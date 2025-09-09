import { Component, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements AfterViewInit {
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    this.initServicesSection();
    this.addServicesStyles();
  }

  private initServicesSection(): void {
    this.initServicesAnimations();
    this.initServicesInteractions();
    this.initServicesEffects();
  }

  private initServicesAnimations(): void {
    const servicesSection = this.document.querySelector('.services-section') as HTMLElement;
    const serviceCards = this.document.querySelectorAll('.service-card');

    if (!servicesSection || serviceCards.length === 0) return;

    servicesSection.classList.add('loading');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateServicesEntrance(servicesSection, serviceCards);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(servicesSection);
  }

  private animateServicesEntrance(servicesSection: HTMLElement, serviceCards: NodeListOf<Element>): void {
    servicesSection.classList.remove('loading');
    servicesSection.classList.add('loaded');

    serviceCards.forEach((card, index) => {
      setTimeout(() => {
        (card as HTMLElement).style.opacity = '1';
        (card as HTMLElement).style.transform = 'translateY(0) scale(1)';
        
        setTimeout(() => {
          card.classList.add('floating');
        }, 800);
        
        const icon = card.querySelector('.service-icon');
        if (icon) {
          setTimeout(() => {
            icon.classList.add('pulse');
          }, 1200 + index * 200);
        }
      }, index * 150);
    });
  }

  private initServicesInteractions(): void {
    const serviceCards = this.document.querySelectorAll('.service-card');

    serviceCards.forEach((card, index) => {
      const icon = card.querySelector('.service-icon') as HTMLElement;
      const cta = card.querySelector('.service-cta') as HTMLElement;

      card.addEventListener('mouseenter', () => {
        (card as HTMLElement).classList.remove('floating');
        (card as HTMLElement).style.transform = 'translateY(-20px) scale(1.03)';
        (card as HTMLElement).style.zIndex = '10';
        
        this.createParticleEffect(card as HTMLElement);
        
        if (icon) {
          icon.style.transform = 'scale(1.15) rotate(10deg)';
          icon.style.filter = 'drop-shadow(0 0 20px rgba(255, 99, 71, 0.6))';
        }
      });

      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.transform = '';
        (card as HTMLElement).style.zIndex = '1';
        
        setTimeout(() => {
          card.classList.add('floating');
        }, 300);
        
        if (icon) {
          icon.style.transform = '';
          icon.style.filter = '';
        }
      });

      card.addEventListener('click', (e: Event) => {
        this.createRippleEffect(e as MouseEvent, card as HTMLElement);
        
        (card as HTMLElement).style.animation = 'none';
        setTimeout(() => {
          (card as HTMLElement).style.animation = 'serviceBounce 0.8s ease-out';
        }, 10);
      });

      if (cta) {
        cta.addEventListener('click', (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          
          cta.style.transform = 'scale(0.95)';
          setTimeout(() => {
            cta.style.transform = '';
          }, 150);
          
          this.showServiceDetails(card as HTMLElement);
        });
      }

      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const rotateX = deltaY * 5;
        const rotateY = deltaX * 5;
        
        (card as HTMLElement).style.transform += ` perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.transform = (card as HTMLElement).style.transform.replace(/perspective\([^)]*\)\s*rotateX\([^)]*\)\s*rotateY\([^)]*\)/g, '');
      });
    });
  }

  private initServicesEffects(): void {
    this.initServicesParallax();
    this.createBackgroundParticles();
    this.initIconScrollEffects();
    this.initCardTiltEffect();
  }

  private createRippleEffect(event: MouseEvent, element: HTMLElement): void {
    const ripple = this.document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('service-ripple');
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  private createParticleEffect(element: HTMLElement): void {
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = this.document.createElement('div');
      particle.classList.add('service-particle');
      
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 50 + Math.random() * 30;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--accent-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
      `;
      
      element.appendChild(particle);
      
      particle.animate([
        {
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0
        },
        {
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`,
          opacity: 1,
          offset: 0.7
        },
        {
          transform: `translate(calc(-50% + ${x * 1.5}px), calc(-50% + ${y * 1.5}px)) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }).onfinish = () => {
        particle.remove();
      };
    }
  }

  private showServiceDetails(card: HTMLElement): void {
    const serviceName = card.querySelector('h3')?.textContent || '';
    const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre o serviço: ${serviceName}`);
    const whatsappURL = `https://wa.me/5511999999999?text=${message}`;
    
    const cta = card.querySelector('.service-cta') as HTMLElement;
    const originalText = cta.innerHTML;
    cta.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
    
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
      cta.innerHTML = originalText;
    }, 1000);
  }

  private createBackgroundParticles(): void {
    const servicesSection = this.document.querySelector('.services-section') as HTMLElement;
    if (!servicesSection) return;
    
    const particlesContainer = this.document.createElement('div');
    particlesContainer.classList.add('services-particles');
    particlesContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
    `;
    
    servicesSection.appendChild(particlesContainer);
    
    for (let i = 0; i < 20; i++) {
      const particle = this.document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: rgba(255, 99, 71, ${0.1 + Math.random() * 0.3});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${10 + Math.random() * 20}s linear infinite;
      `;
      
      particlesContainer.appendChild(particle);
    }
  }

  private initServicesParallax(): void {
    const servicesSection = this.document.querySelector('.services-section') as HTMLElement;
    const serviceCards = this.document.querySelectorAll('.service-card');
    
    if (!servicesSection || serviceCards.length === 0) return;

    window.addEventListener('scroll', this.throttle(() => {
      const rect = servicesSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        
        serviceCards.forEach((card, index) => {
          const offset = (scrollProgress - 0.5) * (10 + index * 2);
          (card as HTMLElement).style.transform += ` translateZ(${offset}px)`;
        });
      }
    }, 16));
  }

  private initIconScrollEffects(): void {
    const serviceIcons = this.document.querySelectorAll('.service-icon');
    
    window.addEventListener('scroll', this.throttle(() => {
      serviceIcons.forEach((icon, index) => {
        const rect = (icon as HTMLElement).getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
          const rotation = scrollProgress * 360 * 0.5;
          
          (icon as HTMLElement).style.transform += ` rotate(${rotation}deg)`;
        }
      });
    }, 16));
  }

  private initCardTiltEffect(): void {
    const serviceCards = this.document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * 10;
        const rotateY = (x - centerX) / centerX * 10;
        
        (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.transform = '';
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

  private addServicesStyles(): void {
    const servicesStyles = this.document.createElement('style');
    servicesStyles.textContent = `
      .service-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 99, 71, 0.3);
        animation: serviceRipple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
      }
      
      @keyframes serviceRipple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
      
      @keyframes serviceBounce {
        0%, 20%, 53%, 80%, 100% {
          transform: translateY(0) scale(1);
        }
        40%, 43% {
          transform: translateY(-15px) scale(1.05);
        }
        70% {
          transform: translateY(-8px) scale(1.02);
        }
        90% {
          transform: translateY(-3px) scale(1.01);
        }
      }
      
      @keyframes particleFloat {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
      
      .service-card {
        position: relative;
        overflow: hidden;
      }
    `;
    this.document.head.appendChild(servicesStyles);
  }

  resetServices(): void {
    const servicesSection = this.document.querySelector('.services-section') as HTMLElement;
    const serviceCards = this.document.querySelectorAll('.service-card');
    
    if (servicesSection) {
      servicesSection.classList.remove('loaded');
      servicesSection.classList.add('loading');
    }
    
    serviceCards.forEach(card => {
      card.classList.remove('floating');
      (card as HTMLElement).style.opacity = '0';
      (card as HTMLElement).style.transform = 'translateY(50px)';
      
      const icon = card.querySelector('.service-icon');
      if (icon) {
        icon.classList.remove('pulse');
      }
    });
  }

  filterServices(category: string): void {
    const serviceCards = this.document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        (card as HTMLElement).style.display = 'block';
        (card as HTMLElement).style.animation = 'serviceSlideIn 0.6s ease-out forwards';
      } else {
        (card as HTMLElement).style.animation = 'serviceSlideOut 0.4s ease-in forwards';
        setTimeout(() => {
          (card as HTMLElement).style.display = 'none';
        }, 400);
      }
    });
  }
}
