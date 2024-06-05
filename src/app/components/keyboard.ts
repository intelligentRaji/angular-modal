import BaseComponent from './baseComponent';
import Button from './button';
import charsInRange from '@utils/charsInRange';

class Keyboard extends BaseComponent {
  private keys = new Map<string, Button>();

  constructor() {
    super({ classNames: ['keyboard'] });
  }

  public render(keyHandler: (key: string) => void) {
    charsInRange('a', 'z').forEach((letter) => {
      const button = new Button({
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

export default Keyboard;
