import BaseComponent from '@components/base-component';
import Quiz from '@components/quiz';
import range from '@utils/charInRange';

class Keyboard extends BaseComponent {
  private handleKeyDownBound: (event: KeyboardEvent) => void;
  private handleKeyboardClickBound: (event: MouseEvent) => void;

  private quiz: Quiz;

  private keys: Map<string, BaseComponent<'button'>>;

  constructor(quiz: Quiz) {
    super('div', ['keyboard']);
    this.keys = new Map();

    this.quiz = quiz;

    this.createKeyboard();
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
    this.handleKeyboardClickBound = this.handleKeyboardClick.bind(this);
    this.setEvents();
  }

  public setEvents() {
    window.addEventListener('keydown', this.handleKeyDownBound);
    this.addListener('click', this.handleKeyboardClickBound);
  }

  private handleKeyboardClick(event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    if (target.tagName !== 'BUTTON') return;
    this.checkKeyState(target.innerText);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey) return;
    const pressedKey = event.key.toLowerCase();
    this.checkKeyState(pressedKey);
  }

  private checkKeyState(key: string) {
    if (!/[a-z]/.test(key)) return;
    const selectedKey = this.keys.get(key);
    if (selectedKey && !selectedKey.hasAttribute('disabled')) {
      selectedKey.setAttribute('disabled', 'true');
      this.quiz.checkGuess(key);
    }
  }

  public updateKeys() {
    this.keys.forEach((key) => {
      key.removeAttribute('disabled');
    });
  }

  private createKeyboard() {
    const buttons = range('a', 'z').map((key) => {
      const button = new BaseComponent('button', ['key'], key);
      this.keys.set(key, button);
      return button;
    });

    this.insertChildren(buttons);
  }
}

export default Keyboard;
