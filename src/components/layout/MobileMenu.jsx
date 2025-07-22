import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  X, 
  Home, 
  Car, 
  MessageSquare, 
  Info, 
  Heart, 
  Settings,
  Phone,
  Star
} from 'lucide-react'

export function MobileMenu({ isOpen, onClose, favoriteCount, totalCars }) {
  if (!isOpen) return null

  const menuItems = [
    { icon: Home, label: 'Home', value: 'inventory' },
    { icon: Car, label: 'Inventory', value: 'inventory' },
    { icon: MessageSquare, label: 'Chat with Rama', value: 'chat' },
    { icon: Info, label: 'About', value: 'about' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
      <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-lg">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-3 border-b">
            <Badge variant="outline" className="w-full justify-center">
              <Heart className="h-3 w-3 mr-2 text-red-500" />
              {favoriteCount} Favorites
            </Badge>
            <Badge variant="secondary" className="w-full justify-center">
              <Car className="h-3 w-3 mr-2" />
              {totalCars} Cars Available
            </Badge>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.value}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={onClose}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
              
              <div className="pt-4 border-t mt-4">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-3" />
                  Contact Us
                </Button>
                <Button variant="ghost" className="w-full justify-start mt-2">
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Button>
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium text-sm">Quick Contact</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Call (555) 123-4567 for immediate assistance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
