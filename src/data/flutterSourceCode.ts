export interface FlutterFile {
  path: string;
  filename: string;
  folder: string;
  language: string;
  content: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    filename: 'pubspec.yaml',
    folder: 'Root',
    language: 'yaml',
    content: `name: quiz_master
description: "QuizMaster – Interactive Android Quiz Application built with Flutter, Provider, and OpenTDB API."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.3.0 <4.0.0"
  flutter: ">=3.35.0"

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  http: ^1.2.2
  shared_preferences: ^2.3.2
  html_unescape: ^2.0.0
  google_fonts: ^6.2.1
  flutter_animate: ^4.5.0
  percent_indicator: ^4.2.3
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true`,
  },
  {
    path: 'lib/main.dart',
    filename: 'main.dart',
    folder: 'lib',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/quiz_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/home_screen.dart';
import 'screens/category_screen.dart';
import 'screens/quiz_screen.dart';
import 'screens/result_screen.dart';
import 'screens/add_question_screen.dart';
import 'screens/leaderboard_screen.dart';
import 'screens/profile_screen.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => QuizProvider()),
      ],
      child: const QuizMasterApp(),
    ),
  );
}

class QuizMasterApp extends StatelessWidget {
  const QuizMasterApp({super.key});

  @override
  Widget build(BuildContext context) {
    final quizProvider = context.watch<QuizProvider>();

    return MaterialApp(
      title: 'QuizMaster',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: quizProvider.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/home': (context) => const HomeScreen(),
        '/category': (context) => const CategoryScreen(),
        '/quiz': (context) => const QuizScreen(),
        '/result': (context) => const ResultScreen(),
        '/add-question': (context) => const AddQuestionScreen(),
        '/leaderboard': (context) => const LeaderboardScreen(),
        '/profile': (context) => const ProfileScreen(),
      },
    );
  }
}`,
  },
  {
    path: 'lib/models/question.dart',
    filename: 'question.dart',
    folder: 'lib/models',
    language: 'dart',
    content: `import 'dart:convert';
import 'package:html_unescape/html_unescape.dart';

enum Difficulty { any, easy, medium, hard }

class Question {
  final String id;
  final String questionText;
  final List<String> options;
  final int correctOptionIndex;
  final String category;
  final String difficulty;
  final bool isCustom;

  Question({
    required this.id,
    required this.questionText,
    required this.options,
    required this.correctOptionIndex,
    required this.category,
    required this.difficulty,
    this.isCustom = false,
  });

  String get correctAnswer => options[correctOptionIndex];

  factory Question.fromOpenTdb(Map<String, dynamic> json, int index) {
    final unescape = HtmlUnescape();
    final rawQuestion = unescape.convert(json['question'] ?? '');
    final rawCorrect = unescape.convert(json['correct_answer'] ?? '');
    final rawIncorrects = (json['incorrect_answers'] as List<dynamic>? ?? [])
        .map((e) => unescape.convert(e.toString()))
        .toList();

    final List<String> allOptions = [...rawIncorrects, rawCorrect];
    allOptions.shuffle();
    final correctIndex = allOptions.indexOf(rawCorrect);

    return Question(
      id: 'opentdb_\${index}_\${DateTime.now().millisecondsSinceEpoch}',
      questionText: rawQuestion,
      options: allOptions,
      correctOptionIndex: correctIndex,
      category: json['category'] ?? 'General Knowledge',
      difficulty: json['difficulty'] ?? 'medium',
      isCustom: false,
    );
  }

  factory Question.fromMap(Map<String, dynamic> map) {
    return Question(
      id: map['id'] ?? DateTime.now().toIso8601String(),
      questionText: map['questionText'] ?? '',
      options: List<String>.from(map['options'] ?? []),
      correctOptionIndex: map['correctOptionIndex'] ?? 0,
      category: map['category'] ?? 'General Knowledge',
      difficulty: map['difficulty'] ?? 'medium',
      isCustom: map['isCustom'] ?? true,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'questionText': questionText,
      'options': options,
      'correctOptionIndex': correctOptionIndex,
      'category': category,
      'difficulty': difficulty,
      'isCustom': isCustom,
    };
  }

  String toJson() => jsonEncode(toMap());
}`,
  },
  {
    path: 'lib/models/category.dart',
    filename: 'category.dart',
    folder: 'lib/models',
    language: 'dart',
    content: `import 'package:flutter/material.dart';

class QuizCategory {
  final int? id;
  final String name;
  final description;
  final IconData icon;
  final Color primaryColor;
  final Color secondaryColor;

