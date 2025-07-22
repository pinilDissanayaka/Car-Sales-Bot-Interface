import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApiCarCard } from './ApiCarCard'

export function CarSwiper({ cars, onCarInquiry }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!cars || cars.length === 0) {
    return null
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cars.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cars.length) % cars.length)
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-4">
        {cars.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex-1 overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {cars.map((car, index) => (
              <div key={index} className="w-full flex-shrink-0 px-2">
                <ApiCarCard 
                  carData={car} 
                  onInquire={onCarInquiry}
                />
              </div>
            ))}
          </div>
        </div>
        
        {cars.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="flex-shrink-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {cars.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {cars.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
