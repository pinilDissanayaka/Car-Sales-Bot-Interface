import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export function ImageSwiper({ images, alt = "Vehicle image" }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  if (!images || images.length === 0) {
    return null
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getImageUrl = (imagePath) => {
    return BASE_URL + imagePath
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main image display */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div className="aspect-[4/3] relative">
          <img
            src={getImageUrl(images[currentIndex])}
            alt={`${alt} ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/api/placeholder/400/300'
            }}
          />
          
          {/* Zoom button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-2">
              <img
                src={getImageUrl(images[currentIndex])}
                alt={`${alt} ${currentIndex + 1} - Full size`}
                className="w-full h-auto max-h-[80vh] object-contain"
                onError={(e) => {
                  e.target.src = '/api/placeholder/800/600'
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Navigation arrows - only show if more than 1 image */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail navigation - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="flex justify-center mt-3 gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden transition-all ${
                index === currentIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`${alt} ${index + 1} thumbnail`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/64/48'
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
