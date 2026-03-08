import React from 'react';
import { Sprout, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Heart, BookOpen } from 'lucide-react';

interface FooterProps {
  onOpenDocs?: () => void;
}

export function Footer({ onOpenDocs }: FooterProps) {
  const displayLanguages = [
    "English", "हिंदी", "বাংলা", "తెలుగు", "मराठी", "தமிழ்", "ગુજરાતી", "ಕನ್ನಡ", "മലയാളം", "ਪੰਜਾਬੀ"
  ];

  return (
    <footer className="bg-[#0B0F19] text-gray-300 pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-600 p-1.5 rounded-lg text-white">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">सही Mandi</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Empowering farmers with real-time market data, transparent pricing, and direct connections to Mandis across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-500 transition-colors">Find a Mandi</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Daily Crop Prices</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Smart Analyzer</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Market News</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Government Schemes</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Mandi Verification</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 shrink-0" />
                <span>GGSIPU-East Delhi Campus</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-600 shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-600 shrink-0" />
                <span>support@sahimandi.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-800 my-10"></div>

        {/* New Bottom Section matching image */}
        <div className="flex flex-col items-center gap-8 mb-10">
          
          {/* Languages */}
          <div className="text-center space-y-4">
            <h3 className="text-white font-medium">Available in <span className="text-green-500">Multiple Languages</span></h3>
            <div className="flex flex-wrap justify-center gap-2">
              {displayLanguages.map((lang, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full border border-gray-700 bg-gray-900/50 text-gray-400 text-sm hover:border-green-500 hover:text-white transition-all cursor-pointer">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="text-center space-y-4">
             <h3 className="text-white font-medium">Follow Us</h3>
             <div className="flex gap-4">
              <SocialIcon Icon={Facebook} />
              <SocialIcon Icon={Twitter} />
              <SocialIcon Icon={Instagram} />
              <SocialIcon Icon={Linkedin} />
              <SocialIcon Icon={Youtube} />
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 relative">
          
          <div className="flex-1 text-center md:text-left">
            <p className="font-bold font-[sans-sa] font-normal text-[13px]">
              © 2026 Sahi Mandi. All rights reserved. Made by Team XYZ with <Heart className="w-3 h-3 inline text-pink-500 fill-current" />.
            </p>
          </div>

          <div className="absolute left-1/2 top-8 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 mt-4 md:mt-0">
            {onOpenDocs && (
              <button
                onClick={onOpenDocs}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full font-medium text-sm shadow-lg shadow-green-900/30 hover:shadow-green-900/50 transition-all hover:scale-105"
              >
                <BookOpen className="w-4 h-4" />
                Platform Documentation
              </button>
            )}
          </div>

          <div className="flex-1 flex justify-center md:justify-end gap-6 pt-12 md:pt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ Icon }: { Icon: any }) {
  return (
    <a href="#" className="p-2.5 bg-gray-800/50 rounded-lg hover:bg-green-600 hover:text-white transition-all group border border-gray-700 hover:border-green-500">
      <Icon className="w-4 h-4 text-gray-400 group-hover:text-white" />
    </a>
  );
}