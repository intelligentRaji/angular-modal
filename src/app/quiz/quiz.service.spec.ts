import { TestBed } from '@angular/core/testing';
import { QuizService } from './quiz.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockQuizData } from '../mocks/mockQuizData';

describe('QuizDataService', () => {
  let service: QuizService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(QuizService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should get question by Id', () => {
    service.currentQuizId = 0;
    service.question$.subscribe((question) => {
      expect(question).toEqual(mockQuizData[0].question);
    });

    httpTesting.expectOne(service.url).flush(mockQuizData);
  });
});
