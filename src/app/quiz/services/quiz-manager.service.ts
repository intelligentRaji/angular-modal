import { Injectable } from '@angular/core';
import { HttpQuizzesService, Quiz } from './http-quizzes.service';
import { BehaviorSubject, combineLatest, filter, map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizManagerService {
  private currentQuizId = 0;

  private guessedLetters$$ = new BehaviorSubject<Set<string>>(new Set<string>());
  private guessedLetters$ = this.guessedLetters$$.asObservable();
  private quiz$!: Observable<Quiz>;

  constructor(private httpQuizzesService: HttpQuizzesService) {
    this.setQuiz();
    this.isAllLettersGuessed$.subscribe();
  }

  public get answer$(): Observable<string> {
    return this.quiz$.pipe(map((quiz) => quiz.answer));
  }

  public get question$(): Observable<string> {
    return this.quiz$.pipe(map((quiz) => quiz.question));
  }

  public get hiddenAnswer$(): Observable<string> {
    return combineLatest([this.answer$, this.guessedLetters$]).pipe(
      map(([answer, guessedLetters]) => this.hideNotGuessedLetters(answer, guessedLetters)),
    );
  }

  private get isAllLettersGuessed$(): Observable<boolean> {
    return combineLatest([this.answer$, this.guessedLetters$]).pipe(
      map(([answer, guessedLetters]) =>
        answer
          .toLowerCase()
          .split('')
          .every((letter) => guessedLetters.has(letter)),
      ),
    );
  }

  public setQuiz(): void {
    this.quiz$ = this.httpQuizzesService.getQuizById(this.currentQuizId).pipe(shareReplay());
  }

  public addIfGuessed(letter: string): void {
    this.answer$
      .pipe(filter((answer) => this.answerIncludeLetter(answer, letter)))
      .subscribe(() => {
        this.updateGuessedLetters(letter);
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
