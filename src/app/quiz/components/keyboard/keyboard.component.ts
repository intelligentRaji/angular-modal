import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fromEvent, map, Observable, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { QuizService } from '../../../core/services/quiz.service';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @for (key of keyboard; track key) {
      <button [disabled]="isGuessed(key) | async" (click)="pressKey(key)">{{ key }}</button>
    }
  `,
  styleUrl: './keyboard.component.scss',
})
export class KeyboardComponent {
  @Input() public allowEmitting = false;

  @Output() public keyEmitter = new EventEmitter<string>();

  public keyboard = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(private quizManagerService: QuizService) {
    fromEvent<KeyboardEvent>(document, 'keydown').subscribe((event) => {
      if (event.ctrlKey || event.altKey) {
        return;
      }
      this.pressKey(event.key);
    });
  }

  public isGuessed(key: string): Observable<boolean> {
    return this.quizManagerService.guessedLetters$.pipe(
      map((guessedLetters) => guessedLetters.has(key)),
      shareReplay(),
    );
  }

  public pressKey(key: string): void {
    if (this.allowEmitting) {
      this.keyEmitter.emit(key);
    }
  }
}
