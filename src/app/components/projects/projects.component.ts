import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService, Project, Comment } from '../../services/supabase.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  projectComments: Comment[] = [];
  isModalOpen = false;
  isLoading = false;
  currentGalleryIndex = 0;
  isGalleryOpen = false;

  // Formulário de comentário
  newComment = {
    author_name: '',
    message: ''
  };

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    await this.loadProjects();
    this.initializeAnimations();
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  private async loadProjects(): Promise<void> {
    this.isLoading = true;
    try {
      this.projects = await this.supabaseService.getProjects();
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private initializeAnimations(): void {
    // Animação dos cards ao carregar
    setTimeout(() => {
      const cards = document.querySelectorAll('.project-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-in');
        }, index * 100);
      });
    }, 100);
  }

  async openProjectModal(project: Project): Promise<void> {
    this.selectedProject = project;
    this.isModalOpen = true;
    
    // Carrega comentários do projeto
    try {
      this.projectComments = await this.supabaseService.getComments(project.id);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      this.projectComments = [];
    }

    // Adiciona classe ao body para prevenir scroll
    document.body.classList.add('modal-open');
    
    // Animação do modal
    setTimeout(() => {
      const modal = document.querySelector('.project-modal');
      if (modal) {
        modal.classList.add('show');
      }
    }, 10);
  }

  closeModal(): void {
    const modal = document.querySelector('.project-modal');
    if (modal) {
      modal.classList.remove('show');
    }
    
    setTimeout(() => {
      this.isModalOpen = false;
      this.selectedProject = null;
      this.projectComments = [];
      this.resetCommentForm();
      document.body.classList.remove('modal-open');
    }, 300);
  }

  async submitComment(): Promise<void> {
    if (!this.selectedProject || !this.newComment.author_name.trim() || !this.newComment.message.trim()) {
      return;
    }

    this.isLoading = true;
    
    try {
      const comment = await this.supabaseService.addComment({
        project_id: this.selectedProject.id,
        author_name: this.newComment.author_name.trim(),
        message: this.newComment.message.trim()
      });

      // Adiciona o novo comentário à lista
      this.projectComments.unshift(comment);
      
      // Atualiza o contador de comentários no projeto
      this.selectedProject.comments_count++;
      
      // Atualiza também na lista principal
      const projectIndex = this.projects.findIndex(p => p.id === this.selectedProject!.id);
      if (projectIndex !== -1) {
        this.projects[projectIndex].comments_count++;
      }

      this.resetCommentForm();
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private resetCommentForm(): void {
    this.newComment = {
      author_name: '',
      message: ''
    };
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onModalBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  trackProject(index: number, project: Project): number {
    return project.id;
  }

  // Gallery methods
  openGallery(index: number): void {
    this.currentGalleryIndex = index;
    this.isGalleryOpen = true;
    document.body.classList.add('gallery-open');
  }

  closeGallery(): void {
    this.isGalleryOpen = false;
    document.body.classList.remove('gallery-open');
  }

  nextImage(): void {
    if (this.selectedProject && this.currentGalleryIndex < this.selectedProject.gallery_images.length - 1) {
      this.currentGalleryIndex++;
    }
  }

  prevImage(): void {
    if (this.currentGalleryIndex > 0) {
      this.currentGalleryIndex--;
    }
  }

  goToImage(index: number): void {
    this.currentGalleryIndex = index;
  }

  onGalleryBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeGallery();
    }
  }
}
