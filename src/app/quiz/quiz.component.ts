import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Key, KeyboardComponent } from './components/keyboard/keyboard.component';
import { QuizService } from '../core/services/quiz.service';
import { ModalComponent } from './components/modal/modal.component';
import { MAX_GUESS_ATTEMPTS } from '../shared/constants/max-guess-attempts';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { QuizStatus } from '../shared/enums/quiz-status';
import { ModalService } from '../services/modal.service';
import { ModalController } from '../services/modal-controller';
import { finalize, interval, startWith, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [AsyncPipe, KeyboardComponent, ModalComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  providers: [QuizService],
})
export class QuizComponent {
  private readonly quizService = inject(QuizService);
  private readonly modalService = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);

  private keyboard = viewChild.required(KeyboardComponent);
  private winModal = viewChild.required<TemplateRef<unknown>>('win');
  private loseModal = viewChild.required<TemplateRef<unknown>>('lose');

  private quizStatus = toSignal(this.quizService.quizStatus$);

  protected question = this.quizService.question;
  protected answer = this.quizService.hiddenAnswer;

  protected isInProgress = computed(() => this.quizStatus() === QuizStatus.IN_PROGRESS);
  protected incorrectGuesses = computed(
    () => `${this.quizService.incorrectGuesses().toString()} / ${MAX_GUESS_ATTEMPTS.toString()}`,
  );

  protected modalController$?: ModalController;

  constructor() {
    this.quizService.getQuiz();

    effect(() => {
      const status = this.quizStatus();

      if (status === QuizStatus.WON) {
        this.openModal(untracked(this.winModal));
      }

      if (status === QuizStatus.LOST) {
        this.openModal(untracked(this.loseModal));
      }
    });
  }

  protected startNewQuiz(): void {
    this.quizService.getQuiz();
    this.keyboard().resetKeys();
    this.closeModal();
  }

  protected pressKey(keys: Key[]): void {
    this.quizService.processKeys(keys);
  }

  private closeModal(): void {
    this.modalController$?.close();
  }

  private openModal(content: TemplateRef<unknown>): void {
    const initialTimerValue = 5;
    const timer = signal(initialTimerValue);

    this.modalController$ = this.modalService.addItem({ content, context: { timer } });
    this.modalController$
      .open()
      .pipe(
        startWith(null),
        switchMap(() => interval(1000)),
        take(initialTimerValue),
        tap((value) => {
          timer.set(initialTimerValue - (value + 1));
        }),
        finalize(() => {
          this.startNewQuiz();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
