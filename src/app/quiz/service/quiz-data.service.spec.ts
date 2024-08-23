import { TestBed } from '@angular/core/testing';
import { QuizDataService } from './quiz-data.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockQuizData } from '../../mocks/mockQuizData';

describe('QuizDataService', () => {
  let service: QuizDataService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizDataService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(QuizDataService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should get question by id', () => {
    const mockId = 0;

    service.getQuizQuestion(mockId).subscribe((getData) => {
      expect(getData).toEqual(mockQuizData[mockId].question);
    });

    const req = httpTesting.expectOne({
      method: 'GET',
      url: 'http://localhost:4200/data.json',
    });

    req.flush(mockQuizData);
  });
});
