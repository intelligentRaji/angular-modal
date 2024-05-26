import BaseComponent from '@components/base-component';
import Gallows from '@components/gallows';
import Quiz from '@components/quiz';
import QuizData from '@data/quizzes.json';

class Controller extends BaseComponent {
  private quiz: Quiz;
  private gallows: Gallows;
  currentQuestion: number;

  private modal: BaseComponent;

  constructor() {
    super('div', ['app']);

    this.gallows = new Gallows();
    this.quiz = new Quiz(this, this.gallows.getNumberOfDrawingSteps());
    this.modal = new BaseComponent('div', ['modal']);

    this.currentQuestion = Math.floor(Math.random() * QuizData.length);
    const question = QuizData[this.currentQuestion];
    if (question) this.quiz.newQuiz(question);

    this.insertChildren([this.gallows, this.quiz]);
  }

  newGame() {
    this.modal.removeNode();
    this.gallows.newDraw();

    const lastQuestion = this.currentQuestion;
    do {
      this.currentQuestion = Math.floor(Math.random() * QuizData.length);
    } while (this.currentQuestion == lastQuestion);
    const question = QuizData[this.currentQuestion];
    if (question) this.quiz.newQuiz(question);
  }

  showModal(state: 'game-over' | 'game-win') {
    this.modal.removeNode();
    this.modal.setInnerHTML(`<h1>${state}</h1>`);
    const restartButton = new BaseComponent('button', ['restart-button']);
    restartButton.setInnerHTML('Restart');

    restartButton.addListener('click', () => {
      this.newGame();
    });
    this.modal.insertChild(restartButton);
    this.insertChild(this.modal);
  }

  wrongGuess(numOfCurrentWrongGuesses: number) {
    this.gallows.drawStep(numOfCurrentWrongGuesses);
  }
}

export default Controller;
