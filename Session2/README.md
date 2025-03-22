# AI Page Summarizer (Gemini Version)

A Chrome extension that uses Google's Gemini AI model to generate concise summaries of web pages.

## Features

- One-click webpage summarization
- Uses Google's state-of-the-art Gemini 1.5 Pro model
- Clean and intuitive user interface
- Secure API key storage using Chrome's built-in storage API
- Handles various webpage formats including Canvas pages
- Intelligent text preprocessing for better results
- Proper error handling and user feedback
- Advanced safety settings for content filtering

## Setup Instructions

1. Clone this repository:
   ```bash
   git clone https://github.com/sajnanshetty/EAG.git
   cd EAG/Session2
   ```

2. Get your Gemini API Token:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an account or sign in
   - Create a new API key
   - Copy the key (it should start with 'AI')

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `Session2` directory

4. Configure your API Key:
   - After loading the extension, click on the extension icon
   - Click on the gear icon (⚙️) or right-click and select "Options"
   - In the options page, paste your Gemini API key
   - Click "Save"
   - You'll see a confirmation message if the key is saved successfully

## Security Features

- API key is stored securely using Chrome's Storage Sync API
- Key is never exposed in the source code
- Key is synced across your Chrome instances (if sync is enabled)
- Automatic validation of API key format
- No sensitive data in version control

## Usage

1. Navigate to any webpage you want to summarize
2. Click the extension icon in your Chrome toolbar
3. Click "Summarize Page"
4. Wait a few seconds for the summary to appear

## File Structure

```
Session2/
├── manifest.json        # Extension configuration
├── popup.html          # Extension popup interface
├── popup.js            # Popup functionality
├── background.js       # Background script with API logic
├── content.js          # Content script for page interaction
├── options.html        # API key configuration page
├── options.js         # Options page functionality
├── config.template.js  # Template for config module
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # Documentation
```

## Technical Details

- Uses the Gemini 1.5 Pro model from Google AI
- Implements intelligent text preprocessing
- Features advanced summarization parameters:
  - Temperature: 0.7 for balanced creativity
  - Top-K: 40 for diverse outputs
  - Top-P: 0.95 for natural text
  - Max tokens: 800 for comprehensive summaries
- Includes safety settings for content filtering
- Proper error handling and timeouts
- Clean text formatting with proper paragraph breaks

## Security Best Practices

- Never commit API keys to version control
- Use the options page to manage your API key
- API key is stored securely in Chrome's storage
- All communication is done over HTTPS
- Content safety filters are enabled by default
- Regular validation of API key format

## Development

To modify the extension:
1. Make your changes
2. Reload the extension in `chrome://extensions/`
3. Test the changes
4. If modifying API key storage:
   - Update the options page UI if needed
   - Use Chrome's storage API for secure storage
   - Test sync functionality across devices

## Troubleshooting

If you encounter issues:
1. Check the console for detailed error messages
2. Verify your API key is correctly set in the options page
3. Make sure you're connected to the internet
4. Try reloading the extension
5. If API key issues:
   - Open the options page
   - Verify the key starts with 'AI'
   - Re-enter and save the key
   - Check the success/error messages

## License

This project is licensed under the MIT License - see the LICENSE file for details. 