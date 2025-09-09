import { Component, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-navigation',
  imports: [],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true
})
export class NavigationComponent implements AfterViewInit {
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    // Enhanced Navigation with Active States and Smooth Scrolling
    this.renderer.listen('window', 'scroll', () => {
      const navbar = this.document.querySelector('.navbar-custom');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
      this.updateActiveNavLink();
    });

    // Smooth scrolling for navigation links
    this.document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      this.renderer.listen(link, 'click', (e: Event) => {
        const href = (link as HTMLAnchorElement).getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = this.document.querySelector(href);
          if (target) {
            // Close mobile menu if open
            const navbarCollapse = this.document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
              // @ts-ignore
              window.bootstrap?.Collapse?.getInstance(navbarCollapse)?.hide();
            }
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            (link as HTMLElement).style.transform = 'scale(0.95)';
            setTimeout(() => {
              (link as HTMLElement).style.transform = '';
            }, 150);
          }
        }
      });
    });

    // Initialize active nav link on page load
    this.updateActiveNavLink();

    // Add entrance animations to navigation items
    const navItems = this.document.querySelectorAll('.navbar-nav .nav-item');
    navItems.forEach((item, index) => {
      (item as HTMLElement).style.opacity = '0';
      (item as HTMLElement).style.transform = 'translateY(-20px)';
      setTimeout(() => {
        (item as HTMLElement).style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        (item as HTMLElement).style.opacity = '1';
        (item as HTMLElement).style.transform = 'translateY(0)';
      }, 100 + (index * 100));
    });

    // Closes hamburger menu when clicking on a link in mobile
    this.document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      this.renderer.listen(link, 'click', () => {
        const navbarCollapse = this.document.getElementById('navbarNav');
        if (window.innerWidth < 992 && navbarCollapse && navbarCollapse.classList.contains('show')) {
          // @ts-ignore
          const bsCollapse = window.bootstrap?.Collapse?.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  private updateActiveNavLink(): void {
    const sections = this.document.querySelectorAll('section[id]');
    const navLinks = this.document.querySelectorAll('.navbar-nav .nav-link');
    let current = '';
    sections.forEach(section => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = (section as HTMLElement).clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id') || '';
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if ((link as HTMLAnchorElement).getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
}
