import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Car, Fuel, Calendar, MapPin, Phone } from 'lucide-react'

export function ApiCarCard({ carData, onInquire }) {
  if (!carData) return null;

  // Debug log to see the car data structure
  console.log('ApiCarCard received carData:', carData);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Handle various possible field names from the API
  const {
    id = carData.id,
    make = carData.make || carData.brand || carData.manufacturer || 'Unknown',
    model = carData.model || carData.model_name || carData.name || 'Unknown',
    year = carData.year || carData.model_year || 'N/A',
    price = carData.base_price || carData.price || carData.cost || carData.amount,
    color = carData.color || carData.colour,
    mileage = carData.mileage || carData.miles || carData.odometer,
    condition = carData.condition || carData.state || 'Used',
    fuel_type = carData.fuel_type || carData.fuel || carData.engine_type || 'Gasoline',
    transmission = carData.transmission || carData.gearbox || 'Automatic',
    location = carData.location || carData.city || carData.address,
    contact = carData.contact || carData.phone || carData.seller_contact,
    features = carData.features || carData.options || [],
    description = carData.description || carData.details,
    created_at = carData.created_at
  } = carData;

  // Handle image URL properly
  const getImageUrl = () => {
    // Check for direct image URL (from your new API format)
    if (carData.image) {
      return carData.image;
    }
    // Check for image_url with BASE_URL (legacy format)
    if (carData.image_url) {
      return BASE_URL + carData.image_url;
    }
    // Fallback to other image properties
    return carData.photo || carData.img_url || null;
  };

  const image = getImageUrl();

  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatMileage = (miles) => {
    if (!miles) return null;
    const numMiles = typeof miles === 'string' ? parseInt(miles.replace(/[^0-9]/g, '')) : miles;
    return numMiles.toLocaleString() + ' miles';
  };

  return (
    <Card className="car-card car-card-enter w-full h-[520px] flex flex-col">
      {/* Car Image */}
      <div className="relative h-40 overflow-hidden rounded-t-lg bg-gray-700 flex-shrink-0">
        <img
          src={image}
          alt={`${make} ${model}`}
          className="w-full h-full object-cover transition-all duration-400"
          onError={(e) => {
            e.target.src = '/api/placeholder/400/250'
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Car Title */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
            {year} {make} {model}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {condition && (
                <Badge className="car-badge text-xs">
                  {condition}
                </Badge>
              )}
              {color && (
                <Badge className="feature-badge text-xs">
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Badge>
              )}
            </div>
            <div className="text-xl font-bold car-price ml-auto">
              {formatPrice(price)}
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className="space-y-2 mb-4 flex-grow">
          {mileage && (
            <div className="flex items-center text-sm text-gray-300">
              <Car className="h-4 w-4 mr-3 flex-shrink-0 text-blue-400" />
              <span className="truncate">{formatMileage(mileage)}</span>
            </div>
          )}
          
          {fuel_type && (
            <div className="flex items-center text-sm text-gray-300">
              <Fuel className="h-4 w-4 mr-3 flex-shrink-0 text-blue-400" />
              <span className="truncate">{fuel_type} • {transmission}</span>
            </div>
          )}

          {location && (
            <div className="flex items-center text-sm text-gray-300">
              <MapPin className="h-4 w-4 mr-3 flex-shrink-0 text-blue-400" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-200 mb-2">Features</h4>
            <div className="flex flex-wrap gap-2">
              {features.slice(0, 2).map((feature, index) => (
                <Badge key={index} className="feature-badge text-xs">
                  {feature}
                </Badge>
              ))}
              {features.length > 2 && (
                <Badge className="feature-badge text-xs">
                  +{features.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Button - Fixed at bottom */}
        <div className="mt-auto pt-2">
          <Button 
            onClick={() => onInquire && onInquire(carData)}
            className="car-action-btn w-full text-sm py-3 px-4 h-auto font-medium rounded-lg"
          >
            Inquire About Car
          </Button>
        </div>
      </div>
    </Card>
  );
}
