import Keyboard from '@components/keyboard';
import QuizService from '../services/quiz.service';
import Quiz from '@components/quiz';
import Gallows from '@components/gallows';
import { GameEndWith } from '../enums/GameEndStatus';

class QuizController {
  private service: QuizService;
  private gallows: Gallows;
  private keyboard: Keyboard;
  private quiz: Quiz;

  constructor({
    gallows,
    keyboard,
    quiz,
    service,
  }: {
    gallows: Gallows;
    keyboard: Keyboard;
    quiz: Quiz;
    service: QuizService;
  }) {
    this.service = service;
    this.gallows = gallows;
    this.keyboard = keyboard;
    this.quiz = quiz;

    this.keyboard.render(this.handleKeyPress);
  }

  private handleKeyPress = (key: string) => {
    if (!this.service.isLetterInAnswer(key)) {
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
    const gameEnded = this.service.isWin() || this.service.isLose();

    if (gameEnded) {
      const gameStatus = this.service.isLose() ? GameEndWith.LOSE : GameEndWith.WIN;
      this.quiz.showModal({ gameStatus, answer: this.service.answer, resetGame: this.resetGame });
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
