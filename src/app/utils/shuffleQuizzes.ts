import { QuizData } from '@interfaces/QuizData';

export default function shuffleQuizzes(quizzes: QuizData[]): QuizData[] {
  const shuffledQuizzes = [...quizzes];

  for (let i = shuffledQuizzes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuizzes[i], shuffledQuizzes[j]] = [shuffledQuizzes[j]!, shuffledQuizzes[i]!];
  }

  return shuffledQuizzes;
}
