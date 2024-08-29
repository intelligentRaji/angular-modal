import { Injectable } from '@angular/core';
import { HttpQuizzesService, Quiz } from './http-quizzes.service';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizManagerService {
  private currentQuizId = 0;

  private guessedLetters$$ = new BehaviorSubject<Set<string>>(new Set<string>());
  private guessedLetters$ = this.guessedLetters$$.asObservable();

  constructor(private httpQuizzesService: HttpQuizzesService) {}

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

  private get quiz$(): Observable<Quiz> {
    return this.httpQuizzesService.getQuizById(this.currentQuizId).pipe(shareReplay());
  }

  public addIfGuessed(letter: string): void {
    this.answer$.pipe(map((answer) => this.answerIncludeLetter(answer, letter))).subscribe(() => {
      this.guessedLetters$$.next(new Set([...this.guessedLetters$$.value, letter]));
    });
  }

  private answerIncludeLetter(answer: string, letter: string): boolean {
    return answer.toLowerCase().includes(letter.toLowerCase());
  }

  private hideNotGuessedLetters(answer: string, guessedLetters: Set<string>): string {
    return answer
      .split('')
      .map((letter) => (guessedLetters.has(letter.toLowerCase()) ? letter : '_'))
      .join('');
  }
}
