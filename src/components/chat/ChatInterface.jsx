
import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { ApiCarCard } from '@/components/car/ApiCarCard';
import { CarSwiper } from '@/components/car/CarSwiper';
import { ImageSwiper } from '@/components/ui/ImageSwiper';
import { VehicleTrackingMap } from '@/components/ui/VehicleTrackingMap';
import { Send, Bot, AlertCircle } from 'lucide-react';

export function ChatInterface({ messages, onSendMessage, isTyping, connectionError }) {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-red-800 px-4 sm:px-6 py-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-2 rounded-lg">

            </div>
            <div>

            </div>
          </div>
          <div className="flex items-center gap-2 bg-red-900/30 border border-red-800 px-3 py-2 rounded-lg">

          </div>
        </div>
      </div>

      {/* ScrollArea (Messages) */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
                <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6 rounded-2xl shadow-xl mb-6">
                  <div className="h-12 w-12 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-lg font-bold">RAMA DBK</span>
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Welcome to RAMA DBK Motors
                </h2>
                <p className="text-gray-400 mb-4 max-w-md text-sm sm:text-base">
                  Your trusted Japanese car exporter.
                </p>
                <div className="bg-red-900/30 border border-red-800 p-3 sm:p-4 rounded-lg mb-6 max-w-sm">
                  <div className="flex items-center gap-2 text-red-300 text-sm sm:text-lg font-bold">
                    📞 +81-45-402-6117
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Call us for immediate assistance</p>
                </div>
                <div className="grid grid-cols-1 gap-3 max-w-lg">
                  <button
                    onClick={() => onSendMessage("What financing options do you have?")}
                    className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all text-left"
                  >
                    <AlertCircle className="h-4 w-4 mb-1 text-red-400" />
                    <div className="text-sm font-medium">Financing</div>
                    <div className="text-xs text-gray-500">Learn about options</div>
                  </button>
                </div>
              </div>
            )}
            
            <div className="py-8 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 sm:gap-4 ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      message.type === 'user' 
                        ? 'bg-gray-700 border border-gray-600' 
                        : 'bg-gradient-to-br from-red-600 to-red-800 border border-red-500'
                    }`}>
                      {message.type === 'user' ? (
                        <span className="text-sm">U</span>
                      ) : (
                        <span className="text-xs">RAMA DBK</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="flex-1 max-w-full sm:max-w-2xl">
                    {message.type === 'bot' ? (
                      <div className="relative">
                        <MarkdownRenderer 
                          content={message.content} 
                          className="text-sm sm:text-[15px] leading-6 sm:leading-7 text-gray-200"
                        />
                        {message.isStreaming && (
                          <div className="inline-flex items-center ml-1">
                            <div className="w-1 h-4 bg-red-400 animate-pulse"></div>
                          </div>
                        )}
                        
                        {/* Vehicle Images */}
                        {message.vehicleImages && message.vehicleImages.length > 0 && (
                          <div className="mt-4 space-y-4">
                            <div className="text-sm font-medium text-gray-300 mb-3">
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
                            <div className="text-sm font-medium text-gray-300 mb-3">
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
                            <div className="text-sm font-medium text-gray-300 mb-3">
                              {message.carData.length === 1 
                                ? 'Here\'s a car that matches your criteria:' 
                                : `Here are ${message.carData.length} cars that match your criteria:`
                              }
                            </div>
                            <CarSwiper 
                              cars={message.carData}
                              onCarInquiry={(carData) => {
                                console.log('Rendering CarSwiper with cars:', message.carData);
                                const inquiryText = `Tell me more about this ${carData.year || ''} ${carData.make || ''} ${carData.model || ''} ${carData.base_price ? `priced at $${carData.base_price}` : carData.price ? `priced at $${carData.price}` : ''}`.trim();
                                onSendMessage(inquiryText);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-200 text-sm sm:text-[15px] leading-6 sm:leading-7 bg-gray-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-700">
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4 agent-working-message">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 border border-red-500 rounded-full flex items-center justify-center text-white pulse-animation">
                      <span className="text-xs font-bold">RAMA DBK</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 max-w-md shadow-lg">
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-sm font-medium">Our agent is working on your request...</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Please wait while we process your inquiry</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={scrollRef} />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Area (Chat Bubble) */}
      <div className="border-t border-red-800 bg-black">
        {/* Connection Error Banner */}
        {connectionError && (
          <div className="bg-red-900/50 border-b border-red-800 px-4 py-2">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-red-300 text-xs sm:text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">Connection Error: {connectionError}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-end bg-gray-800 rounded-lg border border-red-700 focus-within:border-red-600 focus-within:bg-gray-800">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message RAMA DBK Motors..."
                className="flex-1 resize-none border-0 bg-transparent px-4 py-3 text-sm sm:text-base text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-0"
                style={{
                  minHeight: '24px',
                  maxHeight: '200px',
                  fieldSizing: 'content',
                }}
                rows={1}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim()}
                className="m-2 p-2 h-8 w-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-md transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}