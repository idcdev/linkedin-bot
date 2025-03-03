import { SEARCH_QUERY } from '../config/constants.js';
import { 
  typeHumanLike, 
  randomDelay,
  delay,
  clickHumanLike,
  warmupMouseMovements
} from '../utils/human-behavior.js';
import { logger } from '../utils/logger.js';

/**
 * Performs a LinkedIn search
 */
export async function search(page) {
  try {
    logger.action('Starting search process...');
    
    // Wait for search field
    const searchSelector = 'input[class*="search-global-typeahead__input"]';
    await page.waitForSelector(searchSelector, { timeout: 5000 });
    
    // Type search query with human behavior
    logger.wait(`Typing search query: ${logger.highlight(SEARCH_QUERY)}`);
    await typeHumanLike(page, searchSelector, SEARCH_QUERY);
    
    // Small pause before pressing Enter (simulates thinking)
    await delay(randomDelay(800, 2000));
    
    // Sometimes select all text before pressing Enter
    if (Math.random() < 0.3) {
      logger.info('Selecting all text before search...');
      await page.keyboard.down('Meta'); // Command key on Mac
      await page.keyboard.press('a');
      await page.keyboard.up('Meta');
      await delay(randomDelay(200, 500));
    }
    
    // Press Enter
    logger.action('Pressing Enter...');
    await page.keyboard.press('Enter');
    
    // Wait for results
    logger.wait('Waiting for redirect to results page...');
    try {
      // First, wait for URL change
      await page.waitForFunction(
        () => document.location.href.includes('/search/'),
        { timeout: 30000 }
      );
      
      logger.wait('Redirected to search, waiting for results to load...');
      
      // Then wait for results container
      await page.waitForSelector('div.search-results-container', {
        visible: true,
        timeout: 30000
      });
      
      logger.success('Search results loaded successfully!');
    } catch (searchError) {
      logger.error('Error during search: ' + searchError.message);
      logger.error(`URL at search attempt: ${logger.url(await page.url())}`);
      throw searchError;
    }
    
    // Random mouse movement after search
    logger.info('Executing random mouse movements...');
    await warmupMouseMovements(page);
    
    logger.success('Initial search completed successfully!');
    
    // Navigate to people results
    logger.action('Navigating to people results...');
    try {
      // Wait for link and click it
      const linkSelector = 'div.search-results__cluster-bottom-banner a[href*="/search/results/people/"]';
      await page.waitForSelector(linkSelector, { 
        visible: true,
        timeout: 10000 
      });
      
      await clickHumanLike(page, linkSelector, {
        shouldHover: true,
        hoverDelay: [500, 1000],
        postClickDelay: [500, 1000]
      });
      
      logger.wait('Waiting for people results to load...');
      
      // Wait for results container
      await page.waitForSelector('div.search-results-container', {
        visible: true,
        timeout: 30000
      });
      
      logger.success('People results loaded successfully!');
      
      // Add location and hiring filters
      logger.action('Applying location and hiring filters...');
      const currentUrl = await page.url();
      const separator = currentUrl.includes('?') ? '&' : '?';
      const newUrl = `${currentUrl}${separator}geoUrn=%5B"103644278"%5D`;
      
      logger.info(`Navigating to filtered URL: ${logger.url(newUrl)}`);
      
      // Navigate to filtered URL and wait for results
      await Promise.all([
        page.goto(newUrl),
        page.waitForSelector('div.search-results-container', {
          visible: true,
          timeout: 30000
        })
      ]);
      
      logger.success('Filtered results loaded successfully!');
    } catch (filterError) {
      logger.error('Error navigating to people results: ' + filterError.message);
      logger.error(`URL at error: ${logger.url(await page.url())}`);
      throw filterError;
    }
  } catch (error) {
    logger.error('Error during search process: ' + error.message);
    logger.error('Stack trace: ' + logger.dim(error.stack));
    throw error;
  }
} 