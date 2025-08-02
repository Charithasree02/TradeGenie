'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  MessageSquare, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import ChatbotModal from './chatbot-modal';
import PricingModal from './pricing-modal';
import DemoScheduleModal from './demo-schedule-modal';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'About Us', href: '/about' },
    { name: 'Pricing', href: '#', onClick: () => setIsPricingOpen(true) },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">TradeGenie</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="ghost" className="text-purple-600 hover:bg-purple-50">
                Sign In
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
              onClick={() => setIsChatbotOpen(true)}
            >
              Ask Genie
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setIsPricingOpen(true)}
            >
              Free Trial
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
              onClick={() => setIsChatbotOpen(true)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Ask
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-purple-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium px-4 py-2"
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                    setIsMenuOpen(false);
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-purple-600 hover:bg-purple-50 justify-start">
                    Sign In
                  </Button>
                </Link>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2"
                  onClick={() => {
                    setIsPricingOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Free Trial
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <ChatbotModal 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
      <PricingModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
      />
      <DemoScheduleModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
      />
    </nav>
  );
}