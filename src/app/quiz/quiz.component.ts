import { Component } from '@angular/core';
import { QuizDataService } from './service/quiz-data.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  providers: [QuizDataService],
})
export class QuizComponent {
  public question$: Observable<string>;

  constructor(private quizDataService: QuizDataService) {
    this.question$ = this.quizDataService.getQuizQuestion(0);
  }
}
