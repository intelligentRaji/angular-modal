import shuffleQuizzes from '@utils/shuffleQuizzes';
import quizData from '../data/quizzes.json';

class QuizService {
  private guesses = new Set<string>();
  private readonly quizData = shuffleQuizzes(quizData);
  private numberOfQuizzes = quizData.length;
  private currentQuizId = 0;
  private current = this.quizData[this.currentQuizId]!;

  public attempts = 0;
  public readonly maxAttempts: number;

  constructor(maxAttempts?: number) {
    this.maxAttempts = maxAttempts ?? 6;
  }

  get question() {
    return this.current.question;
  }

  get answer() {
    return this.current.answer;
  }

  get hiddenAnswer() {
    return this.answer
      .split('')
      .map((letter) => {
        if (this.guesses.has(letter.toLowerCase())) return letter;
        if (letter === ' ') return ' ';
        return '_';
      })
      .join('');
  }

  newCurrent() {
    this.currentQuizId = (this.currentQuizId + 1) % this.numberOfQuizzes;
    this.guesses.clear();
    this.attempts = 0;
    this.current = this.quizData[this.currentQuizId]!;
  }

  isLetterInAnswer(letter: string): boolean {
    this.guesses.add(letter);
    return this.answer.toLowerCase().includes(letter);
  }

  isWin() {
    return this.hiddenAnswer === this.answer;
  }

  isLose() {
    return this.attempts >= this.maxAttempts;
  }

  incrementAttempts() {
    if (this.attempts < this.maxAttempts) this.attempts += 1;
  }
}

export default QuizService;
