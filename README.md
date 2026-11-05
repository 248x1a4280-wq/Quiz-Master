# QuizMaster – Interactive Android Quiz Application

[![Flutter Version](https://img.shields.io/badge/Flutter-3.35%2B-02569B?logo=flutter)](https://flutter.dev)
[![Dart Version](https://img.shields.io/badge/Dart-3.3%2B-0175C2?logo=dart)](https://dart.dev)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-green.svg)](#)

QuizMaster is a professional, high-performance, and responsive Android quiz application built with **Flutter** and **Dart**. Designed as a comprehensive college group project, it follows modern software engineering principles, clean MVVM-style state management via **Provider with ChangeNotifier**, offline persistence through **SharedPreferences**, and live data integration using the **Open Trivia Database (OpenTDB) REST API**.

---

## 📱 Application Overview & Key Features

### 1. Splash Screen
* Branded QuizMaster icon with curved scaling and fade entrance animations.
* Automated routing transition to the Home Screen.

### 2. Home Screen
* Personalized welcome greeting displaying player avatar and username.
* Statistical performance summary: **Quizzes Completed** and **Highest Score**.
* Quick-start **Featured Quiz** card with immediate category launch.
* 8-domain category overview and shortcut to custom question challenges.

### 3. Quiz Categories & Difficulty Configuration
* Full catalog of academic and general domains:
  * **General Knowledge**
  * **Computer Science**
  * **Programming (Flutter, Dart, Python, etc.)**
  * **Mathematics**
  * **Science & Nature**
  * **Sports**
  * **History**
  * **Entertainment**
* Selectable difficulty levels: **Any**, **Easy**, **Medium**, **Hard**.
* Selectable question count: **5**, **10**, **15**, or **20** questions.

### 4. Interactive Quiz Screen
* Clean single-question presentation with HTML entity unescaping.
* 4 multiple-choice options with distinctive letter badges (A, B, C, D).
* Dynamic countdown timer (20 seconds per question) with color-coded urgency alerts.
* Instant visual feedback (Emerald Green for correct, Crimson Red for wrong).
* Locked response mechanism preventing post-submission modifications.
* Speed-bonus scoring engine (100 base points + up to 50 speed bonus points).
* Graceful network error handling with instant retry and offline question bank fallback.

### 5. Results & Review Answers Screen
* Overall score, percentage accuracy, correct/incorrect counters.
* Contextual motivational performance badge based on mastery score.
* Interactive **Review Answers** drawer displaying each question, selected option, and correct answer.
* One-tap **Play Again** or **Back to Home** navigation.

### 6. Custom Question Creator (Form Validation)
* Full form validation ensuring non-empty questions ($\ge 8$ characters) and 4 valid choices.
* Correct answer target assignment.
* Domain and difficulty tagging.
* Local persistence: Custom questions are saved to the device and immediately playable.

### 7. Leaderboard & Score Persistence
* Top 3 podium display for 1st (Gold 👑), 2nd (Silver 🥈), and 3rd (Bronze 🥉).
* Ranked player roster with scores and accuracy percentages.
* Filter leaderboard by subject domain.
* Persistent state surviving application termination.

### 8. User Profile & Theming
* Editable username and avatar selector.
* Lifetime statistics tracking: Win rate, total questions solved, and high scores.
* System-wide Material 3 **Light Mode** and **Dark Mode** toggle.

---

## 🏗️ Project Architecture

```
lib/
├── main.dart                      # Root entrypoint with MultiProvider & Routes
├── models/
│   ├── question.dart              # Question entity, OpenTDB JSON parser, serialization
│   ├── category.dart              # Category configuration and theme color palettes
│   ├── quiz_result.dart           # Quiz results model and post-game review details
│   └── user_profile.dart          # User credentials, statistics, and accuracy metrics
├── services/
│   ├── api_service.dart           # Open Trivia DB REST client with offline fallback bank
│   └── storage_service.dart       # SharedPreferences abstraction for offline caching
├── providers/
│   └── quiz_provider.dart         # Provider & ChangeNotifier authoritative application state
├── screens/
│   ├── splash_screen.dart         # Animated entrance screen
│   ├── home_screen.dart           # Primary dashboard & statistics hub
│   ├── category_screen.dart       # Category, difficulty & question count configuration
│   ├── quiz_screen.dart           # Question presentation, timer, and choice submission
│   ├── result_screen.dart         # Score report card, metrics, and answer review
│   ├── add_question_screen.dart   # Validated form for user-created custom questions
│   ├── leaderboard_screen.dart    # High scores & podium rankings
│   └── profile_screen.dart        # User profile editor and project documentation
├── widgets/
│   ├── question_card.dart         # Question container with category and difficulty badges
│   ├── answer_option.dart         # Tactile multiple-choice selection tile
│   ├── progress_indicator.dart    # Linear question progress and circular countdown timer
│   └── custom_button.dart         # Standard Material 3 button with loading states
└── theme/
    └── app_theme.dart             # Material 3 Light/Dark color palettes and typography
test/
└── widget_test.dart               # Unit tests & Flutter widget test suite
```

---

## 🚀 Setup & Installation Instructions

### Prerequisites
1. **Flutter SDK**: Version `3.35.0` or newer ([Install Flutter](https://docs.flutter.dev/get-started/install)).
2. **Dart SDK**: Version `3.3.0` or newer.
3. **Android Studio** or **VS Code** with Flutter & Dart extensions.
4. An Android Emulator or physical device with USB Debugging enabled.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/QuizMaster-Flutter.git
cd QuizMaster-Flutter
```

### 2. Install Dependencies
```bash
flutter pub get
```

### 3. Run the Widget Tests
```bash
flutter test
```

### 4. Run the Application in Debug Mode
```bash
flutter run
```

---

## 📦 Building the Release APK

To generate a standalone, optimized release APK suitable for grading and testing on any Android phone:

```bash
# Clean previous build artifacts
flutter clean
flutter pub get

# Build Release APK
flutter build apk --release
```

The compiled release APK will be located at:
```
build/app/outputs/flutter-apk/app-release.apk
```

To build an Android App Bundle (`.aab`) for Google Play:
```bash
flutter build appbundle --release
```

---

## 👥 College Project Team Contributions

| Member Name | Role | Primary Contributions |
| :--- | :--- | :--- |
| **Alex Developer** | Lead Mobile Engineer | App Architecture, Provider State Management, OpenTDB REST API integration |
| **Taylor Chen** | UI/UX & Frontend Designer | Material Design 3 Theming, Custom Widgets, Splash & Category Screens |
| **Jordan Smith** | Database & Persistence | Local Storage (SharedPreferences), Custom Question Form & Validation |
| **Morgan Lee** | QA & Test Engineer | Widget & Unit Tests, Documentation, Release APK packaging |

---

## 🔒 Security & Best Practices
* **No hardcoded secrets**: The Open Trivia DB API is completely public and requires no private API keys.
* **Network Resilience**: In case of network interruption or API rate limits, the app seamlessly switches to the high-integrity curated offline question bank without throwing unhandled exceptions.
* **Input Validation**: All form inputs are sanitized, trimmed, and validated before local storage persistence.
