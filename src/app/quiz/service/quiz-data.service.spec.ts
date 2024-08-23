import { TestBed } from '@angular/core/testing';
import { QuizDataService } from './quiz-data.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

const mockQuizData = [
  {
    id: 0,
    question: 'hello',
  },
];

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

  it('should get quiz data', () => {
    service.getQuizData().subscribe((getData) => {
      expect(getData).toEqual(mockQuizData);
    });

    const req = httpTesting.expectOne({
      method: 'GET',
      url: 'http://localhost:4200/data.json',
    });

    req.flush(mockQuizData);
  });

  it('should get a quiz by id', () => {
    service.getQuizById(0).subscribe((getData) => {
      expect(getData).toEqual(mockQuizData[0]);
    });

    const req = httpTesting.expectOne({
      method: 'GET',
      url: 'http://localhost:4200/data.json',
    });

    req.flush(mockQuizData);
  });
});
