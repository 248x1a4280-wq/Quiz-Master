import 'dart:convert';

class UserProfile {
  final String username;
  final String avatar;
  final int quizzesAttempted;
  final int totalCorrectAnswers;
  final int highestScore;
  final int currentStreak;
  final DateTime memberSince;

  UserProfile({
    this.username = 'Alex Developer',
    this.avatar = '🧑‍💻',
    this.quizzesAttempted = 0,
    this.totalCorrectAnswers = 0,
    this.highestScore = 0,
    this.currentStreak = 1,
    DateTime? memberSince,
  }) : memberSince = memberSince ?? DateTime.now();

  double get accuracyRate => quizzesAttempted > 0
      ? (totalCorrectAnswers / (quizzesAttempted * 10)) * 100
      : 0.0;

  UserProfile copyWith({
    String? username,
    String? avatar,
    int? quizzesAttempted,
    int? totalCorrectAnswers,
    int? highestScore,
    int? currentStreak,
    DateTime? memberSince,
  }) {
    return UserProfile(
      username: username ?? this.username,
      avatar: avatar ?? this.avatar,
      quizzesAttempted: quizzesAttempted ?? this.quizzesAttempted,
      totalCorrectAnswers: totalCorrectAnswers ?? this.totalCorrectAnswers,
      highestScore: highestScore ?? this.highestScore,
      currentStreak: currentStreak ?? this.currentStreak,
      memberSince: memberSince ?? this.memberSince,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'username': username,
      'avatar': avatar,
      'quizzesAttempted': quizzesAttempted,
      'totalCorrectAnswers': totalCorrectAnswers,
      'highestScore': highestScore,
      'currentStreak': currentStreak,
      'memberSince': memberSince.toIso8601String(),
    };
  }

  factory UserProfile.fromMap(Map<String, dynamic> map) {
    return UserProfile(
      username: map['username'] ?? 'Alex Developer',
      avatar: map['avatar'] ?? '🧑‍💻',
      quizzesAttempted: map['quizzesAttempted'] ?? 0,
      totalCorrectAnswers: map['totalCorrectAnswers'] ?? 0,
      highestScore: map['highestScore'] ?? 0,
      currentStreak: map['currentStreak'] ?? 1,
      memberSince: DateTime.tryParse(map['memberSince'] ?? '') ?? DateTime.now(),
    );
  }

  String toJson() => jsonEncode(toMap());
}
