import quizData from '../data/quizzes.json';

interface QuizData {
  question: string;
  answer: string;
}

class QuizModel {
  private quizData = quizData;

  private numberOfQuizzes = quizData.length;
  private currentQuizId = 0;

  get newQuiz() {
    const quizId = this.currentQuizId;
    do {
      this.currentQuizId = Math.floor(Math.random() * this.numberOfQuizzes);
    } while (quizId === this.currentQuizId);

    return this.quizData[this.currentQuizId] as QuizData;
  }
}

export { QuizModel };
export type { QuizData };
