import { Component, OnInit, OnDestroy, Inject, Renderer2, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface ThrottleFunction {
  (...args: any[]): void;
}

interface AnimationKeyframe {
  transform?: string;
  opacity?: string | number;
  offset?: number;
}

interface AnimationOptions {
  duration: number;
  easing: string;
}

@Component({
  selector: 'app-activities',
  imports: [],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;
  private scrollHandler!: ThrottleFunction;
  private intervalIds: number[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.initActivitiesSection();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    this.intervalIds.forEach(id => clearInterval(id));
  }

  private initActivitiesSection(): void {
    this.initActivitiesAnimations();
    this.initActivitiesInteractions();
    this.initActivitiesEffects();
  }

  // Activities Section Animations
  private initActivitiesAnimations(): void {
    const activitiesSection = this.document.querySelector('.activities-section') as HTMLElement;
    const activityCards = this.document.querySelectorAll('.activity-card') as NodeListOf<HTMLElement>;
    const activitiesCta = this.document.querySelector('.activities-cta') as HTMLElement;

    if (!activitiesSection || activityCards.length === 0) return;

    // Add loading class initially
    this.renderer.addClass(activitiesSection, 'loading');

    // Intersection Observer for scroll-triggered animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateActivitiesEntrance(activityCards, activitiesCta, activitiesSection);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    this.observer.observe(activitiesSection);
  }

  private animateActivitiesEntrance(
    activityCards: NodeListOf<HTMLElement>, 
    activitiesCta: HTMLElement | null, 
    activitiesSection: HTMLElement
  ): void {
    // Remove loading class and add loaded class
    this.renderer.removeClass(activitiesSection, 'loading');
    this.renderer.addClass(activitiesSection, 'loaded');

    // Animate each activity card with staggered delay
    activityCards.forEach((card, index) => {
      setTimeout(() => {
        this.renderer.setStyle(card, 'opacity', '1');
        this.renderer.setStyle(card, 'transform', 'translateY(0) scale(1)');
        
        // Add floating animation after entrance
        setTimeout(() => {
          this.renderer.addClass(card, 'floating');
        }, 1000);
        
        // Add pulse animation to icon
        const icon = card.querySelector('.activity-icon') as HTMLElement;
        if (icon) {
          setTimeout(() => {
            this.renderer.addClass(icon, 'pulse');
          }, 1500 + index * 200);
        }
      }, index * 150);
    });

    // Animate CTA section
    if (activitiesCta) {
      setTimeout(() => {
        this.renderer.setStyle(activitiesCta, 'opacity', '1');
        this.renderer.setStyle(activitiesCta, 'transform', 'translateY(0)');
      }, 800);
    }
  }

  // Interactive enhancements for activity cards
  private initActivitiesInteractions(): void {
    const activityCards = this.document.querySelectorAll('.activity-card') as NodeListOf<HTMLElement>;
    const mainCtaButton = this.document.querySelector('.activities-cta .btn-primary') as HTMLElement;

    // Enhanced hover effects for activity cards
    activityCards.forEach((card, index) => {
      const icon = card.querySelector('.activity-icon') as HTMLElement;
      const features = card.querySelectorAll('.features-list li') as NodeListOf<HTMLElement>;
      const cta = card.querySelector('.activity-cta') as HTMLElement;

      card.addEventListener('mouseenter', () => {
        this.handleCardMouseEnter(card, icon, features);
      });

      card.addEventListener('mouseleave', () => {
        this.handleCardMouseLeave(card, icon, features);
      });

      // Click animation with advanced effects
      card.addEventListener('click', (e: MouseEvent) => {
        this.handleCardClick(e, card);
      });

      // CTA button interactions
      if (cta) {
        cta.addEventListener('click', (e: MouseEvent) => {
          this.handleCtaClick(e, cta, card);
        });
      }

      // Magnetic effect on mouse move - DISABLED for cleaner interaction
      // card.addEventListener('mousemove', (e: MouseEvent) => {
      //   this.handleCardMouseMove(e, card);
      // });

      // card.addEventListener('mouseleave', () => {
      //   this.resetCardTransform(card);
      // });
    });

    // Main CTA button enhancements
    if (mainCtaButton) {
      mainCtaButton.addEventListener('click', (e: MouseEvent) => {
        this.handleMainCtaClick(e, mainCtaButton);
      });

      // Enhanced hover with particle effects - DISABLED for cleaner design
      // mainCtaButton.addEventListener('mouseenter', () => {
      //   this.createCtaParticles(mainCtaButton);
      // });
    }
  }

  private handleCardMouseEnter(card: HTMLElement, icon: HTMLElement | null, features: NodeListOf<HTMLElement>): void {
    // Remove floating animation temporarily
    this.renderer.removeClass(card, 'floating');
    
    // Add enhanced hover state
    this.renderer.setStyle(card, 'transform', 'translateY(-25px) scale(1.04)');
    this.renderer.setStyle(card, 'z-index', '10');
    
    // Create particle system around the card - DISABLED for cleaner design
    // this.createActivityParticles(card);
    
    // Enhance icon effects
    if (icon) {
      this.renderer.setStyle(icon, 'transform', 'scale(1.15) rotate(10deg)');
      this.renderer.setStyle(icon, 'filter', 'drop-shadow(0 0 25px rgba(255, 99, 71, 0.7))');
    }

    // Animate features list
    features.forEach((feature, featureIndex) => {
      setTimeout(() => {
        this.renderer.setStyle(feature, 'transform', 'translateX(10px)');
        // Removed color manipulation - let CSS handle it
      }, featureIndex * 50);
    });
  }

  private handleCardMouseLeave(card: HTMLElement, icon: HTMLElement | null, features: NodeListOf<HTMLElement>): void {
    this.renderer.setStyle(card, 'transform', '');
    this.renderer.setStyle(card, 'z-index', '1');
    
    // Restore floating animation
    setTimeout(() => {
      this.renderer.addClass(card, 'floating');
    }, 400);
    
    // Reset icon
    if (icon) {
      this.renderer.setStyle(icon, 'transform', '');
      this.renderer.setStyle(icon, 'filter', '');
    }

    // Reset features
    features.forEach(feature => {
      this.renderer.setStyle(feature, 'transform', '');
      // Removed color reset - let CSS handle it
    });
  }

  private handleCardClick(e: MouseEvent, card: HTMLElement): void {
    // Create ripple effect
    this.createAdvancedRipple(e, card);
    
    // Bounce animation
    this.renderer.setStyle(card, 'animation', 'none');
    setTimeout(() => {
      this.renderer.setStyle(card, 'animation', 'activityBounce 0.8s ease-out');
    }, 10);

    // Show activity details
    this.showActivityDetails(card);
  }

  private handleCtaClick(e: MouseEvent, cta: HTMLElement, card: HTMLElement): void {
    e.preventDefault();
    e.stopPropagation();
    
    // Enhanced click feedback
    this.renderer.setStyle(cta, 'transform', 'scale(0.95)');
    setTimeout(() => {
      this.renderer.setStyle(cta, 'transform', '');
    }, 150);
    
    // Contact action
    this.contactForActivity(card);
  }

  // DISABLED: Magnetic mouse following effect methods
  // These methods were creating the 3D rotation effect that follows mouse movement
  
  // private handleCardMouseMove(e: MouseEvent, card: HTMLElement): void {
  //   // 3D rotation effect based on mouse position - DISABLED for cleaner UX
  // }

  // private resetCardTransform(card: HTMLElement): void {
  //   // Reset 3D transforms - DISABLED
  // }

  private handleMainCtaClick(e: MouseEvent, mainCtaButton: HTMLElement): void {
    e.preventDefault();
    
    // Add loading state with spinner
    const originalText = mainCtaButton.innerHTML;
    this.renderer.setProperty(mainCtaButton, 'innerHTML', '<i class="fas fa-spinner fa-spin"></i> Conectando...');
    
    // Create contact action
    setTimeout(() => {
      const message = encodeURIComponent('Olá! Gostaria de conhecer todas as atividades da JRM Ferreira!');
      const whatsappURL = `https://wa.me/5511999999999?text=${message}`;
      window.open(whatsappURL, '_blank');
      
      // Restore button
      this.renderer.setProperty(mainCtaButton, 'innerHTML', originalText);
    }, 1500);
  }

  // Special effects and animations - SIMPLIFIED for cleaner design
  private initActivitiesEffects(): void {
    // Dynamic background effects - DISABLED
    // this.createActivitiesBackground();
    
    // Parallax scrolling for activities - DISABLED
    // this.initActivitiesParallax();
    
    // Icon rotation and glow effects - DISABLED
    // this.initIconEffects();
    
    // Advanced hover trails - DISABLED
    this.initHoverTrails();
  }

  // Create advanced ripple effect
  private createAdvancedRipple(event: MouseEvent, element: HTMLElement): void {
    const ripple = this.renderer.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    this.renderer.setStyle(ripple, 'position', 'absolute');
    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    this.renderer.setStyle(ripple, 'left', `${x}px`);
    this.renderer.setStyle(ripple, 'top', `${y}px`);
    this.renderer.setStyle(ripple, 'background', 'radial-gradient(circle, rgba(255, 99, 71, 0.4), rgba(255, 165, 0, 0.2), transparent)');
    this.renderer.setStyle(ripple, 'border-radius', '50%');
    this.renderer.setStyle(ripple, 'pointer-events', 'none');
    this.renderer.setStyle(ripple, 'z-index', '100');
    this.renderer.setStyle(ripple, 'animation', 'activityRipple 0.8s ease-out forwards');
    
    this.renderer.setStyle(element, 'position', 'relative');
    this.renderer.appendChild(element, ripple);
    
    setTimeout(() => {
      this.renderer.removeChild(element, ripple);
    }, 800);
  }

  // Create particle system for activity cards
  private createActivityParticles(element: HTMLElement): void {
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = this.renderer.createElement('div');
      this.renderer.addClass(particle, 'activity-particle');
      
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 60 + Math.random() * 40;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const size = 3 + Math.random() * 4;
      
      this.renderer.setStyle(particle, 'position', 'absolute');
      this.renderer.setStyle(particle, 'width', `${size}px`);
      this.renderer.setStyle(particle, 'height', `${size}px`);
      this.renderer.setStyle(particle, 'background', 'linear-gradient(45deg, var(--accent-color), var(--secondary-color))');
      this.renderer.setStyle(particle, 'border-radius', '50%');
      this.renderer.setStyle(particle, 'pointer-events', 'none');
      this.renderer.setStyle(particle, 'z-index', '200');
      this.renderer.setStyle(particle, 'left', '50%');
      this.renderer.setStyle(particle, 'top', '50%');
      this.renderer.setStyle(particle, 'transform', 'translate(-50%, -50%)');
      this.renderer.setStyle(particle, 'opacity', '0');
      this.renderer.setStyle(particle, 'box-shadow', '0 0 10px rgba(255, 99, 71, 0.5)');
      
      this.renderer.appendChild(element, particle);
      
      // Animate particle with complex path
      const keyframes: AnimationKeyframe[] = [
        {
          transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
          opacity: 0
        },
        {
          transform: `translate(calc(-50% + ${x * 0.5}px), calc(-50% + ${y * 0.5}px)) scale(1) rotate(180deg)`,
          opacity: 1,
          offset: 0.3
        },
        {
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.2) rotate(360deg)`,
          opacity: 0.8,
          offset: 0.7
        },
        {
          transform: `translate(calc(-50% + ${x * 1.5}px), calc(-50% + ${y * 1.5}px)) scale(0) rotate(540deg)`,
          opacity: 0
        }
      ];

      const options: AnimationOptions = {
        duration: 1500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      };

      const animation = particle.animate(keyframes, options);
      animation.onfinish = () => {
        this.renderer.removeChild(element, particle);
      };
    }
  }

  // Create CTA button particles
  private createCtaParticles(element: HTMLElement): void {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = this.renderer.createElement('div');
      
      const size = 2 + Math.random() * 3;
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 100;
      
      this.renderer.setStyle(particle, 'position', 'absolute');
      this.renderer.setStyle(particle, 'width', `${size}px`);
      this.renderer.setStyle(particle, 'height', `${size}px`);
      this.renderer.setStyle(particle, 'background', 'rgba(255, 99, 71, 0.8)');
      this.renderer.setStyle(particle, 'border-radius', '50%');
      this.renderer.setStyle(particle, 'pointer-events', 'none');
      this.renderer.setStyle(particle, 'z-index', '100');
      this.renderer.setStyle(particle, 'left', '50%');
      this.renderer.setStyle(particle, 'top', '50%');
      this.renderer.setStyle(particle, 'transform', 'translate(-50%, -50%)');
      this.renderer.setStyle(particle, 'opacity', '0');
      
      this.renderer.appendChild(element, particle);
      
      const ctaKeyframes: AnimationKeyframe[] = [
        {
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0
        },
        {
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`,
          opacity: 1,
          offset: 0.5
        },
        {
          transform: `translate(calc(-50% + ${x * 2}px), calc(-50% + ${y * 2}px)) scale(0)`,
          opacity: 0
        }
      ];

      const ctaOptions: AnimationOptions = {
        duration: 2000,
        easing: 'ease-out'
      };

      const ctaAnimation = particle.animate(ctaKeyframes, ctaOptions);
      ctaAnimation.onfinish = () => {
        this.renderer.removeChild(element, particle);
      };
    }
  }

  // Show activity details
  private showActivityDetails(card: HTMLElement): void {
    const activityNameElement = card.querySelector('h3');
    const activityDescriptionElement = card.querySelector('.activity-description p');
    
    if (!activityNameElement || !activityDescriptionElement) return;
    
    const activityName = activityNameElement.textContent || '';
    const activityDescription = activityDescriptionElement.textContent || '';
    
    // Create enhanced visual feedback
    this.renderer.setStyle(card, 'border-color', 'var(--accent-color)');
    this.renderer.setStyle(card, 'box-shadow', '0 0 50px rgba(255, 99, 71, 0.5)');
    
    console.log(`Activity: ${activityName}`);
    console.log(`Description: ${activityDescription}`);
    
    // Reset after animation
    setTimeout(() => {
      this.renderer.setStyle(card, 'border-color', '');
      this.renderer.setStyle(card, 'box-shadow', '');
    }, 3000);
  }

  // Contact for specific activity
  private contactForActivity(card: HTMLElement): void {
    const activityNameElement = card.querySelector('h3');
    const ctaElement = card.querySelector('.activity-cta') as HTMLElement;
    
    if (!activityNameElement || !ctaElement) return;
    
    const activityName = activityNameElement.textContent || '';
    
    // Add loading state
    const originalText = ctaElement.innerHTML;
    this.renderer.setProperty(ctaElement, 'innerHTML', '<i class="fas fa-spinner fa-spin"></i> Conectando...');
    
    setTimeout(() => {
      const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre: ${activityName}`);
      const whatsappURL = `https://wa.me/5511999999999?text=${message}`;
      window.open(whatsappURL, '_blank');
      
      // Restore button
      this.renderer.setProperty(ctaElement, 'innerHTML', originalText);
    }, 1000);
  }

  // Background effects for activities section
  private createActivitiesBackground(): void {
    const activitiesSection = this.document.querySelector('.activities-section') as HTMLElement;
    if (!activitiesSection) return;
    
    // Create animated background particles
    const backgroundContainer = this.renderer.createElement('div');
    this.renderer.addClass(backgroundContainer, 'activities-background');
    
    this.renderer.setStyle(backgroundContainer, 'position', 'absolute');
    this.renderer.setStyle(backgroundContainer, 'top', '0');
    this.renderer.setStyle(backgroundContainer, 'left', '0');
    this.renderer.setStyle(backgroundContainer, 'width', '100%');
    this.renderer.setStyle(backgroundContainer, 'height', '100%');
    this.renderer.setStyle(backgroundContainer, 'overflow', 'hidden');
    this.renderer.setStyle(backgroundContainer, 'pointer-events', 'none');
    this.renderer.setStyle(backgroundContainer, 'z-index', '1');
    
    this.renderer.appendChild(activitiesSection, backgroundContainer);
    
    // Create floating elements
    for (let i = 0; i < 25; i++) {
      const element = this.renderer.createElement('div');
      
      this.renderer.setStyle(element, 'position', 'absolute');
      this.renderer.setStyle(element, 'width', `${4 + Math.random() * 8}px`);
      this.renderer.setStyle(element, 'height', `${4 + Math.random() * 8}px`);
      this.renderer.setStyle(element, 'background', `rgba(255, 99, 71, ${0.1 + Math.random() * 0.2})`);
      this.renderer.setStyle(element, 'border-radius', '50%');
      this.renderer.setStyle(element, 'left', `${Math.random() * 100}%`);
      this.renderer.setStyle(element, 'top', `${Math.random() * 100}%`);
      this.renderer.setStyle(element, 'animation', `activitiesFloat ${20 + Math.random() * 30}s linear infinite`);
      
      this.renderer.appendChild(backgroundContainer, element);
    }
  }

  // Parallax effects for activities
  private initActivitiesParallax(): void {
    const activitiesSection = this.document.querySelector('.activities-section') as HTMLElement;
    const activityCards = this.document.querySelectorAll('.activity-card') as NodeListOf<HTMLElement>;
    
    if (!activitiesSection || !activityCards || activityCards.length === 0) return;

    this.scrollHandler = this.throttle(() => {
      if (!activitiesSection) return;
      
      const rect = activitiesSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible && activityCards) {
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        
        activityCards.forEach((card, index) => {
          if (card) {
            const offset = (scrollProgress - 0.5) * (8 + index * 2);
            const currentTransform = card.style.transform || '';
            this.renderer.setStyle(card, 'transform', `${currentTransform} translateZ(${offset}px)`);
          }
        });
      }
    }, 16);

    window.addEventListener('scroll', this.scrollHandler);
  }

  // Icon effects and animations
  private initIconEffects(): void {
    const activityIcons = this.document.querySelectorAll('.activity-icon') as NodeListOf<HTMLElement>;
    
    if (!activityIcons || activityIcons.length === 0) return;
    
    // Scroll-based rotation
    const iconScrollHandler = this.throttle(() => {
      if (!activityIcons) return;
      
      activityIcons.forEach((icon) => {
        if (!icon) return;
        
        const rect = icon.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
          const rotation = scrollProgress * 180 * 0.3;
          
          const currentTransform = icon.style.transform || '';
          this.renderer.setStyle(icon, 'transform', `${currentTransform} rotate(${rotation}deg)`);
        }
      });
    }, 16);

    window.addEventListener('scroll', iconScrollHandler);

    // Floating glow animation
    activityIcons.forEach((icon) => {
      if (!icon) return;
      
      let glowOffset = Math.random() * Math.PI * 2;
      
      const intervalId = window.setInterval(() => {
        if (!icon) return;
        
        glowOffset += 0.03;
        const glowIntensity = (Math.sin(glowOffset) + 1) * 0.5;
        const glowSize = 15 + glowIntensity * 15;
        
        this.renderer.setStyle(icon, 'box-shadow', 
          `0 ${glowSize}px ${glowSize * 2}px rgba(255, 99, 71, ${0.3 + glowIntensity * 0.3})`
        );
      }, 100);
      
      this.intervalIds.push(intervalId);
    });
  }

  // Hover trails effect - DISABLED for cleaner design
  private initHoverTrails(): void {
    // Mouse trail effect disabled for cleaner, more professional interaction
    // const activityCards = this.document.querySelectorAll('.activity-card') as NodeListOf<HTMLElement>;
    // ... hover trails code disabled
  }

  // Performance utility function
  private throttle(func: Function, delay: number): ThrottleFunction {
    let timeoutId: number;
    let lastExecTime = 0;
    
    return (...args: any[]) => {
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

  // Reset activities function
  private resetActivities(): void {
    const activitiesSection = this.document.querySelector('.activities-section') as HTMLElement;
    const activityCards = this.document.querySelectorAll('.activity-card') as NodeListOf<HTMLElement>;
    
    if (activitiesSection) {
      this.renderer.removeClass(activitiesSection, 'loaded');
      this.renderer.addClass(activitiesSection, 'loading');
    }
    
    activityCards.forEach(card => {
      this.renderer.removeClass(card, 'floating');
      this.renderer.setStyle(card, 'opacity', '0');
      this.renderer.setStyle(card, 'transform', 'translateY(60px) scale(0.9)');
      
      const icon = card.querySelector('.activity-icon') as HTMLElement;
      if (icon) {
        this.renderer.removeClass(icon, 'pulse');
      }
    });
  }
}
