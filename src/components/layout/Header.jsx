import { Button } from '@/components/ui/button'
import { 
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

export function Header({ onMenuToggle }) {
  return (
    <header className="border-b border-gray-800 bg-black backdrop-blur supports-[backdrop-filter]:bg-black/80 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Branding with Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <img 
              src="/rama-logo.png" 
              alt="RAMA DBK" 
              className="h-8 sm:h-10 w-auto"
              onError={(e) => {
                // If the image fails to load, try alternative paths or hide
                e.target.style.display = 'none'
              }}
            />
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white">
                RAMA DBK 
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">Japanese Car Exporter</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Contact Number Display - Highlighted */}
            <div className="flex items-center gap-2 text-white bg-red-900/30 px-3 lg:px-4 py-1 lg:py-2 rounded-lg border border-red-800">
              <Phone className="h-4 lg:h-5 w-4 lg:w-5 text-red-400" />
              <span className="text-sm lg:text-lg font-bold">+81-45-402-6117</span>
            </div>
            
            {/* Contact Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-gray-800 text-gray-100">
                <DialogHeader>
                  <DialogTitle className="text-white">Contact RAMA DBK Motors</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="font-medium text-white">Call Us</p>
                        <p className="text-sm text-gray-400">+81-45-402-6117</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="font-medium text-white">Email</p>
                        <p className="text-sm text-gray-400">sales@ramadbk.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="font-medium text-white">Visit Us</p>
                        <p className="text-sm text-gray-400">123 Car Avenue, Auto City, AC 12345</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-red-300">Business Hours</span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                      <p>Saturday: 9:00 AM - 6:00 PM</p>
                      <p>Sunday: 12:00 PM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Button and Contact Number */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Contact Number - Larger */}
            <div className="flex items-center gap-1 sm:gap-2 text-white bg-red-900/30 px-2 sm:px-3 py-1 rounded-lg border border-red-800">
              <Phone className="h-3 sm:h-4 w-3 sm:w-4 text-red-400" />
              <span className="text-xs sm:text-sm font-bold">+81-45-402-6117</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onMenuToggle} className="text-gray-300 hover:text-white hover:bg-gray-800 h-8 w-8 sm:h-10 sm:w-10">
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
