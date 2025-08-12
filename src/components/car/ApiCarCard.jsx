import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Car, Fuel, Calendar, MapPin, Phone } from 'lucide-react'

export function ApiCarCard({ carData, onInquire }) {
  if (!carData) return null;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Handle various possible field names from the API
  const {
    make = carData.brand || carData.manufacturer || 'Unknown',
    model = carData.model_name || carData.name || 'Unknown',
    year = carData.year || carData.model_year || 'N/A',
    price = carData.price || carData.cost || carData.amount,
    mileage = carData.mileage || carData.miles || carData.odometer,
    condition = carData.condition || carData.state || 'Used',
    fuel_type = carData.fuel_type || carData.fuel || carData.engine_type || 'Gasoline',
    transmission = carData.transmission || carData.gearbox || 'Automatic',
    location = carData.location || carData.city || carData.address,
    contact = carData.contact || carData.phone || carData.seller_contact,
    features = carData.features || carData.options || [],
    description = carData.description || carData.details
  } = carData;

  // Handle image URL properly
  const getImageUrl = () => {
    // Check for image_url first (from API)
    if (carData.image_url) {
      return BASE_URL + carData.image_url;
    }
    // Fallback to other image properties
    return carData.image || carData.photo || carData.img_url || null;
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
    <Card className="car-card w-full h-[520px] bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Car Image */}
      <div className="relative h-40 overflow-hidden rounded-t-lg bg-gray-700 flex-shrink-0">
        <img
          src={image}
          alt={`${make} ${model}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/400/250'
          }}
        />
      </div>

      <div className="p-3 flex flex-col flex-grow">
        {/* Car Title */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-white mb-1 leading-tight">
            {year} {make} {model}
          </h3>
          <div className="flex items-center justify-between">
            {condition && (
              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                {condition}
              </Badge>
            )}
            <div className="text-lg font-bold text-red-400 ml-auto">
              {formatPrice(price)}
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className="space-y-1.5 mb-3 flex-grow">
          {mileage && (
            <div className="flex items-center text-sm text-gray-300">
              <Car className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span className="truncate">{formatMileage(mileage)}</span>
            </div>
          )}
          
          {fuel_type && (
            <div className="flex items-center text-sm text-gray-300">
              <Fuel className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span className="truncate">{fuel_type} • {transmission}</span>
            </div>
          )}

          {location && (
            <div className="flex items-center text-sm text-gray-300">
              <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-300 mb-1">Features</h4>
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5 border-gray-600 text-gray-300">
                  {feature}
                </Badge>
              ))}
              {features.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-gray-600 text-gray-300">
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
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 px-3 h-auto font-medium rounded-md"
          >
            Inquire About Car
          </Button>
        </div>
      </div>
    </Card>
  );
}
