import 'package:flutter/material.dart';

class QuizCategory {
  final int? id; // OpenTDB category ID (null for custom/all)
  final String name;
  final String description;
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
      id: 18, // Sub-filtered or custom
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
      id: 11, // Film / Entertainment
      name: 'Entertainment',
      description: 'Cinema, music, pop culture, and television.',
      icon: Icons.movie_creation_outlined,
      primaryColor: Color(0xFF06B6D4),
      secondaryColor: Color(0xFF0E7490),
    ),
  ];
}
