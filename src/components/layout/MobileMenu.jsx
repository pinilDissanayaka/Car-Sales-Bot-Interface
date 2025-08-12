import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  X, 
  Home, 
  Car, 
  MessageSquare, 
  Info, 
  Settings,
  Phone,
  Star
} from 'lucide-react'

export function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null

  const menuItems = [
    { icon: Home, label: 'Home', value: 'inventory' },
    { icon: Car, label: 'Inventory', value: 'inventory' },
    { icon: MessageSquare, label: 'Chat with Rama', value: 'chat' },
    { icon: Info, label: 'About', value: 'about' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
      <div className="fixed inset-y-0 right-0 w-64 bg-black shadow-xl border-l border-gray-800">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="font-semibold text-lg text-white">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-300 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Contact Info - Enhanced */}
          <div className="p-4 border-b border-gray-800 bg-red-900/20">
            <div className="flex items-center gap-3 text-white">
              <Phone className="h-5 w-5 text-red-400" />
              <div>
                <span className="text-lg font-bold">+81-45-402-6117</span>
                <p className="text-xs text-gray-400">Call for immediate assistance</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.value}
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                  onClick={onClose}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
              
              <div className="pt-4 border-t border-gray-800 mt-4">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Phone className="h-4 w-4 mr-3" />
                  Contact Us
                </Button>
                <Button variant="ghost" className="w-full justify-start mt-2 text-gray-300 hover:text-white hover:bg-gray-800">
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Button>
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium text-sm text-white">Quick Contact</span>
                </div>
                <p className="text-xs text-gray-400">
                  Call +81-45-402-6117 for immediate assistance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
