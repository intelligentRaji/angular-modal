import BaseComponent from '@components/base-component';
import Controller from '@components/core/controller';
import Keyboard from '@components/keyboard';

class Quiz extends BaseComponent {
  protected question: BaseComponent<'p'>;
  protected answer: BaseComponent<'p'>;
  protected keyboard: Keyboard;
  protected attempts: BaseComponent<'p'>;

  protected parent: Controller;

  protected wrongGuesses: number;
  protected maxWrongGuesses: number;

  private questionText: string;
  private answerText: string;

  protected hiddenAnswer: string[];
  protected letterIndexes: Map<string, number[]>;

  protected keys: Map<string, BaseComponent>;

  constructor(parent: Controller, numberOfDrawingSteps: number) {
    super('div', ['quiz']);

    this.parent = parent;

    this.hiddenAnswer = [];
    this.letterIndexes = new Map();
    this.keys = new Map();

    this.question = new BaseComponent('p', ['question']);
    this.answer = new BaseComponent('p', ['answer']);
    this.attempts = new BaseComponent('p', ['attempts']);

    this.keyboard = new Keyboard(this);

    this.wrongGuesses = 0;
    this.maxWrongGuesses = numberOfDrawingSteps;

    this.questionText = '';
    this.answerText = '';

    this.setAttempts();
    this.insertChildren([this.question, this.answer, this.attempts, this.keyboard]);
  }

  public setQuestionAndAnswer() {
    this.question.setContent(this.questionText);

    if (this.answerText) {
      Array.from(this.answerText.toLowerCase()).forEach((letter, index) => {
        if (letter === ' ') return;
        if (!this.letterIndexes.has(letter)) {
          this.letterIndexes.set(letter, []);
        }
        this.letterIndexes.get(letter)?.push(index);
      });

      this.hiddenAnswer = Array.from(this.answerText.replace(/[a-zA-Z]/g, '_'));
      this.answer.setContent(this.hiddenAnswer.join(''));
    }
  }

  setAttempts() {
    this.attempts.setContent(
      `Attempts: ${this.wrongGuesses.toString()}/${this.maxWrongGuesses.toString()}`,
    );
  }

  public newQuiz({ question, answer }: { question: string; answer: string }) {
    this.clearGame();
    this.answerText = answer;
    this.questionText = question;

    this.setQuestionAndAnswer();
  }

  public clearGame() {
    this.wrongGuesses = 0;
    this.setAttempts();
    this.letterIndexes.clear();
    this.keyboard.updateKeys();
  }

  checkGuess(guess: string) {
    const indexes = this.letterIndexes.get(guess);
    if (indexes) {
      for (const index of indexes) {
        const letter = this.answerText[index];
        if (letter) this.hiddenAnswer[index] = letter;
      }
      this.answer.setContent(this.hiddenAnswer.join(''));

      if (this.hiddenAnswer.join('') === this.answerText) this.parent.showModal('game-win');
    } else {
      this.wrongGuesses++;
      this.parent.wrongGuess(this.wrongGuesses);
      this.setAttempts();
      if (this.wrongGuesses === this.maxWrongGuesses) this.parent.showModal('game-over');
    }
  }
}

export default Quiz;
