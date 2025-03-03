import 'dotenv/config';
import { LINKEDIN_LOGIN_URL } from '../config/constants.js';
import { 
  typeHumanLike, 
  moveMouseHumanLike, 
  addRandomMouseMovements,
  randomDelay,
  delay,
  clickHumanLike
} from '../utils/human-behavior.js';
import { logger } from '../utils/logger.js';

/**
 * Checks if user is logged in
 */
export async function checkLoginStatus(page) {
  logger.info('Checking login status...');
  const currentUrl = page.url();
  logger.info(`Current URL: ${logger.url(currentUrl)}`);
  return currentUrl.includes('/login');
}

/**
 * Performs LinkedIn login process
 */
export async function login(page) {
  try {
    logger.action('Navigating to login page...');
    await page.goto(LINKEDIN_LOGIN_URL, { waitUntil: 'networkidle0' });
    
    logger.wait('Checking if page has fully loaded...');
    await page.waitForSelector('input[name="session_key"]', { timeout: 10000 });
    
    // Simulates random mouse movement before starting
    logger.info('Starting random mouse movements...');
    await addRandomMouseMovements(page);
    
    const needsLogin = await checkLoginStatus(page);
    logger.info(`Does it need to login? ${logger.highlight(needsLogin)}`);
    
    if (needsLogin) {
      logger.action('Preparing to login...');
      
      // Moves mouse to email field and types
      logger.wait('Typing email...');
      await moveMouseHumanLike(page, 'input[name="session_key"]');
      await typeHumanLike(page, 'input[name="session_key"]', process.env.LINKEDIN_USERNAME);
      
      // Small pause between fields
      logger.wait('Waiting before typing password...');
      await delay(randomDelay(1000, 2000));
      
      // Moves mouse to password field and types
      logger.wait('Typing password...');
      await moveMouseHumanLike(page, 'input[name="session_password"]');
      await typeHumanLike(page, 'input[name="session_password"]', process.env.LINKEDIN_PASSWORD);
      
      // Clicks login button with natural movement
      logger.action('Preparing to click login button...');
      await clickHumanLike(page, 'button[type="submit"]', {
        shouldHover: true,
        hoverDelay: [800, 1500],
        postClickDelay: [500, 1000]
      });
      
      // Waits for navigation and feed loading
      logger.wait('Click performed, waiting for redirection...');
      try {
        // First, waits for URL change
        await page.waitForFunction(
          () => document.location.href.includes('/feed/'),
          { timeout: 30000 }
        );
        
        logger.wait('Redirected to feed, waiting for loading...');
        
        // Then waits for a specific element of the feed to appear
        await page.waitForSelector('button[class*="artdeco-button--tertiary"]', {
          visible: true,
          timeout: 30000
        });
        logger.success('Feed loaded successfully!');
      } catch (navError) {
        logger.error('Error during navigation: ' + navError.message);
        logger.error(`URL after navigation attempt: ${logger.url(await page.url())}`);
        throw navError;
      }
      
      // Random movement after login
      logger.info('Executing post-login movements...');
      await addRandomMouseMovements(page);
      
      logger.success('Login successful!');
    } else {
      logger.success('Already logged in!');
    }
  } catch (error) {
    logger.error('Error during login: ' + error.message);
    logger.error('Stack trace: ' + logger.dim(error.stack));
    logger.error(`URL at error time: ${logger.url(await page.url())}`);
    throw error;
  }
} 