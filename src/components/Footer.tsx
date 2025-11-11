'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook } from 'lucide-react';

export default function Footer() {
  const handleSocialClick = (url: string) => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({ type: 'OPEN_EXTERNAL_URL', data: { url } }, '*');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              iTechSolution
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted partner for quality tech products. We offer new and refurbished laptops, desktops, accessories, and more.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => handleSocialClick('https://www.instagram.com/isaqtechsolutions?igsh=MTIzY2kzMDlmZXV5')}
                className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSocialClick('https://www.youtube.com/@isaqtechsolutions')}
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSocialClick('https://www.facebook.com/share/16xwwKX4pM/')}
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=laptops" className="text-gray-400 hover:text-white transition-colors">
                  Laptops
                </Link>
              </li>
              <li>
                <Link href="/products?category=desktops" className="text-gray-400 hover:text-white transition-colors">
                  Desktops
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-gray-400 hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?category=printers" className="text-gray-400 hover:text-white transition-colors">
                  Printers
                </Link>
              </li>
              <li>
                <Link href="/products?category=cctv" className="text-gray-400 hover:text-white transition-colors">
                  CCTV Cameras
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-1 text-blue-400" />
                <a href="tel:+919545690700" className="text-gray-400 hover:text-white transition-colors">
                  +91 9545690700
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-1 text-blue-400" />
                <a href="mailto:isaqtechsolutions@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  isaqtechsolutions@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-blue-400" />
                <span className="text-gray-400">India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} iTechSolution. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}