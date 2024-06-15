import { BaseComponent } from '@components/baseComponent';

export class QuizComponent extends BaseComponent {
  private question = new BaseComponent({ tagName: 'p', classNames: ['question'] });
  private answer = new BaseComponent({ tagName: 'p', classNames: ['answer'] });
  private attempts = new BaseComponent({ tagName: 'p', classNames: ['attempts'] });

  constructor() {
    super({ classNames: ['quiz'] });

    this.insertChildren(this.question, this.answer, this.attempts);
  }
  setQuestion(question: string) {
    this.question.setInnerHTML(question);
  }

  setAnswer(answer: string) {
    this.answer.setInnerHTML(answer);
  }

  setAttempts(currentAttempt: number, maxAttempts: number) {
    this.attempts.setContent(`Attempts: ${currentAttempt}/${maxAttempts}`);
  }
}
