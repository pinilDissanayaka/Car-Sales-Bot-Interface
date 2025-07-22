import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Car, 
  Heart, 
  Settings, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  Menu
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function Header({ favoriteCount, totalCars, onMenuToggle }) {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2.5 rounded-lg shadow-lg">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Rama DBK
              </h1>
              <p className="text-sm text-gray-600">Your AI Car Sales Assistant</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Badge variant="outline" className="text-sm hover:bg-blue-50">
              <Heart className="h-3 w-3 mr-1 text-red-500" />
              {favoriteCount} Favorites
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Car className="h-3 w-3 mr-1" />
              {totalCars} Cars Available
            </Badge>
            
            {/* Contact Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Rama DBK</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Call Us</p>
                        <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">sales@ramadbk.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Visit Us</p>
                        <p className="text-sm text-muted-foreground">123 Car Avenue, Auto City, AC 12345</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-blue-900">Hours</span>
                    </div>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                      <p>Saturday: 9:00 AM - 6:00 PM</p>
                      <p>Sunday: 12:00 PM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* User Avatar */}
            <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                U
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={onMenuToggle}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
