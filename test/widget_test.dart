import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:quiz_master/models/question.dart';
import 'package:quiz_master/models/quiz_result.dart';
import 'package:quiz_master/providers/quiz_provider.dart';
import 'package:quiz_master/widgets/answer_option.dart';
import 'package:quiz_master/widgets/custom_button.dart';
import 'package:quiz_master/widgets/question_card.dart';

void main() {
  group('QuizMaster Unit Tests', () {
    test('Question model serialization and properties test', () {
      final question = Question(
        id: 'test_1',
        questionText: 'What is the primary language used for Flutter development?',
        options: ['Java', 'Dart', 'Kotlin', 'Swift'],
        correctOptionIndex: 1,
        category: 'Programming',
        difficulty: 'easy',
      );

      expect(question.correctAnswer, 'Dart');
      expect(question.options.length, 4);

      final map = question.toMap();
      expect(map['id'], 'test_1');
      expect(map['correctOptionIndex'], 1);

      final restored = Question.fromMap(map);
      expect(restored.questionText, question.questionText);
      expect(restored.correctAnswer, 'Dart');
    });

    test('QuizResult score calculation and percentage test', () {
      final result = QuizResult(
        id: 'res_1',
        categoryName: 'Computer Science',
        difficulty: 'medium',
        score: 850,
        totalQuestions: 10,
        correctCount: 8,
        incorrectCount: 2,
        totalTimeSeconds: 65,
        completedAt: DateTime.now(),
      );

      expect(result.percentage, 80.0);
      expect(result.correctCount, 8);
      expect(result.performanceMessage.contains('Outstanding') || result.performanceMessage.contains('Great'), isTrue);
    });
  });

  group('QuizMaster Widget Tests', () {
    testWidgets('CustomButton renders text and triggers callback', (WidgetTester tester) async {
      bool wasTapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              text: 'Start Quiz Now',
              onPressed: () {
                wasTapped = true;
              },
            ),
          ),
        ),
      );

      expect(find.text('Start Quiz Now'), findsOneWidget);
      await tester.tap(find.text('Start Quiz Now'));
      expect(wasTapped, isTrue);
    });

    testWidgets('QuestionCard displays category, difficulty, and question text', (WidgetTester tester) async {
      final question = Question(
        id: 'q_card_1',
        questionText: 'Which data structure follows the LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correctOptionIndex: 1,
        category: 'Computer Science',
        difficulty: 'easy',
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: QuestionCard(
              question: question,
              questionNumber: 1,
              totalQuestions: 10,
            ),
          ),
        ),
      );

      expect(find.text('Computer Science'), findsOneWidget);
      expect(find.text('EASY'), findsOneWidget);
      expect(find.text('Which data structure follows the LIFO principle?'), findsOneWidget);
    });

    testWidgets('AnswerOptionTile displays option letter and responds to selection', (WidgetTester tester) async {
      int selectedIndex = -1;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AnswerOptionTile(
              index: 0,
              text: 'Option A Content',
              isSelected: false,
              isConfirmed: false,
              isCorrect: false,
              onTap: () {
                selectedIndex = 0;
              },
            ),
          ),
        ),
      );

      expect(find.text('A'), findsOneWidget);
      expect(find.text('Option A Content'), findsOneWidget);

      await tester.tap(find.text('Option A Content'));
      expect(selectedIndex, 0);
    });
  });
}
