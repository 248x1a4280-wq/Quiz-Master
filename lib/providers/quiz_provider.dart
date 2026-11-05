import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/category.dart';
import '../models/question.dart';
import '../models/quiz_result.dart';
import '../models/user_profile.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

enum QuizState { initial, loading, active, review, completed, error }

class QuizProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService();

  // Application State
  QuizState _state = QuizState.initial;
  String _errorMessage = '';
  bool _isDarkMode = true;

  // Active Quiz Data
  List<Question> _questions = [];
  int _currentIndex = 0;
  int? _selectedOptionIndex;
  bool _isAnswerConfirmed = false;
  int _score = 0;
  int _correctCount = 0;
  int _incorrectCount = 0;

  // Selected Quiz Configuration
  QuizCategory _selectedCategory = QuizCategory.defaultCategories[0];
  String _selectedDifficulty = 'medium';
  int _questionCount = 10;

  // Timer State
  static const int questionDuration = 20; // 20 seconds per question
  int _remainingTime = questionDuration;
  Timer? _timer;
  int _totalQuizTime = 0;

  // Reviews tracking for result screen
  final List<UserAnswerReview> _reviews = [];

  // Persistent User Data
  UserProfile _userProfile = UserProfile();
  List<Question> _customQuestions = [];
  List<QuizResult> _quizHistory = [];
  List<Map<String, dynamic>> _leaderboard = [];

  // Getters
  QuizState get state => _state;
  String get errorMessage => _errorMessage;
  bool get isDarkMode => _isDarkMode;
  List<Question> get questions => _questions;
  int get currentIndex => _currentIndex;
  int? get selectedOptionIndex => _selectedOptionIndex;
  bool get isAnswerConfirmed => _isAnswerConfirmed;
  int get score => _score;
  int get correctCount => _correctCount;
  int get incorrectCount => _incorrectCount;
  int get remainingTime => _remainingTime;
  double get timerProgress => _remainingTime / questionDuration;
  QuizCategory get selectedCategory => _selectedCategory;
  String get selectedDifficulty => _selectedDifficulty;
  int get questionCount => _questionCount;
  UserProfile get userProfile => _userProfile;
  List<Question> get customQuestions => _customQuestions;
  List<QuizResult> get quizHistory => _quizHistory;
  List<Map<String, dynamic>> get leaderboard => _leaderboard;
  List<UserAnswerReview> get reviews => _reviews;

  Question? get currentQuestion =>
      _questions.isNotEmpty && _currentIndex < _questions.length
          ? _questions[_currentIndex]
          : null;

  bool get isLastQuestion =>
      _questions.isNotEmpty && _currentIndex == _questions.length - 1;

  QuizProvider() {
    _initializeData();
  }

  /// Initialize local data from SharedPreferences
  Future<void> _initializeData() async {
    _userProfile = await _storageService.loadProfile();
    _customQuestions = await _storageService.loadCustomQuestions();
    _quizHistory = await _storageService.loadQuizHistory();
    _leaderboard = await _storageService.loadLeaderboard();
    _isDarkMode = await _storageService.loadThemeMode();
    notifyListeners();
  }

  /// Toggle Dark / Light Theme
  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    _storageService.saveThemeMode(_isDarkMode);
    notifyListeners();
  }

  /// Update active category & difficulty
  void selectCategory(QuizCategory category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void selectDifficulty(String difficulty) {
    _selectedDifficulty = difficulty;
    notifyListeners();
  }

  void selectQuestionCount(int count) {
    _questionCount = count;
    notifyListeners();
  }

  /// Start a new quiz session with API call
  Future<void> startQuiz({bool useCustomQuestions = false}) async {
    _state = QuizState.loading;
    _errorMessage = '';
    _questions = [];
    _currentIndex = 0;
    _selectedOptionIndex = null;
    _isAnswerConfirmed = false;
    _score = 0;
    _correctCount = 0;
    _incorrectCount = 0;
    _totalQuizTime = 0;
    _reviews.clear();
    _stopTimer();
    notifyListeners();

    try {
      if (useCustomQuestions) {
        if (_customQuestions.isEmpty) {
          throw ApiException('No custom questions found. Create some questions first!');
        }
        _questions = List<Question>.from(_customQuestions)..shuffle();
        if (_questions.length > _questionCount) {
          _questions = _questions.sublist(0, _questionCount);
        }
      } else {
        _questions = await _apiService.fetchQuestions(
          amount: _questionCount,
          categoryId: _selectedCategory.id,
          difficulty: _selectedDifficulty == 'any' ? null : _selectedDifficulty,
        );
      }

      if (_questions.isEmpty) {
        throw ApiException('Failed to retrieve quiz questions.');
      }

      _state = QuizState.active;
      _startTimer();
      notifyListeners();
    } catch (e) {
      _state = QuizState.error;
      _errorMessage = e.toString();
      notifyListeners();
    }
  }

  /// Retry quiz loading after error
  void retryStartQuiz() {
    startQuiz();
  }

  /// User selects an answer option
  void selectOption(int optionIndex) {
    if (_isAnswerConfirmed || _state != QuizState.active) return;
    _selectedOptionIndex = optionIndex;
    notifyListeners();
  }

  /// Confirm and evaluate selected answer
  void confirmAnswer() {
    if (_isAnswerConfirmed || _selectedOptionIndex == null || currentQuestion == null) {
      return;
    }

    _isAnswerConfirmed = true;
    _stopTimer();

    final isCorrect = _selectedOptionIndex == currentQuestion!.correctOptionIndex;
    final timeSpent = questionDuration - _remainingTime;
    _totalQuizTime += timeSpent;

    if (isCorrect) {
      _correctCount++;
      // Score = 100 base + speed bonus up to 50 points
      final speedBonus = (_remainingTime * 2.5).round();
      _score += 100 + speedBonus;
    } else {
      _incorrectCount++;
    }

    // Record review for post-quiz review
    _reviews.add(
      UserAnswerReview(
        question: currentQuestion!,
        selectedIndex: _selectedOptionIndex!,
        isCorrect: isCorrect,
        timeSpentSeconds: timeSpent,
      ),
    );

    notifyListeners();
  }

  /// Advance to next question or complete quiz
  void nextQuestion() {
    if (!_isAnswerConfirmed) {
      confirmAnswer();
      return;
    }

    if (isLastQuestion) {
      _completeQuiz();
    } else {
      _currentIndex++;
      _selectedOptionIndex = null;
      _isAnswerConfirmed = false;
      _startTimer();
      notifyListeners();
    }
  }

  /// Handle time expiration
  void _onTimeExpired() {
    if (!_isAnswerConfirmed) {
      // Treat as unanswered/incorrect
      _selectedOptionIndex = -1;
      _isAnswerConfirmed = true;
      _incorrectCount++;
      _totalQuizTime += questionDuration;

      if (currentQuestion != null) {
        _reviews.add(
          UserAnswerReview(
            question: currentQuestion!,
            selectedIndex: -1,
            isCorrect: false,
            timeSpentSeconds: questionDuration,
          ),
        );
      }
      notifyListeners();
    }
  }

  /// Timer management
  void _startTimer() {
    _stopTimer();
    _remainingTime = questionDuration;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingTime > 1) {
        _remainingTime--;
        notifyListeners();
      } else {
        _remainingTime = 0;
        _stopTimer();
        _onTimeExpired();
      }
    });
  }

  void _stopTimer() {
    _timer?.cancel();
    _timer = null;
  }

  /// Finish quiz, calculate statistics, and persist results
  Future<void> _completeQuiz() async {
    _stopTimer();
    _state = QuizState.completed;

    final result = QuizResult(
      id: 'quiz_${DateTime.now().millisecondsSinceEpoch}',
      categoryName: _selectedCategory.name,
      difficulty: _selectedDifficulty,
      score: _score,
      totalQuestions: _questions.length,
      correctCount: _correctCount,
      incorrectCount: _incorrectCount,
      totalTimeSeconds: _totalQuizTime,
      completedAt: DateTime.now(),
      reviews: List.from(_reviews),
    );

    await _storageService.saveQuizResult(result, _userProfile.username);
    
    // Refresh cached local state
    _userProfile = await _storageService.loadProfile();
    _quizHistory = await _storageService.loadQuizHistory();
    _leaderboard = await _storageService.loadLeaderboard();

    notifyListeners();
  }

  /// Create and save a user-created custom question
  Future<void> addCustomQuestion(Question question) async {
    await _storageService.saveCustomQuestion(question);
    _customQuestions = await _storageService.loadCustomQuestions();
    notifyListeners();
  }

  /// Delete a custom question
  Future<void> deleteCustomQuestion(String id) async {
    await _storageService.deleteCustomQuestion(id);
    _customQuestions = await _storageService.loadCustomQuestions();
    notifyListeners();
  }

  /// Update user profile username or avatar
  Future<void> updateProfile({required String username, required String avatar}) async {
    final updated = _userProfile.copyWith(
      username: username,
      avatar: avatar,
    );
    await _storageService.saveProfile(updated);
    _userProfile = updated;
    notifyListeners();
  }

  /// Reset all data (for fresh testing)
  Future<void> resetAllData() async {
    _userProfile = UserProfile();
    await _storageService.saveProfile(_userProfile);
    _customQuestions.clear();
    _quizHistory.clear();
    _leaderboard = await _storageService.loadLeaderboard();
    notifyListeners();
  }

  @override
  void dispose() {
    _stopTimer();
    super.dispose();
  }
}
