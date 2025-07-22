import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  SortAsc, 
  Grid, 
  List,
  Star,
  DollarSign,
  Calendar,
  Fuel,
  X
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function FilterPanel({ 
  cars, 
  onFilterChange, 
  searchTerm, 
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange 
}) {
  const [filters, setFilters] = useState({
    make: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    condition: '',
    fuelType: '',
    transmission: '',
    featured: false
  })

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const makes = [...new Set(cars.map(car => car.make))].sort()
  const conditions = [...new Set(cars.map(car => car.condition))].sort()
  const fuelTypes = [...new Set(cars.map(car => car.fuelType))].sort()
  const transmissions = [...new Set(cars.map(car => car.transmission))].sort()

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      make: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      condition: '',
      fuelType: '',
      transmission: '',
      featured: false
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
    onSearchChange('')
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== false
  ).length + (searchTerm ? 1 : 0)

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High', icon: DollarSign },
    { value: 'price-desc', label: 'Price: High to Low', icon: DollarSign },
    { value: 'year-desc', label: 'Year: Newest First', icon: Calendar },
    { value: 'year-asc', label: 'Year: Oldest First', icon: Calendar },
    { value: 'mileage-asc', label: 'Mileage: Low to High', icon: Fuel },
    { value: 'mileage-desc', label: 'Mileage: High to Low', icon: Fuel },
  ]

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-500" />
            Search & Filter
          </span>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by make, model, or features..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => onSearchChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick Filters & Actions Row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Quick Filter Buttons */}
          <Button
            variant={filters.featured ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange('featured', !filters.featured)}
          >
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Button>

          <select
            value={filters.make}
            onChange={(e) => handleFilterChange('make', e.target.value)}
            className="px-3 py-1.5 text-sm border border-border rounded-md bg-background"
          >
            <option value="">All Makes</option>
            {makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>

          <select
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            className="px-3 py-1.5 text-sm border border-border rounded-md bg-background"
          >
            <option value="">All Conditions</option>
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>

          {/* Advanced Filters Dialog */}
          <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="h-3 w-3 mr-1" />
                Advanced
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="filters" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="filters">Filters</TabsTrigger>
                  <TabsTrigger value="sort">Sort</TabsTrigger>
                </TabsList>
                
                <TabsContent value="filters" className="space-y-4">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Year Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Year Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={filters.yearMin}
                        onChange={(e) => handleFilterChange('yearMin', e.target.value)}
                        className="px-3 py-2 border border-border rounded-md text-sm bg-background"
                      >
                        <option value="">Min year</option>
                        {years.reverse().map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <select
                        value={filters.yearMax}
                        onChange={(e) => handleFilterChange('yearMax', e.target.value)}
                        className="px-3 py-2 border border-border rounded-md text-sm bg-background"
                      >
                        <option value="">Max year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Fuel Type & Transmission */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fuel Type</label>
                      <select
                        value={filters.fuelType}
                        onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                      >
                        <option value="">Any</option>
                        {fuelTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Transmission</label>
                      <select
                        value={filters.transmission}
                        onChange={(e) => handleFilterChange('transmission', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                      >
                        <option value="">Any</option>
                        {transmissions.map(trans => (
                          <option key={trans} value={trans}>{trans}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sort" className="space-y-4">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => {
                        onSortChange(option.value)
                        setIsAdvancedOpen(false)
                      }}
                    >
                      <option.icon className="h-4 w-4 mr-2" />
                      {option.label}
                    </Button>
                  ))}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          {/* View Mode Toggle */}
          <div className="ml-auto flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none border-0"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none border-0"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Clear All Button */}
          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filter Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                Search: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === false) return null
              
              const displayValue = typeof value === 'boolean' ? key : `${key}: ${value}`
              return (
                <Badge key={key} variant="secondary" className="text-xs">
                  {displayValue}
                  <button
                    onClick={() => handleFilterChange(key, key === 'featured' ? false : '')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
