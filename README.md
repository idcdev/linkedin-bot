# 🤖 LinkedIn Bot

An intelligent bot to automate LinkedIn connections in a humanized way.

## ✨ Features

- 🎭 Humanized Behavior
  - Natural mouse movements
  - Realistic typing
  - Random delays between actions
  - Hover simulation before clicks
  - Occasional circular movements

- 🛡️ Anti-detection
  - Real browser (not headless)
  - Standard User-Agent
  - No fingerprinting
  - Non-linear behavior

- 📊 Resources
  - Automatic login
  - Custom search
  - Mass connection
  - Automatic pagination
  - Detailed and colored logs

## 🚀 How to Use

### Prerequisites

- Node.js 18+
- Google Chrome installed
- LinkedIn account

### Setup

1. Clone the repository:
```bash
git clone git@github.com:idcdev/linkedin-bot.git
cd linkedin-bot
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:
```env
LINKEDIN_USERNAME=your_email@example.com
LINKEDIN_PASSWORD=your_password
```

### Execution

```bash
npm start
```

## ⚙️ Configuration

The `src/config/constants.js` file contains the main settings:

```javascript
export const SEARCH_QUERY = 'tech recruiter'; // Your search
export const BROWSER_CONFIG = {
  headless: false,
  defaultViewport: null,
  // ... other configs
};
```

## 🏗️ Project Structure

```
src/
├── config/          # Configurations
├── services/        # Main services
│   ├── auth.js      # Authentication
│   ├── browser.js   # Browser control
│   ├── connect.js   # Connection logic
│   └── search.js    # Profile search
├── utils/           # Utilities
│   ├── logger.js    # Logging system
│   └── human-behavior.js # Humanized behavior
└── index.js         # Entry point
```

## 🔧 Customization

### Adjusting Delays

In `src/utils/human-behavior.js`:
```javascript
// Delay between connections
const waitTime = randomDelay(1000, 2000);

// Delay between pages
const pageDelay = randomDelay(2000, 4000);
```

### Modifying the Search

In `src/config/constants.js`:
```javascript
export const SEARCH_QUERY = 'your search here';
```

## 📝 Logs

The system includes detailed and colored logs:

- ℹ️ Information (blue)
- ✔️ Success (green)
- ⚠️ Warnings (yellow)
- ❌ Errors (red)
- ➤ Actions (cyan)
- ... Waiting (magenta)

## ⚠️ Disclaimer

This project is for educational purposes only. The use of automation on LinkedIn should follow the platform's Terms of Service. Use responsibly.

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests. 