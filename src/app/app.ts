import Controller from '@components/core/controller';

class App {
  private root: HTMLElement;

  private element: HTMLElement;

  constructor(element: HTMLElement, root: HTMLElement) {
    this.root = root;
    this.element = element;
  }

  start() {
    this.root.append(this.element);
  }
}

new App(new Controller().getNode(), document.body).start();
