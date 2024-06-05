import { BaseComponentProps } from '@interfaces/BaseComponentProps';

class BaseComponent<K extends keyof HTMLElementTagNameMap = 'div'> {
  protected node: HTMLElementTagNameMap[K];

  constructor({ tagName = 'div' as K, classNames = [], textContent = '' }: BaseComponentProps<K>) {
    this.node = document.createElement(tagName);
    this.node.classList.add(...classNames);
    this.node.textContent = textContent;
  }

  public insertChild(child: BaseComponent<keyof HTMLElementTagNameMap>): void {
    this.node.append(child.getNode());
  }

  public insertChildren(...children: BaseComponent<keyof HTMLElementTagNameMap>[]): void {
    children.forEach((child) => {
      this.insertChild(child);
    });
  }

  public setContent(content: string): void {
    this.node.textContent = content;
  }

  public setInnerHTML(html: string) {
    this.node.innerHTML = html;
  }

  public getNode(): HTMLElementTagNameMap[K] {
    return this.node;
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public addListener<T extends keyof HTMLElementEventMap>(
    eventName: T,
    callback: (e: HTMLElementEventMap[T]) => void,
  ): void {
    this.node.addEventListener(eventName, callback as EventListener);
  }

  public removeListener<T extends keyof HTMLElementEventMap>(
    eventName: T,
    callback: (e: HTMLElementEventMap[T]) => void,
  ): void {
    this.node.removeEventListener(eventName, callback as EventListener);
  }

  public setAttribute<T extends keyof HTMLElementTagNameMap[K] & string>(
    attribute: T,
    value: string,
  ): void {
    this.node.setAttribute(attribute, value);
  }

  public hasAttribute(attribute: string): boolean {
    return this.node.hasAttribute(attribute);
  }

  public removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  public removeNode(): void {
    this.node.remove();
  }
}

export default BaseComponent;
