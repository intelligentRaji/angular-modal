import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Quiz {
  id: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  public url = 'http://localhost:4200/data.json';
  public currentQuizId = 0;

  constructor(private http: HttpClient) {}

  public get answer$(): Observable<string> {
    return this.hideAnswer();
  }

  public get question$(): Observable<string> {
    return this.getQuizById(this.currentQuizId).pipe(map((quiz) => quiz.question));
  }

  private get quizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.url);
  }

  private getQuizById(quizId: number): Observable<Quiz> {
    return this.quizzes.pipe(map((quizDataList) => this.findQuizById(quizDataList, quizId)));
  }

  private hideAnswer(): Observable<string> {
    return this.getQuizById(this.currentQuizId).pipe(
      map((quiz) => quiz.answer.replace(/[a-z]/gi, '_')),
    );
  }

  private findQuizById(quizzes: Quiz[], quizId: number): Quiz {
    const quiz = quizzes.find((quizData) => quizData.id === quizId);
    if (quiz) {
      return quiz;
    }
    throw new Error('Quiz not found');
  }
}
