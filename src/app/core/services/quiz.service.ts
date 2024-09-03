import { Injectable, signal } from '@angular/core';
import { HttpQuizzesService } from './http-quizzes.service';
import { BehaviorSubject, tap } from 'rxjs';
import { QuizStatus } from '../../shared/enums/quiz-status';
import { Key } from '../../quiz/components/keyboard/keyboard.component';
import { MAX_GUESS_ATTEMPTS } from '../../shared/constants/max-guess-attempts';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  public incorrectGuesses = signal(0);
  public question = signal('');
  public hiddenAnswer = signal('');

  private quizStatus$$ = new BehaviorSubject<QuizStatus>(QuizStatus.IN_PROGRESS);
  public quizStatus$ = this.quizStatus$$.asObservable();

  private answer = '';

  constructor(private httpQuizzesService: HttpQuizzesService) {
    this.setQuiz();
  }

  public setInitialValues = (): void => {
    this.incorrectGuesses.set(0);
    this.quizStatus$$.next(QuizStatus.IN_PROGRESS);
  };

  public setQuiz(): void {
    this.httpQuizzesService
      .getRandomQuiz()
      .pipe(
        tap((quiz) => {
          this.answer = quiz.answer;
          this.hiddenAnswer.set(
            this.answer
              .split('')
              .map(() => '_')
              .join(''),
          );
          this.question.set(quiz.question);
        }),
        tap(this.setInitialValues),
      )
      .subscribe();
  }

  public processKeys(keys: Key[]): void {
    this.updateHiddenAnswer(keys);
    this.updateIncorrectGuessCount(keys);
    this.updateStatus();
  }

  private updateStatus(): void {
    if (this.incorrectGuesses() >= MAX_GUESS_ATTEMPTS) {
      this.quizStatus$$.next(QuizStatus.LOST);
    } else if (this.answer === this.hiddenAnswer()) {
      this.quizStatus$$.next(QuizStatus.WON);
    }
  }

  private updateIncorrectGuessCount(keys: Key[]): void {
    this.incorrectGuesses.set(
      keys.reduce(
        (incorrect, letter) =>
          incorrect + (!this.answer.includes(letter.value) && letter.isDisabled ? 1 : 0),
        0,
      ),
    );
  }

  private updateHiddenAnswer(keys: Key[]): void {
    this.hiddenAnswer.set(
      Array.from(this.answer)
        .map((letter) =>
          keys.some((key) => key.value === letter.toLowerCase() && key.isDisabled) ? letter : '_',
        )
        .join(''),
    );
  }
}
