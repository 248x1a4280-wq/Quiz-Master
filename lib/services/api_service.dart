import 'dart:async';
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

  /// Fetches questions from Open Trivia DB API with fallback to built-in curated questions
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
      final response = await http
          .get(uri)
          .timeout(const Duration(seconds: 8));

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
        } else if (responseCode == 1) {
          // No Results - return fallback questions
          return _getCuratedFallbackQuestions(categoryId, amount);
        } else if (responseCode == 5) {
          // Rate limit reached - fallback gracefully
          return _getCuratedFallbackQuestions(categoryId, amount);
        } else {
          throw ApiException('Trivia service returned status code $responseCode');
        }
      } else if (response.statusCode == 429) {
        // Rate limited by Cloudflare/OpenTDB
        return _getCuratedFallbackQuestions(categoryId, amount);
      } else {
        throw ApiException(
          'Failed to load quiz. Server error (${response.statusCode})',
          response.statusCode,
        );
      }
    } on SocketException {
      // Offline mode - provide offline curated questions
      return _getCuratedFallbackQuestions(categoryId, amount);
    } on TimeoutException {
      // Slow connection - fallback to cached curated questions
      return _getCuratedFallbackQuestions(categoryId, amount);
    } catch (e) {
      if (e is ApiException) rethrow;
      // Network/parse error fallback
      return _getCuratedFallbackQuestions(categoryId, amount);
    }
  }

  /// High quality curated question bank for offline mode or API rate limits
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
      Question(
        id: 'curated_4',
        questionText: 'In Flutter, what kind of widget is immutable once created?',
        options: ['StatefulWidget', 'StatelessWidget', 'InheritedWidget', 'Both B and C'],
        correctOptionIndex: 1,
        category: 'Programming',
        difficulty: 'easy',
      ),
      Question(
        id: 'curated_5',
        questionText: 'What is the value of Euler\'s constant "e" approximately equal to?',
        options: ['3.1415', '2.7182', '1.6180', '1.4142'],
        correctOptionIndex: 1,
        category: 'Mathematics',
        difficulty: 'hard',
      ),
      Question(
        id: 'curated_6',
        questionText: 'Who is recognized as the father of modern Computer Science?',
        options: ['Charles Babbage', 'Alan Turing', 'John von Neumann', 'Ada Lovelace'],
        correctOptionIndex: 1,
        category: 'History',
        difficulty: 'medium',
      ),
      Question(
        id: 'curated_7',
        questionText: 'How many players are on the field for one team in a standard soccer match?',
        options: ['9', '10', '11', '12'],
        correctOptionIndex: 2,
        category: 'Sports',
        difficulty: 'easy',
      ),
      Question(
        id: 'curated_8',
        questionText: 'Which protocol is used for secure communication over a computer network?',
        options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
        correctOptionIndex: 2,
        category: 'Computer Science',
        difficulty: 'easy',
      ),
      Question(
        id: 'curated_9',
        questionText: 'What does Dart\'s null-safety system guarantee at compile time?',
        options: ['No memory leaks', 'Variables cannot be null unless explicitly typed', 'Faster network calls', 'Automatic garbage collection disablement'],
        correctOptionIndex: 1,
        category: 'Programming',
        difficulty: 'hard',
      ),
      Question(
        id: 'curated_10',
        questionText: 'Which movie won the first Academy Award for Best Animated Feature in 2002?',
        options: ['Monsters, Inc.', 'Shrek', 'Jimmy Neutron', 'Ice Age'],
        correctOptionIndex: 1,
        category: 'Entertainment',
        difficulty: 'medium',
      ),
    ];

    if (amount <= curatedList.length) {
      return curatedList.sublist(0, amount);
    }
    return curatedList;
  }
}
