export const LINKEDIN_URL = 'https://www.linkedin.com';
export const LINKEDIN_LOGIN_URL = 'https://www.linkedin.com/login';
export const SEARCH_QUERY = 'tech recruiter';

export const BROWSER_CONFIG = {
  headless: false,
  defaultViewport: null,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: [
    '--start-maximized',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1920,1080',
    '--window-position=0,0',
    '--disable-notifications',
    '--lang=en-US',
  ],
  ignoreDefaultArgs: ['--enable-automation'],
  product: 'chrome'
}; 