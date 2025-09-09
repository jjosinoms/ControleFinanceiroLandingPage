import { Component, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-slogan',
  imports: [],
  templateUrl: './slogan.component.html',
  styleUrls: ['./slogan.component.css']
})
export class SloganComponent implements AfterViewInit {
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    this.initSloganSection();
    this.addAdditionalStyles();
  }

  private initSloganSection(): void {
    this.initSloganAnimations();
    this.initSloganInteractions();
  }

  private initSloganAnimations(): void {
    const sloganCard = this.document.querySelector('.slogan-card') as HTMLElement;
    const sloganIcon = this.document.querySelector('.slogan-icon') as HTMLElement;
    const sloganTitle = this.document.querySelector('.slogan-title') as HTMLElement;
    const sloganAccent = this.document.querySelector('.slogan-accent') as HTMLElement;
    const sloganSubtitle = this.document.querySelector('.slogan-subtitle') as HTMLElement;

    if (!sloganCard) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSloganElements(sloganCard, sloganIcon, sloganTitle, sloganAccent, sloganSubtitle);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(sloganCard);
  }

  private animateSloganElements(sloganCard: HTMLElement, sloganIcon: HTMLElement, sloganTitle: HTMLElement, sloganAccent: HTMLElement, sloganSubtitle: HTMLElement): void {
    sloganCard.style.opacity = '0';
    sloganCard.style.transform = 'translateY(50px) scale(0.95)';
    sloganCard.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    setTimeout(() => {
      sloganCard.style.opacity = '1';
      sloganCard.style.transform = 'translateY(0) scale(1)';
    }, 100);

    const elements = [sloganIcon, sloganTitle, sloganAccent, sloganSubtitle];
    
    elements.forEach((element, index) => {
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';

        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, 200 + (index * 150));
      }
    });

    if (sloganAccent) {
      setTimeout(() => {
        sloganAccent.style.width = '0';
        sloganAccent.style.transition = 'width 1s ease-out';
        setTimeout(() => {
          sloganAccent.style.width = '80px';
        }, 100);
      }, 600);
    }
  }

  private initSloganInteractions(): void {
    const sloganCard = this.document.querySelector('.slogan-card') as HTMLElement;
    const sloganIcon = this.document.querySelector('.slogan-icon') as HTMLElement;

    if (!sloganCard) return;

    sloganCard.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = sloganCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      const intensity = 8;
      sloganCard.style.transform = `translateY(-8px) rotateX(${deltaY * intensity}deg) rotateY(${deltaX * intensity}deg)`;
    });

    sloganCard.addEventListener('mouseleave', () => {
      sloganCard.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });

    if (sloganIcon) {
      sloganIcon.addEventListener('mouseenter', () => {
        sloganIcon.style.transform = 'scale(1.1) rotate(5deg)';
        sloganIcon.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      });

      sloganIcon.addEventListener('mouseleave', () => {
        sloganIcon.style.transform = 'scale(1) rotate(0deg)';
      });

      sloganIcon.addEventListener('click', () => {
        sloganIcon.style.animation = 'none';
        setTimeout(() => {
          sloganIcon.style.animation = 'iconBounce 0.6s ease-out';
        }, 10);
      });
    }

    window.addEventListener('scroll', this.throttle(() => {
      const sloganSection = this.document.querySelector('.slogan-section-enhanced') as HTMLElement;
      
      if (sloganSection) {
        const rect = sloganSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const translateY = (scrollProgress - 0.5) * 30;
          
          if (sloganCard) {
            sloganCard.style.transform = `translateY(${translateY}px)`;
          }
        }
      }
    }, 16));

    const sloganTitle = this.document.querySelector('.slogan-title') as HTMLElement;
    if (sloganTitle) {
      const text = sloganTitle.textContent || '';
      const words = text.split(' ');
      
      sloganTitle.addEventListener('mouseenter', () => {
        sloganTitle.innerHTML = words.map((word, index) => 
          `<span class="word-${index}" style="animation-delay: ${index * 0.1}s">${word}</span>`
        ).join(' ');
        
        const style = this.document.createElement('style');
        style.textContent = `
          .slogan-title span {
            display: inline-block;
            animation: wordPulse 0.6s ease-out forwards;
          }
          
          @keyframes wordPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); color: #ff6347; }
            100% { transform: scale(1); }
          }
        `;
        this.document.head.appendChild(style);
      });
    }
  }

  private throttle(func: Function, delay: number): (...args: any[]) => void {
    let timeoutId: any;
    let lastExecTime = 0;
    
    return (...args: any[]) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  private addAdditionalStyles(): void {
    const additionalStyles = this.document.createElement('style');
    additionalStyles.textContent = `
      @keyframes iconBounce {
        0%, 20%, 53%, 80%, 100% {
          transform: scale(1) rotate(0deg);
        }
        40%, 43% {
          transform: scale(1.2) rotate(-5deg);
        }
        70% {
          transform: scale(1.1) rotate(3deg);
        }
        90% {
          transform: scale(1.05) rotate(-1deg);
        }
      }

      .slogan-card {
        transform-style: preserve-3d;
        perspective: 1000px;
      }

      .slogan-background-pattern {
        animation: backgroundFloat 20s ease-in-out infinite;
      }

      @keyframes backgroundFloat {
        0%, 100% { 
          background-position: 0% 0%, 100% 100%; 
        }
        50% { 
          background-position: 100% 100%, 0% 0%; 
        }
      }

      .slogan-card::before {
        background: linear-gradient(90deg, 
          transparent, 
          rgba(255, 99, 71, 0.3), 
          rgba(255, 165, 0, 0.3), 
          transparent
        );
      }
    `;
    this.document.head.appendChild(additionalStyles);
  }
}
