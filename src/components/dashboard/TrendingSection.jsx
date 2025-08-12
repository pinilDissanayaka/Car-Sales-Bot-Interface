import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Car,
  Search,
  Eye,
  Zap
} from 'lucide-react'

export function TrendingSection({ cars, onCarInquire }) {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  
  // Calculate trending data
  const avgPrice = cars.reduce((sum, car) => sum + car.price, 0) / cars.length
  const popularMakes = cars.reduce((acc, car) => {
    acc[car.make] = (acc[car.make] || 0) + 1
    return acc
  }, {})
  
  const topMake = Object.entries(popularMakes)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'

  // Price segments
  const priceSegments = {
    'Under $25K': cars.filter(car => car.price < 25000).length,
    '$25K - $50K': cars.filter(car => car.price >= 25000 && car.price < 50000).length,
    '$50K+': cars.filter(car => car.price >= 50000).length,
  }

  // Most popular cars (featured ones + random selection)
  const popularCars = [
    ...cars.filter(car => car.featured),
    ...cars.filter(car => !car.featured).slice(0, 3 - cars.filter(car => car.featured).length)
  ].slice(0, 3)

  // Recent additions (simulate by getting newest years)
  const recentAdditions = cars
    .sort((a, b) => b.year - a.year)
    .slice(0, 3)

  const trends = [
    {
      title: 'Average Price',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(avgPrice),
      change: '+5.2%',
      isUp: true,
      description: 'from last month'
    },
    {
      title: 'Most Popular Make',
      value: topMake,
      change: `${popularMakes[topMake] || 0} available`,
      isUp: true,
      description: 'highest demand'
    },
    {
      title: 'Inventory Turnover',
      value: '14 days',
      change: '-2 days',
      isUp: false,
      description: 'average time on lot'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trends.map((trend, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{trend.title}</span>
                  <div className={`flex items-center gap-1 text-xs ${
                    trend.isUp ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {trend.change}
                  </div>
                </div>
                <div className="text-lg font-semibold">{trend.value}</div>
                <div className="text-xs text-muted-foreground">{trend.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            Price Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(priceSegments).map(([range, count]) => (
              <div key={range} className="flex items-center justify-between">
                <span className="font-medium">{range}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / cars.length) * 100}%` }}
                    />
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Cars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Most Popular
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularCars.map((car, index) => (
              <div key={car.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  {index + 1}
                </div>
                <img
                  src={car.image || '/api/placeholder/80/60'}
                  alt={`${car.make} ${car.model}`}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{car.year} {car.make} {car.model}</p>
                  <p className="text-sm text-blue-600">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(car.price)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCarInquire(car)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Additions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-green-500" />
            Recent Additions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAdditions.map((car) => (
              <div key={car.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={car.image || '/api/placeholder/60/45'}
                    alt={`${car.make} ${car.model}`}
                    className="w-12 h-9 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-sm">{car.make} {car.model}</p>
                    <p className="text-xs text-muted-foreground">{car.year} • {car.condition}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCarInquire(car)}
                >
                  <Search className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range Search */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Price Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min price"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Max price"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </div>
            <Button className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Search by Price
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
