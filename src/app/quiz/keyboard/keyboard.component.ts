import { Component } from '@angular/core';
import { KeyboardService } from './keyboard.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
})
export class KeyboardComponent {
  public keyboard = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(private keyboardService: KeyboardService) {
    fromEvent(document, 'keydown').subscribe((event: Event) => {
      if (event instanceof KeyboardEvent) {
        this.click(event.key);
      }
    });
  }

  public click(key: string): void {
    this.keyboardService.notifyClick(key);
  }
}
