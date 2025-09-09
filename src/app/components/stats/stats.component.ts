import { Component, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements AfterViewInit {
  private hasAnimated = false;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    this.initStatsSection();
    this.addStatsStyles();
  }

  private initStatsSection(): void {
    this.initStatsAnimations();
    this.initStatsCounters();
  }

  private initStatsCounters(): void {
    const statItems = this.document.querySelectorAll('.stat-item h3');
    const statsSection = this.document.querySelector('.stats-section') as HTMLElement;

    if (!statsSection || statItems.length === 0) return;

    // Clear any existing classes
    statsSection.classList.remove('stats-loaded', 'stats-loading');
    statsSection.classList.add('stats-loading');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          // Small delay to ensure smooth animation
          setTimeout(() => {
            this.animateStats(statsSection, statItems);
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(statsSection);
  }

  private animateStats(statsSection: HTMLElement, statItems: NodeListOf<Element>): void {
    statsSection.classList.remove('stats-loading');
    statsSection.classList.add('stats-loaded');

    const statsData = [
      { element: statItems[0], target: 15, suffix: '+', duration: 2000 },
      { element: statItems[1], target: 500, suffix: '+', duration: 2500 },
      { element: statItems[2], target: 100, suffix: '%', duration: 2000 },
      { element: statItems[3], target: 24, suffix: 'h', duration: 1500 }
    ];

    statsData.forEach((stat, index) => {
      setTimeout(() => {
        this.animateCounter(stat.element as HTMLElement, stat.target, stat.suffix, stat.duration);
      }, index * 200);
    });
  }

  private animateCounter(element: HTMLElement, target: number, suffix: string, duration: number): void {
    if (!element) return;

    let start = 0;
    const startTime = Date.now();
    
    // Store original text for reset
    element.setAttribute('data-target', target.toString());
    element.setAttribute('data-suffix', suffix);
    element.classList.add('stat-number-animated');
    
    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = this.easeOutCubic(progress);
      const current = Math.floor(start + (target - start) * easedProgress);
      
      element.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + suffix;
        // Final pulse animation
        element.style.animation = 'pulse 0.6s ease-out';
      }
    };
    
    requestAnimationFrame(updateCounter);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  private initStatsAnimations(): void {
    const statItems = this.document.querySelectorAll('.stat-item');
    
    if (statItems.length === 0) return;

    statItems.forEach((item, index) => {
      let isHovered = false;
      
      item.addEventListener('mouseenter', () => {
        isHovered = true;
        // Remove conflicting transforms
        (item as HTMLElement).style.transform = 'translateY(-10px)';
        
        // Add ripple effect
        const existingRipple = item.querySelector('.stat-ripple');
        if (!existingRipple) {
          const ripple = this.document.createElement('div');
          ripple.className = 'stat-ripple';
          item.appendChild(ripple);
          
          setTimeout(() => {
            if (ripple.parentElement) {
              ripple.remove();
            }
          }, 600);
        }
      });

      item.addEventListener('mouseleave', () => {
        isHovered = false;
        (item as HTMLElement).style.transform = '';
      });

      item.addEventListener('click', () => {
        if (!isHovered) return;
        
        (item as HTMLElement).style.animation = 'none';
        requestAnimationFrame(() => {
          (item as HTMLElement).style.animation = 'statBounce 0.6s ease-out';
        });
      });
    });
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

  private addStatsStyles(): void {
    const statsStyles = this.document.createElement('style');
    statsStyles.textContent = `
      .stat-ripple {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 99, 71, 0.3), transparent);
        transform: translate(-50%, -50%);
        animation: statRipple 0.6s ease-out forwards;
        pointer-events: none;
      }

      @keyframes statRipple {
        to {
          width: 150px;
          height: 150px;
          opacity: 0;
        }
      }

      @keyframes statBounce {
        0%, 20%, 53%, 80%, 100% {
          transform: translateY(0) scale(1);
        }
        40%, 43% {
          transform: translateY(-10px) scale(1.05);
        }
        70% {
          transform: translateY(-5px) scale(1.02);
        }
        90% {
          transform: translateY(-2px) scale(1.01);
        }
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }

      .stat-item {
        position: relative;
        overflow: hidden;
      }

      .stat-item::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent, rgba(255, 99, 71, 0.1), transparent);
        transform: rotate(45deg);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .stat-item:hover::after {
        opacity: 1;
        animation: shine 1.5s ease-in-out infinite;
      }

      @keyframes shine {
        0% {
          transform: rotate(45deg) translateX(-200%);
        }
        50% {
          transform: rotate(45deg) translateX(0%);
        }
        100% {
          transform: rotate(45deg) translateX(200%);
        }
      }
    `;
    this.document.head.appendChild(statsStyles);
  }

  resetStats(): void {
    const statsSection = this.document.querySelector('.stats-section') as HTMLElement;
    const statItems = this.document.querySelectorAll('.stat-item h3');
    
    if (statsSection) {
      statsSection.classList.remove('stats-loaded');
      statsSection.classList.add('stats-loading');
    }
    
    statItems.forEach(item => {
      if (item) {
        const element = item as HTMLElement;
        element.classList.remove('stat-number-animated');
        element.style.animation = 'none';
        
        const suffix = element.getAttribute('data-suffix') || '';
        element.textContent = '0' + suffix;
      }
    });
    
    this.hasAnimated = false;
  }
}
