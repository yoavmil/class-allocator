import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { StudentService } from '../services/student.service';
import { ConfigService } from '../services/config.service';
import { AfterViewInit } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  standalone: false,
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css',
})
export class CanvasComponent {
  @ViewChild('studentCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

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
  }
  ngAfterViewInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeCanvasToFit();
    this.drawCanvas();
  }

  private resizeCanvasToFit(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }

  private drawCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // === Draw class zones ===
    const anglePerClass = (2 * Math.PI) / this.classCount;
    const outerRadius = Math.max(centerX, centerY) * 2;
    const unallocatedRadius = 200;

    for (let i = 0; i < this.classCount; i++) {
      const startAngle = i * anglePerClass;
      const endAngle = startAngle + anglePerClass;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = this.getColor(i);
      ctx.fill();
    }

    // === Draw central unallocated circle ===

    ctx.beginPath();
    ctx.arc(centerX, centerY, unallocatedRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.unallocatedLabel, centerX, centerY + 5);
  }

  private get unallocatedLabel(): string {
    return 'לא משוייכים';
  }

  private getColor(index: number): string {
    const colors = [
      '#FFCDD2',
      '#C8E6C9',
      '#BBDEFB',
      '#FFF9C4',
      '#D1C4E9',
      '#B2EBF2',
    ];
    return colors[index % colors.length];
  }
}
