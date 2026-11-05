import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class QuizProgressBar extends StatelessWidget {
  final int current;
  final int total;

  const QuizProgressBar({
    super.key,
    required this.current,
    required this.total,
  });

  @override
  Widget build(BuildContext context) {
    final progress = total > 0 ? (current / total).clamp(0.0, 1.0) : 0.0;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Question $current of $total',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
              ),
            ),
            Text(
              '${(progress * 100).toInt()}%',
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppTheme.primaryBlue,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: Container(
            height: 8,
            color: isDark ? AppTheme.darkSurfaceVariant : AppTheme.lightSurfaceVariant,
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: progress,
              child: Container(
                decoration: const BoxDecoration(
                  gradient: AppTheme.brandGradient,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class TimerProgressCircle extends StatelessWidget {
  final int secondsRemaining;
  final double progress; // 0.0 to 1.0

  const TimerProgressCircle({
    super.key,
    required this.secondsRemaining,
    required this.progress,
  });

  @override
  Widget build(BuildContext context) {
    final isWarning = secondsRemaining <= 5;
    final timerColor = isWarning ? AppTheme.errorRed : AppTheme.primaryPurple;

    return Stack(
      alignment: Alignment.center,
      children: [
        SizedBox(
          width: 54,
          height: 54,
          child: CircularProgressIndicator(
            value: progress,
            strokeWidth: 4,
            backgroundColor: timerColor.withOpacity(0.15),
            valueColor: AlwaysStoppedAnimation<Color>(timerColor),
          ),
        ),
        Text(
          '$secondsRemaining',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: timerColor,
          ),
        ),
      ],
    );
  }
}
