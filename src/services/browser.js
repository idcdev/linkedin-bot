import puppeteer from 'puppeteer-core';
import { BROWSER_CONFIG } from '../config/constants.js';

export async function startBrowser() {
  try {
    console.log('Iniciando navegador...');
    const browser = await puppeteer.launch(BROWSER_CONFIG);
    
    const page = await browser.newPage();
    
    // Configura o viewport para uma resolução comum de desktop
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    
    return { browser, page };
  } catch (error) {
    console.error('Erro ao iniciar o navegador:', error);
    throw error;
  }
} 