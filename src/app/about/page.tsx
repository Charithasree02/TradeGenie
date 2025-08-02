'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Globe, 
  Users, 
  Award, 
  Target, 
  Heart,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react';

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    bio: 'Former trade diplomat with 15+ years of experience in international trade and policy.',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'Dr. Michael Chen',
    role: 'CTO',
    bio: 'AI and machine learning expert with PhD from MIT and 10+ years in tech innovation.',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Head of Partnerships',
    bio: 'International business development expert with extensive network across 50+ countries.',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'James Wilson',
    role: 'Lead AI Engineer',
    bio: 'Specialized in natural language processing and trade data analytics.',
    image: '/api/placeholder/150/150'
  }
];

const stats = [
  { icon: Users, value: '10,000+', label: 'Active Users' },
  { icon: Globe, value: '150+', label: 'Countries' },
  { icon: Award, value: '98%', label: 'Success Rate' },
  { icon: Target, value: '50M+', label: 'Documents Processed' }
];

const values = [
  {
    icon: Heart,
    title: 'Empowerment',
    description: 'We believe in empowering entrepreneurs, especially women, to succeed in global trade.'
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Our mission is to make international trade accessible to businesses of all sizes.'
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'We leverage cutting-edge AI technology to solve complex trade challenges.'
  },
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from technology to customer service.'
  }
];

export default function AboutPage() {
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
              About TradeGenie
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transforming Global Trade
              <span className="text-purple-600"> with AI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're on a mission to democratize international trade by making it accessible, 
              efficient, and transparent for businesses of all sizes around the world.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3">
              Join Our Journey
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                TradeGenie was founded with a simple yet powerful vision: to break down the barriers 
                that prevent small and medium businesses from participating in international trade.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We understand that navigating the complexities of global trade can be overwhelming. 
                That's why we've developed an AI-powered platform that simplifies every aspect of 
                international trade, from document generation to risk assessment and partner matching.
              </p>
              <p className="text-lg text-gray-600">
                Our commitment to empowering women entrepreneurs and underrepresented businesses 
                drives everything we do, ensuring that the benefits of global trade are accessible to all.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white">
                  <CardContent className="p-6 text-center">
                    <value.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team of experts brings together decades of experience in international trade, 
              artificial intelligence, and business development.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-purple-600 mb-3">{member.role}</p>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Impact Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Global Impact
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Worldwide Reach</h3>
                    <p className="text-gray-600">
                      Our platform serves businesses across 150+ countries, facilitating 
                      cross-border trade and fostering international business relationships.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Empowering Entrepreneurs</h3>
                    <p className="text-gray-600">
                      We've helped over 10,000 entrepreneurs, with a special focus on women-owned 
                      businesses, to expand their operations globally.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Industry Recognition</h3>
                    <p className="text-gray-600">
                      Recognized as a leading innovator in trade technology, with awards from 
                      international trade organizations and tech industry leaders.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Achievements</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Documents Processed</span>
                      <span className="font-semibold text-gray-900">50M+</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Successful Partnerships</span>
                      <span className="font-semibold text-gray-900">25,000+</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Risk Assessments</span>
                      <span className="font-semibold text-gray-900">100,000+</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Compliance Checks</span>
                      <span className="font-semibold text-gray-900">1M+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="font-semibold text-gray-900">98%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
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
              Join thousands of successful businesses using TradeGenie to scale their global operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-lg px-8 py-3">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600 text-lg px-8 py-3">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}