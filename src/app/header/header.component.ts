import { Component } from '@angular/core';
import { ExcelService } from '../services/excel.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public constructor(
    private excelService: ExcelService,
    private studentService: StudentService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.excelService.loadFromExcel(file);
    }
  }

  public get hasData(): boolean {
    return this.studentService.getAll().length > 0;
  }
}
