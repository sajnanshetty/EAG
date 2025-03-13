# AI Page Summarizer Chrome Extension

This Chrome extension uses OpenAI's GPT-3.5 to generate concise summaries of web pages you're browsing.

## Features

- One-click summarization of any webpage
- Clean and modern user interface
- Efficient content extraction
- AI-powered summarization using GPT-3.5

## Setup Instructions

1. Clone or download this repository
2. Get an OpenAI API key from [OpenAI's website](https://platform.openai.com/)
3. Set up your API key securely:
   - Copy `config.template.js` to `config.js`
   - Replace `YOUR_OPENAI_API_KEY_HERE` in `config.js` with your actual OpenAI API key
   - Note: `config.js` is in `.gitignore` to prevent accidental commits of sensitive data
4. Create an `icons` folder and add icon images with the following sizes:
   - 16x16 pixels (icon16.png)
   - 48x48 pixels (icon48.png)
   - 128x128 pixels (icon128.png)
5. Open Chrome and go to `chrome://extensions/`
6. Enable "Developer mode" in the top right
7. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to any webpage you want to summarize
2. Click the extension icon in your Chrome toolbar
3. Click the "Summarize Page" button
4. Wait for the AI to generate a summary
5. Read the generated summary in the popup window

## Files Structure

- `manifest.json`: Extension configuration
- `popup.html`: Extension popup interface
- `popup.js`: Popup interaction logic
- `content.js`: Webpage content extraction
- `background.js`: AI processing logic
- `config.js`: Secure API key configuration (not included in repository)
- `config.template.js`: Template for API key configuration
- `icons/`: Extension icons

## Security Note

Please keep your OpenAI API key secure and never share it publicly. The key is only used locally in your browser.
- The API key is stored in `config.js` which is excluded from version control
- Never commit your actual `config.js` file to the repository
- Use `config.template.js` as a reference for setting up your own configuration

## License

MIT License 