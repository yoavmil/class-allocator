import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  // Internal store
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable(); // public stream

  /** Get current value (snapshot) */
  getAll(): Student[] {
    return this.studentsSubject.getValue();
  }

  /** Replace all students */
  setAll(students: Student[]): void {
    this.studentsSubject.next(students);
  }

  /** Add a single student */
  add(student: Student): void {
    const current = this.getAll();
    this.studentsSubject.next([...current, student]);
  }

  /** Clear all students */
  clear(): void {
    this.studentsSubject.next([]);
  }
}
