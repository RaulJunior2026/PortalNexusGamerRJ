import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function runAIEvolutionCycle() {
  console.log('[AI Manager] Iniciando ciclo de evolução do site...');

  // 1. Coletar tendências e dados do site
  const latestArticles = await prisma.article.findMany({ 
    take: 5, 
    orderBy: { publishedAt: 'desc' },
    select: { title: true } 
  });
  
  const ctx = latestArticles.map(a => a.title).join(', ');

  if (!process.env.GEMINI_API_KEY) {
    console.warn('[AI Manager] Sem chave Gemini. Pulando evolução.');
    return;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    Você é o Gerente de Produto de IA do portal Nexus Gamer.
    Sua missão é manter o site moderno e relevante.
    As notícias mais quentes do momento são: ${ctx}.

    Decida:
    1. Devemos mudar a cor de destaque (neon-blue) para outra cor temática baseada nas notícias? (Ex: Verde ciber se falarmos de Matrix, Laranja se falarmos de GTA VI).
    2. Devemos criar uma nova "categoria temporária" no banco de dados para agrupar esse hype?
    3. Registre o que você decidiu fazer.

    Responda em JSON:
    {
      "themeColor": "#hex_color" ou null,
      "newCategory": "Nome da Categoria" ou null,
      "aiReflection": "Explicação curta do motivo"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = JSON.parse(response.text().replace(/```json|```/g, '').trim());

    // Executar mudanças
    if (data.themeColor) {
      await prisma.siteConfig.upsert({
        where: { key: 'themeAccentColor' },
        update: { value: data.themeColor },
        create: { key: 'themeAccentColor', value: data.themeColor }
      });
    }

    if (data.newCategory) {
      await prisma.category.upsert({
        where: { slug: data.newCategory.toLowerCase().replace(/\s+/g, '-') },
        update: {},
        create: { name: data.newCategory, slug: data.newCategory.toLowerCase().replace(/\s+/g, '-') }
      });
    }

    // Registrar log
    await prisma.aIEventLog.create({
      data: {
        action: 'SITE_EVOLUTION',
        details: data.aiReflection
      }
    });

    console.log('[AI Manager] Evolução concluída:', data.aiReflection);
  } catch (error) {
    console.error('[AI Manager] Erro no ciclo de evolução:', error);
  }
}
