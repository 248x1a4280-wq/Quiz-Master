import 'dart:convert';
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

  /// Save user profile
  Future<void> saveProfile(UserProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(keyProfile, profile.toJson());
  }

  /// Load user profile
  Future<UserProfile> loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(keyProfile);
    if (jsonStr == null || jsonStr.isEmpty) {
      return UserProfile();
    }
    try {
      final map = jsonDecode(jsonStr) as Map<String, dynamic>;
      return UserProfile.fromMap(map);
    } catch (_) {
      return UserProfile();
    }
  }

  /// Save a custom question
  Future<void> saveCustomQuestion(Question question) async {
    final prefs = await SharedPreferences.getInstance();
    final existingList = await loadCustomQuestions();
    existingList.insert(0, question);
    final stringList = existingList.map((q) => q.toJson()).toList();
    await prefs.setStringList(keyCustomQuestions, stringList);
  }

  /// Load all custom questions
  Future<List<Question>> loadCustomQuestions() async {
    final prefs = await SharedPreferences.getInstance();
    final stringList = prefs.getStringList(keyCustomQuestions);
    if (stringList == null) return [];
    try {
      return stringList
          .map((item) => Question.fromMap(jsonDecode(item) as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return [];
    }
  }

  /// Delete a custom question by id
  Future<void> deleteCustomQuestion(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = await loadCustomQuestions();
    existing.removeWhere((q) => q.id == id);
    await prefs.setStringList(
      keyCustomQuestions,
      existing.map((q) => q.toJson()).toList(),
    );
  }

  /// Save a quiz result to history and update profile stats & leaderboard
  Future<void> saveQuizResult(QuizResult result, String username) async {
    final prefs = await SharedPreferences.getInstance();
    
    // 1. Save to History
    final history = await loadQuizHistory();
    history.insert(0, result);
    // Keep last 50 games
    final trimmedHistory = history.take(50).toList();
    await prefs.setStringList(
      keyQuizHistory,
      trimmedHistory.map((r) => r.toJson()).toList(),
    );

    // 2. Update Leaderboard Entry
    await _recordLeaderboardEntry(result, username);

    // 3. Update User Profile Aggregates
    final currentProfile = await loadProfile();
    final newAttempted = currentProfile.quizzesAttempted + 1;
    final newCorrect = currentProfile.totalCorrectAnswers + result.correctCount;
    final newHighest = result.score > currentProfile.highestScore
        ? result.score
        : currentProfile.highestScore;

    final updatedProfile = currentProfile.copyWith(
      quizzesAttempted: newAttempted,
      totalCorrectAnswers: newCorrect,
      highestScore: newHighest,
    );
    await saveProfile(updatedProfile);
  }

  /// Load quiz history
  Future<List<QuizResult>> loadQuizHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final stringList = prefs.getStringList(keyQuizHistory);
    if (stringList == null) return [];
    try {
      return stringList
          .map((item) => QuizResult.fromMap(jsonDecode(item) as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return [];
    }
  }

  /// Record leaderboard entry
  Future<void> _recordLeaderboardEntry(QuizResult result, String username) async {
    final prefs = await SharedPreferences.getInstance();
    final list = await loadLeaderboard();

    list.add({
      'username': username,
      'score': result.score,
      'category': result.categoryName,
      'difficulty': result.difficulty,
      'accuracy': result.percentage.toInt(),
      'date': result.completedAt.toIso8601String(),
    });

    // Sort descending by score
    list.sort((a, b) => (b['score'] as int).compareTo(a['score'] as int));

    // Keep top 25
    final top25 = list.take(25).toList();
    await prefs.setString(keyLeaderboard, jsonEncode(top25));
  }

  /// Load leaderboard entries
  Future<List<Map<String, dynamic>>> loadLeaderboard() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(keyLeaderboard);
    if (jsonStr == null || jsonStr.isEmpty) {
      // Return initial realistic seeded leaderboard for college project demo
      return [
        {
          'username': 'Sarah_Tech',
          'score': 1000,
          'category': 'Computer Science',
          'difficulty': 'hard',
          'accuracy': 100,
          'date': DateTime.now().subtract(const Duration(hours: 3)).toIso8601String(),
        },
        {
          'username': 'Rahul_Code',
          'score': 920,
          'category': 'Programming',
          'difficulty': 'medium',
          'accuracy': 90,
          'date': DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
        },
        {
          'username': 'Elena_V',
          'score': 850,
          'category': 'General Knowledge',
          'difficulty': 'medium',
          'accuracy': 80,
          'date': DateTime.now().subtract(const Duration(days: 2)).toIso8601String(),
        },
        {
          'username': 'David_K',
          'score': 740,
          'category': 'Science & Nature',
          'difficulty': 'easy',
          'accuracy': 70,
          'date': DateTime.now().subtract(const Duration(days: 3)).toIso8601String(),
        },
      ];
    }
    try {
      final decoded = jsonDecode(jsonStr) as List<dynamic>;
      return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
    } catch (_) {
      return [];
    }
  }

  /// Theme preference
  Future<void> saveThemeMode(bool isDark) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(keyDarkMode, isDark);
  }

  Future<bool> loadThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(keyDarkMode) ?? true;
  }
}
