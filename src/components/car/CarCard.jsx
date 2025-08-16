import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Car, Fuel, Calendar, Settings, MessageSquare } from 'lucide-react'

export function CarCard({ car, onInquire }) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const getImageUrl = (car) => {
    // If car has image_url property (from API), construct full URL
    if (car.image_url) {
      const fullUrl = BASE_URL + car.image_url;
      console.log('Using car.image_url:', fullUrl);
      return fullUrl;
    }
    // Fallback to existing image property or placeholder
    return car.image || '/api/placeholder/400/250';
  }

  return (
    <Card className="car-card car-card-enter overflow-hidden transition-all duration-300">
      <div className="relative">
        <img
          src={getImageUrl(car)}
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover transition-all duration-400"
          onError={(e) => {
            e.target.src = '/api/placeholder/400/250'
          }}
        />
        
        {car.featured && (
          <Badge className="absolute top-2 left-2 car-badge" variant="default">
            Featured
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold text-white">
            {car.make} {car.model}
          </span>
          <Badge variant="outline" className="car-badge">{car.condition}</Badge>
        </CardTitle>
        <div className="text-2xl font-bold car-price">
          {formatPrice(car.price)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Car className="h-4 w-4 text-blue-400" />
            <span>{car.mileage?.toLocaleString()} miles</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Fuel className="h-4 w-4 text-blue-400" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Settings className="h-4 w-4 text-blue-400" />
            <span>{car.transmission}</span>
          </div>
        </div>
        
        {car.features && car.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-200">Key Features:</h4>
            <div className="flex flex-wrap gap-2">
              {car.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} className="feature-badge text-xs">
                  {feature}
                </Badge>
              ))}
              {car.features.length > 3 && (
                <Badge className="feature-badge text-xs">
                  +{car.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <Button 
          className="car-action-btn w-full mt-auto" 
          onClick={() => onInquire(car)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Ask About This Car
        </Button>
      </CardContent>
    </Card>
  )
}
