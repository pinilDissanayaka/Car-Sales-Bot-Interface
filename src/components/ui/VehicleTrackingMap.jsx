import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Truck, Target } from 'lucide-react'

export function VehicleTrackingMap({ mapData, title = "Vehicle Tracking" }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    const loadLeaflet = async () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        initializeMap()
        return
      }

      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://unpkg.com/leaflet/dist/leaflet.css'
        document.head.appendChild(cssLink)
      }

      // Load Leaflet JS
      if (!document.querySelector('script[src*="leaflet.js"]')) {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet/dist/leaflet.js'
        script.onload = () => {
          initializeMap()
        }
        document.head.appendChild(script)
      } else {
        initializeMap()
      }
    }

    loadLeaflet()

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [mapData])

  const initializeMap = () => {
    if (!mapRef.current || !mapData || !window.L) return

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
    }

    // Extract coordinates from map data - handle both nested and direct structure
    const mapDataSource = mapData.map_data || mapData
    const { dispatch, current, dest } = mapDataSource

    if (!dispatch || !current || !dest) {
      console.error('Invalid map data structure:', mapDataSource)
      return
    }

    // Create map and fit bounds to show all locations
    const map = window.L.map(mapRef.current).fitBounds([
      [dispatch.lat, dispatch.lon],
      [current.lat, current.lon],
      [dest.lat, dest.lon]
    ])

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // Custom icons
    const dispatchIcon = window.L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    })

    const currentIcon = window.L.divIcon({
      html: '<div style="font-size: 20px; text-align: center;">🚛</div>',
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    })

    const destIcon = window.L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    })

    // Add markers
    window.L.marker([dispatch.lat, dispatch.lon], { icon: dispatchIcon })
      .bindPopup('<strong>🚩 Dispatch Origin</strong><br/>Tokyo, Japan')
      .addTo(map)

    window.L.marker([current.lat, current.lon], { icon: currentIcon })
      .bindPopup('<strong>📍 Current Location</strong><br/>Osaka, Japan<br/><em>Vehicle in Transit</em>')
      .addTo(map)

    window.L.marker([dest.lat, dest.lon], { icon: destIcon })
      .bindPopup('<strong>🏁 Destination</strong><br/>Colombo, Sri Lanka')
      .addTo(map)

    // Draw route line
    window.L.polyline([
      [dispatch.lat, dispatch.lon],
      [current.lat, current.lon],
      [dest.lat, dest.lon]
    ], {
      color: '#3b82f6',
      weight: 3,
      opacity: 0.7,
      dashArray: '10,5'
    }).addTo(map)

    mapInstanceRef.current = map
  }

  if (!mapData) {
    return null
  }

  const mapDataSource = mapData.map_data || mapData
  const { dispatch, current, dest } = mapDataSource

  if (!dispatch || !current || !dest) {
    return null
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Origin</p>
              <p className="text-xs text-green-600">Tokyo, Japan</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Current</p>
              <p className="text-xs text-blue-600">Osaka, Japan</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">Destination</p>
              <p className="text-xs text-red-600">Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div 
          ref={mapRef} 
          className="w-full h-80 rounded-lg border border-gray-200"
          style={{ minHeight: '320px' }}
        />
        
        {/* Coordinates Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Dispatch:</strong> {dispatch.lat.toFixed(6)}°N, {dispatch.lon.toFixed(6)}°E</p>
          <p><strong>Current:</strong> {current.lat.toFixed(6)}°N, {current.lon.toFixed(6)}°E</p>
          <p><strong>Destination:</strong> {dest.lat.toFixed(6)}°N, {dest.lon.toFixed(6)}°E</p>
        </div>
      </CardContent>
    </Card>
  )
}
