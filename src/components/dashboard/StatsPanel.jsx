import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Award,
  Zap
} from 'lucide-react'

export function StatsPanel({ cars }) {
  const totalValue = cars.reduce((sum, car) => sum + car.price, 0)
  const avgPrice = totalValue / cars.length
  const newCars = cars.filter(car => car.condition === 'New').length
  const usedCars = cars.filter(car => car.condition === 'Used').length
  const certifiedCars = cars.filter(car => car.condition === 'Certified Pre-Owned').length
  const featuredCars = cars.filter(car => car.featured).length

  const stats = [
    {
      title: 'Total Inventory',
      value: cars.length.toString(),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12 this week'
    },
    {
      title: 'Average Price',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(avgPrice),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: 'Market competitive'
    },
    {
      title: 'Featured Vehicles',
      value: featuredCars.toString(),
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: 'Special deals'
    }
  ]

  const inventoryBreakdown = [
    { label: 'New', count: newCars, color: 'bg-green-500' },
    { label: 'Certified Pre-Owned', count: certifiedCars, color: 'bg-blue-500' },
    { label: 'Used', count: usedCars, color: 'bg-orange-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inventory Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Inventory Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <Badge variant="outline">{item.count}</Badge>
              </div>
            ))}
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Inventory Value</span>
                <span className="font-semibold text-lg">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(totalValue)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Test Drive
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <DollarSign className="h-4 w-4 mr-2" />
            Get Financing Quote
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Speak with Sales Rep
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
