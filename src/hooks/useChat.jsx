import { useState, useCallback } from 'react'
import { chatAPI } from '@/services/chatAPI'

export function useChat() {
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      type: 'bot',
      content: 'Hello! I\'m Rama DBK, your car sales assistant. How can I help you find your perfect car today?',
      isStreaming: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const [streamingMessageId, setStreamingMessageId] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [threadId] = useState(() => `thread_${Date.now()}`) // Generate unique thread ID

  const addMessage = useCallback((type, content, isStreaming = false, carData = null, vehicleImages = null, mapData = null) => {
    const newMessage = {
      id: Date.now() + Math.random(), // Unique ID for streaming updates
      type,
      content,
      isStreaming,
      carData, // Add car data to message
      vehicleImages, // Add vehicle images to message
      mapData, // Add map data to message
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }, [])

  const updateMessage = useCallback((messageId, content, isStreaming = false, carData = null, vehicleImages = null, mapData = null) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              content, 
              isStreaming, 
              ...(carData && { carData }),
              ...(vehicleImages && { vehicleImages }),
              ...(mapData && { mapData })
            }
          : msg
      )
    )
  }, [])

  const sendMessage = useCallback(async (content) => {
    try {
      // Clear any previous connection errors
      setConnectionError(null)
      
      // Add user message
      addMessage('user', content)
      
      // Show typing indicator with processing message
      setIsTyping(true)
      setIsProcessing(true)
      
      // Add initial empty bot message for streaming
      const botMessageId = addMessage('bot', '', true)
      setStreamingMessageId(botMessageId)
      
      // Keep typing indicator for a minimum duration to show "working" message
      setTimeout(() => {
        setIsTyping(false)
      }, 1500) // Show for 1.5 seconds minimum
      
      // Send message to API with streaming (using thread ID for context)
      const botResponse = await chatAPI.sendMessage(
        content, 
        (chunk, fullResponse) => {
          // Update message with streaming content
          updateMessage(botMessageId, fullResponse, true)
          // Hide typing once we start receiving content
          setIsTyping(false)
        },
        threadId // Pass thread ID for conversation context
      )
      
      console.log('Bot response received:', botResponse);

      // Extract response text, car data, and vehicle images from the response object
      let responseText = '';
      let carData = null;
      let vehicleImages = null;
      let mapData = null;

      // Helper to try extracting cars from various shapes
      const extractCarsFromObject = (obj) => {
        if (!obj || typeof obj !== 'object') return null;
        
        let cars = null;
        if (Array.isArray(obj.carData)) cars = obj.carData;
        else if (Array.isArray(obj.car_data)) cars = obj.car_data;
        // some APIs return cars directly under `data` as an array
        else if (Array.isArray(obj.data)) cars = obj.data;
        else if (Array.isArray(obj.cars)) cars = obj.cars;
        else if (obj.data && Array.isArray(obj.data.cars)) cars = obj.data.cars;
        // other possible shapes
        else if (Array.isArray(obj.results)) cars = obj.results;
        
        // Only return cars if the array is not empty
        return (cars && cars.length > 0) ? cars : null;
      };

      if (typeof botResponse === 'string') {
        // try to parse JSON string responses that embed structured data
        const trimmed = botResponse.trim();
        if (trimmed.startsWith('{')) {
          try {
            const parsed = JSON.parse(trimmed);
            carData = extractCarsFromObject(parsed);
            vehicleImages = parsed.vehicle_images || parsed.vehicleImages || null;
            mapData = parsed.map_data || parsed.mapData || null;
            
            // If we have car data, use a clean message
            if (carData && Array.isArray(carData) && carData.length > 0) {
              responseText = carData.length === 1 ? "Here's a car I found for you:" : `Here are ${carData.length} cars I found for you:`;
            } else {
              // Only show the response parameter, exclude thread_id and other metadata
              responseText = parsed.response || parsed.message || parsed.reply || '';
            }
          } catch (err) {
            // not JSON, treat as plain text
            responseText = botResponse;
          }
        } else {
          responseText = botResponse;
        }
      } else if (botResponse && typeof botResponse === 'object') {
        // botResponse is already an object
        // First try to extract car data from the response
        carData = extractCarsFromObject(botResponse) || null;
        vehicleImages = botResponse.vehicle_images || botResponse.vehicleImages || null;
        mapData = botResponse.map_data || botResponse.mapData || null;

        // If we have car data, use a clean message
        if (carData && Array.isArray(carData) && carData.length > 0) {
          responseText = carData.length === 1 ? "Here's a car I found for you:" : `Here are ${carData.length} cars I found for you:`;
        } else {
          // Show the original response text when no car data is found
          responseText = botResponse.response || botResponse.message || botResponse.reply || '';
        }

        // If response text itself is a JSON string, try to parse nested data
        if (!carData && typeof botResponse.response === 'string' && botResponse.response.trim().startsWith('{')) {
          try {
            const nested = JSON.parse(botResponse.response.trim());
            carData = extractCarsFromObject(nested) || carData;
            vehicleImages = vehicleImages || nested.vehicle_images || nested.vehicleImages || null;
            mapData = mapData || nested.map_data || nested.mapData || null;
            
            // If we found car data in nested JSON, use clean message
            if (carData && Array.isArray(carData) && carData.length > 0) {
              responseText = carData.length === 1 ? "Here's a car I found for you:" : `Here are ${carData.length} cars I found for you:`;
            } else {
              // Only use the nested response if the data object is empty or doesn't exist
              const hasEmptyData = !nested.data || (typeof nested.data === 'object' && Object.keys(nested.data).length === 0);
              if (hasEmptyData) {
                // Only show the response parameter, exclude thread_id and other metadata
                responseText = nested.response || nested.message || nested.reply || '';
              }
            }
          } catch (err) {
            // ignore parse errors
          }
        }

        // Fallback: if nothing found, try data.response
        if (!carData && !responseText && botResponse.data && typeof botResponse.data.response === 'string') {
          responseText = botResponse.data.response;
          const dataCars = Array.isArray(botResponse.data.cars) && botResponse.data.cars.length > 0 ? botResponse.data.cars : null;
          carData = carData || dataCars;
          
          // If we found car data, use clean message
          if (carData && Array.isArray(carData) && carData.length > 0) {
            responseText = carData.length === 1 ? "Here's a car I found for you:" : `Here are ${carData.length} cars I found for you:`;
          }
        }

        console.log('Parsed responseText and extracted car/aux data:', { responseText, carData, vehicleImages, mapData });
      }
      
      // Handle car data, vehicle images, and map data if present
      if (carData && Array.isArray(carData) && carData.length > 0) {
        console.log('Received car data:', carData);
        // Update message with response text, car data, vehicle images, and map data
        updateMessage(botMessageId, responseText, false, carData, vehicleImages, mapData)
      } else if (vehicleImages && Array.isArray(vehicleImages) && vehicleImages.length > 0) {
        console.log('Received vehicle images:', vehicleImages);
        // Update message with response text, vehicle images, and map data
        updateMessage(botMessageId, responseText, false, null, vehicleImages, mapData)
      } else if (mapData) {
        console.log('Received map data:', mapData);
        // Update message with response text and map data only
        updateMessage(botMessageId, responseText, false, null, null, mapData)
      } else {
        // Mark streaming as complete without additional data
        // Only show response if it has meaningful content
        const finalResponseText = responseText || "I received your message.";
        updateMessage(botMessageId, finalResponseText, false)
      }
      
      setStreamingMessageId(null)
      setIsProcessing(false)
      
    } catch (error) {
      setIsTyping(false)
      setIsProcessing(false)
      setStreamingMessageId(null)
      setConnectionError(error.message)
      
      // Add error message to chat
      addMessage('bot', `Sorry, I'm having trouble connecting to the server right now. ${error.message} Please try again in a moment.`)
    }
  }, [addMessage, updateMessage, threadId])

  const sendCarInquiry = useCallback(async (car) => {
    const inquiryMessage = `Tell me more about the ${car.year} ${car.make} ${car.model}`
    await sendMessage(inquiryMessage)
  }, [sendMessage])

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        content: 'Hello! I\'m Rama DBK, your car sales assistant. How can I help you find your perfect car today?',
        isStreaming: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
    setIsTyping(false)
    setIsProcessing(false)
    setConnectionError(null)
    setStreamingMessageId(null)
  }, [])

  return {
    messages,
    isTyping,
    isProcessing,
    connectionError,
    streamingMessageId,
    sendMessage,
    sendCarInquiry,
    clearChat
  }
}
