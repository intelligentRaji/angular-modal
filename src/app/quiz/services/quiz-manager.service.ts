import { Injectable, signal } from '@angular/core';
import { HttpQuizzesService } from './http-quizzes.service';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
import { QuizStatus } from '../../share/enums/quizStatus';

@Injectable({
  providedIn: 'root',
})
export class QuizManagerService {
  public maxIncorrectGuesses = 6;
  public incorrectGuesses = signal(0);

  public answer$: Observable<string>;
  public question$: Observable<string>;

  public quizStatus = signal(QuizStatus.IN_PROGRESS);

  private answer$$ = new BehaviorSubject<string>('');
  private question$$ = new BehaviorSubject<string>('');
  private guessedLetters$$ = new BehaviorSubject<Set<string>>(new Set<string>());
  private guessedLetters$ = this.guessedLetters$$.asObservable();

  constructor(private httpQuizzesService: HttpQuizzesService) {
    this.answer$ = this.answer$$.asObservable();
    this.question$ = this.question$$.asObservable();

    this.setQuiz();
  }

  public get hiddenAnswer$(): Observable<string> {
    return combineLatest([this.answer$, this.guessedLetters$]).pipe(
      map(([answer, guessedLetters]) => this.updateHiddenAnswer(answer, guessedLetters)),
    );
  }

  public get isAnswerGuessed$(): Observable<boolean> {
    return combineLatest([this.answer$, this.guessedLetters$]).pipe(
      map(([answer, guessedLetters]) =>
        answer
          .toLowerCase()
          .split('')
          .every((letter) => guessedLetters.has(letter)),
      ),
    );
  }

  public setInitialValues = (): void => {
    this.guessedLetters$$.next(new Set<string>());
    this.incorrectGuesses.set(0);
    this.quizStatus.set(QuizStatus.IN_PROGRESS);
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
    this.updateQuizStatus();
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

  private updateQuizStatus(): void {
    this.isAnswerGuessed$
      .pipe(
        map((allLettersGuessed) => {
          if (this.incorrectGuesses() === this.maxIncorrectGuesses) {
            return QuizStatus.LOST;
          }

          if (allLettersGuessed) {
            return QuizStatus.WON;
          }

          return QuizStatus.IN_PROGRESS;
        }),
      )
      .subscribe((quizStatus) => {
        this.quizStatus.set(quizStatus);
      });
  }
}
