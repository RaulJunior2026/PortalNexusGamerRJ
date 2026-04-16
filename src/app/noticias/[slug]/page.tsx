import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import ArticleSchema from '@/components/SchemaMarkup/ArticleSchema';
import styles from './ArticleLayout.module.css';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Mock de busca no banco de dados baseado no slug gerado pela IA
  const article = {
    title: `Descubra a verdade sobre ${slug.replace(/-/g, ' ')}`,
    category: "Investigação IA",
    date: "16 de Abril, 2026",
    readTime: "4 min de leitura",
    author: "Agente Nexus",
    content: `
      <p>A inteligência artificial tem revolucionado a forma como consumimos e desenvolvemos os jogos modernos. O nível de dinamismo aplicado por redes neurais tem deixado fãs completamente eufóricos com os lançamentos mais recentes que nossa IA reportou.</p>
      
      <h2>Impactos Invisíveis dos Gráficos</h2>
      <p>Os motores gráficos passaram de simples renderizadores de pixels para verdadeiros estúdios de cinema simulando física em tempo real.</p>
      
      <!-- Inserção estruturada para AdSense Dinâmico de In-Article (gerado pela IA) -->
      <div class="${styles.adMidArticle}">[ SLOT AD-SENSE IN-ARTICLE ]</div>

      <h2>Veredito Final</h2>
      <p>O cenário está moldado e aqueles que não se adaptarem podem ficar para trás. Nossa inteligência artificial rastreou as métricas de hype e garante que estamos vivendo uma revolução dos videogames. Não perca as próximas promoções monitoradas.</p>
    `,
    imageUrl: "https://example.com/thumbnail.jpg"
  };

  return (
    <>
      <Navbar />
      <ArticleSchema 
        title={article.title}
        url={`https://nexus-gamer.example.com/noticias/${slug}`}
        imageUrl={article.imageUrl}
        publishedAt={new Date().toISOString()}
      />
      
      <div className={styles.articleContainer}>
        <main className={styles.mainContent}>
          <header className={styles.articleHeader}>
            <span className={styles.badge}>{article.category}</span>
            <h1 className={styles.title}>{article.title}</h1>
            <div className={styles.metaInfo}>
              <span>Por {article.author}</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>⏱️ {article.readTime}</span>
            </div>
          </header>

          {/* O artigo gerado pela IA já virá validado e contido em HTML seguro */}
          <article 
            className={styles.contentBody} 
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </main>

        <Sidebar />
      </div>
    </>
  );
}
