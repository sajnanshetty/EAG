import config from './config.js';

// Function to preprocess content
function preprocessContent(content) {
  try {
    // Remove HTML tags
    let processedContent = content.replace(/<[^>]*>/g, ' ');
    
    // Remove extra whitespace and newlines
    processedContent = processedContent.replace(/\s+/g, ' ').trim();
    
    // Remove special characters but keep basic punctuation
    processedContent = processedContent.replace(/[^\w\s.,!?-]/g, ' ');
    
    // Limit content length to what the API can handle (approximately 1024 tokens)
    const maxLength = 4000; // characters
    if (processedContent.length > maxLength) {
      processedContent = processedContent.substring(0, maxLength) + '...';
    }
    
    return processedContent;
  } catch (error) {
    console.error('Error preprocessing content:', error);
    return content;
  }
}

// Function to call Hugging Face API with retries
async function summarizeContent(content, retries = 3) {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('No content provided for summarization');
    }

    // Preprocess the content
    const processedContent = preprocessContent(content);
    console.log('Processed content length:', processedContent.length);

    // Log API key (first few characters only for security)
    const apiKey = config.HUGGINGFACE_API_KEY.trim();
    console.log('API Key format check:', {
      length: apiKey.length,
      startsWith: apiKey.startsWith('hf_'),
      firstChars: apiKey.substring(0, 4)
    });

    if (!apiKey.startsWith('hf_')) {
      throw new Error('Invalid API key format. Hugging Face API keys should start with "hf_"');
    }

    console.log('Sending request to Hugging Face API...');

    // Improved parameters for better summarization
    const requestBody = {
      inputs: processedContent,
      parameters: {
        max_length: 800,        // Increased for more comprehensive summaries
        min_length: 200,        // Increased for more detailed summaries
        do_sample: true,        // Enable sampling for more natural text
        temperature: 0.7,       // Add some creativity while maintaining coherence
        top_p: 0.9,            // Nucleus sampling for better quality
        repetition_penalty: 1.2, // Reduce repetition
        length_penalty: 1.0,    // Balanced length penalty
        early_stopping: true,   // Stop when appropriate
        no_repeat_ngram_size: 3  // Avoid repeating phrases
      }
    };

    console.log('Request body prepared');

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      console.log('Making API request...');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      };
      console.log('Request headers:', {
        ...headers,
        'Authorization': 'Bearer ' + apiKey.substring(0, 4) + '...'
      });

      const response = await fetch(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 500));
        throw new Error('Received invalid response format from API');
      }

      const responseData = await response.json();
      console.log('Response data:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        const errorMessage = responseData.error || response.statusText;
        console.error('API Error:', errorMessage);
        throw new Error(`API Error: ${errorMessage}`);
      }

      if (!responseData || !responseData[0] || !responseData[0].summary_text) {
        throw new Error('Invalid response format from Hugging Face API');
      }

      // Post-process the summary to improve readability
      let summary = responseData[0].summary_text;
      
      // Ensure proper sentence spacing
      summary = summary.replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2');
      
      // Remove any excessive whitespace
      summary = summary.replace(/\s+/g, ' ').trim();
      
      // Ensure proper paragraph breaks
      summary = summary.split('\n\n').map(para => para.trim()).join('\n\n');

      return summary;
    } catch (error) {
      if (error.name === 'AbortError') {
        if (retries > 0) {
          console.log(`Request timed out. Retrying... (${retries} attempts left)`);
          // Wait for 2 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          return summarizeContent(content, retries - 1);
        }
        throw new Error('Request timed out after multiple attempts. Please try again.');
      }
      throw error;
    }
  } catch (error) {
    console.error('Detailed error in summarizeContent:', error);
    throw error;
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  if (request.action === 'summarize') {
    console.log('Processing summarize request');
    console.log('Content length:', request.content?.length || 0);
    
    summarizeContent(request.content)
      .then(summary => {
        console.log('Summary generated successfully');
        sendResponse({ success: true, summary });
      })
      .catch(error => {
        console.error('Error in message listener:', error);
        sendResponse({ 
          success: false, 
          error: error.message || 'Failed to generate summary. Please try again.' 
        });
      });
    return true; // Will respond asynchronously
  }
}); 