import BaseComponent from '@components/baseComponent';
import Button from '@components/button';
import { GameEndWith } from '../enums/GameEndStatus';

class Quiz extends BaseComponent {
  private question = new BaseComponent({ tagName: 'p', classNames: ['question'] });
  private answer = new BaseComponent({ tagName: 'p', classNames: ['answer'] });
  private attempts = new BaseComponent({ tagName: 'p', classNames: ['attempts'] });
  private modal = new BaseComponent({ classNames: ['modal'] });

  constructor() {
    super({ classNames: ['quiz'] });

    this.insertChildren(this.question, this.answer, this.attempts, this.modal);
  }

  showModal({
    gameStatus,
    answer,
    resetGame,
  }: {
    gameStatus: GameEndWith;
    answer: string;
    resetGame?: () => void;
  }) {
    this.modal.setInnerHTML(`<p>${gameStatus}!</p><p>The answer was: ${answer}</p>`);
    this.modal.insertChild(
      new Button({
        textContent: 'Play Again',
        listener: () => {
          if (resetGame) resetGame();
          this.modal.setInnerHTML('');
        },
      }),
    );
  }

  setQuestion(question: string) {
    this.question.setInnerHTML(question);
  }

  setAnswer(answer: string) {
    this.answer.setInnerHTML(answer);
  }

  setAttempts(attempts: number, maxAttempts: number) {
    this.attempts.setContent(`Attempts: ${attempts}/${maxAttempts}`);
  }
}

export default Quiz;
