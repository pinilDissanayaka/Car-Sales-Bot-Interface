// API service for handling chat requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ChatAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Send a message to the chat API with streaming support
   * @param {string} message - The user message
   * @param {Function} onChunk - Callback for streaming chunks
   * @param {string} threadId - Thread ID for conversation context
   * @returns {Promise<{response: string, carData?: Array}>} - Response with optional car data
   */
  async sendMessage(message, onChunk = null, threadId = "8") {
    try {
      const response = await fetch(`${this.baseURL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          thread_id: threadId,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.trim() === '') continue;
              
              // Handle Server-Sent Events format
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  return { response: fullResponse };
                }
                
                try {
                  const parsed = JSON.parse(data);
                  let content = parsed.choices?.[0]?.delta?.content || 
                               parsed.content || 
                               parsed.response || 
                               parsed.message;
                  
                  // Handle case where the content itself is a JSON string
                  if (typeof content === 'string' && content.startsWith('{')) {
                    try {
                      const nestedParsed = JSON.parse(content);
                      if (nestedParsed.response) {
                        content = nestedParsed.response;
                      }
                    } catch {
                      // If nested parsing fails, use content as is
                    }
                  }
                  
                  if (content) {
                    fullResponse += content;
                    onChunk(content, fullResponse);
                  }
                } catch {
                  // If not JSON, treat as plain text
                  let textData = data;
                  
                  // Check if it's a JSON string that we can parse
                  if (data.startsWith('{')) {
                    try {
                      const parsed = JSON.parse(data);
                      if (parsed.response) {
                        textData = parsed.response;
                      }
                    } catch {
                      // Use original data if parsing fails
                    }
                  }
                  
                  fullResponse += textData;
                  onChunk(textData, fullResponse);
                }
              } else {
                // Handle plain text streaming
                fullResponse += line;
                onChunk(line, fullResponse);
              }
            }
          }
          
          return { response: fullResponse };
        } finally {
          reader.releaseLock();
        }
      }

      // Handle non-streaming response
      const data = await response.json();
      console.log('Full API response:', data); // Debug log

      // Accept object responses even if `response` field is missing.
      if (data && typeof data === 'object') {
        const result = { response: data.response || data.message || data.reply || '' };

        // Extract cars from common locations
        if (data.data && Array.isArray(data.data.cars) && data.data.cars.length > 0) {
          result.carData = data.data.cars;
          console.log('Car data received (data.cars):', data.data.cars.length);
        } else if (Array.isArray(data.carData) && data.carData.length > 0) {
          result.carData = data.carData;
          console.log('Car data received (carData):', data.carData.length);
        } else if (Array.isArray(data.car_data) && data.car_data.length > 0) {
          result.carData = data.car_data;
          console.log('Car data received (car_data):', data.car_data.length);
        }

        if (Array.isArray(data.vehicle_images) && data.vehicle_images.length > 0) {
          result.vehicle_images = data.vehicle_images;
          console.log('Vehicle images received:', data.vehicle_images.length);
        }

        console.log('Final result object:', result); // Debug log
        return result;
      }
      
      // Handle case where the entire response is a JSON string
      if (typeof data === 'string') {
        try {
          const parsedData = JSON.parse(data);
          const result = { response: parsedData.response || parsedData.message || parsedData.reply || '' };

          if (parsedData.data && Array.isArray(parsedData.data.cars) && parsedData.data.cars.length > 0) {
            result.carData = parsedData.data.cars;
            console.log('Car data received from parsed string (data.cars):', parsedData.data.cars.length);
          } else if (Array.isArray(parsedData.carData) && parsedData.carData.length > 0) {
            result.carData = parsedData.carData;
            console.log('Car data received from parsed string (carData):', parsedData.carData.length);
          } else if (Array.isArray(parsedData.car_data) && parsedData.car_data.length > 0) {
            result.carData = parsedData.car_data;
            console.log('Car data received from parsed string (car_data):', parsedData.car_data.length);
          }

          if (Array.isArray(parsedData.vehicle_images) && parsedData.vehicle_images.length > 0) {
            result.vehicle_images = parsedData.vehicle_images;
            console.log('Vehicle images received from parsed string:', parsedData.vehicle_images.length);
          }

          return result;
        } catch {
          // If it's not valid JSON, return as plain text
          return { response: data };
        }
      }
      
      // Fallback for other response formats
      if (data.message || data.reply) {
        return { response: data.message || data.reply };
      } else if (data.data && data.data.response) {
        return { response: data.data.response };
      } else {
        return { response: 'I received your message but couldn\'t process the response properly.' };
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the chat service. Please check if the server is running.');
      } else if (error.message.includes('HTTP error')) {
        throw new Error(`Server error: ${error.message}`);
      } else {
        throw new Error('An unexpected error occurred while sending your message.');
      }
    }
  }

  /**
   * Check if the API is available
   * @returns {Promise<boolean>} - True if API is available
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      return response.ok;
    } catch (error) {
      console.warn('Health check failed:', error);
      return false;
    }
  }

  /**
   * Get the current API base URL
   * @returns {string} - The API base URL
   */
  getBaseURL() {
    return this.baseURL;
  }
}

// Export a singleton instance
export const chatAPI = new ChatAPI();
export default chatAPI;
