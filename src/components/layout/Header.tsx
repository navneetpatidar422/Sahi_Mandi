import React, { useState, useEffect } from 'react';
import { Menu, User, Bell, Languages, Search, Sprout, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEWS_ITEMS } from '../../lib/mockData';

interface HeaderProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onNavigate: (page: string) => void;
  activePage: string;
  user?: any;
}

export function Header({ onLoginClick, isLoggedIn, onNavigate, activePage, user }: HeaderProps) {
  const [newsIndex, setNewsIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % NEWS_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'mandis', label: 'Mandis' },
    { id: 'analyze', label: 'Smart Analyzer' },
    { id: 'admin', label: 'Mandi Admin' },
  ];

  if (isLoggedIn) {
    navLinks.splice(1, 0, { id: 'dashboard', label: 'My Dashboard' });
  }

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      {/* News Ticker */}
      <div className="bg-green-800 text-white text-xs py-2 px-4 overflow-hidden relative flex items-center justify-center">
        <div className="max-w-7xl w-full flex items-center">
          <span className="font-bold text-yellow-400 mr-3 shrink-0 uppercase tracking-wider">Latest Updates:</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={newsIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="truncate w-full font-medium"
            >
              {NEWS_ITEMS[newsIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => onNavigate('home')}
            >
              <div className="bg-green-600 p-2 rounded-lg text-white">
                <Sprout className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 tracking-tight leading-none">सही Mandi</span>
                <span className="text-xs text-green-600 font-medium tracking-wide">मोल से मंज़िल तक...</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    activePage === link.id 
                      ? 'bg-green-600 text-white shadow-md shadow-green-200' 
                      : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button className="text-gray-500 hover:text-green-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-gray-200"></div>
              <button className="text-gray-500 hover:text-green-600 transition-colors flex items-center gap-1 text-sm font-medium">
                <Languages className="w-4 h-4" />
                <span>EN</span>
              </button>
              
              {isLoggedIn ? (
                 <button 
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-full transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200 overflow-hidden">
                    {user?.avatar || user?.image ? (
                      <img src={user.avatar || user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm">{user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}</span>
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs text-gray-500 font-medium">Hello,</span>
                    <span className="text-sm font-bold text-gray-900 leading-none group-hover:text-green-700 max-w-[100px] truncate">
                      {user?.name || 'Farmer'}
                    </span>
                  </div>
                 </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5"
                >
                  Login / Register
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 text-base font-medium ${
                    activePage === link.id ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-gray-100" />
              {!isLoggedIn && (
                <button 
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold"
                >
                  Login / Register
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}