import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Car, Fuel, Calendar, MapPin, Phone } from 'lucide-react'

export function ApiCarCard({ carData, onInquire }) {
  if (!carData) return null;

  const BASE_URL = 'http://localhost:8070';

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
    <Card className="car-card w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      {/* Car Image */}
      {image && (
        <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={image}
            alt={`${make} ${model}`}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              // Show a placeholder div instead
              const placeholder = document.createElement('div');
              placeholder.className = 'w-full h-full bg-gray-200 flex items-center justify-center text-gray-500';
              placeholder.innerHTML = '<div class="text-center"><div class="text-lg">🚗</div><div class="text-sm">No Image</div></div>';
              e.target.parentNode.appendChild(placeholder);
            }}
            onLoad={(e) => {
              e.target.style.opacity = '1';
            }}
            style={{ opacity: '0' }}
          />
        </div>
      )}

      <div className="p-4">
        {/* Car Title */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {year} {make} {model}
            </h3>
            {condition && (
              <Badge variant="secondary" className="text-xs mt-1">
                {condition}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">
              {formatPrice(price)}
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className="space-y-2 mb-4">
          {mileage && (
            <div className="flex items-center text-sm text-gray-600">
              <Car className="h-4 w-4 mr-2" />
              <span>{formatMileage(mileage)}</span>
            </div>
          )}
          
          {fuel_type && (
            <div className="flex items-center text-sm text-gray-600">
              <Fuel className="h-4 w-4 mr-2" />
              <span>{fuel_type} • {transmission}</span>
            </div>
          )}

          {location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{location}</span>
            </div>
          )}

          {contact && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{contact}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {description}
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={() => onInquire && onInquire(carData)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Inquire About This Car
        </Button>
      </div>
    </Card>
  );
}
