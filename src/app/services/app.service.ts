import ListOfQuizzes from '../data/quizzes.json';
import { TriviaMetrics } from '@interfaces/TriviaMetrics';
import { shuffleQuizzes } from '@utils/shuffleQuizzes';

export class AppService {
  private readonly ListOfQuizzes = shuffleQuizzes(ListOfQuizzes);
  private readonly numberOfQuizzes = this.ListOfQuizzes.length;

  private currentQuizId = 0;
  private currentQuiz = this.ListOfQuizzes[this.currentQuizId]!;

  public triviaMetrics: TriviaMetrics;
  private guesses = new Set<string>();
  public currentAttempt = 0;
  public readonly maxAttempts: number;

  constructor(maxAttempts?: number) {
    this.maxAttempts = maxAttempts ?? 6;

    this.triviaMetrics = {
      question: this.question,
      answer: this.hiddenAnswer,
      currentAttempt: this.currentAttempt,
      maxAttempts: this.maxAttempts,
    };
  }

  get question() {
    return this.currentQuiz.question;
  }

  get answer() {
    return this.currentQuiz.answer;
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

  get isCorrectAnswer() {
    return this.hiddenAnswer === this.answer;
  }

  get isMaxAttemptsReached() {
    return this.currentAttempt >= this.maxAttempts;
  }

  newCurrent() {
    this.currentQuizId = (this.currentQuizId + 1) % this.numberOfQuizzes;
    this.guesses.clear();
    this.currentAttempt = 0;
    this.currentQuiz = this.ListOfQuizzes[this.currentQuizId]!;

    this.triviaMetrics = {
      question: this.question,
      answer: this.hiddenAnswer,
      currentAttempt: this.currentAttempt,
      maxAttempts: this.maxAttempts,
    };
  }

  isGuessRight(playerGuess: string): boolean {
    this.recordGuess(playerGuess);
    return this.answer.toLowerCase().includes(playerGuess);
  }

  recordGuess(playerGuess: string) {
    this.guesses.add(playerGuess);
  }

  incrementAttempts() {
    if (this.currentAttempt < this.maxAttempts) this.currentAttempt += 1;
  }
}
