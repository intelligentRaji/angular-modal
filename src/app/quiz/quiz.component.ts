import { Component, OnInit } from '@angular/core';
import { QuizDataService } from './service/quiz-data.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  providers: [QuizDataService],
})
export class QuizComponent implements OnInit {
  public question = 'Capital of France?';

  constructor(private quizDataService: QuizDataService) {}

  public ngOnInit(): void {
    this.quizDataService.getQuizById(0).subscribe((quizData) => {
      if (quizData) {
        this.question = quizData.question;
      }
    });
  }
}
