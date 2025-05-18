import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {}
  private _classCountSubject = new BehaviorSubject<number>(2);
  public classCount$ = this._classCountSubject.asObservable();

  public get classCount(): number {
    return this._classCountSubject.value;
  }

  public set classCount(value: number) {
    if (value !== this._classCountSubject.value) {
      this._classCountSubject.next(value);
    }
  }
}
