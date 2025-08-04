// Configuration template for the AI Page Summarizer Extension (Gemini Version)
// 1. Copy this file and rename it to config.js
// 2. Replace YOUR_API_KEY with your Gemini API key in the extension's options page
// 3. Never commit your actual config.js file to version control

const config = {
    // The API key will be stored in Chrome's secure storage
    async getApiKey() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['geminiApiKey'], (result) => {
                resolve(result.geminiApiKey || '');
            });
        });
    },

    async setApiKey(apiKey) {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
                resolve();
            });
        });
    }
};

export default config; 