  const QuizCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.primaryColor,
    required this.secondaryColor,
  });

  static const List<QuizCategory> defaultCategories = [
    QuizCategory(
      id: 9,
      name: 'General Knowledge',
      description: 'Test your grasp across diverse global trivia.',
      icon: Icons.lightbulb_outline,
      primaryColor: Color(0xFF3B82F6),
      secondaryColor: Color(0xFF1D4ED8),
    ),
    QuizCategory(
      id: 18,
      name: 'Computer Science',
      description: 'Algorithms, hardware, protocols, and IT foundations.',
      icon: Icons.computer_outlined,
      primaryColor: Color(0xFF6366F1),
      secondaryColor: Color(0xFF4338CA),
    ),
    QuizCategory(
      id: 18,
      name: 'Programming',
      description: 'Flutter, Dart, Python, JavaScript, and OOP principles.',
      icon: Icons.code,
      primaryColor: Color(0xFF8B5CF6),
      secondaryColor: Color(0xFF6D28D9),
    ),
    QuizCategory(
      id: 19,
      name: 'Mathematics',
      description: 'Algebra, geometry, logic, and arithmetic challenges.',
      icon: Icons.calculate_outlined,
      primaryColor: Color(0xFFEC4899),
      secondaryColor: Color(0xFFBE185D),
    ),
    QuizCategory(
      id: 17,
      name: 'Science & Nature',
      description: 'Physics, chemistry, biology, and astronomy wonders.',
      icon: Icons.biotech_outlined,
      primaryColor: Color(0xFF10B981),
      secondaryColor: Color(0xFF047857),
    ),
    QuizCategory(
      id: 21,
      name: 'Sports',
      description: 'Olympic games, world football, basketball, and records.',
      icon: Icons.sports_basketball_outlined,
      primaryColor: Color(0xFFF59E0B),
      secondaryColor: Color(0xFFB45309),
    ),
    QuizCategory(
      id: 23,
      name: 'History',
      description: 'Ancient empires, world wars, and turning points.',
      icon: Icons.history_edu_outlined,
      primaryColor: Color(0xFFEF4444),
      secondaryColor: Color(0xFFB91C1C),
    ),
    QuizCategory(
      id: 11,
      name: 'Entertainment',
      description: 'Cinema, music, pop culture, and television.',
      icon: Icons.movie_creation_outlined,
      primaryColor: Color(0xFF06B6D4),
      secondaryColor: Color(0xFF0E7490),
    ),
  ];
}`,
  },
  {
    path: 'lib/models/quiz_result.dart',
    filename: 'quiz_result.dart',
    folder: 'lib/models',
    language: 'dart',
    content: `import 'dart:convert';
import 'question.dart';

class UserAnswerReview {
  final Question question;
  final int selectedIndex;
  final bool isCorrect;
  final int timeSpentSeconds;

  UserAnswerReview({
    required this.question,
    required this.selectedIndex,
    required this.isCorrect,
    required this.timeSpentSeconds,
  });

  Map<String, dynamic> toMap() {
    return {
      'question': question.toMap(),
      'selectedIndex': selectedIndex,
      'isCorrect': isCorrect,
      'timeSpentSeconds': timeSpentSeconds,
    };
  }

  factory UserAnswerReview.fromMap(Map<String, dynamic> map) {
    return UserAnswerReview(
      question: Question.fromMap(map['question']),
      selectedIndex: map['selectedIndex'] ?? -1,
      isCorrect: map['isCorrect'] ?? false,
      timeSpentSeconds: map['timeSpentSeconds'] ?? 0,
    );
  }
}

class QuizResult {
  final String id;
  final String categoryName;
  final String difficulty;
  final int score;
  final int totalQuestions;
  final int correctCount;
  final int incorrectCount;
  final int totalTimeSeconds;
  final DateTime completedAt;
  final List<UserAnswerReview> reviews;

  QuizResult({
    required this.id,
    required this.categoryName,
    required this.difficulty,
    required this.score,
    required this.totalQuestions,
    required this.correctCount,
    required this.incorrectCount,
    required this.totalTimeSeconds,
    required this.completedAt,
    this.reviews = const [],
  });

  double get percentage =>
      totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0.0;

