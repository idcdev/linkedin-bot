import 'dotenv/config';
import { startBrowser } from './services/browser.js';
import { login } from './services/auth.js';
import { search } from './services/search.js';
import { connectWithPeople } from './services/connect.js';

async function main() {
  let browser;
  try {
    const { browser: _browser, page } = await startBrowser();
    browser = _browser;
    
    // Performs login
    await login(page);
    
    // Performs search and applies filters
    await search(page);
    
    // Starts the connection process
    await connectWithPeople(page);
    
    // Keeps the browser open for debugging
    // await browser.close();
  } catch (error) {
    console.error('Error during execution:', error);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main(); 