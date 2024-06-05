import eventEmitter, { eventNames } from '@services/eventEmitter';
import BaseComponent from './baseComponent';
import Button from './button';
import charsInRange from '@utils/charsInRange';

class Keyboard extends BaseComponent {
  private keys = new Map<string, Button>();

  constructor() {
    super({ classNames: ['keyboard'] });
    this.render();

    eventEmitter.on(eventNames.RESET, () => this.reset());
  }

  private render() {
    charsInRange('a', 'z').forEach((keyValue) => {
      const button = new Button({
        classNames: ['key'],
        textContent: keyValue,
        listener: () => this.processKey(keyValue),
      });
      this.keys.set(keyValue, button);
      this.insertChild(button);
    });

    window.addEventListener('keydown', this.HandleKeyDown);
  }

  private HandleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey) return;
    if (!/^[a-z]$/.test(event.key)) return;
    const pressedKey = event.key.toLowerCase();
    if (!this.keys.get(pressedKey)?.hasAttribute('disabled')) this.processKey(pressedKey);
  };

  private processKey(key: string) {
    const button = this.keys.get(key);
    button?.setAttribute('disabled', 'true');

    eventEmitter.emit(eventNames.KEY_PRESSED, key);
  }

  private reset() {
    this.keys.forEach((button) => {
      button.removeAttribute('disabled');
    });
  }
}

export default Keyboard;
