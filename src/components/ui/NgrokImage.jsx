import { useState, useEffect } from 'react'

export function NgrokImage({ src, alt, className, onError, onLoad, style }) {
  const [imageSrc, setImageSrc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoading(true)
        setHasError(false)
        
        // Check if it's a local image or doesn't need ngrok headers
        if (!src || src.startsWith('data:') || src.startsWith('/api/placeholder') || src.includes('localhost:')) {
          setImageSrc(src)
          onLoad && onLoad()
          setIsLoading(false)
          return
        }
        
        const response = await fetch(src, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'User-Agent': 'Car-Sales-Bot-Interface/1.0'
          }
        })
        
        if (response.ok) {
          const blob = await response.blob()
          const objectUrl = URL.createObjectURL(blob)
          setImageSrc(objectUrl)
          onLoad && onLoad()
        } else {
          throw new Error('Failed to load image')
        }
      } catch (error) {
        console.error('Error loading image:', error)
        setHasError(true)
        onError && onError(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (src) {
      fetchImage()
    }

    // Cleanup object URL on unmount
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc)
      }
    }
  }, [src])

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`} style={style}>
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    )
  }

  if (hasError || !imageSrc) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-500`} style={style}>
        <div className="text-center">
          <div className="text-2xl mb-1">🚗</div>
          <div className="text-sm">Image not found</div>
        </div>
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
    />
  )
}
