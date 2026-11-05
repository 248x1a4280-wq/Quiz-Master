import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/category.dart';
import '../models/question.dart';
import '../providers/quiz_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/custom_button.dart';

class AddQuestionScreen extends StatefulWidget {
  const AddQuestionScreen({super.key});

  @override
  State<AddQuestionScreen> createState() => _AddQuestionScreenState();
}

class _AddQuestionScreenState extends State<AddQuestionScreen> {
  final _formKey = GlobalKey<FormState>();

  final _questionController = TextEditingController();
  final _optionAController = TextEditingController();
  final _optionBController = TextEditingController();
  final _optionCController = TextEditingController();
  final _optionDController = TextEditingController();

  int _correctAnswerIndex = 0;
  String _selectedCategory = 'Programming';
  String _selectedDifficulty = 'medium';
  bool _isSaving = false;

  final List<String> _categories = [
    'Programming',
    'Computer Science',
    'General Knowledge',
    'Mathematics',
    'Science & Nature',
    'Sports',
    'History',
    'Entertainment',
  ];

  final List<String> _difficulties = ['easy', 'medium', 'hard'];

  @override
  void dispose() {
    _questionController.dispose();
    _optionAController.dispose();
    _optionBController.dispose();
    _optionCController.dispose();
    _optionDController.dispose();
    super.dispose();
  }

  void _saveQuestion() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fix form validation errors before saving.'),
          backgroundColor: AppTheme.errorRed,
        ),
      );
      return;
    }

    setState(() => _isSaving = true);

    final newQuestion = Question(
      id: 'custom_${DateTime.now().millisecondsSinceEpoch}',
      questionText: _questionController.text.trim(),
      options: [
        _optionAController.text.trim(),
        _optionBController.text.trim(),
        _optionCController.text.trim(),
        _optionDController.text.trim(),
      ],
      correctOptionIndex: _correctAnswerIndex,
      category: _selectedCategory,
      difficulty: _selectedDifficulty,
      isCustom: true,
    );

    final provider = context.read<QuizProvider>();
    await provider.addCustomQuestion(newQuestion);

    setState(() => _isSaving = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Custom question created successfully!'),
          backgroundColor: AppTheme.successGreen,
        ),
      );

      // Reset form
      _questionController.clear();
      _optionAController.clear();
      _optionBController.clear();
      _optionCController.clear();
      _optionDController.clear();
      setState(() {
        _correctAnswerIndex = 0;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final quizProvider = context.watch<QuizProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Custom Question'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Create Your Own Challenge',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Add custom trivia questions. All entries are saved locally to your device.',
                style: TextStyle(
                  fontSize: 13,
                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                ),
              ),
              const SizedBox(height: 18),

              Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Question text field
                    const Text('Question Statement', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                    const SizedBox(height: 6),
                    TextFormField(
                      controller: _questionController,
                      maxLines: 3,
                      decoration: const InputDecoration(
                        hintText: 'e.g. Which programming language was developed by Google in 2011?',
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter the question statement';
                        }
                        if (value.trim().length < 8) {
                          return 'Question must be at least 8 characters long';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Option A
                    const Text('Option A', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                    const SizedBox(height: 6),
                    TextFormField(
                      controller: _optionAController,
                      decoration: const InputDecoration(hintText: 'Enter Option A'),
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Option A is required' : null,
                    ),
                    const SizedBox(height: 12),

                    // Option B
                    const Text('Option B', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                    const SizedBox(height: 6),
                    TextFormField(
                      controller: _optionBController,
                      decoration: const InputDecoration(hintText: 'Enter Option B'),
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Option B is required' : null,
                    ),
                    const SizedBox(height: 12),

                    // Option C
                    const Text('Option C', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                    const SizedBox(height: 6),
                    TextFormField(
                      controller: _optionCController,
                      decoration: const InputDecoration(hintText: 'Enter Option C'),
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Option C is required' : null,
                    ),
                    const SizedBox(height: 12),

                    // Option D
                    const Text('Option D', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                    const SizedBox(height: 6),
                    TextFormField(
                      controller: _optionDController,
                      decoration: const InputDecoration(hintText: 'Enter Option D'),
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Option D is required' : null,
                    ),
                    const SizedBox(height: 16),

                    // Correct Answer Selector
                    const Text('Select Correct Answer', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<int>(
                      value: _correctAnswerIndex,
                      decoration: const InputDecoration(),
                      items: const [
                        DropdownMenuItem(value: 0, child: Text('Option A is Correct')),
                        DropdownMenuItem(value: 1, child: Text('Option B is Correct')),
                        DropdownMenuItem(value: 2, child: Text('Option C is Correct')),
                        DropdownMenuItem(value: 3, child: Text('Option D is Correct')),
                      ],
                      onChanged: (val) {
                        if (val != null) setState(() => _correctAnswerIndex = val);
                      },
                    ),
                    const SizedBox(height: 16),

                    // Category and Difficulty row
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Category', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                              const SizedBox(height: 6),
                              DropdownButtonFormField<String>(
                                value: _selectedCategory,
                                decoration: const InputDecoration(),
                                items: _categories
                                    .map((c) => DropdownMenuItem(value: c, child: Text(c, overflow: TextOverflow.ellipsis)))
                                    .toList(),
                                onChanged: (val) {
                                  if (val != null) setState(() => _selectedCategory = val);
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Difficulty', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                              const SizedBox(height: 6),
                              DropdownButtonFormField<String>(
                                value: _selectedDifficulty,
                                decoration: const InputDecoration(),
                                items: _difficulties
                                    .map((d) => DropdownMenuItem(value: d, child: Text(d.toUpperCase())))
                                    .toList(),
                                onChanged: (val) {
                                  if (val != null) setState(() => _selectedDifficulty = val);
                                },
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Submit Button
                    CustomButton(
                      text: 'Save Custom Question',
                      icon: Icons.check,
                      isLoading: _isSaving,
                      onPressed: _saveQuestion,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Existing Custom Questions List
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Saved Custom Questions',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    '${quizProvider.customQuestions.length} total',
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              if (quizProvider.customQuestions.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: isDark ? AppTheme.darkSurface : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? AppTheme.darkBorder : AppTheme.lightBorder,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      'No custom questions yet. Add one above!',
                      style: TextStyle(
                        fontSize: 13,
                        color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: quizProvider.customQuestions.length,
                  itemBuilder: (context, index) {
                    final q = quizProvider.customQuestions[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: isDark ? AppTheme.darkSurface : Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isDark ? AppTheme.darkBorder : AppTheme.lightBorder,
                        ),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  q.questionText,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '${q.category} · ${q.difficulty.toUpperCase()} · Answer: ${q.correctAnswer}',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: AppTheme.errorRed, size: 20),
                            onPressed: () => quizProvider.deleteCustomQuestion(q.id),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
