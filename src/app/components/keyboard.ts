import { BaseComponent } from './baseComponent';
import { ButtonComponent } from './button';
import { charsInRange } from '@utils/charsInRange';

export class KeyboardComponent extends BaseComponent {
  private keys = new Map<string, ButtonComponent>();

  constructor() {
    super({ classNames: ['keyboard'] });
  }

  public generateKeyboard(keyHandler: (key: string) => void) {
    charsInRange('a', 'z').forEach((letter) => {
      const button = new ButtonComponent({
        classNames: ['key'],
        textContent: letter,
      });

      button.addListener('click', () => {
        button.disable();
        keyHandler(letter);
      });

      this.keys.set(letter, button);
      this.insertChild(button);
    });

    this.setWindowListener(keyHandler);
  }

  setWindowListener(keyHandler: (key: string) => void) {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.ctrlKey) return;
      const letter = event.key;
      if (!/^[a-z]$/.test(letter)) return;

      const button = this.keys.get(letter);
      if (button && !button.hasAttribute('disabled')) {
        button.disable();
        keyHandler(letter);
      }
    });
  }

  public reset() {
    this.keys.forEach((button) => {
      button.enable();
    });
  }
}
