import { BaseComponent } from './baseComponent';
import { ButtonComponent } from './button';

export class ModalComponent extends BaseComponent {
  private button = new ButtonComponent({
    textContent: 'Play Again',
  });
  private modalText = new BaseComponent({
    classNames: ['modal-text'],
  });

  constructor() {
    super({ classNames: ['modal'] });
    this.insertChildren(this.modalText, this.button);
  }

  setButtonFunction(listener: () => void) {
    this.button.addListener('click', listener);
  }

  setModalText(text: string) {
    this.modalText.setContent(text);
  }

  clearModal() {
    this.button.removeNode();
    this.modalText.removeNode();
  }
}
