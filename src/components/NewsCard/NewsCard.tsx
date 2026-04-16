import styles from './NewsCard.module.css';

interface NewsCardProps {
  title: string;
  category: string;
  date: string;
}

export default function NewsCard({ title, category, date }: NewsCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imagePlaceholder}>Thumbnail</div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.badge}>{category}</span>
          <span>{date}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </article>
  );
}
