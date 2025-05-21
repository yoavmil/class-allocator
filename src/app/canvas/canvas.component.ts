import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { StudentService } from '../services/student.service';
import { ConfigService } from '../services/config.service';
import { AfterViewInit } from '@angular/core';
import { OnInit } from '@angular/core';
import { Student } from '../models/student';

@Component({
  selector: 'app-canvas',
  standalone: false,
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css',
})
export class CanvasComponent {
  unallocatedRadius = 200;
  // Camera/viewport controls
  zoom = 1;
  offsetX = 0;
  offsetY = 0;
  // Pan handling
  private isPanning = false;
  private lastX = 0;
  private lastY = 0;
  draggingStudent: any = null;

  private get classCount(): number {
    return this.configService.classCount;
  }

  public constructor(
    private studentService: StudentService,
    private configService: ConfigService
  ) {}

  public get hasData(): boolean {
    return this.studentService.getAll().length > 0;
  }

  ngOnInit(): void {
    this.configService.classCount$.subscribe((value) => {
      this.onResize();
    });
    this.studentService.students$.subscribe((value) => (this.students = value));
  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {}

  students: Student[] = [];

  public get unallocatedLabel(): string {
    return 'לא משוייכים';
  }

  getColor(index: number): string {
    const palette = ['#ff9999', '#99ccff', '#99ff99', '#ffcc99', '#ccccff'];
    return palette[index % palette.length];
  }

  get viewBox() {
    return `${-window.innerWidth / 2 / this.zoom - this.offsetX} ${
      -window.innerHeight / 2 / this.zoom - this.offsetY
    } ${window.innerWidth / this.zoom} ${window.innerHeight / this.zoom}`;
  }

  onMouseDown(event: MouseEvent) {
    this.isPanning = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }
  startDrag(event: MouseEvent, student: any) {
    event.stopPropagation(); // prevent pan
    this.draggingStudent = student;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  onMouseMove(event: MouseEvent) {
    if (this.draggingStudent) {
      const dx = (event.clientX - this.lastX) / this.zoom;
      const dy = (event.clientY - this.lastY) / this.zoom;
      this.draggingStudent.x += dx;
      this.draggingStudent.y += dy;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    } else if (this.isPanning) {
      const dx = (event.clientX - this.lastX) / this.zoom;
      const dy = (event.clientY - this.lastY) / this.zoom;
      this.offsetX += dx;
      this.offsetY += dy;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
  }

  onMouseUp() {
    this.isPanning = false;
    this.draggingStudent = null;
  }

  onWheel(event: WheelEvent) {
    if (this.draggingStudent) return;
    event.preventDefault();
    const delta = -event.deltaY * 0.001;
    this.zoom *= 1 + delta;
    this.zoom = Math.min(Math.max(this.zoom, 0.2), 5);
  }

  get classSectors() {
    const sectors = [];
    const anglePerClass = (2 * Math.PI) / this.classCount;
    const outerRadius = 1000; // Far enough to fill view

    for (let i = 0; i < this.classCount; i++) {
      const start = i * anglePerClass;
      const end = start + anglePerClass;
      sectors.push({
        path: this.describeSector(
          0,
          0,
          this.unallocatedRadius,
          outerRadius,
          start,
          end
        ),
        color: this.getColor(i),
      });
    }

    return sectors;
  }

  describeSector(
    cx: number,
    cy: number,
    innerR: number,
    outerR: number,
    startAngle: number,
    endAngle: number
  ): string {
    const polarToCartesian = (r: number, angle: number) => ({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });

    const p1 = polarToCartesian(outerR, startAngle);
    const p2 = polarToCartesian(outerR, endAngle);
    const p3 = polarToCartesian(innerR, endAngle);
    const p4 = polarToCartesian(innerR, startAngle);
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    return `
      M ${p1.x} ${p1.y}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}
      L ${p3.x} ${p3.y}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y}
      Z
    `.trim();
  }

  get connectionLines() {
    const lines: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      weight: number;
    }[] = [];

    for (const student of this.students) {
      if (!student.x || !student.y || !student.preferences) continue;

      for (const [weightStr, targetNameOrId] of Object.entries(
        student.preferences
      )) {
        const weight = Number(weightStr);
        const target = this.students.find(
          (s) =>
            s.name === targetNameOrId ||
            s.id?.toString() === targetNameOrId.toString()
        );
        if (target?.x != null && target?.y != null) {
          lines.push({
            x1: student.x,
            y1: student.y,
            x2: target.x,
            y2: target.y,
            weight,
          });
        }
      }
    }

    return lines;
  }
  abs(value: number): number {
    return Math.abs(value);
  }
}
