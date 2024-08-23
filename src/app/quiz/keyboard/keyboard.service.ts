import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  public click$: Observable<string>;
  private clickSubject = new Subject<string>();

  constructor() {
    this.click$ = this.clickSubject.asObservable();
  }

  public notifyClick(key: string): void {
    this.clickSubject.next(key);
  }
}
