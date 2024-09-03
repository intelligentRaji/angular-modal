import { Component, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Key, KeyboardComponent } from './components/keyboard/keyboard.component';
import { QuizService } from '../core/services/quiz.service';
import { ModalComponent } from './components/modal/modal.component';
import { QuizStatus } from '../shared/enums/quiz-status';
import { MAX_GUESS_ATTEMPTS } from '../shared/constants/max-guess-attempts';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [AsyncPipe, KeyboardComponent, ModalComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  providers: [QuizService],
})
export class QuizComponent {
  public question = this.quizService.question;
  public answer = this.quizService.hiddenAnswer;
  public incorrectGuesses = this.quizService.incorrectGuesses;

  protected readonly MAX_GUESS_ATTEMPTS = MAX_GUESS_ATTEMPTS;
  private quizStatus?: QuizStatus;

  constructor(public quizService: QuizService) {
    this.quizService.quizStatus$.subscribe((status) => {
      this.quizStatus = status;
    });
  }

  @ViewChild(KeyboardComponent) public keyboard!: KeyboardComponent;

  public newQuiz(): void {
    this.quizService.setQuiz();
    this.keyboard.resetKeys();
  }

  public get isLose(): boolean {
    return this.quizStatus === QuizStatus.LOST;
  }

  public get isWin(): boolean {
    return this.quizStatus === QuizStatus.WON;
  }

  public get isInProgress(): boolean {
    return this.quizStatus === QuizStatus.IN_PROGRESS;
  }

  public pressKey(keys: Key[]): void {
    this.quizService.processKeys(keys);
  }
}
