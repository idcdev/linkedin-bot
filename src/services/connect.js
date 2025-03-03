import { logger } from '../utils/logger.js';
import { clickHumanLike, delay, randomDelay, warmupMouseMovements } from '../utils/human-behavior.js';

/**
 * Sends connection requests from search results
 */
export async function connectWithPeople(page) {
  try {
    logger.action('Starting connection process...');
    
    let currentPage = 1;
    let hasMorePages = true;
    
    while (hasMorePages) {
      // If it's not the first page, update the URL with the page number
      if (currentPage > 1) {
        const currentUrl = await page.url();
        const baseUrl = currentUrl.split('&page=')[0];
        const newUrl = `${baseUrl}&page=${currentPage}`;
        
        logger.info(`Navigating to page ${logger.highlight(currentPage)}: ${logger.url(newUrl)}`);
        await page.goto(newUrl);
      }
      
      // Wait for the list of people to be loaded
      await page.waitForSelector('div.search-results-container', {
        visible: true,
        timeout: 30000
      });
      
      // Get all connect buttons from the list
      const connectButtons = await page.$$('button.artdeco-button--2.artdeco-button--secondary[aria-label*="Invite"]');
      logger.info(`Found ${logger.highlight(connectButtons.length)} people to connect with on page ${currentPage}`);
      
      if (connectButtons.length === 0) {
        // Check if we're still on the search results page
        const isOnSearchPage = await page.evaluate(() => 
          document.location.href.includes('/search/results/people/')
        );

        if (!isOnSearchPage) {
          logger.warning('Not on search results page anymore. Current URL: ' + logger.url(await page.url()));
          hasMorePages = false;
          break;
        }

        logger.info('No connect buttons found on this page, moving to next page...');
        
        // Increment the page and continue
        currentPage++;
        continue;
      }
      
      // Process each connect button
      for (const connectButton of connectButtons) {
        try {
          // Get the person's name from the aria-label
          const ariaLabel = await connectButton.evaluate(el => el.getAttribute('aria-label'));
          const name = ariaLabel.replace('Invite ', '').replace(' to connect', '');
          logger.info(`Processing connection with: ${logger.highlight(name)}`);
          
          // Occasionally make some random movements before connecting
          if (Math.random() < 0.3) {
            await warmupMouseMovements(page);
          }
          
          // Click the connect button
          logger.action('Clicking connect button...');
          await clickHumanLike(page, `button[aria-label="${ariaLabel}"]`, {
            shouldHover: true,
            hoverDelay: [200, 500],
            postClickDelay: [300, 800]
          });
          
          // Wait for the modal to appear
          logger.wait('Waiting for modal...');
          await page.waitForSelector('div.artdeco-modal[role="dialog"]', {
            visible: true,
            timeout: 5000
          });
          
          // Click "Send without a note"
          logger.action('Clicking "Send without a note"...');
          const sendButton = 'button.artdeco-button--primary[aria-label="Send without a note"]';
          await page.waitForSelector(sendButton, {
            visible: true,
            timeout: 5000
          });
          
          await clickHumanLike(page, sendButton, {
            shouldHover: true,
            hoverDelay: [150, 400],
            postClickDelay: [200, 500]
          });
          
          logger.success(`Connection request sent to ${logger.highlight(name)}!`);
          
          // Random delay between connections - shorter but still natural
          const waitTime = randomDelay(1000, 2000);
          logger.wait(`Waiting ${waitTime}ms before next connection...`);
          await delay(waitTime);
          
        } catch (connectionError) {
          logger.error('Error processing connection: ' + connectionError.message);
          continue; // Continue with next person even if one fails
        }
      }
      
      // Prepare for the next page
      currentPage++;
      
      // Longer delay between pages to seem more natural
      const pageDelay = randomDelay(2000, 4000);
      logger.wait(`Waiting ${pageDelay}ms before loading next page...`);
      await delay(pageDelay);
    }
    
    logger.success('Finished sending all connection requests!');
  } catch (error) {
    logger.error('Error during connection process: ' + error.message);
    logger.error('Stack trace: ' + logger.dim(error.stack));
    throw error;
  }
} 