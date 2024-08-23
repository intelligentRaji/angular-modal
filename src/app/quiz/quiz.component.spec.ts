import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { QuizDataService } from './service/quiz-data.service';
import { provideHttpClient } from '@angular/common/http';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        QuizDataService,
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true,
        },
      ],
    });
    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('renders question element with correct text', () => {
    const questionElement = fixture.nativeElement.querySelector('.question');
    const questionText = questionElement.textContent;
    expect(questionText).toContain(component.question);
  });
});
