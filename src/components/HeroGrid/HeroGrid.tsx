import styles from './HeroGrid.module.css';
import Link from 'next/link';

interface HeroArticle {
  id: number;
  title: string;
  slug: string;
  category: {
    name: string;
  };
}

interface HeroGridProps {
  articles: HeroArticle[];
}

export default function HeroGrid({ articles }: HeroGridProps) {
  // Garantir que temos pelo menos as estruturas vazias ou mocks se não houver dados
  const main = articles[0] || { title: "Nexus Gamer: Automação Total em Games", slug: "#", category: { name: "Nexus" } };
  const sub1 = articles[1] || { title: "Em breve: Mais novidades do mundo gamer", slug: "#", category: { name: "Novo" } };
  const sub2 = articles[2] || { title: "Confira as últimas promoções na nossa aba lateral", slug: "#", category: { name: "Promo" } };

  return (
    <div className={styles.heroWrapper}>
      {/* Principal (Fio do Topo) */}
      <Link href={`/noticias/${main.slug}`} className={styles.mainHero}>
        <div className={styles.overlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>{main.category.name}</span>
          <h2 className={styles.heroTitle}>{main.title}</h2>
        </div>
      </Link>

      {/* Secundários (Stack Lateral) */}
      <div className={styles.subHeroContainer}>
        <Link href={`/noticias/${sub1.slug}`} className={styles.subHero}>
          <div className={styles.overlay} />
          <div className={styles.subHeroContent}>
            <span className={styles.heroBadgeBlue}>{sub1.category.name}</span>
            <h3 className={styles.subHeroTitle}>{sub1.title}</h3>
          </div>
        </Link>
        
        <Link href={`/noticias/${sub2.slug}`} className={styles.subHero}>
          <div className={styles.overlay} />
          <div className={styles.subHeroContent}>
            <span className={styles.heroBadgeBlue}>{sub2.category.name}</span>
            <h3 className={styles.subHeroTitle}>{sub2.title}</h3>
          </div>
        </Link>
      </div>
    </div>
  );
}
