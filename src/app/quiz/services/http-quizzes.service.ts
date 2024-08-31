import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

export interface Quiz {
  id: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class HttpQuizzesService {
  public url = 'http://localhost:4200/data.json';

  private numberOfQuizzes = 0;
  private currentQuizId = 0;

  constructor(private http: HttpClient) {}

  private get quizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.url).pipe(tap(console.log));
  }

  public getRandomQuiz(): Observable<Quiz> {
    return this.quizzes.pipe(
      map((quizDataList) => {
        this.numberOfQuizzes = quizDataList.length;
        this.currentQuizId = this.newQuizId();
        return this.findQuizById(quizDataList, this.currentQuizId);
      }),
    );
  }

  private newQuizId(): number {
    let newQuizId;
    do {
      newQuizId = Math.floor(Math.random() * this.numberOfQuizzes);
    } while (newQuizId === this.currentQuizId);
    return newQuizId;
  }

  private findQuizById(quizzes: Quiz[], quizId: number): Quiz {
    const quiz = quizzes.find((quizData) => quizData.id === quizId);
    if (quiz) {
      return quiz;
    }
    throw new Error('Quiz not found');
  }
}
