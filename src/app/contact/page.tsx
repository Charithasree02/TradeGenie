'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Users,
  Globe,
  HelpCircle,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';

const faqs = [
  {
    question: 'What is TradeGenie?',
    answer: 'TradeGenie is an AI-powered global trade intelligence platform that helps businesses navigate international trade by providing tools for document generation, risk analysis, partner matching, and compliance checking.'
  },
  {
    question: 'How does the AI document generator work?',
    answer: 'Our AI document generator uses natural language processing to understand your requirements and automatically fills in the necessary fields for various trade documents. Simply describe what you need, and our AI will guide you through the process.'
  },
  {
    question: 'Is my data secure with TradeGenie?',
    answer: 'Yes, we take data security very seriously. All your data is encrypted and stored securely. We comply with international data protection regulations including GDPR and CCPA.'
  },
  {
    question: 'What countries do you support?',
    answer: 'TradeGenie supports trade operations across 150+ countries. Our platform includes country-specific regulations, tariff information, and compliance requirements for each supported country.'
  },
  {
    question: 'How accurate is the risk analysis?',
    answer: 'Our risk analysis tool uses real-time data and AI algorithms to provide highly accurate assessments. We maintain a 98% accuracy rate in our risk predictions and recommendations.'
  },
  {
    question: 'Can I integrate TradeGenie with my existing systems?',
    answer: 'Yes, we offer API integration capabilities that allow you to connect TradeGenie with your existing ERP, CRM, and other business systems.'
  }
];

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'support@tradegenie.com',
    description: 'Get support within 24 hours'
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri 9AM-6PM EST'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: '123 Trade Street, Commerce City, NY 10001',
    description: 'By appointment only'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'Mon-Fri: 9AM-6PM EST',
    description: '24/7 AI support available'
  }
];

const offices = [
  {
    city: 'New York',
    country: 'USA',
    address: '123 Trade Street, Commerce City, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'ny@tradegenie.com'
  },
  {
    city: 'London',
    country: 'UK',
    address: '456 Commerce Avenue, London EC2A 1HQ',
    phone: '+44 20 7123 4567',
    email: 'london@tradegenie.com'
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    address: '789 Trade Center, Singapore 048583',
    phone: '+65 6123 4567',
    email: 'singapore@tradegenie.com'
  },
  {
    city: 'Mumbai',
    country: 'India',
    address: '312 Business Park, Mumbai 400050',
    phone: '+91 22 1234 5678',
    email: 'mumbai@tradegenie.com'
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: ''
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E7] to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-purple-100 text-purple-800">
              Contact Us
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Have questions about TradeGenie? Our team is here to help you succeed in global trade.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <info.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                    <p className="text-lg font-medium text-gray-900 mb-1">{info.value}</p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="inquiryType">Inquiry Type</Label>
                      <Select value={formData.inquiryType} onValueChange={(value) => setFormData({...formData, inquiryType: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="general">General Question</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="mt-1"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <HelpCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Social Media */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                      <Instagram className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Global Offices
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visit us at any of our worldwide locations or connect with our local teams.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{office.city}</h3>
                    <p className="text-sm text-gray-600 mb-3">{office.country}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{office.address}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{office.phone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{office.email}</span>
                      </div>
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
              Ready to Start Your Global Trade Journey?
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join thousands of successful businesses using TradeGenie to expand their global reach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-lg px-8 py-3">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600 text-lg px-8 py-3">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}