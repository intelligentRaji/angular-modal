import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true,
        },
      ],
    });
    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the question', async () => {
    const value = await firstValueFrom(component.question$);
    const questionElement = fixture.debugElement.query(By.css('.question'));
    const questionText = questionElement.nativeElement.textContent.trim();

    expect(questionText).toBe(value);
  });
});
