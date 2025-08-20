/**
 * Footer component with site links and company information
 */
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    'Programs': [
      { href: '/programs', label: 'All Programs' },
      { href: '/programs/mtm', label: 'MTM The Future Today' },
      { href: '/programs/timemymeds', label: 'TimeMyMeds Sync' },
      { href: '/programs/test-treat', label: 'Test & Treat Services' },
      { href: '/programs/hba1c', label: 'HbA1c Testing' }
    ],
    'Resources': [
      { href: '/resources', label: 'Resource Library' },
      { href: '/success-stories', label: 'Success Stories' },
      { href: '/about', label: 'About Our Team' },
      { href: '/contact', label: 'Support Center' }
    ],
    'Company': [
      { href: '/about', label: 'About ClinicalRxQ' },
      { href: '/contact', label: 'Contact Us' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' }
    ]
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img 
                    src="https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/0fb3f1b8-e6cd-4575-806d-018bad3c9e1a.png" 
                    alt="ClinicalRxQ Logo" 
                    className="w-6 h-6"
                  />
                </div>
              </div>
              <div className="text-xl font-bold">
                <span className="text-white">Clinical</span>
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 bg-clip-text text-transparent">RxQ</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Where dispensing meets direct patient care. Empowering community pharmacy 
              professionals with comprehensive training and resources to enhance patient care and business success.
            </p>
            <div className="italic text-cyan-400 mb-6">
              "Retail is a FOUR-LETTER Word. We are COMMUNITY PHARMACISTS."
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-gray-300">1-800-CLINICAL</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-gray-300">info@clinicalrxq.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-gray-300">Serving Community Pharmacies Nationwide</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0 flex items-center">
              <span>© 2025 ClinicalRxQ. All rights reserved.</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> for Community Pharmacists
              </span>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}