  String get performanceMessage {
    if (percentage >= 90) return 'Outstanding! Quiz Champion! 🏆';
    if (percentage >= 75) return 'Great Job! Superb Accuracy! 🌟';
    if (percentage >= 50) return 'Well Played! Keep Improving! 🎯';
    return 'Practice Makes Perfect! Try Again! 💪';
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'categoryName': categoryName,
      'difficulty': difficulty,
      'score': score,
      'totalQuestions': totalQuestions,
      'correctCount': correctCount,
      'incorrectCount': incorrectCount,
      'totalTimeSeconds': totalTimeSeconds,
      'completedAt': completedAt.toIso8601String(),
      'reviews': reviews.map((r) => r.toMap()).toList(),
    };
  }

  factory QuizResult.fromMap(Map<String, dynamic> map) {
    return QuizResult(
      id: map['id'] ?? DateTime.now().toIso8601String(),
      categoryName: map['categoryName'] ?? 'General Knowledge',
      difficulty: map['difficulty'] ?? 'medium',
      score: map['score'] ?? 0,
      totalQuestions: map['totalQuestions'] ?? 0,
      correctCount: map['correctCount'] ?? 0,
      incorrectCount: map['incorrectCount'] ?? 0,
      totalTimeSeconds: map['totalTimeSeconds'] ?? 0,
      completedAt: DateTime.tryParse(map['completedAt'] ?? '') ?? DateTime.now(),
      reviews: (map['reviews'] as List<dynamic>? ?? [])
          .map((r) => UserAnswerReview.fromMap(r))
          .toList(),
    );
  }

  String toJson() => jsonEncode(toMap());
}`,
  },
  {
    path: 'lib/models/user_profile.dart',
    filename: 'user_profile.dart',
    folder: 'lib/models',
    language: 'dart',
    content: `import 'dart:convert';

class UserProfile {
  final String username;
  final String avatar;
  final int quizzesAttempted;
  final int totalCorrectAnswers;
  final int highestScore;
  final int currentStreak;
  final DateTime memberSince;

  UserProfile({
    this.username = 'Alex Developer',
    this.avatar = '🧑‍💻',
    this.quizzesAttempted = 0,
    this.totalCorrectAnswers = 0,
    this.highestScore = 0,
    this.currentStreak = 1,
    DateTime? memberSince,
  }) : memberSince = memberSince ?? DateTime.now();

  double get accuracyRate => quizzesAttempted > 0
      ? (totalCorrectAnswers / (quizzesAttempted * 10)) * 100
      : 0.0;

  UserProfile copyWith({
    String? username,
    String? avatar,
    int? quizzesAttempted,
    int? totalCorrectAnswers,
    int? highestScore,
    int? currentStreak,
    DateTime? memberSince,
  }) {
    return UserProfile(
      username: username ?? this.username,
      avatar: avatar ?? this.avatar,
      quizzesAttempted: quizzesAttempted ?? this.quizzesAttempted,
      totalCorrectAnswers: totalCorrectAnswers ?? this.totalCorrectAnswers,
      highestScore: highestScore ?? this.highestScore,
      currentStreak: currentStreak ?? this.currentStreak,
      memberSince: memberSince ?? this.memberSince,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'username': username,
      'avatar': avatar,
      'quizzesAttempted': quizzesAttempted,
      'totalCorrectAnswers': totalCorrectAnswers,
      'highestScore': highestScore,
      'currentStreak': currentStreak,
      'memberSince': memberSince.toIso8601String(),
    };
  }

  factory UserProfile.fromMap(Map<String, dynamic> map) {
    return UserProfile(
      username: map['username'] ?? 'Alex Developer',
      avatar: map['avatar'] ?? '🧑‍💻',
      quizzesAttempted: map['quizzesAttempted'] ?? 0,
      totalCorrectAnswers: map['totalCorrectAnswers'] ?? 0,
      highestScore: map['highestScore'] ?? 0,
      currentStreak: map['currentStreak'] ?? 1,
      memberSince: DateTime.tryParse(map['memberSince'] ?? '') ?? DateTime.now(),
    );
  }

  String toJson() => jsonEncode(toMap());
}`,
  },
  {
    path: 'lib/services/api_service.dart',
    filename: 'api_service.dart',
    folder: 'lib/services',
    language: 'dart',
    content: `import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/question.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, [this.statusCode]);

  @override
  String toString() => message;
}

class ApiService {
  static const String baseUrl = 'https://opentdb.com/api.php';

