import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';

export interface Key {
  value: string;
  isDisabled: boolean;
}

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
  host: {
    '(document:keydown)': 'pressKey($event)',
  },
})
export class KeyboardComponent {
  @Input() public allowEmitting = false;

  protected keys: Key[] = Array.from('abcdefghijklmnopqrstuvwxyz', (key) => ({
    value: key,
    isDisabled: false,
  }));

  @Output() private keyEmitter = new EventEmitter<typeof this.keys>();

  public resetKeys(): void {
    this.keys.forEach((key) => (key.isDisabled = false));
  }

  protected pressKey(event: KeyboardEvent): void {
    if (event.ctrlKey || event.altKey) {
      return;
    }

    const keyIndex = this.keys.findIndex(
      (key) => key.value === event.key.toLowerCase() && !key.isDisabled,
    );

    if (keyIndex === -1) {
      return;
    }
    this.updateKey(keyIndex);
  }

  protected updateKey(keyIndex: number): void {
    if (!this.allowEmitting) {
      return;
    }
    const key = this.keys[keyIndex];
    key.isDisabled = true;
    this.keyEmitter.emit(this.keys);
  }
}
