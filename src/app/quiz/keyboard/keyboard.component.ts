import { Component, EventEmitter, Output } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [],
  template: `
    @for (key of keyboard; track key) {
      <button (click)="pressKey(key)">{{ key }}</button>
    }
  `,
  styleUrl: './keyboard.component.scss',
})
export class KeyboardComponent {
  @Output() public keyEmitter = new EventEmitter<string>();

  public keyboard = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor() {
    fromEvent(document, 'keydown').subscribe((event: Event) => {
      if (event instanceof KeyboardEvent && !event.ctrlKey) {
        this.pressKey(event.key);
      }
    });
  }

  public pressKey(key: string): void {
    this.keyEmitter.emit(key);
  }
}