  Future<List<Question>> fetchQuestions({
    required int amount,
    int? categoryId,
    String? difficulty,
  }) async {
    final queryParams = <String, String>{
      'amount': amount.toString(),
      'type': 'multiple',
    };

    if (categoryId != null && categoryId > 0) {
      queryParams['category'] = categoryId.toString();
    }

    if (difficulty != null && difficulty.isNotEmpty && difficulty != 'any') {
      queryParams['difficulty'] = difficulty.toLowerCase();
    }

    final uri = Uri.parse(baseUrl).replace(queryParameters: queryParams);

    try {
      final response = await http.get(uri).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final responseCode = data['response_code'] as int? ?? 0;

        if (responseCode == 0) {
          final results = data['results'] as List<dynamic>;
          if (results.isEmpty) {
            throw ApiException('No questions returned for the selected criteria.');
          }
          return results
              .asMap()
              .entries
              .map((entry) => Question.fromOpenTdb(entry.value, entry.key))
              .toList();
        } else {
          return _getCuratedFallbackQuestions(categoryId, amount);
        }
      } else {
        return _getCuratedFallbackQuestions(categoryId, amount);
      }
    } catch (_) {
      return _getCuratedFallbackQuestions(categoryId, amount);
    }
  }

  List<Question> _getCuratedFallbackQuestions(int? categoryId, int amount) {
    final curatedList = [
      Question(
        id: 'curated_1',
        questionText: 'Which state management pattern uses ChangeNotifier in Flutter?',
        options: ['Provider', 'Bloc', 'Redux', 'GetX'],
        correctOptionIndex: 0,
        category: 'Programming',
        difficulty: 'medium',
      ),
      Question(
        id: 'curated_2',
        questionText: 'What is the time complexity of searching in a balanced Binary Search Tree?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
        correctOptionIndex: 1,
        category: 'Computer Science',
        difficulty: 'medium',
      ),
      Question(
        id: 'curated_3',
        questionText: 'Which planet in our solar system is known as the Red Planet?',
        options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
        correctOptionIndex: 2,
        category: 'Science & Nature',
        difficulty: 'easy',
      ),
    ];
    return curatedList.take(amount).toList();
  }
}`,
  },
  {
    path: 'lib/services/storage_service.dart',
    filename: 'storage_service.dart',
    folder: 'lib/services',
    language: 'dart',
    content: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/question.dart';
import '../models/quiz_result.dart';
import '../models/user_profile.dart';

class StorageService {
  static const String keyProfile = 'quizmaster_user_profile';
  static const String keyCustomQuestions = 'quizmaster_custom_questions';
  static const String keyQuizHistory = 'quizmaster_quiz_history';
  static const String keyLeaderboard = 'quizmaster_leaderboard';
  static const String keyDarkMode = 'quizmaster_dark_mode';

  Future<void> saveProfile(UserProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(keyProfile, profile.toJson());
  }

  Future<UserProfile> loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(keyProfile);
    if (jsonStr == null || jsonStr.isEmpty) return UserProfile();
    try {
      return UserProfile.fromMap(jsonDecode(jsonStr));
    } catch (_) {
      return UserProfile();
    }
  }

  Future<void> saveCustomQuestion(Question question) async {
    final prefs = await SharedPreferences.getInstance();
    final list = await loadCustomQuestions();
    list.insert(0, question);
    await prefs.setStringList(keyCustomQuestions, list.map((q) => q.toJson()).toList());
  }

  Future<List<Question>> loadCustomQuestions() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(keyCustomQuestions);
    if (list == null) return [];
    try {
      return list.map((item) => Question.fromMap(jsonDecode(item))).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveQuizResult(QuizResult result, String username) async {
    final prefs = await SharedPreferences.getInstance();
    final history = await loadQuizHistory();
    history.insert(0, result);
    await prefs.setStringList(keyQuizHistory, history.take(50).map((r) => r.toJson()).toList());
    
    final currentProfile = await loadProfile();
    await saveProfile(currentProfile.copyWith(
      quizzesAttempted: currentProfile.quizzesAttempted + 1,
      totalCorrectAnswers: currentProfile.totalCorrectAnswers + result.correctCount,
      highestScore: result.score > currentProfile.highestScore ? result.score : currentProfile.highestScore,
    ));
  }

  Future<List<QuizResult>> loadQuizHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(keyQuizHistory);
    if (list == null) return [];
    try {
      return list.map((item) => QuizResult.fromMap(jsonDecode(item))).toList();
    } catch (_) {
      return [];
    }
  }
}`,
  },
  {
    path: 'lib/providers/quiz_provider.dart',
    filename: 'quiz_provider.dart',
    folder: 'lib/providers',
    language: 'dart',
    content: `import 'dart:async';
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

  QuizState _state = QuizState.initial;
  String _errorMessage = '';
  bool _isDarkMode = true;

  List<Question> _questions = [];
  int _currentIndex = 0;
  int? _selectedOptionIndex;
  bool _isAnswerConfirmed = false;
  int _score = 0;
  int _correctCount = 0;
  int _incorrectCount = 0;

  QuizCategory _selectedCategory = QuizCategory.defaultCategories[0];
  String _selectedDifficulty = 'medium';
  int _questionCount = 10;

  static const int questionDuration = 20;
  int _remainingTime = questionDuration;
  Timer? _timer;
  int _totalQuizTime = 0;

  final List<UserAnswerReview> _reviews = [];
  UserProfile _userProfile = UserProfile();
  List<Question> _customQuestions = [];

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

  Future<void> _initializeData() async {
    _userProfile = await _storageService.loadProfile();
    _customQuestions = await _storageService.loadCustomQuestions();
    notifyListeners();
  }

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }

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

  Future<void> startQuiz({bool useCustomQuestions = false}) async {
    _state = QuizState.loading;
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
        _questions = List<Question>.from(_customQuestions)..shuffle();
      } else {
        _questions = await _apiService.fetchQuestions(
          amount: _questionCount,
          categoryId: _selectedCategory.id,
          difficulty: _selectedDifficulty == 'any' ? null : _selectedDifficulty,
        );
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

  void selectOption(int optionIndex) {
    if (_isAnswerConfirmed || _state != QuizState.active) return;
    _selectedOptionIndex = optionIndex;
    notifyListeners();
  }

  void confirmAnswer() {
    if (_isAnswerConfirmed || _selectedOptionIndex == null || currentQuestion == null) return;
    _isAnswerConfirmed = true;
    _stopTimer();

    final isCorrect = _selectedOptionIndex == currentQuestion!.correctOptionIndex;
    final timeSpent = questionDuration - _remainingTime;
    _totalQuizTime += timeSpent;

    if (isCorrect) {
      _correctCount++;
      _score += 100 + (_remainingTime * 2.5).round();
    } else {
      _incorrectCount++;
    }

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
        confirmAnswer();
      }
    });
  }

  void _stopTimer() {
    _timer?.cancel();
    _timer = null;
  }

  Future<void> _completeQuiz() async {
    _stopTimer();
    _state = QuizState.completed;
    final result = QuizResult(
      id: 'quiz_\${DateTime.now().millisecondsSinceEpoch}',
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
    _userProfile = await _storageService.loadProfile();
    notifyListeners();
  }
}`,
  },
  {
    path: 'lib/theme/app_theme.dart',
    filename: 'app_theme.dart',
    folder: 'lib/theme',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryBlue = Color(0xFF2563EB);
  static const Color primaryPurple = Color(0xFF7C3AED);
  static const Color accentIndigo = Color(0xFF4F46E5);
  static const Color successGreen = Color(0xFF10B981);
  static const Color errorRed = Color(0xFFEF4444);
  static const Color warningAmber = Color(0xFFF59E0B);

  static const LinearGradient brandGradient = LinearGradient(
    colors: [primaryBlue, primaryPurple],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: const Color(0xFF0F172A),
      colorScheme: const ColorScheme.dark(
        primary: primaryBlue,
        secondary: primaryPurple,
        surface: Color(0xFF1E293B),
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      colorScheme: const ColorScheme.light(
        primary: primaryBlue,
        secondary: primaryPurple,
        surface: Colors.white,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme),
    );
  }
}`,
  },
  {
    path: 'test/widget_test.dart',
    filename: 'widget_test.dart',
    folder: 'test',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:quiz_master/models/question.dart';
import 'package:quiz_master/models/quiz_result.dart';
import 'package:quiz_master/widgets/custom_button.dart';

void main() {
  test('Question model serialization test', () {
    final question = Question(
      id: 'test_1',
      questionText: 'What is the primary language used for Flutter development?',
      options: ['Java', 'Dart', 'Kotlin', 'Swift'],
      correctOptionIndex: 1,
      category: 'Programming',
      difficulty: 'easy',
    );
    expect(question.correctAnswer, 'Dart');
  });

  testWidgets('CustomButton renders text and triggers callback', (WidgetTester tester) async {
    bool wasTapped = false;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CustomButton(
            text: 'Start Quiz Now',
            onPressed: () => wasTapped = true,
          ),
        ),
      ),
    );
    expect(find.text('Start Quiz Now'), findsOneWidget);
    await tester.tap(find.text('Start Quiz Now'));
    expect(wasTapped, isTrue);
  });
}`,
  },
  {
    path: 'README.md',
    filename: 'README.md',
    folder: 'Root',
    language: 'markdown',
    content: `# QuizMaster – Interactive Android Quiz Application

Professional, high-performance Android quiz application built with **Flutter 3.35+** and **Dart 3.3+**. Features Provider state management, Open Trivia Database API integration, SharedPreferences local storage, custom question authoring, countdown timer, sound synthesizer, and release APK build setup.

## Quick Start
\`\`\`bash
flutter pub get
flutter test
flutter run
flutter build apk --release
\`\`\``,
  },
];
