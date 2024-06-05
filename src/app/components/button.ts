import BaseComponent from './baseComponent';

interface ButtonProps {
  classNames?: string[];
  textContent?: string;
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
}

export default Button;
