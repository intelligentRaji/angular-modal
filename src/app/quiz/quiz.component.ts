import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { QuizManagerService } from './services/quiz-manager.service';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [AsyncPipe, KeyboardComponent, ModalComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  providers: [QuizManagerService],
})
export class QuizComponent {
  public question$ = this.quizManagerService.question$;
  public answer$ = this.quizManagerService.hiddenAnswer$;

  public showModal$ = this.quizManagerService.isAllLettersGuessed$;

  constructor(public quizManagerService: QuizManagerService) {}

  public pressKey(key: string): void {
    this.quizManagerService.addIfGuessed(key);
  }
}
