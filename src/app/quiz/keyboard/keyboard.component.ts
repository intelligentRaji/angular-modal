import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @for (key of keyboard; track key) {
      <button (click)="pressKey(key)">{{ key }}</button>
    }
  `,
  styleUrl: './keyboard.component.scss',
})
export class KeyboardComponent {
  @Input() public removeSubscribers = false;

  @Output() public keyEmitter = new EventEmitter<string>();

  public keyboard = 'abcdefghijklmnopqrstuvwxyz'.split('');

  private readonly keyboardEventSubscription = fromEvent<KeyboardEvent>(
    document,
    'keydown',
  ).subscribe((event) => {
    if (!event.ctrlKey) {
      this.pressKey(event.key);
    }
  });

  public pressKey(key: string): void {
    this.keyEmitter.emit(key);
  }
}
