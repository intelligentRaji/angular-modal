import { Injectable, signal } from '@angular/core';
import { HttpQuizzesService } from './http-quizzes.service';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
import { QuizStatus } from '../../shared/enums/quiz-status';
import { MAX_GUESS_ATTEMPTS } from '../../shared/constants/max-guess-attempts';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  public incorrectGuesses = signal(0);

  public answer$;
  public question$;
  public guessedLetters$;
  public quizStatus$;

  private quizStatus$$ = new BehaviorSubject<QuizStatus>(QuizStatus.IN_PROGRESS);
  private answer$$ = new BehaviorSubject<string>('');
  private question$$ = new BehaviorSubject<string>('');
  private guessedLetters$$ = new BehaviorSubject<Set<string>>(new Set<string>());

  constructor(private httpQuizzesService: HttpQuizzesService) {
    this.answer$ = this.answer$$.asObservable();
    this.question$ = this.question$$.asObservable();
    this.guessedLetters$ = this.guessedLetters$$.asObservable();
    this.quizStatus$ = this.quizStatus$$.asObservable();

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
        map((isAnswerGuessed) => {
          if (isAnswerGuessed) {
            this.quizStatus$$.next(QuizStatus.WON);
          } else if (this.incorrectGuesses() >= MAX_GUESS_ATTEMPTS) {
            this.quizStatus$$.next(QuizStatus.LOST);
          }
        }),
      )
      .subscribe();
  }
}
