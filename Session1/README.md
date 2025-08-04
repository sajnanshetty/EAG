# AI Page Summarizer Chrome Extension

A Chrome extension that uses Hugging Face's BART-CNN model to generate concise summaries of web pages.

## Features

- One-click webpage summarization
- Uses state-of-the-art BART-CNN model for high-quality summaries
- Clean and intuitive user interface
- Handles various webpage formats including Canvas pages
- Intelligent text preprocessing for better results
- Proper error handling and user feedback

## Setup Instructions

1. Clone this repository:
   ```bash
   git clone https://github.com/sajnanshetty/EAG.git
   cd EAG/Session1
   ```

2. Get your Hugging Face API Token:
   - Go to [Hugging Face](https://huggingface.co/)
   - Create an account or sign in
   - Go to Settings → Access Tokens
   - Create a new token with read access
   - Copy the token

3. Create a `config.js` file:
   - Copy `config.template.js` to `config.js`
   - Replace `YOUR_API_KEY` with your Hugging Face API token

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `Session1` directory

## Usage

1. Navigate to any webpage you want to summarize
2. Click the extension icon in your Chrome toolbar
3. Click "Summarize Page"
4. Wait a few seconds for the summary to appear

## File Structure

```
Session1/
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

- Uses the `facebook/bart-large-cnn` model from Hugging Face
- Implements intelligent text preprocessing
- Features advanced summarization parameters:
  - Adjustable summary length (200-800 tokens)
  - Temperature control for creativity
  - Repetition penalty for better quality
  - Top-p sampling for natural text
- Proper error handling and retries
- Clean text formatting with proper paragraph breaks

## Security Notes

- The Hugging Face API key is stored locally in `config.js`
- Never commit your `config.js` file to version control
- The extension only requests necessary permissions
- All communication is done over HTTPS

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