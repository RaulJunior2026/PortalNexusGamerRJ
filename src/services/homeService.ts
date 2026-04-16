import { prisma } from '@/lib/prisma';

export async function getHomeData() {
  try {
    // Buscar os 3 destaques (highlights) ou os mais recentes se não houver destaques suficentes
    const highlights = await prisma.article.findMany({
      where: { isHighlight: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      include: { category: true }
    });

    // Se não tiver 3 destaques, preencher com os últimos posts
    let heroArticles = [...highlights];
    if (heroArticles.length < 3) {
      const latest = await prisma.article.findMany({
        where: { NOT: { id: { in: highlights.map(h => h.id) } } },
        orderBy: { publishedAt: 'desc' },
        take: 3 - heroArticles.length,
        include: { category: true }
      });
      heroArticles = [...heroArticles, ...latest];
    }

    // Buscar feed principal (não repetindo destaques)
    const feed = await prisma.article.findMany({
      where: { NOT: { id: { in: heroArticles.map(h => h.id) } } },
      orderBy: { publishedAt: 'desc' },
      take: 10,
      include: { category: true }
    });

    // Mais lidas (simulado por visualizações)
    const ranking = await prisma.article.findMany({
      orderBy: { views: 'desc' },
      take: 5
    });

    return { heroArticles, feed, ranking };
  } catch (error) {
    console.warn('[Build] Falha na conexão com o banco na Home. Retornando dados vazios.');
    return { heroArticles: [], feed: [], ranking: [] };
  }
}
