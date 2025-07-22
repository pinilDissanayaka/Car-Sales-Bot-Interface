import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star,
  Send,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react'

export function ContactSection() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-500" />
            Get in Touch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                <p className="text-xs text-muted-foreground">Call for immediate assistance</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">sales@ramadbk.com</p>
                <p className="text-xs text-muted-foreground">We respond within 2 hours</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">123 Car Avenue</p>
                <p className="text-sm text-muted-foreground">Auto City, AC 12345</p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Business Hours</span>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>12:00 PM - 5:00 PM</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              4.8/5 based on 150+ reviews
            </span>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button className="w-full" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Test Drive
            </Button>
            <Button className="w-full" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with Sales Rep
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="john@example.com" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input type="tel" placeholder="(555) 123-4567" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">I'm interested in</label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                <option>Browsing inventory</option>
                <option>Specific vehicle inquiry</option>
                <option>Financing options</option>
                <option>Trade-in valuation</option>
                <option>Test drive scheduling</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget Range</label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                <option>Under $20,000</option>
                <option>$20,000 - $30,000</option>
                <option>$30,000 - $50,000</option>
                <option>$50,000 - $70,000</option>
                <option>Over $70,000</option>
                <option>No budget limit</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                placeholder="Tell us about your car needs, preferred features, or any questions you have..."
                rows={4}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="newsletter" className="rounded border-border" />
              <label htmlFor="newsletter" className="text-sm text-muted-foreground">
                Subscribe to our newsletter for deals and updates
              </label>
            </div>
            
            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
