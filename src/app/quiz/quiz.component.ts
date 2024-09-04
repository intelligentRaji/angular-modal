import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Key, KeyboardComponent } from './components/keyboard/keyboard.component';
import { QuizService } from '../core/services/quiz.service';
import { ModalComponent } from './components/modal/modal.component';
import { QuizStatus } from '../shared/enums/quiz-status';
import { MAX_GUESS_ATTEMPTS } from '../shared/constants/max-guess-attempts';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [AsyncPipe, KeyboardComponent, ModalComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  providers: [QuizService],
})
export class QuizComponent implements OnInit {
  @ViewChild(KeyboardComponent)
  private keyboard?: KeyboardComponent;

  private quizService = inject(QuizService);
  private quizStatus = toSignal(this.quizService.quizStatus$);

  protected question = this.quizService.question;
  protected answer = this.quizService.hiddenAnswer;

  protected isLose = computed(() => this.quizStatus() === QuizStatus.LOST);
  protected isWin = computed(() => this.quizStatus() === QuizStatus.WON);
  protected isInProgress = computed(() => this.quizStatus() === QuizStatus.IN_PROGRESS);
  protected incorrectGuesses = computed(
    () => `${this.quizService.incorrectGuesses().toString()} / ${MAX_GUESS_ATTEMPTS.toString()}`,
  );

  protected newQuiz(): void {
    this.quizService.getQuiz();
    this.keyboard?.resetKeys();
  }

  protected pressKey(keys: Key[]): void {
    this.quizService.processKeys(keys);
  }

  public ngOnInit(): void {
    this.quizService.getQuiz();
  }
}
