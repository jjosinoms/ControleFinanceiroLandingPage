import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;
  private statsObserver?: IntersectionObserver;
  private autoplayInterval?: number;
  private currentIndex = 0;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.initTestimonialsSection();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.statsObserver) {
      this.statsObserver.disconnect();
    }
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  private initTestimonialsSection(): void {
    this.initTestimonialsAnimations();
    this.initTestimonialsInteractions();
    this.initTestimonialsCarousel();
    this.initTestimonialsCounters();
  }

  // Testimonials Section Animations
  private initTestimonialsAnimations(): void {
    const testimonialsSection = this.document.querySelector('.testimonials-section-enhanced');
    const testimonialCards = this.document.querySelectorAll('.testimonial-card-enhanced');

    if (!testimonialsSection || testimonialCards.length === 0) return;

    // Add loading class initially
    this.renderer.addClass(testimonialsSection, 'loading');

    // Intersection Observer for scroll-triggered animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateTestimonialsEntrance();
          this.observer?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    this.observer.observe(testimonialsSection);
  }

  private animateTestimonialsEntrance(): void {
    const testimonialsSection = this.document.querySelector('.testimonials-section-enhanced');
    const testimonialCards = this.document.querySelectorAll('.testimonial-card-enhanced');
    const testimonialStats = this.document.querySelectorAll('.testimonial-stat-enhanced');

    if (!testimonialsSection) return;

    // Remove loading class and add loaded class
    this.renderer.removeClass(testimonialsSection, 'loading');
    this.renderer.addClass(testimonialsSection, 'loaded');

    // Animate stats first
    testimonialStats.forEach((stat, index) => {
      setTimeout(() => {
        this.renderer.setStyle(stat, 'opacity', '1');
        this.renderer.setStyle(stat, 'transform', 'translateY(0)');
        this.renderer.addClass(stat, 'floating');
      }, index * 200);
    });

    // Animate testimonial cards with staggered delay
    setTimeout(() => {
      testimonialCards.forEach((card, index) => {
        setTimeout(() => {
          this.renderer.setStyle(card, 'opacity', '1');
          this.renderer.setStyle(card, 'transform', 'translateY(0) scale(1)');
          
          // Add floating animation after entrance
          setTimeout(() => {
            this.renderer.addClass(card, 'floating');
          }, 1000);
        }, index * 150);
      });
    }, 600);
  }

  // Testimonials Statistics Counter Animation
  private initTestimonialsCounters(): void {
    const statNumbers = this.document.querySelectorAll('.testimonial-stat-number-enhanced');
    
    if (statNumbers.length === 0) return;

    this.statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateTestimonialCounters();
          this.statsObserver?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    const testimonialsStats = this.document.querySelector('.testimonials-stats-enhanced');
    if (testimonialsStats) {
      this.statsObserver.observe(testimonialsStats);
    }
  }

  private animateTestimonialCounters(): void {
    const statNumbers = this.document.querySelectorAll('.testimonial-stat-number-enhanced');

    // Define the statistics data based on testimonials
    const statsData = [
      { element: statNumbers[0], target: 98, suffix: '%', duration: 2000 }, // Satisfação
      { element: statNumbers[1], target: 500, suffix: '+', duration: 2500 }, // Projetos
      { element: statNumbers[2], target: 15, suffix: '+', duration: 1500 },  // Anos
      { element: statNumbers[3], target: 24, suffix: '/7', duration: 1800 }   // Suporte
    ];

    statsData.forEach((stat, index) => {
      setTimeout(() => {
        this.animateCounter(stat.element as HTMLElement, stat.target, stat.suffix, stat.duration);
      }, index * 300);
    });
  }

  private animateCounter(element: HTMLElement, target: number, suffix: string, duration: number): void {
    if (!element) return;

    let start = 0;
    const startTime = Date.now();
    
    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easedProgress = this.easeOutCubic(progress);
      const current = Math.floor(start + (target - start) * easedProgress);
      
      element.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + suffix;
        
        // Add completion effect
        this.renderer.setStyle(element, 'animation', 'pulse 0.6s ease-out');
      }
    };
    
    requestAnimationFrame(updateCounter);
  }

  // Easing function for smooth animation
  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  // Interactive enhancements
  private initTestimonialsInteractions(): void {
    const testimonialCards = this.document.querySelectorAll('.testimonial-card-enhanced');

    // Enhanced hover effects for testimonial cards
    testimonialCards.forEach((card) => {
      const cardElement = card as HTMLElement;

      this.renderer.listen(cardElement, 'mouseenter', () => {
        // Remove floating animation temporarily
        this.renderer.removeClass(cardElement, 'floating');
        
        // Enhanced hover state
        this.renderer.setStyle(cardElement, 'transform', 'translateY(-15px) scale(1.02)');
        this.renderer.setStyle(cardElement, 'z-index', '10');
        
        // Animate stars
        const cardStars = cardElement.querySelectorAll('.fas.fa-star');
        cardStars.forEach((star, starIndex) => {
          setTimeout(() => {
            this.renderer.setStyle(star, 'transform', 'scale(1.2)');
            this.renderer.setStyle(star, 'text-shadow', '0 0 20px rgba(255, 215, 0, 1)');
          }, starIndex * 100);
        });
      });

      this.renderer.listen(cardElement, 'mouseleave', () => {
        this.renderer.removeStyle(cardElement, 'transform');
        this.renderer.setStyle(cardElement, 'z-index', '1');
        
        // Restore floating animation
        setTimeout(() => {
          this.renderer.addClass(cardElement, 'floating');
        }, 400);
        
        // Reset stars
        const cardStars = cardElement.querySelectorAll('.fas.fa-star');
        cardStars.forEach(star => {
          this.renderer.removeStyle(star, 'transform');
          this.renderer.removeStyle(star, 'text-shadow');
        });
      });

      // Click animation
      this.renderer.listen(cardElement, 'click', (e: Event) => {
        // Create ripple effect
        this.createTestimonialRipple(e as MouseEvent, cardElement);
        
        // Bounce animation
        this.renderer.setStyle(cardElement, 'animation', 'none');
        setTimeout(() => {
          this.renderer.setStyle(cardElement, 'animation', 'testimonialBounce 0.8s ease-out');
        }, 10);
      });
    });
  }

  // Testimonials carousel functionality
  private initTestimonialsCarousel(): void {
    const testimonialCards = this.document.querySelectorAll('.testimonial-card-enhanced');
    
    if (testimonialCards.length === 0) return;

    this.currentIndex = 0;

    // Start autoplay
    this.startAutoplay();

    // Pause autoplay on hover
    const testimonialsSection = this.document.querySelector('.testimonials-section-enhanced');
    if (testimonialsSection) {
      this.renderer.listen(testimonialsSection, 'mouseenter', () => {
        this.clearAutoplay();
      });

      this.renderer.listen(testimonialsSection, 'mouseleave', () => {
        this.startAutoplay();
      });
    }
  }

  private goToTestimonial(index: number): void {
    const testimonialCards = this.document.querySelectorAll('.testimonial-card-enhanced');
    
    // Highlight corresponding testimonial
    testimonialCards.forEach((card, cardIndex) => {
      const cardElement = card as HTMLElement;
      if (cardIndex === index) {
        this.renderer.setStyle(cardElement, 'transform', 'translateY(-15px) scale(1.05)');
        this.renderer.setStyle(cardElement, 'border-color', 'rgba(255, 99, 71, 0.5)');
        this.renderer.setStyle(cardElement, 'box-shadow', '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 99, 71, 0.4)');
      } else {
        this.renderer.removeStyle(cardElement, 'transform');
        this.renderer.removeStyle(cardElement, 'border-color');
        this.renderer.removeStyle(cardElement, 'box-shadow');
      }
    });
    
    this.currentIndex = index;
    
    // Reset autoplay
    this.resetAutoplay();
  }

  private startAutoplay(): void {
    const testimonialCards = this.document.querySelectorAll('.testimonial-card-enhanced');
    this.autoplayInterval = window.setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % testimonialCards.length;
      this.goToTestimonial(this.currentIndex);
    }, 5000);
  }

  private clearAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  private resetAutoplay(): void {
    this.clearAutoplay();
    this.startAutoplay();
  }

  // Create testimonial ripple effect
  private createTestimonialRipple(event: MouseEvent, element: HTMLElement): void {
    const ripple = this.renderer.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const rippleStyles = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255, 99, 71, 0.3), rgba(255, 165, 0, 0.1), transparent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
      animation: testimonialRipple 1s ease-out forwards;
    `;
    
    this.renderer.setAttribute(ripple, 'style', rippleStyles);
    this.renderer.setStyle(element, 'position', 'relative');
    this.renderer.appendChild(element, ripple);
    
    setTimeout(() => {
      this.renderer.removeChild(element, ripple);
    }, 1000);
  }

  // Performance utility
  private throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: number;
    let lastExecTime = 0;
    
    return (...args: Parameters<T>) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }
}
