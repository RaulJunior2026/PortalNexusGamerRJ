import Navbar from '../components/Navbar/Navbar';
import NewsCard from '../components/NewsCard/NewsCard';
import Sidebar from '../components/Sidebar/Sidebar';
import HeroGrid from '../components/HeroGrid/HeroGrid';
import { getHomeData } from '@/services/homeService';
import styles from './Home.module.css';

export default async function Home() {
  const { heroArticles, feed, ranking } = await getHomeData();

  return (
    <>
      <Navbar />
      
      <div className={styles.homeContainer}>
        {/* Bloco de Destaques Herói com Dados Dinâmicos */}
        <HeroGrid articles={heroArticles} />

        <div className={styles.mainLayout}>
          {/* Feed Principal de Notícias */}
          <main>
            <div className={styles.sectionHeader}>
              <h2>Últimas Publicações</h2>
              <div className={styles.sectionLine}></div>
            </div>
            
            <div className={styles.feed}>
              {feed.length > 0 ? (
                feed.map((news) => (
                  <NewsCard 
                    key={news.id} 
                    title={news.title} 
                    category={news.category.name} 
                    date={new Date(news.publishedAt).toLocaleDateString('pt-BR')} 
                  />
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                  Aguardando a IA rastrear as primeiras notícias da internet...
                </p>
              )}
            </div>

            {feed.length > 0 && (
              <div style={{ marginTop: '2.5rem', textAlign: 'center', padding: '2rem', background: 'var(--panel-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <button style={{ backgroundColor: 'transparent', border: '1px solid var(--accent-neon-blue)', color: 'var(--accent-neon-blue)', padding: '0.8rem 2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '800', textTransform: 'uppercase' }}>
                  Carregar mais conteúdo
                </button>
              </div>
            )}
          </main>

          {/* Sidebar Lateral com Rankings Dinâmicos */}
          <div className={styles.sidebarSection}>
            <div className={styles.sectionHeader}>
              <h2>Mais Lidas</h2>
              <div className={styles.sectionLine}></div>
            </div>

            <ul className={styles.rankingList}>
              {ranking.length > 0 ? (
                ranking.map((news, index) => (
                  <li key={news.id} className={styles.rankingItem}>
                    <span className={styles.rankingNumber}>{index + 1}</span>
                    <span className={styles.rankingTitle}>{news.title}</span>
                  </li>
                ))
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sem dados de audiência.</p>
              )}
            </ul>

            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}
