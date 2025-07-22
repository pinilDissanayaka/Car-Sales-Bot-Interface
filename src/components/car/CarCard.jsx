import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Car, Fuel, Calendar, Settings, Heart, MessageSquare } from 'lucide-react'

export function CarCard({ car, onInquire, onFavorite, isFavorite }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={car.image || '/api/placeholder/400/250'}
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 ${
            isFavorite ? 'text-red-500' : 'text-white hover:text-red-500'
          }`}
          onClick={() => onFavorite(car.id)}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
        
        {car.featured && (
          <Badge className="absolute top-2 left-2" variant="default">
            Featured
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            {car.make} {car.model}
          </span>
          <Badge variant="outline">{car.condition}</Badge>
        </CardTitle>
        <div className="text-2xl font-bold text-blue-600">
          {formatPrice(car.price)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span>{car.mileage?.toLocaleString()} miles</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>{car.transmission}</span>
          </div>
        </div>
        
        {car.features && car.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Key Features:</h4>
            <div className="flex flex-wrap gap-1">
              {car.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {car.features.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{car.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <Button 
          className="w-full" 
          onClick={() => onInquire(car)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Ask About This Car
        </Button>
      </CardContent>
    </Card>
  )
}
