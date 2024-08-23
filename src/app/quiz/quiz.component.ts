import { Component, signal } from '@angular/core';
import { QuizService } from './quiz.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { KeyboardService } from './keyboard/keyboard.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [AsyncPipe, KeyboardComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  providers: [QuizService],
})
export class QuizComponent {
  public errorMessage = signal('');
  public question$: Observable<string>;
  public answer$: Observable<string>;
  public pressedKey = signal('');

  constructor(
    private quizService: QuizService,
    private keyboardService: KeyboardService,
  ) {
    this.question$ = this.quizService.question$;
    this.answer$ = this.quizService.answer$;

    this.keyboardService.click$.subscribe((key) => {
      this.pressedKey.set(key);
    });
  }
}
