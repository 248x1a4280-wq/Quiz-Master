import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/custom_button.dart';
import 'home_screen.dart';
import 'quiz_screen.dart';

class ResultScreen extends StatefulWidget {
  const ResultScreen({super.key});

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  bool _showReview = false;

  @override
  Widget build(BuildContext context) {
    final quizProvider = context.watch<QuizProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final total = quizProvider.questions.length;
    final correct = quizProvider.correctCount;
    final incorrect = quizProvider.incorrectCount;
    final percentage = total > 0 ? ((correct / total) * 100).toInt() : 0;
    final score = quizProvider.score;

    String performanceMsg;
    IconData performanceIcon;
    Color performanceColor;

    if (percentage >= 80) {
      performanceMsg = 'Outstanding Performance!';
      performanceIcon = Icons.military_tech;
      performanceColor = AppTheme.warningAmber;
    } else if (percentage >= 60) {
      performanceMsg = 'Well Done! Great Score!';
      performanceIcon = Icons.thumb_up_alt_outlined;
      performanceColor = AppTheme.primaryBlue;
    } else {
      performanceMsg = 'Keep Learning & Practicing!';
      performanceIcon = Icons.replay_outlined;
      performanceColor = AppTheme.accentIndigo;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Results'),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            children: [
              // Score Summary Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 26),
                decoration: BoxDecoration(
                  gradient: AppTheme.brandGradient,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primaryPurple.withOpacity(0.3),
                      blurRadius: 18,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(performanceIcon, color: Colors.white, size: 36),
                    ),
                    const SizedBox(height: 14),
                    Text(
                      performanceMsg,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${quizProvider.selectedCategory.name} · ${quizProvider.selectedDifficulty.toUpperCase()}',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.white.withOpacity(0.85),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(
                          '$score',
                          style: const TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: -1,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'PTS',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Colors.white.withOpacity(0.7),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Metrics Grid: Percentage, Correct, Incorrect, Total
              Row(
                children: [
                  Expanded(
                    child: _buildMetricTile(
                      label: 'Accuracy',
                      value: '$percentage%',
                      icon: Icons.percent,
                      color: AppTheme.primaryBlue,
                      isDark: isDark,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricTile(
                      label: 'Correct',
                      value: '$correct',
                      icon: Icons.check_circle_outline,
                      color: AppTheme.successGreen,
                      isDark: isDark,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricTile(
                      label: 'Incorrect',
                      value: '$incorrect',
                      icon: Icons.cancel_outlined,
                      color: AppTheme.errorRed,
                      isDark: isDark,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Review Answers Accordion Toggle
              InkWell(
                onTap: () {
                  setState(() {
                    _showReview = !_showReview;
                  });
                },
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                  decoration: BoxDecoration(
                    color: isDark ? AppTheme.darkSurface : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? AppTheme.darkBorder : AppTheme.lightBorder,
                    ),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.fact_check_outlined, color: AppTheme.primaryBlue),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _showReview ? 'Hide Answer Review' : 'Review Answers (${quizProvider.reviews.length})',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: isDark ? Colors.white : const Color(0xFF0F172A),
                          ),
                        ),
                      ),
                      Icon(
                        _showReview ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                        color: isDark ? Colors.white70 : const Color(0xFF64748B),
                      ),
                    ],
                  ),
                ),
              ),

              // Detailed Question Review List
              if (_showReview) ...[
                const SizedBox(height: 14),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: quizProvider.reviews.length,
                  itemBuilder: (context, idx) {
                    final review = quizProvider.reviews[idx];
                    final q = review.question;
                    final isCorrect = review.isCorrect;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? AppTheme.darkSurface : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isCorrect
                              ? AppTheme.successGreen.withOpacity(0.4)
                              : AppTheme.errorRed.withOpacity(0.4),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Q${idx + 1}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w800,
                                  color: AppTheme.primaryBlue,
                                ),
                              ),
                              const Spacer(),
                              Icon(
                                isCorrect ? Icons.check_circle : Icons.cancel,
                                size: 18,
                                color: isCorrect ? AppTheme.successGreen : AppTheme.errorRed,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                isCorrect ? 'Correct' : 'Incorrect',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: isCorrect ? AppTheme.successGreen : AppTheme.errorRed,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            q.questionText,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: isDark ? Colors.white : const Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 10),
                          if (!isCorrect && review.selectedIndex >= 0 && review.selectedIndex < q.options.length) ...[
                            Text(
                              'Your choice: ${q.options[review.selectedIndex]}',
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppTheme.errorRed,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 2),
                          ],
                          Text(
                            'Correct answer: ${q.correctAnswer}',
                            style: const TextStyle(
                              fontSize: 13,
                              color: AppTheme.successGreen,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
              const SizedBox(height: 24),

              // Action Buttons: Play Again & Back Home
              CustomButton(
                text: 'Play Again',
                icon: Icons.replay,
                onPressed: () {
                  quizProvider.startQuiz();
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => const QuizScreen()),
                  );
                },
              ),
              const SizedBox(height: 12),
              CustomButton(
                text: 'Back to Home',
                icon: Icons.home_outlined,
                isSecondary: true,
                onPressed: () {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const HomeScreen()),
                    (route) => false,
                  );
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricTile({
    required String label,
    required String value,
    required IconData icon,
    required Color color,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.darkSurface : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppTheme.darkBorder : AppTheme.lightBorder,
        ),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
            ),
          ),
        ],
      ),
    );
  }
}
