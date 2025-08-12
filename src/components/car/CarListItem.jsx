import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Car, 
  Fuel, 
  Calendar, 
  Settings, 
  MessageSquare,
  Eye,
  Phone,
  MapPin,
  Star
} from 'lucide-react'

export function CarListItem({ car, onInquire }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="md:flex">
        {/* Image Section */}
        <div className="relative md:w-64 md:flex-shrink-0">
          <img
            src={car.image || '/api/placeholder/400/250'}
            alt={`${car.make} ${car.model}`}
            className="w-full h-48 md:h-full object-cover"
          />
          
          {car.featured && (
            <Badge className="absolute top-2 left-2" variant="default">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            {/* Main Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {car.year} {car.make} {car.model}
                </h3>
                <Badge variant="outline">{car.condition}</Badge>
              </div>
              
              <div className="text-2xl font-bold text-red-600">
                {formatPrice(car.price)}
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{car.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>{car.mileage?.toLocaleString()} mi</span>
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

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Key Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {car.features.slice(0, 4).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {car.features.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{car.features.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 lg:min-w-48">
              <Button 
                className="w-full" 
                onClick={() => onInquire(car)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask About This Car
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>

              <Button variant="ghost" size="sm" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                Schedule Test Drive
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
