# Configuração do Supabase para Projetos

## Visão Geral

O componente de projetos foi implementado com integração Supabase para gerenciar comentários. Atualmente está funcionando com dados mock para demonstração, mas pode ser facilmente configurado para usar um banco de dados real.

## Estado Atual

✅ **Funcionando com dados mock**
- 6 projetos pré-definidos
- Sistema de comentários simulado
- Interface completa de modal e formulários

## Para Integrar com Supabase Real

### 1. Criar Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

### 2. Configurar Banco de Dados

Execute os seguintes comandos SQL no editor SQL do Supabase:

```sql
-- Tabela de projetos
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  image_url VARCHAR(500),
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de comentários
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  author_name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir projetos de exemplo
INSERT INTO projects (title, description, short_description, image_url, comments_count) VALUES
('Reforma de Fachada Comercial', 'Projeto completo de renovação de fachada comercial com materiais modernos e sustentáveis. Incluindo pintura, revestimento e iluminação LED.', 'Renovação completa de fachada comercial', 'midia/img/fachada/fachada-1.webp', 12),
('Construção Residencial', 'Casa residencial de alto padrão com 3 quartos, área gourmet e piscina. Projeto executado com acabamentos premium.', 'Casa residencial de alto padrão', 'midia/img/fachada2/obra-1.jpg', 8),
('Instalação Elétrica Industrial', 'Sistema elétrico completo para indústria, incluindo quadros de distribuição, cabeamento e sistemas de segurança.', 'Sistema elétrico industrial completo', 'midia/img/quadro-luz/luz-1.webp', 15),
('Reforma de Piscina', 'Revitalização completa de área de lazer com nova piscina, deck em madeira e paisagismo moderno.', 'Revitalização de área de lazer', 'midia/img/piscina/obra-12.webp', 6),
('Projeto Corporativo', 'Escritório corporativo moderno com conceito aberto, salas de reunião e área de descanso para colaboradores.', 'Escritório corporativo moderno', 'midia/img/equipe-trabalhando/equipe-1.webp', 9),
('Reforma Estrutural', 'Reforma estrutural completa incluindo fundação, pilares e laje. Projeto executado seguindo todas as normas técnicas.', 'Reforma estrutural completa', 'midia/img/paredes/obra-1.jpg', 18);
```

### 3. Configurar Políticas RLS (Row Level Security)

```sql
-- Habilitar RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on comments" ON comments FOR SELECT USING (true);

-- Permitir inserção pública apenas em comentários
CREATE POLICY "Allow public insert on comments" ON comments FOR INSERT WITH CHECK (true);
```

### 4. Obter Credenciais

No painel do Supabase:
1. Vá em Settings → API
2. Copie o `Project URL`
3. Copie a `anon public` key

### 5. Atualizar o Código

No arquivo `src/app/services/supabase.service.ts`:

```typescript
constructor() {
  // Descomente e configure suas credenciais
  const supabaseUrl = 'SUA_URL_DO_SUPABASE';
  const supabaseKey = 'SUA_CHAVE_PUBLICA_DO_SUPABASE';
  this.supabase = createClient(supabaseUrl, supabaseKey);
}

// E descomente os métodos reais do Supabase no final do arquivo
```

## Características do Sistema

### Interface
- **Design moderno e clean** mantendo a paleta de cores do site
- **Cards responsivos** com hover effects e animações suaves
- **Modal fullscreen** para visualização detalhada dos projetos
- **Sistema de comentários** integrado com formulário

### Funcionalidades
- ✅ Listagem de projetos em grade responsiva
- ✅ Modal com imagem em destaque e descrição completa
- ✅ Lista de comentários por projeto
- ✅ Formulário para adicionar novos comentários
- ✅ Contador de comentários em tempo real
- ✅ Animações e transições suaves
- ✅ Design responsivo para mobile

### Tecnologias
- **Angular 18+** com Standalone Components
- **Supabase** para backend e banco de dados
- **TypeScript** para tipagem forte
- **CSS Moderno** com animações e responsividade
- **FontAwesome** para ícones

## Estrutura dos Dados

### Projeto
```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  comments_count: number;
  created_at?: string;
}
```

### Comentário
```typescript
interface Comment {
  id?: number;
  project_id: number;
  author_name: string;
  message: string;
  created_at?: string;
}
```

## Próximos Passos

1. **Autenticação**: Implementar login de usuários
2. **Moderação**: Sistema de aprovação de comentários
3. **Curtidas**: Sistema de likes nos comentários
4. **Filtros**: Filtrar projetos por categoria
5. **Busca**: Sistema de busca nos projetos
6. **Upload**: Upload de imagens para novos projetos

## Suporte

Para dúvidas sobre a implementação, verifique:
- Documentação do Supabase: https://supabase.com/docs
- Documentação do Angular: https://angular.dev
