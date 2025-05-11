import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrl: './upload-excel.component.css',
  imports: [CommonModule, MatButtonModule, MatCardModule],
})
export class UploadExcelComponent {
  fileName: string | null = null;

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
      // handle file here
    }
  }
}
