import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {}

  public get classCount(): number {
    return this._classCount;
  }
  public set classCount(value: number) {
    this._classCount = value;
  }
  private _classCount: number = 2;
}
