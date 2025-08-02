'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  FileText, 
  Users, 
  Shield, 
  MessageSquare, 
  Globe, 
  CheckCircle, 
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import ChatbotModal from '@/components/chatbot-modal';
import PricingModal from '@/components/pricing-modal';
import DemoScheduleModal from '@/components/demo-schedule-modal';

const features = [
  {
    icon: FileText,
    title: "Document Generator",
    description: "AI-powered trade document generation with precision and compliance",
    color: "text-purple-600",
    link: "/documents"
  },
  {
    icon: Users,
    title: "Partner Matcher",
    description: "Connect with verified trade partners across 150+ countries",
    color: "text-yellow-600",
    link: "/partners"
  },
  {
    icon: Shield,
    title: "Risk Analyzer",
    description: "Intelligent risk assessment with 98% accuracy for global markets",
    color: "text-red-600",
    link: "/risk-analyzer"
  },
  {
    icon: MessageSquare,
    title: "Genie Chatbot",
    description: "24/7 AI assistant for all your trade-related queries",
    color: "text-blue-600",
    link: "/chat"
  },
  {
    icon: Globe,
    title: "Market Intelligence",
    description: "Real-time market trends and analysis for informed decisions",
    color: "text-green-600",
    link: "/market-intelligence"
  },
  {
    icon: Award,
    title: "Global Compliance",
    description: "Navigate international regulations with expert guidance",
    color: "text-indigo-600",
    link: "/compliance"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, Textile Exports Ltd",
    content: "TradeGenie transformed our export business. The AI document generator saved us countless hours!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Director, Global Foods Inc",
    content: "The risk analysis feature helped us avoid potential losses in emerging markets.",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Founder, Fashion Forward",
    content: "Found amazing manufacturing partners through the AI matching system. Game-changer!",
    rating: 5
  }
];

const freeTrialFeatures = [
  "Generate unlimited trade documents",
  "AI-powered partner matching",
  "Complete market intelligence access",
  "Risk analysis for all markets",
  "Priority customer support"
];

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E7] to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-800">
                  <Zap className="w-4 h-4 mr-2" />
                  AI-Powered Trade Intelligence
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Ready to Scale Your
                  <span className="text-purple-600"> Trade?</span>
                </h1>
                <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                  Empowering women entrepreneurs with AI-driven global trade solutions. 
                  Navigate international markets with confidence and precision.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3"
                  onClick={() => setIsPricingOpen(true)}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-purple-600 border-purple-600 hover:bg-purple-50 text-lg px-8 py-3"
                  onClick={() => setIsChatbotOpen(true)}
                >
                  Ask the Genie
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-xs font-semibold text-purple-700">SJ</div>
                    <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-700">MC</div>
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-xs font-semibold text-green-700">ER</div>
                  </div>
                  <span className="text-sm text-gray-600">Join 10,000+ entrepreneurs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-gray-900">98% Success Rate</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Card className="bg-white shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                  <CardTitle className="text-xl">14 Days Free Full Access</CardTitle>
                  <CardDescription className="text-purple-100">
                    No credit card required • Start instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {freeTrialFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
                    onClick={() => setIsPricingOpen(true)}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
              
              {/* Floating Genie Mascot */}
              <motion.div
                className="absolute -top-6 -right-6 w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center shadow-lg"
                animate={{
                  x: mousePosition.x * 0.02,
                  y: mousePosition.y * 0.02,
                }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Magical Features Await Discovery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Harness the power of AI to transform your global trade operations with our comprehensive suite of intelligent tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-gray-50">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-4 ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                    <Link href={feature.link}>
                      <Button variant="ghost" className="mt-4 text-purple-600 hover:text-purple-700 p-0 h-auto">
                        Learn more <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center space-x-8 bg-purple-50 rounded-full px-8 py-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-purple-600">6</span>
                <span className="text-gray-600">AI Tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-purple-600">150+</span>
                <span className="text-gray-600">Countries</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-purple-600">∞</span>
                <span className="text-gray-600">Possibilities</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from entrepreneurs who transformed their business with TradeGenie
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 bg-white shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Trade Business?
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join thousands of successful entrepreneurs using TradeGenie to scale their global operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-lg px-8 py-3"
                onClick={() => setIsPricingOpen(true)}
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-purple-600 text-lg px-8 py-3"
                onClick={() => setIsDemoOpen(true)}
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-8 w-8 text-yellow-500" />
                <span className="text-2xl font-bold">TradeGenie</span>
              </div>
              <p className="text-gray-400">
                AI-powered global trade intelligence platform for modern entrepreneurs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TradeGenie. All rights reserved. Made with ❤️ for global entrepreneurs.</p>
          </div>
        </div>
      </footer>

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
    </div>
  );
}