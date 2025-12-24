import { Instagram, Facebook, MessageCircle, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-maroon-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold font-serif mb-4">Lera</h3>
            <p className="text-beige-100 text-sm">
              Luxury modest fashion celebrating cultural beauty with contemporary sophistication.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-beige-100">
              <li><a href="#shop" className="hover:text-beige-300 transition-colors">Abayas</a></li>
              <li><a href="#shop" className="hover:text-beige-300 transition-colors">Kaftans</a></li>
              <li><a href="#shop" className="hover:text-beige-300 transition-colors">Hijabs</a></li>
              <li><a href="#shop" className="hover:text-beige-300 transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-beige-100">
              <li><a href="#contact" className="hover:text-beige-300 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-beige-300 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-beige-300 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-beige-300 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-maroon-800 hover:bg-maroon-700 rounded-lg transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-maroon-800 hover:bg-maroon-700 rounded-lg transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer" className="p-2 bg-maroon-800 hover:bg-maroon-700 rounded-lg transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="mailto:hello@lera.com" className="p-2 bg-maroon-800 hover:bg-maroon-700 rounded-lg transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-maroon-800 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-beige-100">
            <div>
              <p className="font-semibold mb-1">Business Hours</p>
              <p>Mon - Fri: 9:00 AM - 6:00 PM (WAT)</p>
              <p>Sat: 10:00 AM - 4:00 PM</p>
            </div>
            <div className="text-right">
              <p>&copy; 2024 Lera. All rights reserved.</p>
              <p className="mt-2">Celebrating modest fashion. Living in time.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
