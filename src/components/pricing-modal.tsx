'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  FileText, 
  TrendingUp,
  Award,
  Crown,
  X,
  ArrowRight
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  badge?: string;
  color: string;
  icon: any;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    description: 'Perfect for getting started',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      '7-day full access',
      'Generate up to 10 documents',
      'Basic market intelligence',
      'Limited partner matching',
      'Email support',
      'Single user account'
    ],
    badge: '7 Days Free',
    color: 'text-gray-600',
    icon: Star
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'Great for small businesses',
    price: {
      monthly: 29,
      yearly: 290,
    },
    features: [
      'Unlimited document generation',
      'Basic market intelligence',
      '50 partner matches/month',
      'Standard risk analysis',
      'Email & chat support',
      'Up to 3 users',
      'Mobile app access',
      'Basic reporting'
    ],
    color: 'text-blue-600',
    icon: Zap
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing businesses',
    price: {
      monthly: 79,
      yearly: 790,
    },
    features: [
      'Everything in Starter',
      'Advanced market intelligence',
      'Unlimited partner matching',
      'Advanced risk analysis',
      'Priority support',
      'Up to 10 users',
      'API access',
      'Advanced analytics',
      'Custom branding',
      'Team collaboration'
    ],
    popular: true,
    badge: 'Most Popular',
    color: 'text-purple-600',
    icon: Shield
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: {
      monthly: 199,
      yearly: 1990,
    },
    features: [
      'Everything in Professional',
      'Premium market intelligence',
      'Dedicated account manager',
      'Custom integrations',
      '24/7 phone support',
      'Unlimited users',
      'Advanced API access',
      'Custom workflows',
      'White-label solution',
      'SLA guarantee',
      'On-premise deployment option',
      'Advanced security features'
    ],
    badge: 'Premium',
    color: 'text-yellow-600',
    icon: Crown
  }
];

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleGetStarted = (planId: string) => {
    // In a real implementation, this would navigate to signup or open a payment flow
    console.log(`Getting started with plan: ${planId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-8">
          <DialogHeader className="text-center pb-8">
            <DialogTitle className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </DialogTitle>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your business needs
            </p>
            
            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <span className={`text-base font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                className="scale-110"
              />
              <span className={`text-base font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              <Badge variant="secondary" className="ml-3 bg-green-100 text-green-800 px-3 py-1 text-sm">
                Save 17%
              </Badge>
            </div>
          </DialogHeader>

          {/* Pricing Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative cursor-pointer ${plan.popular ? 'transform scale-105' : ''}`}
                onClick={() => handleGetStarted(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-purple-600 text-white px-4 py-2 shadow-lg text-sm font-medium">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full flex flex-col border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-600 shadow-xl bg-gradient-to-b from-purple-50 to-white' 
                    : 'border-gray-200 hover:border-purple-400 bg-white'
                }`}>
                  <CardHeader className="text-center pb-6 pt-8 px-6 flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full ${plan.popular ? 'bg-purple-100' : 'bg-gray-100'} flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className={`w-8 h-8 ${plan.color}`} />
                    </div>
                    
                    <CardTitle className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-purple-900' : 'text-gray-900'}`}>
                      {plan.name}
                    </CardTitle>
                    
                    <CardDescription className="text-base text-gray-600 mb-4">
                      {plan.description}
                    </CardDescription>
                    
                    <div className="mt-4">
                      {plan.price[billingCycle] === 0 ? (
                        <div className="text-center">
                          <span className="text-4xl font-bold text-gray-900">Free</span>
                          <p className="text-sm text-gray-500 mt-2">{plan.badge}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-bold text-gray-900">
                              ${plan.price[billingCycle]}
                            </span>
                            <span className="text-gray-500 text-lg ml-1">
                              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                            </span>
                          </div>
                          {billingCycle === 'yearly' && (
                            <p className="text-sm text-green-600 mt-2 font-medium">
                              Save ${(plan.price.monthly * 12 - plan.price.yearly)}/year
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col px-6 pb-8">
                    <div className="flex-1 mb-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button
                      className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl' 
                          : plan.id === 'free' 
                            ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg'
                            : 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-200 hover:border-purple-300'
                      }`}
                      size="lg"
                    >
                      {plan.id === 'free' ? 'Start Free Trial' : 'Get Started'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                All Plans Include:
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">SSL Security</span>
                  <span className="text-sm text-gray-600">Enterprise-grade encryption</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">150+ Countries</span>
                  <span className="text-sm text-gray-600">Global market coverage</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">24/7 Support</span>
                  <span className="text-sm text-gray-600">Round-the-clock assistance</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600">
                Need a custom plan?{' '}
                <button className="text-purple-600 hover:text-purple-700 font-medium underline">
                  Contact our sales team
                </button>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}