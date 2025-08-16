import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApiCarCard } from './ApiCarCard'

export function CarSwiper({ cars, onCarInquiry }) {
  console.log('CarSwiper received cars:', cars); // Debug log
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [carsPerView, setCarsPerView] = useState(3)
  const swiperRef = useRef(null)

  if (!cars || cars.length === 0) {
    console.log('CarSwiper: No cars to display'); // Debug log
    return null
  }

  // Update cars per view based on screen size
  useEffect(() => {
    const updateCarsPerView = () => {
      const width = window.innerWidth
      if (width < 768) {
        setCarsPerView(1) // Mobile: 1 car
      } else if (width < 1024) {
        setCarsPerView(2) // Tablet: 2 cars
      } else {
        setCarsPerView(3) // Desktop: 3 cars
      }
    }

    updateCarsPerView()
    window.addEventListener('resize', updateCarsPerView)
    return () => window.removeEventListener('resize', updateCarsPerView)
  }, [])

  // Reset currentIndex when carsPerView changes to prevent out-of-bounds
  useEffect(() => {
    const newMaxIndex = Math.max(0, cars.length - carsPerView)
    if (currentIndex > newMaxIndex) {
      setCurrentIndex(newMaxIndex)
    }
  }, [carsPerView, cars.length, currentIndex])

  const maxIndex = Math.max(0, cars.length - carsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (cars.length <= carsPerView) return 0
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (cars.length <= carsPerView) return 0
      return prev <= 0 ? maxIndex : prev - 1
    })
  }

  // Handle touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && cars.length > carsPerView) {
      nextSlide()
    }
    if (isRightSwipe && cars.length > carsPerView) {
      prevSlide()
    }
  }

  // Auto-play functionality (optional)
  useEffect(() => {
    if (isAutoPlaying && cars.length > carsPerView) {
      const interval = setInterval(nextSlide, 4000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, cars.length])

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="flex items-stretch gap-2 md:gap-4">
        {/* Previous Button */}
        {cars.length > carsPerView && (
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="flex-shrink-0 h-10 w-10 p-0 z-10 shadow-md hover:shadow-lg transition-shadow self-center bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300"
            disabled={cars.length <= carsPerView}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        {/* Swiper Container */}
        <div 
          className="flex-1 overflow-hidden rounded-lg relative"
          ref={swiperRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left gradient overlay to indicate more content */}
          {cars.length > carsPerView && currentIndex > 0 && (
            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
          )}
          
          {/* Right gradient overlay to indicate more content */}
          {cars.length > carsPerView && currentIndex < maxIndex && (
            <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />
          )}
          
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / carsPerView)}%)`,
              height: '540px' // Fixed height for consistent card display
            }}
          >
            {cars.map((car, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 px-2 h-full"
                style={{ width: `${100 / carsPerView}%` }}
              >
                <ApiCarCard 
                  carData={car} 
                  onInquire={onCarInquiry}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Next Button */}
        {cars.length > carsPerView && (
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="flex-shrink-0 h-10 w-10 p-0 z-10 shadow-md hover:shadow-lg transition-shadow self-center bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300"
            disabled={cars.length <= carsPerView}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Dots Indicator */}
      {cars.length > carsPerView && (
        <div className="flex justify-center mt-3 gap-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-red-500 w-4' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Car counter for multiple cars */}
      <div className="text-center mt-2">
        {cars.length > carsPerView ? (
          <span className="text-xs text-gray-400">
            Showing {currentIndex + 1}-{Math.min(currentIndex + carsPerView, cars.length)} of {cars.length} cars
          </span>
        ) : (
          <span className="text-xs text-gray-400">
            {cars.length} {cars.length === 1 ? 'car' : 'cars'}
          </span>
        )}
      </div>
    </div>
  )
}
