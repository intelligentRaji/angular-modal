import { QuizModel } from './quiz.model';

class QuizService {
  private model = new QuizModel();
  private guesses = new Set<string>();
  private current = this.model.newQuiz;

  get answer() {
    return this.current.answer;
  }

  get question() {
    return this.current.question;
  }

  get hiddenAnswer() {
    return this.answer
      .split('')
      .map((letter) => {
        if (this.guesses.has(letter.toLowerCase())) return letter;
        if (letter === ' ') return ' ';
        return '_';
      })
      .join('');
  }

  checkLetter(letter: string): boolean {
    const normalizedLetter = letter.toLowerCase();
    this.guesses.add(normalizedLetter);
    return this.answer.toLowerCase().includes(normalizedLetter);
  }

  checkAnswer(): boolean {
    return this.hiddenAnswer === this.answer;
  }

  newCurrent() {
    this.current = this.model.newQuiz;
    this.guesses.clear();
  }
}

export default QuizService;
