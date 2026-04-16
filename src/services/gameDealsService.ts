export async function fetchFreeGames() {
  console.log(`[Scraper] Buscando jogos grátis nas lojas...`);
  
  return [
    {
      platform: "Epic Games",
      title: "Mystery Game AAA",
      url: "https://store.epicgames.com",
      imageUrl: "https://example.com/epic.jpg",
      isFree: true,
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString() // 7 dias
    },
    {
      platform: "Steam",
      title: "Indie Retro Shooter",
      url: "https://store.steampowered.com",
      imageUrl: "https://example.com/steam.jpg",
      isFree: true,
      originalPrice: "R$ 39,90"
    }
  ];
}
