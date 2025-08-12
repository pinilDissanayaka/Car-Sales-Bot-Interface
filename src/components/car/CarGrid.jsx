import { useState } from 'react'
import { CarCard } from './CarCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, SlidersHorizontal, Car } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function CarGrid({ cars, onCarInquire }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    make: '',
    priceRange: '',
    year: '',
    condition: ''
  })

  const filteredCars = cars.filter(car => {
    const matchesSearch = searchTerm === '' || 
      `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesMake = selectedFilters.make === '' || car.make === selectedFilters.make
    const matchesCondition = selectedFilters.condition === '' || car.condition === selectedFilters.condition
    
    return matchesSearch && matchesMake && matchesCondition
  })

  const uniqueMakes = [...new Set(cars.map(car => car.make))].sort()
  const conditions = [...new Set(cars.map(car => car.condition))].sort()

  const clearFilters = () => {
    setSelectedFilters({
      make: '',
      priceRange: '',
      year: '',
      condition: ''
    })
    setSearchTerm('')
  }

  const activeFiltersCount = Object.values(selectedFilters).filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cars by make or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Cars</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Make</label>
                <select
                  value={selectedFilters.make}
                  onChange={(e) => setSelectedFilters(prev => ({...prev, make: e.target.value}))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Makes</option>
                  {uniqueMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Condition</label>
                <select
                  value={selectedFilters.condition}
                  onChange={(e) => setSelectedFilters(prev => ({...prev, condition: e.target.value}))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Conditions</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={clearFilters} variant="outline" className="flex-1">
                  Clear Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFilters.make && (
            <Badge variant="secondary">
              Make: {selectedFilters.make}
              <button
                onClick={() => setSelectedFilters(prev => ({...prev, make: ''}))}
                className="ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedFilters.condition && (
            <Badge variant="secondary">
              Condition: {selectedFilters.condition}
              <button
                onClick={() => setSelectedFilters(prev => ({...prev, condition: ''}))}
                className="ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCars.length} of {cars.length} cars
      </div>

      {/* Car Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map(car => (
          <CarCard
            key={car.id}
            car={car}
            onInquire={onCarInquire}
          />
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No cars found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
