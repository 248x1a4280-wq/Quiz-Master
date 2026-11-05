import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/answer_option.dart';
import '../widgets/custom_button.dart';
import '../widgets/progress_indicator.dart';
import '../widgets/question_card.dart';
import 'result_screen.dart';

class QuizScreen extends StatelessWidget {
  const QuizScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quizProvider = context.watch<QuizProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Listen for completion and navigate
    if (quizProvider.state == QuizState.completed) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const ResultScreen()),
        );
      });
    }

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        final shouldQuit = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Quit Quiz?'),
            content: const Text('Your current progress and score will be lost.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(false),
                child: const Text('Continue Quiz'),
              ),
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(true),
                style: TextButton.styleFrom(foregroundColor: AppTheme.errorRed),
                child: const Text('Quit'),
              ),
            ],
          ),
        );
        if (shouldQuit == true && context.mounted) {
          Navigator.of(context).pop();
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(quizProvider.selectedCategory.name),
          actions: [
            Center(
              child: Padding(
                padding: const EdgeInsets.only(right: 16.0),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryPurple.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    'Score: ${quizProvider.score}',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.primaryPurple,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
        body: SafeArea(
          child: _buildBody(context, quizProvider, isDark),
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context, QuizProvider quizProvider, bool isDark) {
    // 1. Loading State
    if (quizProvider.state == QuizState.loading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(
              width: 50,
              height: 50,
              child: CircularProgressIndicator(
                strokeWidth: 3.5,
                valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryBlue),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Fetching Questions...',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Connecting to Open Trivia Database',
              style: TextStyle(
                fontSize: 13,
                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
              ),
            ),
          ],
        ),
      );
    }

    // 2. Error State with Retry
    if (quizProvider.state == QuizState.error) {
      return Padding(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: AppTheme.errorRed.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.cloud_off, size: 36, color: AppTheme.errorRed),
              ),
              const SizedBox(height: 20),
              Text(
                'Failed to Load Quiz',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                quizProvider.errorMessage.isNotEmpty
                    ? quizProvider.errorMessage
                    : 'Check your internet connection and try again.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                ),
              ),
              const SizedBox(height: 24),
              CustomButton(
                text: 'Retry Loading',
                icon: Icons.refresh,
                onPressed: () => quizProvider.retryStartQuiz(),
              ),
              const SizedBox(height: 12),
              CustomButton(
                text: 'Back to Home',
                isSecondary: true,
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
        ),
      );
    }

    // 3. Active Question State
    final currentQ = quizProvider.currentQuestion;
    if (currentQ == null) {
      return const Center(child: Text('No question available.'));
    }

    return Column(
      children: [
        // Top Header: Progress bar + Countdown Timer
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: QuizProgressBar(
                  current: quizProvider.currentIndex + 1,
                  total: quizProvider.questions.length,
                ),
              ),
              const SizedBox(width: 16),
              TimerProgressCircle(
                secondsRemaining: quizProvider.remainingTime,
                progress: quizProvider.timerProgress,
              ),
            ],
          ),
        ),

        // Scrollable Question & Options
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                QuestionCard(
                  question: currentQ,
                  questionNumber: quizProvider.currentIndex + 1,
                  totalQuestions: quizProvider.questions.length,
                ),
                const SizedBox(height: 20),

                // Answers List
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: currentQ.options.length,
                  itemBuilder: (context, index) {
                    final optionText = currentQ.options[index];
                    final isSelected = quizProvider.selectedOptionIndex == index;
                    final isCorrect = index == currentQ.correctOptionIndex;

                    return AnswerOptionTile(
                      index: index,
                      text: optionText,
                      isSelected: isSelected,
                      isConfirmed: quizProvider.isAnswerConfirmed,
                      isCorrect: isCorrect,
                      onTap: () => quizProvider.selectOption(index),
                    );
                  },
                ),

                // Instant Feedback banner once confirmed
                if (quizProvider.isAnswerConfirmed) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: quizProvider.selectedOptionIndex == currentQ.correctOptionIndex
                          ? AppTheme.successGreen.withOpacity(0.12)
                          : AppTheme.errorRed.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: quizProvider.selectedOptionIndex == currentQ.correctOptionIndex
                            ? AppTheme.successGreen.withOpacity(0.3)
                            : AppTheme.errorRed.withOpacity(0.3),
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          quizProvider.selectedOptionIndex == currentQ.correctOptionIndex
                              ? Icons.check_circle_outline
                              : Icons.info_outline,
                          color: quizProvider.selectedOptionIndex == currentQ.correctOptionIndex
                              ? AppTheme.successGreen
                              : AppTheme.errorRed,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            quizProvider.selectedOptionIndex == currentQ.correctOptionIndex
                                ? 'Correct! +100 points (+ speed bonus)'
                                : 'Incorrect! Correct answer is: ${currentQ.correctAnswer}',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: quizProvider.selectedOptionIndex == currentQ.correctOptionIndex
                                  ? AppTheme.successGreen
                                  : AppTheme.errorRed,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),

        // Bottom Action Bar: Confirm Answer / Next Question
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: isDark ? AppTheme.darkSurface : Colors.white,
            border: Border(
              top: BorderSide(
                color: isDark ? AppTheme.darkBorder : AppTheme.lightBorder,
              ),
            ),
          ),
          child: quizProvider.isAnswerConfirmed
              ? CustomButton(
                  text: quizProvider.isLastQuestion ? 'View Results' : 'Next Question',
                  icon: quizProvider.isLastQuestion ? Icons.emoji_events : Icons.arrow_forward,
                  onPressed: () => quizProvider.nextQuestion(),
                )
              : CustomButton(
                  text: 'Submit Answer',
                  icon: Icons.check,
                  onPressed: quizProvider.selectedOptionIndex == null
                      ? null
                      : () => quizProvider.confirmAnswer(),
                ),
        ),
      ],
    );
  }
}
