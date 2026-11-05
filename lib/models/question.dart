import 'dart:convert';
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

  /// Factory constructor to parse Open Trivia DB API JSON response
  factory Question.fromOpenTdb(Map<String, dynamic> json, int index) {
    final unescape = HtmlUnescape();
    final rawQuestion = unescape.convert(json['question'] ?? '');
    final rawCorrect = unescape.convert(json['correct_answer'] ?? '');
    final rawIncorrects = (json['incorrect_answers'] as List<dynamic>? ?? [])
        .map((e) => unescape.convert(e.toString()))
        .toList();

    // Combine and shuffle options
    final List<String> allOptions = [...rawIncorrects, rawCorrect];
    allOptions.shuffle();
    final correctIndex = allOptions.indexOf(rawCorrect);

    return Question(
      id: 'opentdb_${index}_${DateTime.now().millisecondsSinceEpoch}',
      questionText: rawQuestion,
      options: allOptions,
      correctOptionIndex: correctIndex,
      category: json['category'] ?? 'General Knowledge',
      difficulty: json['difficulty'] ?? 'medium',
      isCustom: false,
    );
  }

  /// Factory constructor for local/custom questions created by users
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
}
