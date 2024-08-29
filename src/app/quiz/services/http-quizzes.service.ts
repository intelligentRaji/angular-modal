import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, share } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  private get quizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.url).pipe(share());
  }

  public getQuizById(quizId: number): Observable<Quiz> {
    return this.quizzes.pipe(map((quizDataList) => this.findQuizById(quizDataList, quizId)));
  }

  private findQuizById(quizzes: Quiz[], quizId: number): Quiz {
    const quiz = quizzes.find((quizData) => quizData.id === quizId);
    if (quiz) {
      return quiz;
    }
    throw new Error('Quiz not found');
  }
}
