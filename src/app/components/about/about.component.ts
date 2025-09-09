import { Component, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit {
  private hasAnimated = false;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    // Simplificado para debug - apenas inicializa contadores
    this.initCounters();
  }

  private initCounters(): void {
    const statNumbers = this.document.querySelectorAll('.about-stat h4');
    
    if (statNumbers.length > 0) {
      setTimeout(() => {
        this.animateStatCounters(statNumbers);
      }, 1000);
    }
  }



  private animateStatCounters(statNumbers: NodeListOf<Element>): void {
    // Simplesmente garante que os números estejam visíveis
    statNumbers.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.opacity = '1';
      htmlElement.style.transform = 'scale(1)';
    });
  }

}
