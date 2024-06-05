import eventEmitter, { eventNames } from '@services/eventEmitter';
import QuizService from './quiz.service';
import QuizView from './quiz.view';

class QuizController {
  private service = new QuizService();
  private view = new QuizView();

  private maxAttempts: number;
  private attempts = 0;

  constructor(maxAttempts?: number) {
    this.maxAttempts = maxAttempts ?? 6;

    eventEmitter.on(eventNames.KEY_PRESSED, (key: string) => {
      if (this.attempts === this.maxAttempts) return;
      if (!this.service.checkLetter(key)) this.wrongGuess();

      this.view.setAnswer(this.hiddenAnswer);
      if (this.service.checkAnswer()) eventEmitter.emit(eventNames.GAME_WIN, this.answer);
    });

    eventEmitter.on(eventNames.RESET, () => {
      this.attempts = 0;
      this.service.newCurrent();
      this.render();
    });

    this.render();
  }

  get question() {
    return this.service.question;
  }

  get answer() {
    return this.service.answer;
  }

  get hiddenAnswer() {
    return this.service.hiddenAnswer;
  }

  render() {
    this.view.setQuestion(this.question);
    this.view.setAnswer(this.hiddenAnswer);
    this.view.setAttempts(this.attempts, this.maxAttempts);
  }

  mount() {
    return this.view.getNode();
  }

  wrongGuess() {
    eventEmitter.emit(eventNames.WRONG_KEY_PRESSED, this.attempts);

    if (this.attempts < this.maxAttempts) this.attempts += 1;
    this.view.setAttempts(this.attempts, this.maxAttempts);

    if (this.attempts === this.maxAttempts) eventEmitter.emit(eventNames.GAME_LOSE, this.answer);
  }
}

export default QuizController;
