import Keyboard from '@components/keyboard';
import QuizService from '../services/quiz.service';
import Quiz from '@components/quiz';
import Gallows from '@components/gallows';

class QuizController {
  private service: QuizService;
  private gallows: Gallows;
  private keyboard: Keyboard;
  private quiz: Quiz;

  constructor(gallows: Gallows, keyboard: Keyboard, quiz: Quiz, service: QuizService) {
    this.service = service;
    this.gallows = gallows;
    this.keyboard = keyboard;
    this.quiz = quiz;

    this.keyboard.render(this.handleKeyPress);
  }

  private handleKeyPress = (key: string) => {
    if (!this.service.checkLetter(key)) {
      this.service.incrementAttempts();
      this.gallows.drawStep(this.service.attempts);
    }
    this.updateView();
    this.checkGameStatus();
  };

  private resetGame = () => {
    this.keyboard.reset();
    this.gallows.newDraw();
    this.service.newCurrent();
    this.startGame();
  };

  private checkGameStatus() {
    if (this.service.checkLose()) {
      this.quiz.showModal('lose', this.service.answer, this.resetGame);
    }
    if (this.service.checkWin()) {
      this.quiz.showModal('win', this.service.answer, this.resetGame);
    }
  }

  updateView() {
    this.quiz.setAnswer(this.service.hiddenAnswer);
    this.quiz.setAttempts(this.service.attempts, this.service.maxAttempts);
  }

  startGame() {
    this.quiz.setQuestion(this.service.question);
    this.updateView();
  }
}

export default QuizController;
