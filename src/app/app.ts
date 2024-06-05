import Gallows from '@components/gallows';
import Keyboard from '@components/keyboard';
import QuizController from './quiz/quiz.controller';
import Modal from '@components/modal';

class App {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  public start() {
    const gallows = new Gallows();
    const keyboard = new Keyboard();
    const quiz = new QuizController();
    const modal = new Modal();

    this.root.append(gallows.getNode(), quiz.mount(), keyboard.getNode(), modal.getNode());
  }
}

new App(document.body).start();
