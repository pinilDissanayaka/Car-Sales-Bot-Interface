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
  const [threadId] = useState(() => `thread_${Date.now()}`) // Generate unique thread ID

  const addMessage = useCallback((type, content, isStreaming = false, carData = null) => {
    const newMessage = {
      id: Date.now() + Math.random(), // Unique ID for streaming updates
      type,
      content,
      isStreaming,
      carData, // Add car data to message
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }, [])

  const updateMessage = useCallback((messageId, content, isStreaming = false, carData = null) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content, isStreaming, ...(carData && { carData }) }
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
      
      // Show typing indicator
      setIsTyping(true)
      
      // Add initial empty bot message for streaming
      const botMessageId = addMessage('bot', '', true)
      setStreamingMessageId(botMessageId)
      setIsTyping(false) // Hide typing indicator when streaming starts
      
      // Send message to API with streaming (using thread ID for context)
      const botResponse = await chatAPI.sendMessage(
        content, 
        (chunk, fullResponse) => {
          // Update message with streaming content
          updateMessage(botMessageId, fullResponse, true)
        },
        threadId // Pass thread ID for conversation context
      )
      
      console.log('Bot response received:', botResponse);
      
      // Extract response text and car data from the response object
      let responseText = '';
      let carData = null;
      
      if (typeof botResponse === 'string') {
        responseText = botResponse;
      } else if (botResponse.response) {
        // Check if response is a JSON string that needs parsing
        if (typeof botResponse.response === 'string' && botResponse.response.startsWith('{')) {
          try {
            const parsedResponse = JSON.parse(botResponse.response);
            responseText = parsedResponse.response || botResponse.response;
            carData = parsedResponse.car_data || null;
            console.log('Parsed response text:', responseText);
            console.log('Extracted car data:', carData);
          } catch (error) {
            console.warn('Failed to parse response JSON:', error);
            responseText = botResponse.response;
          }
        } else {
          responseText = botResponse.response;
          carData = botResponse.carData || null;
        }
      }
      
      // Handle car data if present
      if (carData && Array.isArray(carData) && carData.length > 0) {
        console.log('Received car data:', carData);
        // Update message with both response text and car data
        updateMessage(botMessageId, responseText, false, carData)
      } else {
        // Mark streaming as complete without car data
        updateMessage(botMessageId, responseText, false)
      }
      
      setStreamingMessageId(null)
      
    } catch (error) {
      setIsTyping(false)
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
    setConnectionError(null)
    setStreamingMessageId(null)
  }, [])

  return {
    messages,
    isTyping,
    connectionError,
    streamingMessageId,
    sendMessage,
    sendCarInquiry,
    clearChat
  }
}
