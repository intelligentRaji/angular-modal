import { Injectable, signal } from '@angular/core';
import { HttpQuizzesService } from './http-quizzes.service';
import { BehaviorSubject, combineLatest, map, switchMap, tap } from 'rxjs';
import { QuizStatus } from '../../shared/enums/quiz-status';
import { MAX_GUESS_ATTEMPTS } from '../../shared/constants/max-guess-attempts';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  public incorrectGuesses = signal(0);
  private answer$$ = new BehaviorSubject<string>('');
  public answer$ = this.answer$$.asObservable();
  private question$$ = new BehaviorSubject<string>('');
  public question$ = this.question$$.asObservable();
  private guessedLetters$$ = new BehaviorSubject<Set<string>>(new Set<string>());
  public guessedLetters$ = this.guessedLetters$$.asObservable();

  private isAnswerGuessed$ = combineLatest([this.answer$, this.guessedLetters$]).pipe(
    map(([answer, guessedLetters]) =>
      answer
        .toLowerCase()
        .split('')
        .every((letter) => guessedLetters.has(letter)),
    ),
  );

  private quizStatus$$ = new BehaviorSubject<QuizStatus>(QuizStatus.IN_PROGRESS);
  public quizStatus$ = this.guessedLetters$$.pipe(
    switchMap(() =>
      combineLatest([this.isAnswerGuessed$, this.quizStatus$$]).pipe(
        map(([isAnswerGuessed, status]) => {
          if (isAnswerGuessed) {
            return QuizStatus.WON;
          }
          if (this.incorrectGuesses() >= MAX_GUESS_ATTEMPTS) {
            return QuizStatus.LOST;
          }
          return status;
        }),
      ),
    ),
  );

  public hiddenAnswer$ = combineLatest([this.answer$, this.guessedLetters$]).pipe(
    map(([answer, guessedLetters]) => this.updateHiddenAnswer(answer, guessedLetters)),
  );

  constructor(private httpQuizzesService: HttpQuizzesService) {
    this.setQuiz();
  }

  public setInitialValues = (): void => {
    this.incorrectGuesses.set(0);
    this.guessedLetters$$.next(new Set<string>());
    this.quizStatus$$.next(QuizStatus.IN_PROGRESS);
  };

  public setQuiz(): void {
    this.httpQuizzesService
      .getRandomQuiz()
      .pipe(
        map((quiz) => {
          this.answer$$.next(quiz.answer);
          this.question$$.next(quiz.question);
        }),
        tap(this.setInitialValues),
      )
      .subscribe();
  }

  public processGuess(letter: string): void {
    this.updateGuessedLetters(letter);
    if (!this.answerIncludeLetter(this.answer$$.value, letter)) {
      this.updateIncorrectGuessCount();
    }
  }

  private answerIncludeLetter(answer: string, letter: string): boolean {
    return answer.toLowerCase().includes(letter.toLowerCase());
  }

  private updateIncorrectGuessCount(): void {
    this.incorrectGuesses.set(this.incorrectGuesses() + 1);
  }

  private updateGuessedLetters(letter: string): void {
    this.guessedLetters$$.next(this.guessedLetters$$.value.add(letter));
  }

  private updateHiddenAnswer(answer: string, guessedLetters: Set<string>): string {
    return Array.from(answer)
      .map((letter) => (guessedLetters.has(letter.toLowerCase()) ? letter : '_'))
      .join('');
  }
}
