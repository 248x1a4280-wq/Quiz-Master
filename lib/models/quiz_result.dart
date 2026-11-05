import 'dart:convert';
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
}
