import { Injectable } from '@angular/core';
import { HttpQuizzesService } from './http-quizzes.service';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizManagerService {
  public question$: Observable<string>;
  public answer$: Observable<string>;
  public hiddenAnswer$: Observable<string>;
  public isQuizSolved$: Observable<boolean>;

  private currentQuizId = 0;
  private guessedLetters = new Set<string>();
  private hiddenAnswer$$ = new BehaviorSubject<Set<string>>(new Set());

  constructor(private quizService: HttpQuizzesService) {
    const quiz$ = this.quizService.getQuizById(this.currentQuizId).pipe(shareReplay());

    this.question$ = quiz$.pipe(map((quiz) => quiz.question));
    this.answer$ = quiz$.pipe(map((quiz) => quiz.answer));
    this.hiddenAnswer$ = combineLatest([this.answer$, this.hiddenAnswer$$]).pipe(
      map(([answer, guessedLetters]) => this.hideNotGuessedLetters(answer, guessedLetters)),
    );
    this.isQuizSolved$ = combineLatest([this.answer$, this.hiddenAnswer$$]).pipe(
      map(([answer, guessedLetters]) => this.isQuizSolved(answer, guessedLetters)),
    );
  }

  public addIfGuessed(letter: string): void {
    this.answer$.pipe(map((answer) => this.answerIncludeLetter(answer, letter))).subscribe(() => {
      this.guessedLetters.add(letter);
      this.hiddenAnswer$$.next(this.guessedLetters);
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

  private isQuizSolved(answer: string, guessedLetters: Set<string>): boolean {
    return answer.split('').every((letter) => guessedLetters.has(letter.toLowerCase()));
  }
}
