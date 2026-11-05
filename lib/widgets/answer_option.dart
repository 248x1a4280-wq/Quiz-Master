import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class AnswerOptionTile extends StatelessWidget {
  final int index;
  final String text;
  final bool isSelected;
  final bool isConfirmed;
  final bool isCorrect;
  final VoidCallback onTap;

  const AnswerOptionTile({
    super.key,
    required this.index,
    required this.text,
    required this.isSelected,
    required this.isConfirmed,
    required this.isCorrect,
    required this.onTap,
  });

  String get optionLetter {
    switch (index) {
      case 0:
        return 'A';
      case 1:
        return 'B';
      case 2:
        return 'C';
      case 3:
        return 'D';
      default:
        return '${index + 1}';
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    Color borderColor;
    Color backgroundColor;
    Color badgeColor;
    Color badgeTextColor;
    Widget? trailingIcon;

    if (isConfirmed) {
      if (isCorrect) {
        // Correct answer highlighted
        borderColor = AppTheme.successGreen;
        backgroundColor = AppTheme.successGreen.withOpacity(isDark ? 0.2 : 0.1);
        badgeColor = AppTheme.successGreen;
        badgeTextColor = Colors.white;
        trailingIcon = const Icon(Icons.check_circle, color: AppTheme.successGreen, size: 24);
      } else if (isSelected && !isCorrect) {
        // User picked wrong answer
        borderColor = AppTheme.errorRed;
        backgroundColor = AppTheme.errorRed.withOpacity(isDark ? 0.2 : 0.1);
        badgeColor = AppTheme.errorRed;
        badgeTextColor = Colors.white;
        trailingIcon = const Icon(Icons.cancel, color: AppTheme.errorRed, size: 24);
      } else {
        borderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;
        backgroundColor = isDark ? AppTheme.darkSurface : AppTheme.lightSurface;
        badgeColor = isDark ? AppTheme.darkSurfaceVariant : AppTheme.lightSurfaceVariant;
        badgeTextColor = isDark ? Colors.white70 : const Color(0xFF64748B);
      }
    } else {
      if (isSelected) {
        borderColor = AppTheme.primaryBlue;
        backgroundColor = AppTheme.primaryBlue.withOpacity(isDark ? 0.2 : 0.08);
        badgeColor = AppTheme.primaryBlue;
        badgeTextColor = Colors.white;
      } else {
        borderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;
        backgroundColor = isDark ? AppTheme.darkSurface : AppTheme.lightSurface;
        badgeColor = isDark ? AppTheme.darkSurfaceVariant : AppTheme.lightSurfaceVariant;
        badgeTextColor = isDark ? Colors.white70 : const Color(0xFF64748B);
      }
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isConfirmed ? null : onTap,
          borderRadius: BorderRadius.circular(14),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: borderColor,
                width: isSelected || (isConfirmed && isCorrect) ? 2 : 1,
              ),
            ),
            child: Row(
              children: [
                // Option letter badge (A, B, C, D)
                Container(
                  width: 34,
                  height: 34,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: badgeColor,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    optionLetter,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: badgeTextColor,
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                // Option Text
                Expanded(
                  child: Text(
                    text,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                      color: isDark ? const Color(0xFFF8FAFC) : const Color(0xFF0F172A),
                    ),
                  ),
                ),
                if (trailingIcon != null) ...[
                  const SizedBox(width: 8),
                  trailingIcon,
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
