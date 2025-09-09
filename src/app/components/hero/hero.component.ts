import { Component, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit {
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    this.initHeroSection();
    this.initHeroButtons();
    this.initHeroBadge();
    this.optimizeHeroPerformance();
    // Adiciona CSS para ripple effect
    const style = this.renderer.createElement('style');
    style.textContent = `
      .btn-hero-primary, .btn-hero-secondary { position: relative; overflow: hidden; }
      .ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.3); animation: ripple-animation 0.6s ease-out; pointer-events: none; }
      @keyframes ripple-animation { to { transform: scale(2); opacity: 0; } }
      .hero-feature-card { opacity: 0; transform: translateY(20px); transition: all 0.6s ease; }
      .hero-feature-card.loaded { opacity: 1; transform: translateY(0); }
    `;
    this.document.head.appendChild(style);
  }

  private initHeroSection(): void {
    this.initVideoBackground();
    this.initScrollIndicator();
    this.initHeroAnimations();
    this.initHeroStats();
  }

  private initVideoBackground(): void {
    const video = this.document.querySelector('.hero-video') as HTMLVideoElement | null;
    const videoLoading = this.document.querySelector('.video-loading') as HTMLElement | null;
    const videoBackground = this.document.querySelector('.video-background') as HTMLElement | null;
    const fallbackBg = this.document.querySelector('.video-fallback') as HTMLElement | null;
    
    if (!video) {
      console.warn('Hero video element not found');
      return;
    }

    // Log para debug
    console.log('Video src:', video.src);
    console.log('Video element:', video);

    // Mostrar loading inicialmente
    if (videoLoading) {
      videoLoading.style.display = 'flex';
      videoLoading.classList.remove('hidden');
    }

    // Event listeners do vídeo
    video.addEventListener('loadstart', () => {
      console.log('Video loadstart');
      if (videoLoading) {
        videoLoading.style.display = 'flex';
        videoLoading.classList.remove('hidden');
      }
    });

    video.addEventListener('canplay', () => {
      console.log('Video canplay');
      this.playVideo(video);
    });

    video.addEventListener('canplaythrough', () => {
      console.log('Video canplaythrough');
      if (videoLoading) {
        videoLoading.classList.add('hidden');
        setTimeout(() => { 
          videoLoading.style.display = 'none'; 
        }, 500);
      }
      
      // Marcar vídeo como carregado e fazer fade in
      video.setAttribute('data-loaded', 'true');
      video.style.opacity = '1';
    });

    video.addEventListener('error', (e) => {
      console.error('Video error:', e);
      this.handleVideoError(videoBackground, fallbackBg, videoLoading);
    });

    video.addEventListener('stalled', () => {
      console.warn('Video stalled');
    });

    video.addEventListener('waiting', () => {
      console.log('Video waiting');
    });

    // Forçar carregamento
    video.load();
    
    // Tentar reproduzir após um pequeno delay
    setTimeout(() => {
      this.playVideo(video);
    }, 1000);

    // Fallback: tornar vídeo visível após 3 segundos mesmo se não carregar completamente
    setTimeout(() => {
      if (video.style.opacity !== '1') {
        console.log('Forcing video visibility after timeout');
        video.style.opacity = '1';
        video.setAttribute('data-loaded', 'true');
        if (videoLoading) {
          videoLoading.style.display = 'none';
        }
      }
    }, 3000);

    // Observer para pausar/reproduzir quando sai/entra na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.playVideo(video);
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(video);
  }

  private playVideo(video: HTMLVideoElement): void {
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video playing successfully');
        })
        .catch((error) => {
          console.error('Error playing video:', error);
          // Tentar novamente sem som se der erro
          video.muted = true;
          video.play().catch((e) => {
            console.error('Failed to play muted video:', e);
          });
        });
    }
  }

  private handleVideoError(videoBackground: HTMLElement | null, fallbackBg: HTMLElement | null, videoLoading: HTMLElement | null): void {
    console.log('Switching to fallback background');
    
    if (videoBackground) {
      videoBackground.style.display = 'none';
    }
    
    if (fallbackBg) {
      fallbackBg.style.display = 'block';
      fallbackBg.style.backgroundImage = 'url("midia/img/fachada/fachada-0.jpg")';
      fallbackBg.style.backgroundSize = 'cover';
      fallbackBg.style.backgroundPosition = 'center';
      fallbackBg.style.backgroundRepeat = 'no-repeat';
    }
    
    if (videoLoading) {
      videoLoading.style.display = 'none';
    }
  }

  private initScrollIndicator(): void {
    const scrollIndicator = this.document.querySelector('.scroll-indicator') as HTMLElement | null;
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const nextSection = this.document.querySelector('.slogan-section') || this.document.querySelector('.stats-section') || this.document.querySelector('.services-section');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      let scrollTimeout: any;
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          scrollIndicator.style.opacity = '0.3';
        } else {
          scrollIndicator.style.opacity = '0.85';
        }
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (window.scrollY > 200) {
            scrollIndicator.style.display = 'none';
          }
        }, 2000);
      });
    }
  }

  private initHeroAnimations(): void {
    const heroContent = this.document.querySelector('.hero-container') as HTMLElement | null;
    const heroOverlay = this.document.querySelector('.hero-overlay') as HTMLElement | null;
    if (heroContent) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        if (scrolled < window.innerHeight) {
          heroContent.style.transform = `translateY(${rate}px)`;
          if (heroOverlay) {
            heroOverlay.style.opacity = String(1 - (scrolled / window.innerHeight) * 0.5);
          }
        }
      });
    }
    const titleHighlight = this.document.querySelector('.title-highlight') as HTMLElement | null;
    if (titleHighlight) {
      const text = titleHighlight.textContent || '';
      titleHighlight.textContent = '';
      titleHighlight.style.borderRight = '2px solid #ffa500';
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          titleHighlight.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        } else {
          setTimeout(() => { titleHighlight.style.borderRight = 'none'; }, 1000);
        }
      };
      setTimeout(typeWriter, 1200);
    }
    const heroElements = [
      '.hero-stats-mini', '.hero-title', '.hero-subtitle', '.hero-actions', '.hero-carousel-container'
    ];
    heroElements.forEach((selector, index) => {
      const element = this.document.querySelector(selector) as HTMLElement | null;
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        setTimeout(() => {
          element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, 200 + (index * 200));
      }
    });
  }

  private initHeroStats(): void {
    const statNumbers = this.document.querySelectorAll('.stat-mini');
    if (statNumbers.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStatNumbers();
            observer.unobserve(entry.target);
          }
        });
      });
      statNumbers.forEach(stat => observer.observe(stat));
    }
  }

  private animateStatNumbers(): void {
    const statElements = [
      { element: this.document.querySelector('.stat-mini:nth-child(1)'), target: 500, suffix: '+' },
      { element: this.document.querySelector('.stat-mini:nth-child(2)'), target: 15, suffix: '+' },
      { element: this.document.querySelector('.stat-mini:nth-child(3)'), target: 100, suffix: '%' }
    ];
    statElements.forEach(({ element, target, suffix }) => {
      if (element) {
        const numberElement = element.querySelector('.stat-number') || element;
        let current = 0;
        const increment = target / 50;
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          const displayValue = Math.floor(current);
          if (numberElement.textContent?.includes('+') || numberElement.textContent?.includes('%')) {
            numberElement.innerHTML = numberElement.innerHTML.replace(/\d+/, displayValue.toString());
          } else {
            numberElement.textContent = displayValue + suffix;
          }
        }, 40);
      }
    });
  }

  private initHeroButtons(): void {
    const buttons = this.document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const btn = button as HTMLElement;
        const mouseEvent = e as MouseEvent;
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = mouseEvent.clientX - rect.left - size / 2;
        const y = mouseEvent.clientY - rect.top - size / 2;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        btn.appendChild(ripple);
        setTimeout(() => { ripple.remove(); }, 600);
      });
      button.addEventListener('mouseenter', () => {
        (button as HTMLElement).style.transform = 'translateY(-3px) scale(1.02)';
      });
      button.addEventListener('mouseleave', () => {
        (button as HTMLElement).style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  private initHeroBadge(): void {
    const badge = this.document.querySelector('.hero-badge') as HTMLElement | null;
    if (badge) {
      let floatDirection = 1;
      setInterval(() => {
        const currentTransform = badge.style.transform || 'translateY(0px)';
        const currentY = parseFloat(currentTransform.match(/translateY\(([^)]+)\)/)?.[1] || '0');
        if (Math.abs(currentY) > 10) floatDirection *= -1;
        const newY = currentY + (floatDirection * 0.5);
        badge.style.transform = `translateY(${newY}px)`;
      }, 50);
      badge.addEventListener('click', function() {
        badge.style.animation = 'none';
        setTimeout(() => { badge.style.animation = 'badgeFloat 3s ease-in-out infinite'; }, 100);
      });
    }
  }

  private optimizeHeroPerformance(): void {
    let scrollTimeout: any;
    const originalScrollHandler = window.onscroll;
    window.onscroll = function(ev: Event) {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          if (originalScrollHandler) originalScrollHandler.call(window, ev);
          scrollTimeout = null;
        }, 16);
      }
    };
    const lazyElements = this.document.querySelectorAll('.hero-feature-card, .hero-carousel-container');
    if ('IntersectionObserver' in window) {
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            lazyObserver.unobserve(entry.target);
          }
        });
      });
      lazyElements.forEach(el => lazyObserver.observe(el));
    }
  }
}
