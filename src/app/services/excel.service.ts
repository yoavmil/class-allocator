import { Injectable } from '@angular/core';
import { StudentService } from './student.service';
import * as XLSX from 'xlsx';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private studentService: StudentService) { }

  public loadFromExcel(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const parsed: Student[] = this.parseStudentRows(rows);
      console.dir(parsed);
      this.studentService.setAll(parsed);
    };
    reader.readAsArrayBuffer(file);
  }

  private parseStudentRows(rows: any[][]): Student[] {
    const header = rows[0];

    // Find column indexes by name
    const nameColIndex = header.findIndex(
      (col) => col?.toString().trim() === 'שם'
    );
    const genderColIndex = header.findIndex(
      (col) => col?.toString().trim() === 'מין'
    );

    if (nameColIndex === -1) {
      throw new Error("העמודה 'שם' לא נמצאה בקובץ האקסל");
    }

    // Detect all numeric columns = preference weights
    const weightColumns = header
      .map((h, index) => {
        const weight = Number(h);
        return !isNaN(weight) ? { index, weight } : null;
      })
      .filter((x): x is { index: number; weight: number } => x !== null);

    return rows.slice(1).map((row) => {
      const rawName = row[nameColIndex]?.toString().trim();
      const rawGender = row[genderColIndex]?.toString().trim().toLowerCase();

      // Handle gender parsing
      let gender: 'male' | 'female' | null = null;
      if (['בת', 'נקבה', 'female'].includes(rawGender)) {
        gender = 'female';
      } else if (['בן', 'זכר', 'male'].includes(rawGender)) {
        gender = 'male';
      }

      const preferences: { [weight: number]: string } = {};
      for (const { index, weight } of weightColumns) {
        const target = row[index]?.toString().trim();
        if (target) {
          preferences[weight] = target;
        }
      }

      return {
        name: rawName,
        gender,
        preferences,
        x: 0, // TODO read those from the excel row
        y: 0, // TODO random them inside the unallocated circle
      };
    });
  }
}
