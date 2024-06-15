import { BaseComponent } from './baseComponent';
import { BaseComponentProps } from '@interfaces/BaseComponentProps';

interface ButtonProps extends Omit<BaseComponentProps, 'tagName'> {
  listener?: (event?: MouseEvent) => void;
}

export class ButtonComponent extends BaseComponent<'button'> {
  constructor({ classNames, textContent, listener }: ButtonProps) {
    super({
      tagName: 'button',
      classNames,
      textContent,
    });

    if (listener) this.addListener('click', listener);
  }

  enable() {
    this.removeAttribute('disabled');
  }

  disable() {
    this.setAttribute('disabled', 'true');
  }
}
