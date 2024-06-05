import Keyboard from '@components/keyboard';
import QuizController from './controllers/quiz.controller';
import Gallows from '@components/gallows';
import Quiz from '@components/quiz';
import QuizService from '@services/quiz.service';

class App {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  public start() {
    const keyboard = new Keyboard();
    const gallows = new Gallows();
    const quiz = new Quiz();
    const service = new QuizService();

    new QuizController({
      gallows,
      keyboard,
      quiz,
      service,
    }).startGame();

    this.root.append(gallows.getNode(), quiz.getNode(), keyboard.getNode());
  }
}

new App(document.body).start();
