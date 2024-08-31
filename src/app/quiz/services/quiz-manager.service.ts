import { Injectable, signal } from '@angular/core';
import { HttpQuizzesService } from './http-quizzes.service';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizManagerService {
  public maxIncorrectGuesses = 6;
  public incorrectGuesses = signal(0);

  public answer$: Observable<string>;
  public question$: Observable<string>;

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
      map(([answer, guessedLetters]) => this.hideNotGuessedLetters(answer, guessedLetters)),
    );
  }

  public get isAllLettersGuessed$(): Observable<boolean> {
    return combineLatest([this.answer$, this.guessedLetters$]).pipe(
      map(([answer, guessedLetters]) =>
        answer
          .toLowerCase()
          .split('')
          .every((letter) => guessedLetters.has(letter)),
      ),
      shareReplay(),
    );
  }

  public setQuiz(): void {
    this.httpQuizzesService
      .getRandomQuiz()
      .pipe(
        map((quiz) => {
          this.answer$$.next(quiz.answer);
          this.question$$.next(quiz.question);
        }),
        tap(() => {
          this.guessedLetters$$.next(new Set<string>());
          this.incorrectGuesses.set(0);
        }),
        shareReplay(),
      )
      .subscribe();
  }

  public addIfGuessed(letter: string): void {
    this.answer$.subscribe((answer) => {
      if (this.answerIncludeLetter(answer, letter)) {
        this.updateGuessedLetters(letter);
        return;
      }
      this.incorrectGuesses.update((value) => value + 1);
    });
  }

  private answerIncludeLetter(answer: string, letter: string): boolean {
    return answer.toLowerCase().includes(letter.toLowerCase());
  }

  private updateGuessedLetters(letter: string): void {
    this.guessedLetters$$.next(new Set([...this.guessedLetters$$.value, letter]));
  }

  private hideNotGuessedLetters(answer: string, guessedLetters: Set<string>): string {
    return Array.from(answer)
      .map((letter) => (guessedLetters.has(letter.toLowerCase()) ? letter : '_'))
      .join('');
  }
}
