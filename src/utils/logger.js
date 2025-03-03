const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Regular colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background
  bgBlue: '\x1b[44m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m'
};

function getTimestamp() {
  return new Date().toLocaleTimeString();
}

function formatMessage(message, type) {
  const timestamp = `${colors.dim}[${getTimestamp()}]${colors.reset}`;
  const prefix = {
    info: `${colors.blue}ℹ${colors.reset}`,
    success: `${colors.green}✔${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    error: `${colors.red}✖${colors.reset}`,
    action: `${colors.cyan}➤${colors.reset}`,
    wait: `${colors.magenta}…${colors.reset}`
  }[type] || '•';
  
  return `${timestamp} ${prefix} ${message}${colors.reset}`;
}

export const logger = {
  info: (message) => console.log(formatMessage(message, 'info')),
  success: (message) => console.log(formatMessage(`${colors.green}${message}`, 'success')),
  warning: (message) => console.log(formatMessage(`${colors.yellow}${message}`, 'warning')),
  error: (message) => console.error(formatMessage(`${colors.red}${message}`, 'error')),
  action: (message) => console.log(formatMessage(`${colors.cyan}${message}`, 'action')),
  wait: (message) => console.log(formatMessage(`${colors.magenta}${message}`, 'wait')),
  
  // Special formatters
  url: (url) => `${colors.blue}${colors.bright}${url}${colors.reset}`,
  highlight: (text) => `${colors.bright}${text}${colors.reset}`,
  dim: (text) => `${colors.dim}${text}${colors.reset}`
}; 