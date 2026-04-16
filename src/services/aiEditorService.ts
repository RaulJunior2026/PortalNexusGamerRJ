import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const parser = new Parser();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const RSS_FEEDS = [
  'https://feeds.feedburner.com/ign/all',
  'https://www.polygon.com/rss/index.xml',
];

export async function runAIEditorCycle() {
  console.log('[AI Editor] Iniciando ciclo de automação...');

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      console.log(`[AI Editor] Processando feed: ${feed.title}`);

      // Pegar as 3 notícias mais recentes de cada feed para não sobrecarregar no teste
      for (const item of feed.items.slice(0, 3)) {
        const existing = await prisma.article.findUnique({
          where: { slug: slugify(item.title || '') }
        });

        if (existing) continue;

        console.log(`[AI Editor] Nova notícia detectada: ${item.title}`);
        
        // Chamar IA para reescrever
        const aiOutput = await processContentWithIA(item.title || '', item.contentSnippet || item.content || '');

        if (aiOutput) {
          // Garantir categoria "Games"
          const category = await prisma.category.upsert({
            where: { slug: 'games' },
            update: {},
            create: { name: 'Games', slug: 'games' }
          });

          // Salvar no Banco
          await prisma.article.create({
            data: {
              title: aiOutput.title,
              slug: slugify(aiOutput.title),
              content: aiOutput.content,
              metaDesc: aiOutput.summary,
              isHighlight: aiOutput.trendingScore > 0.8,
              trendingScore: aiOutput.trendingScore,
              categoryId: category.id,
              originalSource: item.link
            }
          });
          console.log(`[AI Editor] Artigo publicado: ${aiOutput.title}`);
        }
      }
    } catch (error) {
      console.error(`[AI Editor] Erro ao processar feed ${feedUrl}:`, error);
    }
  }
}

async function processContentWithIA(originalTitle: string, originalContent: string) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[AI Editor] Sem chave Gemini. Usando Mock.');
    return {
      title: `[MOCK] ${originalTitle}`,
      content: `<p>Este é um conteúdo mockado pois a API Key não foi configurada.</p><p>${originalContent.substring(0, 200)}...</p>`,
      summary: "Resumo mockado para SEO.",
      trendingScore: Math.random()
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    Você é o editor-chefe do portal gamer Nexus Gamer, sucessor do GameVicio.
    Recebi esta notícia: 
    Título: ${originalTitle}
    Conteúdo: ${originalContent}

    Sua tarefa:
    1. Reescreva a notícia em Português do Brasil com tom profissional, dinâmico e "gamer".
    2. Crie um título altamente viral e chamativo (clickbait inteligente).
    3. Formate o corpo da notícia em HTML rico (p, h2, h3).
    4. Gere um resumo de 150 caracteres para SEO.
    5. Atribua um score de tendência (trendingScore) de 0.0 a 1.0 baseado no potencial de hype.

    Responda APENAS em formato JSON:
    {
      "title": "título aqui",
      "content": "html aqui",
      "summary": "resumo aqui",
      "trendingScore": 0.9
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extração robusta de JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON não encontrado na resposta da IA");
    
    const jsonStr = jsonMatch[0].trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('[AI Editor] Erro na chamada Gemini ou Parsing:', error);
    return null;
  }
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
