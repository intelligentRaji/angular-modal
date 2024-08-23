import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface QuizData {
  id: number;
  question: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuizDataService {
  public url = 'http://localhost:4200/data.json';

  constructor(private http: HttpClient) {}

  private get quizList(): Observable<QuizData[]> {
    return this.http.get<QuizData[]>(this.url);
  }

  public getQuizQuestion(quizId: number): Observable<string> {
    return this.getQuizById(quizId).pipe(
      map((quizData) => {
        if (quizData) {
          return quizData.question;
        }
        throw new Error('Quiz not found');
      }),
    );
  }

  private getQuizById(quizId: number): Observable<QuizData | undefined> {
    return this.quizList.pipe(map((quizDataList) => this.findQuizById(quizDataList, quizId)));
  }

  private findQuizById(quizList: QuizData[], quizId: number): QuizData | undefined {
    return quizList.find((quizData) => quizData.id === quizId);
  }
}
