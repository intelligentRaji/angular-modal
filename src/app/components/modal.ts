import eventEmitter, { eventNames } from '@services/eventEmitter';
import BaseComponent from './baseComponent';
import Button from './button';

class Modal extends BaseComponent {
  constructor() {
    super({ classNames: ['modal'] });

    eventEmitter.on(eventNames.GAME_WIN, (answer: string) => this.render('win', answer));
    eventEmitter.on(eventNames.GAME_LOSE, (answer: string) => this.render('lose', answer));
    eventEmitter.on(eventNames.RESET, () => this.setInnerHTML(''));
  }

  render(state: 'win' | 'lose', answer: string) {
    this.setInnerHTML(`<p>${state}!</p><p>The answer was: ${answer}</p>`);
    this.insertChild(
      new Button({
        textContent: 'Play Again',
        listener: () => eventEmitter.emit(eventNames.RESET),
      }),
    );
  }
}

export default Modal;
