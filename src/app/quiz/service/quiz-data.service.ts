import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface QuizData {
  id: number;
  question: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuizDataService {
  public url = 'http://localhost:4200/data.json';

  constructor(private http: HttpClient) {}

  public getQuizData(): Observable<QuizData[]> {
    return this.http.get<QuizData[]>(this.url);
  }

  public getQuizById(quizId: number): Observable<QuizData | undefined> {
    return this.http
      .get<QuizData[]>(this.url)
      .pipe(map((quizDataList) => quizDataList.find((quizData) => quizData.id === quizId)));
  }
}
