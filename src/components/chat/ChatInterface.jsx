import { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { ApiCarCard } from '@/components/car/ApiCarCard'
import { CarSwiper } from '@/components/car/CarSwiper'
import { ImageSwiper } from '@/components/ui/ImageSwiper'
import { VehicleTrackingMap } from '@/components/ui/VehicleTrackingMap'
import { Send, Bot, User, AlertCircle } from 'lucide-react'

export function ChatInterface({ messages, onSendMessage, isTyping, connectionError }) {
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [inputValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto px-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                <div className="bg-blue-500 text-white p-4 rounded-full mb-6">
                  <Bot className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-medium text-gray-800 mb-2">
                  How can I help you today?
                </h1>
                <p className="text-gray-600 text-sm">
                  Ask me about cars, pricing, features, or anything else.
                </p>
              </div>
            )}
            
            <div className="py-8 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      message.type === 'user' 
                        ? 'bg-gray-700' 
                        : 'bg-blue-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="flex-1 max-w-2xl">
                    {message.type === 'bot' ? (
                      <div className="relative">
                        <MarkdownRenderer 
                          content={message.content} 
                          className="text-[15px] leading-7"
                        />
                        {message.isStreaming && (
                          <div className="inline-flex items-center ml-1">
                            <div className="w-1 h-4 bg-blue-500 animate-pulse"></div>
                          </div>
                        )}
                        
                        {/* Vehicle Images */}
                        {message.vehicleImages && message.vehicleImages.length > 0 && (
                          <div className="mt-4 space-y-4">
                            <div className="text-sm font-medium text-gray-700 mb-3">
                              {message.vehicleImages.length === 1 
                                ? 'Vehicle Image:' 
                                : `Vehicle Images (${message.vehicleImages.length}):`
                              }
                            </div>
                            <ImageSwiper 
                              images={message.vehicleImages} 
                              alt="Vehicle"
                            />
                          </div>
                        )}
                        
                        {/* Vehicle Tracking Map */}
                        {message.mapData && (
                          <div className="mt-4 space-y-4">
                            <div className="text-sm font-medium text-gray-700 mb-3">
                            </div>
                            <VehicleTrackingMap 
                              mapData={message.mapData}
                              title="Vehicle Delivery Tracking"
                            />
                          </div>
                        )}
                        
                        {/* Car Cards */}
                        {message.carData && message.carData.length > 0 && (
                          <div className="mt-4 space-y-4">
                            <div className="text-sm font-medium text-gray-700 mb-3">
                              {message.carData.length === 1 
                                ? 'Here\'s a car that matches your criteria:' 
                                : `Here are ${message.carData.length} cars that match your criteria:`
                              }
                            </div>
                            <CarSwiper 
                              cars={message.carData}
                              onCarInquiry={(carData) => {
                                // Handle car inquiry - send a message about this specific car
                                const inquiryText = `Tell me more about this ${carData.year || ''} ${carData.make || ''} ${carData.model || ''} ${carData.price ? `priced at $${carData.price}` : ''}`.trim();
                                onSendMessage(inquiryText);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-800 text-[15px] leading-7">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={scrollRef} />
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        {/* Connection Error Banner */}
        {connectionError && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Connection Error: {connectionError}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-end bg-gray-50 rounded-lg border border-gray-200 focus-within:border-gray-300 focus-within:bg-white">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Rama DBK..."
                className="flex-1 resize-none border-0 bg-transparent px-4 py-3 text-[15px] placeholder-gray-500 focus:outline-none focus:ring-0"
                style={{
                  minHeight: '24px',
                  maxHeight: '200px',
                  fieldSizing: 'content'
                }}
                rows={1}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim()}
                className="m-2 p-2 h-8 w-8 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 rounded-md transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
