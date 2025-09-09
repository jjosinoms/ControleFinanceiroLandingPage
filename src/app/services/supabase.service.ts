import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Comment {
  id?: number;
  project_id: number;
  author_name: string;
  message: string;
  created_at?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  gallery_folder: string;
  gallery_images: string[];
  comments_count: number;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  // Mock data para simulação (como solicitado)
  private mockProjects: Project[] = [
    {
      id: 1,
      title: 'Reforma de Fachada Comercial',
      description: 'Projeto completo de renovação de fachada comercial com materiais modernos e sustentáveis. Incluindo pintura, revestimento e iluminação LED. Transformação visual impressionante que combina estética e funcionalidade.',
      short_description: 'Renovação completa de fachada comercial',
      image_url: 'midia/img/fachada/fachada-1.webp',
      gallery_folder: 'fachada',
      gallery_images: [
        'midia/img/fachada/fachada-0.webp',
        'midia/img/fachada/fachada-1.webp',
        'midia/img/fachada/fachada-2.webp'
      ],
      comments_count: 12
    },
    {
      id: 2,
      title: 'Construção Residencial',
      description: 'Casa residencial de alto padrão com 3 quartos, área gourmet e piscina. Projeto executado com acabamentos premium e atenção aos detalhes. Arquitetura moderna integrada ao paisagismo.',
      short_description: 'Casa residencial de alto padrão',
      image_url: 'midia/img/fachada2/obra-1.jpg',
      gallery_folder: 'fachada2',
      gallery_images: [
        'midia/img/fachada2/obra-1.jpg',
        'midia/img/fachada2/obra-2.jpg',
        'midia/img/fachada2/obra-3.jpg',
        'midia/img/fachada2/obra-4.jpg'
      ],
      comments_count: 8
    },
    {
      id: 3,
      title: 'Instalação Elétrica Industrial',
      description: 'Sistema elétrico completo para indústria, incluindo quadros de distribuição, cabeamento e sistemas de segurança. Projeto executado seguindo todas as normas técnicas e de segurança.',
      short_description: 'Sistema elétrico industrial completo',
      image_url: 'midia/img/quadro-luz/luz-1.webp',
      gallery_folder: 'quadro-luz',
      gallery_images: [
        'midia/img/quadro-luz/luz-1.webp',
        'midia/img/quadro-luz/luz-2.webp'
      ],
      comments_count: 15
    },
    {
      id: 4,
      title: 'Área de Lazer com Piscina',
      description: 'Revitalização completa de área de lazer com nova piscina, deck em madeira e paisagismo moderno. Espaço projetado para relaxamento e entretenimento da família.',
      short_description: 'Revitalização de área de lazer completa',
      image_url: 'midia/img/piscina/obra-1.webp',
      gallery_folder: 'piscina',
      gallery_images: [
        'midia/img/piscina/obra-1.webp',
        'midia/img/piscina/obra-2.webp',
        'midia/img/piscina/obra-3.webp',
        'midia/img/piscina/obra-4.webp',
        'midia/img/piscina/obra-5.webp',
        'midia/img/piscina/obra-6.jpg',
        'midia/img/piscina/obra-7.jpg',
        'midia/img/piscina/obra-8.jpg'
      ],
      comments_count: 6
    },
    {
      id: 5,
      title: 'Projeto Corporativo',
      description: 'Escritório corporativo moderno com conceito aberto, salas de reunião e área de descanso para colaboradores. Ambiente projetado para produtividade e bem-estar.',
      short_description: 'Escritório corporativo moderno',
      image_url: 'midia/img/equipe-trabalhando/equipe-1.webp',
      gallery_folder: 'equipe-trabalhando',
      gallery_images: [
        'midia/img/equipe-trabalhando/equipe-1.webp',
        'midia/img/equipe-trabalhando/equipe-2.webp',
        'midia/img/equipe-trabalhando/equipe-3.webp',
        'midia/img/equipe-trabalhando/equipe-4.webp'
      ],
      comments_count: 9
    },
    {
      id: 6,
      title: 'Reforma Estrutural',
      description: 'Reforma estrutural completa incluindo fundação, pilares e laje. Projeto executado seguindo todas as normas técnicas de segurança e qualidade construtiva.',
      short_description: 'Reforma estrutural completa',
      image_url: 'midia/img/paredes/obra-1.jpg',
      gallery_folder: 'paredes',
      gallery_images: [
        'midia/img/paredes/obra-1.jpg',
        'midia/img/paredes/obra-2.jpg',
        'midia/img/paredes/obra-3.jpg',
        'midia/img/paredes/obra-4.jpg',
        'midia/img/paredes/obra-5.jpg',
        'midia/img/paredes/obra-6.jpg',
        'midia/img/paredes/obra-7.jpg'
      ],
      comments_count: 18
    }
  ];

  private mockComments: Comment[] = [
    {
      id: 1,
      project_id: 1,
      author_name: 'Maria Silva',
      message: 'Excelente trabalho! A fachada ficou moderna e elegante.',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      project_id: 1,
      author_name: 'João Santos',
      message: 'Profissionais muito competentes, recomendo!',
      created_at: '2024-01-16T14:20:00Z'
    },
    {
      id: 3,
      project_id: 2,
      author_name: 'Ana Costa',
      message: 'Casa dos sonhos! Superou todas as expectativas.',
      created_at: '2024-01-18T09:15:00Z'
    },
    {
      id: 4,
      project_id: 3,
      author_name: 'Carlos Oliveira',
      message: 'Sistema elétrico impecável, sem problemas até hoje.',
      created_at: '2024-01-20T16:45:00Z'
    },
    {
      id: 5,
      project_id: 4,
      author_name: 'Lucia Ferreira',
      message: 'A piscina ficou perfeita! Área de lazer incrível.',
      created_at: '2024-01-22T11:30:00Z'
    }
  ];

  constructor() {
    // Configuração do Supabase (comentada para usar mock data)
    // const supabaseUrl = 'YOUR_SUPABASE_URL';
    // const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
    // this.supabase = createClient(supabaseUrl, supabaseKey);
    
    // Para demonstração, criamos um cliente mock
    this.supabase = {} as SupabaseClient;
  }

  // Métodos para projetos
  async getProjects(): Promise<Project[]> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.mockProjects];
  }

  async getProject(id: number): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockProjects.find(project => project.id === id) || null;
  }

  // Métodos para comentários
  async getComments(projectId: number): Promise<Comment[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockComments.filter(comment => comment.project_id === projectId);
  }

  async addComment(comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newComment: Comment = {
      ...comment,
      id: Math.max(...this.mockComments.map(c => c.id || 0)) + 1,
      created_at: new Date().toISOString()
    };
    
    this.mockComments.push(newComment);
    
    // Atualiza o contador de comentários do projeto
    const project = this.mockProjects.find(p => p.id === comment.project_id);
    if (project) {
      project.comments_count++;
    }
    
    return newComment;
  }

  // Método para configurar Supabase real (quando necessário)
  initializeSupabase(url: string, key: string): void {
    this.supabase = createClient(url, key);
  }

  // Métodos para integração real com Supabase (comentados)
  /*
  async getProjectsFromSupabase(): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getCommentsFromSupabase(projectId: number): Promise<Comment[]> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async addCommentToSupabase(comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> {
    const { data, error } = await this.supabase
      .from('comments')
      .insert([comment])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  */
}
