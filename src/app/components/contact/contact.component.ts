import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contactForm') contactFormRef!: NgForm;
  @ViewChild('contactSection') contactSectionRef!: ElementRef;

  // Form data
  formData: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  // Form states
  isLoading = false;
  isFormValid = false;
  formProgress = 0;
  formMessage = '';
  messageType: 'success' | 'error' | '' = '';
  
  // Validation states
  validationErrors: { [key: string]: string } = {};
  fieldValidStates: { [key: string]: boolean } = {};

  // Animation and interaction observers
  private intersectionObserver?: IntersectionObserver;
  private mousePosition = { x: 0, y: 0 };
  private animationFrameId?: number;
  private particlesContainer?: HTMLElement;

  ngOnInit(): void {
    this.initializeAnimationStyles();
  }

  ngAfterViewInit(): void {
    this.initContactAnimations();
    this.initContactInteractions();
    this.initContactEffects();
    this.initWhatsAppIntegration();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // =============================================
  // FORM VALIDATION METHODS
  // =============================================

  validateField(fieldName: keyof ContactForm, showMessage = false): ValidationResult {
    const value = this.formData[fieldName]?.trim() || '';
    let isValid = true;
    let message = '';

    switch (fieldName) {
      case 'name':
        if (value.length < 2) {
          isValid = false;
          message = 'Nome deve ter pelo menos 2 caracteres';
        } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
          isValid = false;
          message = 'Nome deve conter apenas letras';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          message = 'Email deve ter um formato válido';
        }
        break;

      case 'phone':
        const phoneRegex = /^(?:\+55\s?)?(?:\(\d{2}\)\s?|\d{2}\s?)(?:9\s?)?\d{4}[-\s]?\d{4}$/;
        if (value && !phoneRegex.test(value)) {
          isValid = false;
          message = 'Telefone deve ter um formato válido (ex: (11) 99999-9999)';
        }
        break;

      case 'subject':
        if (value.length < 3) {
          isValid = false;
          message = 'Assunto deve ter pelo menos 3 caracteres';
        }
        break;

      case 'message':
        if (value.length < 10) {
          isValid = false;
          message = 'Mensagem deve ter pelo menos 10 caracteres';
        } else if (value.length > 1000) {
          isValid = false;
          message = 'Mensagem deve ter no máximo 1000 caracteres';
        }
        break;
    }

    // Update field validation state
    this.fieldValidStates[fieldName] = isValid;
    
    if (isValid) {
      delete this.validationErrors[fieldName];
    } else if (showMessage) {
      this.validationErrors[fieldName] = message;
    }

    this.updateFormProgress();
    return { isValid, message };
  }

  onFieldInput(fieldName: keyof ContactForm): void {
    this.validateField(fieldName, false);
    this.updateFloatingLabel(fieldName);
  }

  onFieldBlur(fieldName: keyof ContactForm): void {
    this.validateField(fieldName, true);
  }

  onFieldFocus(fieldName: keyof ContactForm): void {
    delete this.validationErrors[fieldName];
  }

  private updateFormProgress(): void {
    const totalFields = Object.keys(this.formData).length;
    const validFields = Object.values(this.fieldValidStates).filter(Boolean).length;
    this.formProgress = (validFields / totalFields) * 100;
    this.isFormValid = this.formProgress === 100;
  }

  private updateFloatingLabel(fieldName: string): void {
    setTimeout(() => {
      const field = document.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`) as HTMLElement;
      const label = field?.previousElementSibling as HTMLElement;
      
      if (label && label.tagName === 'LABEL') {
        if (this.formData[fieldName as keyof ContactForm]?.trim() !== '') {
          label.style.transform = 'translateY(-25px) scale(0.85)';
          label.style.color = 'var(--accent-color)';
        } else {
          label.style.transform = '';
          label.style.color = '';
        }
      }
    });
  }

  // =============================================
  // FORM SUBMISSION
  // =============================================

  async onSubmit(): Promise<void> {
    // Se o usuário preencheu o telefone, envia todos os campos para o WhatsApp dele
    if (this.formData.phone && this.formData.phone.replace(/\D/g, '').length >= 10) {
      const userPhone = this.formData.phone.replace(/\D/g, '');
      const message =
        `Olá! Solicitei um orçamento pelo site.\n` +
        `Nome: ${this.formData.name}\n` +
        `E-mail: ${this.formData.email}\n` +
        `Telefone: ${this.formData.phone}\n` +
        `Serviço desejado: ${this.formData.subject}\n` +
        `Mensagem: ${this.formData.message}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/55${userPhone}?text=${encodedMessage}`;
      window.open(whatsappURL, '_blank');
      this.resetForm();
      this.showFormMessage('Redirecionando para o seu WhatsApp...', 'success');
      return;
    }

    // Validação dos outros campos normalmente
    let isFormValid = true;
    Object.keys(this.formData).forEach(key => {
      const result = this.validateField(key as keyof ContactForm, true);
      if (!result.isValid) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showFormMessage('Por favor, corrija os erros antes de enviar.', 'error');
      this.animateFormShake();
      return;
    }

    // Monta mensagem para WhatsApp do cliente
    const whatsappNumber = '5521992215224';
    const message =
      `Olá! Gostaria de solicitar um orçamento.\n` +
      `Nome: ${this.formData.name}\n` +
      `E-mail: ${this.formData.email}\n` +
      `Telefone: ${this.formData.phone}\n` +
      `Serviço desejado: ${this.formData.subject}\n` +
      `Mensagem: ${this.formData.message}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');

    this.resetForm();
    this.showFormMessage('Redirecionando para o WhatsApp...', 'success');
  }

  private async sendFormData(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate API call - 90% success rate
        const success = Math.random() > 0.1;
        if (success) {
          resolve();
        } else {
          reject(new Error('Simulated network error'));
        }
      }, 1500);
    });
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
    this.validationErrors = {};
    this.fieldValidStates = {};
    this.formProgress = 0;
    this.isFormValid = false;
  }

  private showFormMessage(message: string, type: 'success' | 'error'): void {
    this.formMessage = message;
    this.messageType = type;
    
    setTimeout(() => {
      this.formMessage = '';
      this.messageType = '';
    }, 5000);
  }

  private animateFormShake(): void {
    const formElement = document.querySelector('.contact-form-wrapper') as HTMLElement;
    if (formElement) {
      formElement.style.animation = 'formShake 0.5s ease-in-out';
      setTimeout(() => {
        formElement.style.animation = '';
      }, 500);
    }
  }

  // =============================================
  // WHATSAPP INTEGRATION
  // =============================================

  openWhatsAppChat(phone = '5511999999999', message = ''): void {
    const defaultMessage = 'Olá! Gostaria de saber mais sobre os serviços da JRM Ferreira Construções.';
    const finalMessage = message || defaultMessage;
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    this.createWhatsAppAnimation();
  }

  private createWhatsAppAnimation(): void {
    // Removed animated bubble for cleaner professional look
  }

  // =============================================
  // COPY TO CLIPBOARD
  // =============================================

  async copyToClipboard(text: string, event: Event): Promise<void> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      
      const element = event.currentTarget as HTMLElement;
      if (element) {
        this.showCopyNotification(element);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }

  private showCopyNotification(element: HTMLElement): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: #28a745;
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      z-index: 1000;
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
      white-space: nowrap;
    `;
    notification.textContent = 'Copiado!';
    
    element.style.position = 'relative';
    element.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(-50%) translateY(-5px)';
    }, 10);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 1500);
  }

  // =============================================
  // ANIMATIONS AND EFFECTS
  // =============================================

  private initContactAnimations(): void {
    const contactSection = this.contactSectionRef?.nativeElement;
    if (!contactSection) return;

    contactSection.classList.add('loading');

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateContactEntrance();
          this.intersectionObserver?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.intersectionObserver.observe(contactSection);
  }

  private animateContactEntrance(): void {
    const contactSection = this.contactSectionRef?.nativeElement;
    if (!contactSection) return;

    contactSection.classList.remove('loading');
    contactSection.classList.add('loaded');

    // Animate contact info items
    const contactInfoItems = contactSection.querySelectorAll('.contact-info-item');
    contactInfoItems.forEach((item: any, index: number) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, index * 150 + 800);
    });

    // Animate form
    const contactForm = contactSection.querySelector('.contact-form-wrapper');
    if (contactForm) {
      setTimeout(() => {
        contactForm.classList.add('form-ready');
        this.initFormFieldAnimations();
      }, 600);
    }
  }

  private initFormFieldAnimations(): void {
    const formFields = document.querySelectorAll('.form-control');
    formFields.forEach((field: any, index: number) => {
      setTimeout(() => {
        field.style.opacity = '1';
        field.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  private initContactInteractions(): void {
    // Removed excessive animations for professional look
  }

  private initContactEffects(): void {
    // Removed excessive particle and trail effects for professional look
  }

  private initWhatsAppIntegration(): void {
    // Phone links handling will be done in template with click handlers
  }

  private createContactRipple(element: HTMLElement): void {
    // Removed ripple effect for cleaner professional look
  }

  private createSuccessConfetti(): void {
    const colors = ['#ff6347', '#ffa500', '#ffd700', '#32cd32', '#1e90ff'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        z-index: 10000;
        pointer-events: none;
        border-radius: 50%;
      `;
      
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight;
      
      confetti.style.left = startX + 'px';
      confetti.style.top = startY + 'px';
      
      document.body.appendChild(confetti);
      
      confetti.animate([
        {
          transform: 'translateY(0) rotate(0deg)',
          opacity: 1
        },
        {
          transform: `translateY(-${300 + Math.random() * 300}px) translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`,
          opacity: 0
        }
      ], {
        duration: 2000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }).onfinish = () => {
        confetti.remove();
      };
    }
  }

  private createContactParticles(): void {
    // Removed floating particles for cleaner professional look
  }

  private initMouseTrails(): void {
    // Removed mouse trail effects for cleaner professional look
  }

  private initializeAnimationStyles(): void {
    if (document.getElementById('contact-animations')) return;

    const styles = document.createElement('style');
    styles.id = 'contact-animations';
    styles.textContent = `
      /* Removed excessive animations for professional look */

      @keyframes formShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
    `;
    
    document.head.appendChild(styles);
  }

  private cleanup(): void {
    this.intersectionObserver?.disconnect();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.particlesContainer) {
      this.particlesContainer.remove();
    }

    // Remove animation styles
    const styles = document.getElementById('contact-animations');
    if (styles) {
      styles.remove();
    }
  }

  // Utility methods for template
  getFieldError(fieldName: keyof ContactForm): string {
    return this.validationErrors[fieldName] || '';
  }

  isFieldValid(fieldName: keyof ContactForm): boolean {
    return this.fieldValidStates[fieldName] || false;
  }

  isFieldInvalid(fieldName: keyof ContactForm): boolean {
    return fieldName in this.validationErrors;
  }
}
