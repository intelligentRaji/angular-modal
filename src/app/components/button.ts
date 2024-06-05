import BaseComponent, { BaseComponentProps } from './baseComponent';

interface ButtonProps extends Omit<BaseComponentProps, 'tagName'> {
  listener?: (event?: MouseEvent) => void;
}

class Button extends BaseComponent<'button'> {
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

export default Button;
