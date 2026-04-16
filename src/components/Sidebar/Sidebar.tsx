import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.widget}>
        <h4 className={styles.widgetTitle}>Publicidade</h4>
        <div className={styles.adPlaceholder}>Google AdSense</div>
      </div>
      
      <div className={styles.widget}>
        <h4 className={styles.widgetTitle}>🔥 Jogos Grátis Agora</h4>
        <ul style={{ listStyle: 'none', gap: '1rem', display: 'flex', flexDirection: 'column', padding: 0 }}>
          <li style={{ color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>• Epic: Jogo Misterioso</li>
          <li style={{ color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>• Steam: Jogo Grátis Fim de Semana</li>
        </ul>
      </div>
    </aside>
  );
}
