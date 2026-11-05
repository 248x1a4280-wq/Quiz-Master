import { Question } from '../types/quiz';

function decodeHtml(html: string): string {
  if (typeof document === 'undefined') return html;
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export const CURATED_OFFLINE_QUESTIONS: Question[] = [
  {
    id: 'curated_1',
    questionText: 'Which state management pattern uses ChangeNotifier and notifyListeners() in Flutter?',
    options: ['Provider', 'Bloc', 'Redux', 'GetX'],
    correctOptionIndex: 0,
    category: 'Programming',
    difficulty: 'medium',
  },
  {
    id: 'curated_2',
    questionText: 'What is the time complexity of searching in a balanced Binary Search Tree?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
    correctOptionIndex: 1,
    category: 'Computer Science',
    difficulty: 'medium',
  },
  {
    id: 'curated_3',
    questionText: 'Which planet in our solar system is famously known as the Red Planet?',
    options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
    correctOptionIndex: 2,
    category: 'Science & Nature',
    difficulty: 'easy',
  },
  {
    id: 'curated_4',
    questionText: 'In Flutter, what kind of widget is immutable once created?',
    options: ['StatefulWidget', 'StatelessWidget', 'InheritedWidget', 'RenderObject'],
    correctOptionIndex: 1,
    category: 'Programming',
    difficulty: 'easy',
  },
  {
    id: 'curated_5',
    questionText: 'What is the value of Euler\'s mathematical constant "e" approximately equal to?',
    options: ['3.1415', '2.7182', '1.6180', '1.4142'],
    correctOptionIndex: 1,
    category: 'Mathematics',
    difficulty: 'hard',
  },
  {
    id: 'curated_6',
    questionText: 'Who is widely recognized as the father of modern Computer Science?',
    options: ['Charles Babbage', 'Alan Turing', 'John von Neumann', 'Ada Lovelace'],
    correctOptionIndex: 1,
    category: 'History',
    difficulty: 'medium',
  },
  {
    id: 'curated_7',
    questionText: 'How many players are on the field for one team in a regulation football (soccer) match?',
    options: ['9', '10', '11', '12'],
    correctOptionIndex: 2,
    category: 'Sports',
    difficulty: 'easy',
  },
  {
    id: 'curated_8',
    questionText: 'Which protocol provides end-to-end encrypted communication over the World Wide Web?',
    options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
    correctOptionIndex: 2,
    category: 'Computer Science',
    difficulty: 'easy',
  },
  {
    id: 'curated_9',
    questionText: 'What does Dart\'s sound null-safety guarantee at compile time?',
    options: ['No memory leaks', 'Non-nullable variables cannot be null', 'Asynchronous threading', 'Zero garbage collection overhead'],
    correctOptionIndex: 1,
    category: 'Programming',
    difficulty: 'hard',
  },
  {
    id: 'curated_10',
    questionText: 'Which film won the first Academy Award for Best Animated Feature in 2002?',
    options: ['Monsters, Inc.', 'Shrek', 'Jimmy Neutron', 'Ice Age'],
    correctOptionIndex: 1,
    category: 'Entertainment',
    difficulty: 'medium',
  },
  {
    id: 'curated_11',
    questionText: 'In Flutter, which tree hierarchy represents the visual geometry and layout rendering?',
    options: ['Widget Tree', 'Element Tree', 'RenderObject Tree', 'State Tree'],
    correctOptionIndex: 2,
    category: 'Programming',
    difficulty: 'hard',
  },
  {
    id: 'curated_12',
    questionText: 'Which layer of the OSI model handles logical addressing and routing of packets?',
    options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
    correctOptionIndex: 1,
    category: 'Computer Science',
    difficulty: 'medium',
  },
];

export async function fetchOpenTdbQuestions(
  amount: number = 10,
  categoryId?: number | null,
  difficulty?: string | null
): Promise<Question[]> {
  try {
    const params = new URLSearchParams();
    params.set('amount', amount.toString());
    params.set('type', 'multiple');

    if (categoryId && categoryId > 0) {
      params.set('category', categoryId.toString());
    }

    if (difficulty && difficulty !== 'any') {
      params.set('difficulty', difficulty.toLowerCase());
    }

    const url = `https://opentdb.com/api.php?${params.toString()}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      // Fallback on HTTP error
      return getFilteredCurated(amount, categoryId);
    }

    const data = await response.json();

    if (data.response_code === 0 && Array.isArray(data.results) && data.results.length > 0) {
      return data.results.map((raw: any, index: number) => {
        const decodedQuestion = decodeHtml(raw.question);
        const decodedCorrect = decodeHtml(raw.correct_answer);
        const decodedIncorrects = (raw.incorrect_answers || []).map((ans: string) => decodeHtml(ans));

        const allOptions = [...decodedIncorrects, decodedCorrect];
        // Fisher-Yates shuffle
        for (let i = allOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
        }

        const correctIndex = allOptions.indexOf(decodedCorrect);

        return {
          id: `opentdb_${index}_${Date.now()}`,
          questionText: decodedQuestion,
          options: allOptions,
          correctOptionIndex: correctIndex >= 0 ? correctIndex : 0,
          category: decodeHtml(raw.category),
          difficulty: raw.difficulty,
          isCustom: false,
        };
      });
    } else {
      // Code 1 (no results) or 5 (rate limit)
      return getFilteredCurated(amount, categoryId);
    }
  } catch (err) {
    // Offline or network timeout - seamlessly return curated questions
    return getFilteredCurated(amount, categoryId);
  }
}

function getFilteredCurated(amount: number, categoryId?: number | null): Question[] {
  let list = [...CURATED_OFFLINE_QUESTIONS];
  // Shuffle curated questions so repeated sessions feel fresh
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, Math.min(amount, list.length));
}
