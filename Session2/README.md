# AI Page Summarizer (Gemini Version)

A Chrome extension that uses Google's Gemini AI model to generate concise summaries of web pages.

## Features

- One-click webpage summarization
- Uses Google's state-of-the-art Gemini Pro model
- Clean and intuitive user interface
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

3. Create a `config.js` file:
   - Copy `config.template.js` to `config.js`
   - Replace `YOUR_API_KEY` with your Gemini API key

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `Session2` directory

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
├── config.js          # API key configuration (create this)
├── config.template.js  # Template for config.js
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # Documentation
```

## Technical Details

- Uses the Gemini Pro model from Google AI
- Implements intelligent text preprocessing
- Features advanced summarization parameters:
  - Temperature: 0.7 for balanced creativity
  - Top-K: 40 for diverse outputs
  - Top-P: 0.95 for natural text
  - Max tokens: 800 for comprehensive summaries
- Includes safety settings for content filtering
- Proper error handling and timeouts
- Clean text formatting with proper paragraph breaks

## Security Notes

- The Gemini API key is stored locally in `config.js`
- Never commit your `config.js` file to version control
- The extension only requests necessary permissions
- All communication is done over HTTPS
- Content safety filters are enabled by default

## Development

To modify the extension:
1. Make your changes
2. Reload the extension in `chrome://extensions/`
3. Test the changes

## Troubleshooting

If you encounter issues:
1. Check the console for detailed error messages
2. Verify your API key is correct
3. Make sure you're connected to the internet
4. Try reloading the extension

## License

This project is licensed under the MIT License - see the LICENSE file for details. 