import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../theme/app_theme.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  String _selectedFilter = 'All';

  @override
  Widget build(BuildContext context) {
    final quizProvider = context.watch<QuizProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final allEntries = quizProvider.leaderboard;

    final filteredEntries = _selectedFilter == 'All'
        ? allEntries
        : allEntries.where((e) => e['category'] == _selectedFilter).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Leaderboard'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Filter categories pills/buttons
            Container(
              height: 48,
              margin: const EdgeInsets.symmetric(vertical: 8),
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: ['All', 'Computer Science', 'Programming', 'General Knowledge', 'Science & Nature']
                    .map((cat) {
                  final isSelected = _selectedFilter == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      onSelected: (val) {
                        if (val) setState(() => _selectedFilter = cat);
                      },
                      selectedColor: AppTheme.primaryBlue,
                      backgroundColor: isDark ? AppTheme.darkSurfaceVariant : AppTheme.lightSurfaceVariant,
                      labelStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isSelected
                            ? Colors.white
                            : (isDark ? Colors.white70 : const Color(0xFF475569)),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),

            // Top 3 Podium if enough entries
            if (filteredEntries.length >= 3)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    // #2 Silver
                    _buildPodiumSpot(
                      entry: filteredEntries[1],
                      rank: 2,
                      color: const Color(0xFF94A3B8),
                      height: 100,
                      isDark: isDark,
                    ),
                    const SizedBox(width: 12),
                    // #1 Gold
                    _buildPodiumSpot(
                      entry: filteredEntries[0],
                      rank: 1,
                      color: AppTheme.warningAmber,
                      height: 126,
                      isDark: isDark,
                    ),
                    const SizedBox(width: 12),
                    // #3 Bronze
                    _buildPodiumSpot(
                      entry: filteredEntries[2],
                      rank: 3,
                      color: const Color(0xFFD97706),
                      height: 84,
                      isDark: isDark,
                    ),
                  ],
                ),
              ),

            const SizedBox(height: 10),

            // Rankings List
            Expanded(
              child: filteredEntries.isEmpty
                  ? Center(
                      child: Text(
                        'No leaderboard entries found for $_selectedFilter.',
                        style: TextStyle(
                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                        ),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                      itemCount: filteredEntries.length,
                      itemBuilder: (context, index) {
                        final item = filteredEntries[index];
                        final rank = index + 1;
                        final username = item['username'] ?? 'Player';
                        final score = item['score'] ?? 0;
                        final category = item['category'] ?? 'General';
                        final accuracy = item['accuracy'] ?? 0;

                        return Container(
                          margin: const EdgeInsets.only(bottom: 10),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: isDark ? AppTheme.darkSurface : Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: rank <= 3
                                  ? (rank == 1
                                      ? AppTheme.warningAmber.withOpacity(0.5)
                                      : AppTheme.primaryBlue.withOpacity(0.3))
                                  : (isDark ? AppTheme.darkBorder : AppTheme.lightBorder),
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 32,
                                height: 32,
                                alignment: Alignment.center,
                                decoration: BoxDecoration(
                                  color: rank == 1
                                      ? AppTheme.warningAmber
                                      : (rank == 2
                                          ? const Color(0xFF94A3B8)
                                          : (rank == 3
                                              ? const Color(0xFFD97706)
                                              : (isDark ? AppTheme.darkSurfaceVariant : AppTheme.lightSurfaceVariant))),
                                  shape: BoxShape.circle,
                                ),
                                child: Text(
                                  '$rank',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w800,
                                    color: rank <= 3 ? Colors.white : (isDark ? Colors.white70 : const Color(0xFF334155)),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      username,
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                                      ),
                                    ),
                                    Text(
                                      '$category · $accuracy% accuracy',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                '$score pts',
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w800,
                                  color: AppTheme.primaryBlue,
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPodiumSpot({
    required Map<String, dynamic> entry,
    required int rank,
    required Color color,
    required double height,
    required bool isDark,
  }) {
    final username = entry['username'] ?? 'Player';
    final score = entry['score'] ?? 0;

    return Expanded(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: color, width: 2),
            ),
            child: CircleAvatar(
              radius: 18,
              backgroundColor: color.withOpacity(0.2),
              child: Text(
                rank == 1 ? '👑' : (rank == 2 ? '🥈' : '🥉'),
                style: const TextStyle(fontSize: 16),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            username,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
            ),
          ),
          Text(
            '$score pts',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: color,
            ),
          ),
          const SizedBox(height: 6),
          Container(
            height: height,
            width: double.infinity,
            decoration: BoxDecoration(
              color: color.withOpacity(isDark ? 0.2 : 0.15),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
              border: Border.all(color: color.withOpacity(0.4)),
            ),
            child: Center(
              child: Text(
                '#$rank',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: color,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
