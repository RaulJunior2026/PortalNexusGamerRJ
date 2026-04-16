import { NextResponse } from 'next/server';
import { runAIEditorCycle } from '@/services/aiEditorService';
import { runAIEvolutionCycle } from '@/services/aiManagerService';
import { fetchFreeGames } from '@/services/gameDealsService';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // No ambiente de dev, permitimos rodar sem token para testes rápidos
  if (process.env.NODE_ENV === 'production') {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    // Rodar ciclo do Editor IA (Scrape + Rewrite + Save)
    await runAIEditorCycle();

    // Rodar ciclo de Evolução (Análise de Hype + Ajuste de Tema/Categorias)
    await runAIEvolutionCycle();

    // Buscar ofertas de jogos (pode ser expandido para salvar no BD também)
    const freeGames = await fetchFreeGames();

    return NextResponse.json({
      status: "success",
      message: "Ciclo de automação do Editor-Chefe IA concluído.",
      freeGamesPreview: freeGames
    });
  } catch (error) {
    console.error('[Cron] Falha no ciclo:', error);
    return NextResponse.json({ status: "error", message: "Erro interno no processamento." }, { status: 500 });
  }
}
