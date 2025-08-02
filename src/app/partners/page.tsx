'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  Search, 
  Star, 
  MapPin, 
  Globe, 
  Award, 
  Heart,
  MessageSquare,
  Filter,
  X,
  Building,
  Factory,
  ShoppingCart,
  Truck,
  Ship,
  Package
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  type: 'manufacturer' | 'distributor' | 'retailer' | 'service_provider' | 'trading_company';
  industry: string;
  country: string;
  city: string;
  languages: string[];
  certifications: string[];
  rating: number;
  experience: number;
  description: string;
  specialties: string[];
  minOrder: string;
  annualRevenue: string;
  employees: string;
  compatibilityScore: number;
  isFavorite: boolean;
}

interface FilterOptions {
  industry: string;
  country: string;
  partnerType: string;
  minRating: number;
  languages: string[];
  certifications: string[];
}

const industries = [
  'Textiles & Apparel',
  'Electronics',
  'Food & Beverages',
  'Machinery',
  'Chemicals',
  'Pharmaceuticals',
  'Automotive',
  'Agriculture',
  'Metals & Mining',
  'Construction',
  'Logistics',
  'Medical Equipment',
  'Renewable Energy',
  'Furniture',
  'General Trading'
];

const countries = [
  'Germany', 'USA', 'China', 'Japan', 'India', 'France', 'UK', 'Italy', 
  'Canada', 'Australia', 'Brazil', 'Mexico', 'South Korea', 'Spain', 'Netherlands',
  'Switzerland', 'UAE', 'Singapore', 'Sweden', 'Taiwan'
];

const languages = [
  'English', 'German', 'Mandarin', 'Japanese', 'Hindi', 'French', 
  'Spanish', 'Italian', 'Korean', 'Dutch', 'Portuguese'
];

const certifications = [
  'ISO 9001', 'ISO 14001', 'OHSAS 18001', 'HACCP', 'GMP', 'FDA',
  'CE Mark', 'RoHS', 'REACH', 'FSC', 'Fair Trade', 'Organic Certified'
];

const partnerTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'retailer', label: 'Retailer' },
  { value: 'service_provider', label: 'Service Provider' },
  { value: 'trading_company', label: 'Trading Company' }
];

const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Müller Textiles GmbH',
    type: 'manufacturer',
    industry: 'Textiles & Apparel',
    country: 'Germany',
    city: 'Berlin',
    languages: ['English', 'German', 'French'],
    certifications: ['ISO 9001', 'ISO 14001', 'Fair Trade'],
    rating: 4.8,
    experience: 15,
    description: 'Leading manufacturer of high-quality textiles and apparel with a focus on sustainable production. Specializing in organic cotton and innovative fabric technologies.',
    specialties: ['Organic Cotton', 'Technical Textiles', 'Sustainable Fashion'],
    minOrder: '€5,000',
    annualRevenue: '€50M',
    employees: '250-500',
    compatibilityScore: 95,
    isFavorite: false
  },
  {
    id: '2',
    name: 'Global Tech Solutions',
    type: 'distributor',
    industry: 'Electronics',
    country: 'USA',
    city: 'San Francisco',
    languages: ['English', 'Spanish', 'Mandarin'],
    certifications: ['ISO 9001', 'CE Mark', 'RoHS'],
    rating: 4.6,
    experience: 12,
    description: 'Premier distributor of electronic components and IoT devices. Strong network across North America and Asia with expertise in supply chain management.',
    specialties: ['IoT Devices', 'Electronic Components', 'Supply Chain Solutions'],
    minOrder: '$10,000',
    annualRevenue: '$75M',
    employees: '100-250',
    compatibilityScore: 88,
    isFavorite: false
  },
  {
    id: '3',
    name: 'Sakura Foods Co.',
    type: 'manufacturer',
    industry: 'Food & Beverages',
    country: 'Japan',
    city: 'Tokyo',
    languages: ['Japanese', 'English', 'Mandarin'],
    certifications: ['HACCP', 'GMP', 'FDA', 'Organic Certified'],
    rating: 4.9,
    experience: 20,
    description: 'Traditional Japanese food manufacturer with modern production facilities. Specializing in premium quality food products for international markets.',
    specialties: ['Traditional Foods', 'Organic Products', 'Food Processing'],
    minOrder: '¥500,000',
    annualRevenue: '¥8B',
    employees: '500-1000',
    compatibilityScore: 92,
    isFavorite: false
  },
  {
    id: '4',
    name: 'IndoChem Industries',
    type: 'manufacturer',
    industry: 'Chemicals',
    country: 'India',
    city: 'Mumbai',
    languages: ['English', 'Hindi', 'Gujarati'],
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001', 'REACH'],
    rating: 4.4,
    experience: 18,
    description: 'Leading chemical manufacturer with expertise in specialty chemicals and industrial solutions. Committed to environmental sustainability and innovation.',
    specialties: ['Specialty Chemicals', 'Industrial Solutions', 'Environmental Technologies'],
    minOrder: '₹200,000',
    annualRevenue: '₹450Cr',
    employees: '1000+',
    compatibilityScore: 85,
    isFavorite: false
  },
  {
    id: '5',
    name: 'EuroTrade Logistics',
    type: 'service_provider',
    industry: 'Logistics',
    country: 'Netherlands',
    city: 'Rotterdam',
    languages: ['English', 'Dutch', 'German', 'French'],
    certifications: ['ISO 9001', 'AEO', 'IATA'],
    rating: 4.7,
    experience: 25,
    description: 'Comprehensive logistics and supply chain solutions provider. Operating from Europe\'s largest port with global network and expertise in customs clearance.',
    specialties: ['Freight Forwarding', 'Customs Brokerage', 'Warehousing', 'Supply Chain Management'],
    minOrder: '€2,500',
    annualRevenue: '€120M',
    employees: '500-1000',
    compatibilityScore: 90,
    isFavorite: false
  },
  {
    id: '6',
    name: 'Fashion Forward Ltd',
    type: 'retailer',
    industry: 'Textiles & Apparel',
    country: 'UK',
    city: 'London',
    languages: ['English', 'French', 'Italian'],
    certifications: ['Fair Trade', 'FSC'],
    rating: 4.5,
    experience: 8,
    description: 'Trend-setting fashion retailer with focus on sustainable and ethical fashion. Operating across Europe with strong online presence.',
    specialties: ['Sustainable Fashion', 'Retail Operations', 'E-commerce'],
    minOrder: '£3,000',
    annualRevenue: '£25M',
    employees: '50-100',
    compatibilityScore: 82,
    isFavorite: false
  },
  // Additional Partners
  {
    id: '7',
    name: 'Precision Machinery Corp',
    type: 'manufacturer',
    industry: 'Machinery',
    country: 'Germany',
    city: 'Munich',
    languages: ['English', 'German', 'Spanish'],
    certifications: ['ISO 9001', 'CE Mark', 'TÜV'],
    rating: 4.7,
    experience: 22,
    description: 'High-precision machinery manufacturer specializing in industrial automation and CNC equipment. Known for reliability and cutting-edge technology.',
    specialties: ['CNC Machines', 'Industrial Automation', 'Precision Engineering'],
    minOrder: '€20,000',
    annualRevenue: '€85M',
    employees: '500-1000',
    compatibilityScore: 91,
    isFavorite: false
  },
  {
    id: '8',
    name: 'MediCare Pharmaceuticals',
    type: 'manufacturer',
    industry: 'Pharmaceuticals',
    country: 'Switzerland',
    city: 'Zurich',
    languages: ['English', 'German', 'French', 'Italian'],
    certifications: ['ISO 9001', 'GMP', 'FDA', 'EMA'],
    rating: 4.9,
    experience: 30,
    description: 'World-leading pharmaceutical company with focus on innovative medicines and healthcare solutions. State-of-the-art research facilities.',
    specialties: ['Generic Medicines', 'Biotechnology', 'Medical Research'],
    minOrder: 'CHF 50,000',
    annualRevenue: 'CHF 2.5B',
    employees: '5000+',
    compatibilityScore: 96,
    isFavorite: false
  },
  {
    id: '9',
    name: 'AutoParts Global',
    type: 'distributor',
    industry: 'Automotive',
    country: 'USA',
    city: 'Detroit',
    languages: ['English', 'Spanish', 'French'],
    certifications: ['ISO 9001', 'IATF 16949', 'ISO 14001'],
    rating: 4.3,
    experience: 16,
    description: 'Leading automotive parts distributor with extensive inventory and just-in-time delivery capabilities. Serving major automotive manufacturers worldwide.',
    specialties: ['Auto Parts', 'Logistics', 'Supply Chain Management'],
    minOrder: '$25,000',
    annualRevenue: '$120M',
    employees: '250-500',
    compatibilityScore: 84,
    isFavorite: false
  },
  {
    id: '10',
    name: 'Green Harvest Ltd',
    type: 'manufacturer',
    industry: 'Agriculture',
    country: 'Brazil',
    city: 'São Paulo',
    languages: ['Portuguese', 'English', 'Spanish'],
    certifications: ['ISO 9001', 'Organic Certified', 'Fair Trade'],
    rating: 4.6,
    experience: 12,
    description: 'Sustainable agricultural producer specializing in organic fruits, vegetables, and grains. Committed to environmental stewardship and fair trade practices.',
    specialties: ['Organic Farming', 'Sustainable Agriculture', 'Export Crops'],
    minOrder: 'R$ 15,000',
    annualRevenue: 'R$ 85M',
    employees: '100-250',
    compatibilityScore: 87,
    isFavorite: false
  },
  {
    id: '11',
    name: 'SteelForge Industries',
    type: 'manufacturer',
    industry: 'Metals & Mining',
    country: 'China',
    city: 'Shanghai',
    languages: ['Mandarin', 'English', 'Japanese'],
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    rating: 4.2,
    experience: 25,
    description: 'Major steel and metal products manufacturer with advanced production facilities. Serving construction, automotive, and industrial sectors globally.',
    specialties: ['Steel Production', 'Metal Fabrication', 'Industrial Materials'],
    minOrder: '¥100,000',
    annualRevenue: '¥12B',
    employees: '5000+',
    compatibilityScore: 83,
    isFavorite: false
  },
  {
    id: '12',
    name: 'BuildRight Construction',
    type: 'service_provider',
    industry: 'Construction',
    country: 'UAE',
    city: 'Dubai',
    languages: ['English', 'Arabic', 'Hindi'],
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    rating: 4.5,
    experience: 18,
    description: 'Premium construction company specializing in commercial and residential projects. Known for quality craftsmanship and timely delivery.',
    specialties: ['Commercial Construction', 'Project Management', 'Architectural Services'],
    minOrder: '$50,000',
    annualRevenue: '$95M',
    employees: '250-500',
    compatibilityScore: 89,
    isFavorite: false
  },
  {
    id: '13',
    name: 'TechInnovate Solutions',
    type: 'manufacturer',
    industry: 'Electronics',
    country: 'South Korea',
    city: 'Seoul',
    languages: ['Korean', 'English', 'Japanese'],
    certifications: ['ISO 9001', 'CE Mark', 'RoHS', 'FCC'],
    rating: 4.8,
    experience: 14,
    description: 'Cutting-edge electronics manufacturer specializing in consumer electronics and semiconductor components. Innovation-driven with strong R&D capabilities.',
    specialties: ['Consumer Electronics', 'Semiconductors', 'R&D'],
    minOrder: '₩20,000,000',
    annualRevenue: '₩180B',
    employees: '1000-5000',
    compatibilityScore: 93,
    isFavorite: false
  },
  {
    id: '14',
    name: 'Vintners Choice',
    type: 'manufacturer',
    industry: 'Food & Beverages',
    country: 'France',
    city: 'Bordeaux',
    languages: ['French', 'English', 'Spanish'],
    certifications: ['ISO 9001', 'HACCP', 'Organic Certified', 'AOC'],
    rating: 4.9,
    experience: 35,
    description: 'Prestigious wine producer with centuries of tradition. Specializing in premium wines and spirits with international acclaim.',
    specialties: ['Wine Production', 'Spirits', 'Organic Beverages'],
    minOrder: '€8,000',
    annualRevenue: '€65M',
    employees: '50-100',
    compatibilityScore: 94,
    isFavorite: false
  },
  {
    id: '15',
    name: 'AsiaPacific Trading',
    type: 'trading_company',
    industry: 'General Trading',
    country: 'Singapore',
    city: 'Singapore',
    languages: ['English', 'Mandarin', 'Malay', 'Japanese'],
    certifications: ['ISO 9001', 'AEO', 'SGD'],
    rating: 4.4,
    experience: 20,
    description: 'Established trading company with extensive network across Asia-Pacific. Specializing in cross-border trade and market entry strategies.',
    specialties: ['Cross-border Trade', 'Market Entry', 'Distribution'],
    minOrder: '$15,000',
    annualRevenue: '$55M',
    employees: '100-250',
    compatibilityScore: 86,
    isFavorite: false
  },
  {
    id: '16',
    name: 'Nordic Furniture Design',
    type: 'manufacturer',
    industry: 'Furniture',
    country: 'Sweden',
    city: 'Stockholm',
    languages: ['Swedish', 'English', 'German', 'Danish'],
    certifications: ['ISO 9001', 'FSC', 'Green Building'],
    rating: 4.7,
    experience: 22,
    description: 'Scandinavian furniture designer and manufacturer known for minimalist design and sustainable materials. Serving luxury and commercial markets.',
    specialties: ['Scandinavian Design', 'Sustainable Furniture', 'Custom Design'],
    minOrder: '€12,000',
    annualRevenue: '€45M',
    employees: '100-250',
    compatibilityScore: 90,
    isFavorite: false
  },
  {
    id: '17',
    name: 'MedSupply Solutions',
    type: 'distributor',
    industry: 'Medical Equipment',
    country: 'Canada',
    city: 'Toronto',
    languages: ['English', 'French', 'Spanish'],
    certifications: ['ISO 9001', 'ISO 13485', 'FDA', 'Health Canada'],
    rating: 4.6,
    experience: 15,
    description: 'Leading medical equipment distributor serving hospitals and healthcare facilities across North America. Specializing in diagnostic and therapeutic equipment.',
    specialties: ['Medical Equipment', 'Healthcare Solutions', 'Distribution'],
    minOrder: 'C$ 20,000',
    annualRevenue: 'C$ 75M',
    employees: '100-250',
    compatibilityScore: 88,
    isFavorite: false
  },
  {
    id: '18',
    name: 'SolarTech Energy',
    type: 'manufacturer',
    industry: 'Renewable Energy',
    country: 'Spain',
    city: 'Madrid',
    languages: ['Spanish', 'English', 'Portuguese', 'French'],
    certifications: ['ISO 9001', 'ISO 14001', 'TÜV', 'CE Mark'],
    rating: 4.5,
    experience: 12,
    description: 'Renewable energy solutions provider specializing in solar panels and wind energy systems. Committed to sustainable development and clean energy.',
    specialties: ['Solar Energy', 'Wind Power', 'Renewable Solutions'],
    minOrder: '€25,000',
    annualRevenue: '€85M',
    employees: '250-500',
    compatibilityScore: 89,
    isFavorite: false
  },
  {
    id: '19',
    name: 'Pacific Seafoods',
    type: 'manufacturer',
    industry: 'Food & Beverages',
    country: 'Australia',
    city: 'Sydney',
    languages: ['English', 'Mandarin', 'Japanese'],
    certifications: ['ISO 9001', 'HACCP', 'MSC', 'Organic Certified'],
    rating: 4.7,
    experience: 18,
    description: 'Sustainable seafood producer and processor with focus on responsible fishing practices. Serving premium markets across Asia-Pacific.',
    specialties: ['Sustainable Seafood', 'Fish Processing', 'Export'],
    minOrder: 'A$ 10,000',
    annualRevenue: 'A$ 55M',
    employees: '100-250',
    compatibilityScore: 91,
    isFavorite: false
  },
  {
    id: '20',
    name: 'SmartHome Systems',
    type: 'manufacturer',
    industry: 'Electronics',
    country: 'Taiwan',
    city: 'Taipei',
    languages: ['Mandarin', 'English', 'Japanese'],
    certifications: ['ISO 9001', 'CE Mark', 'FCC', 'RoHS'],
    rating: 4.4,
    experience: 10,
    description: 'Innovative smart home and IoT device manufacturer. Specializing in home automation systems and connected devices for modern living.',
    specialties: ['Smart Home', 'IoT Devices', 'Home Automation'],
    minOrder: '$8,000',
    annualRevenue: '$35M',
    employees: '50-100',
    compatibilityScore: 85,
    isFavorite: false
  }
];

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>(mockPartners);
  const [filters, setFilters] = useState<FilterOptions>({
    industry: '',
    country: '',
    partnerType: 'all',
    minRating: 0,
    languages: [],
    certifications: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery]);

  const applyFilters = () => {
    let filtered = partners;

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    if (filters.industry) {
      filtered = filtered.filter(partner => partner.industry === filters.industry);
    }

    if (filters.country) {
      filtered = filtered.filter(partner => partner.country === filters.country);
    }

    if (filters.partnerType !== 'all') {
      filtered = filtered.filter(partner => partner.type === filters.partnerType);
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(partner => partner.rating >= filters.minRating);
    }

    if (filters.languages.length > 0) {
      filtered = filtered.filter(partner =>
        filters.languages.every(lang => partner.languages.includes(lang))
      );
    }

    if (filters.certifications.length > 0) {
      filtered = filtered.filter(partner =>
        filters.certifications.every(cert => partner.certifications.includes(cert))
      );
    }

    setFilteredPartners(filtered);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleFavorite = (partnerId: string) => {
    setPartners(prev =>
      prev.map(partner =>
        partner.id === partnerId
          ? { ...partner, isFavorite: !partner.isFavorite }
          : partner
      )
    );
  };

  const getPartnerIcon = (type: string) => {
    switch (type) {
      case 'manufacturer':
        return <Factory className="w-5 h-5" />;
      case 'distributor':
        return <Truck className="w-5 h-5" />;
      case 'retailer':
        return <ShoppingCart className="w-5 h-5" />;
      case 'service_provider':
        return <Building className="w-5 h-5" />;
      case 'trading_company':
        return <Ship className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E7] to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Partner Matcher</h1>
              <p className="text-gray-600">Find the perfect trade partners for your business</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search partners by name, industry, or specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:w-auto"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              {showFilters && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Industry</Label>
                    <Select value={filters.industry} onValueChange={(v) => handleFilterChange('industry', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Industries</SelectItem>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Country</Label>
                    <Select value={filters.country} onValueChange={(v) => handleFilterChange('country', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Countries</SelectItem>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Partner Type</Label>
                    <Select value={filters.partnerType} onValueChange={(v) => handleFilterChange('partnerType', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {partnerTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Minimum Rating</Label>
                    <Select value={filters.minRating.toString()} onValueChange={(v) => handleFilterChange('minRating', Number(v))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any Rating</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Partners List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Found {filteredPartners.length} partners
              </h2>
            </div>

            <div className="space-y-4">
              {filteredPartners.map((partner) => (
                <Card
                  key={partner.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedPartner?.id === partner.id
                      ? 'border-purple-600 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPartner(partner)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getPartnerIcon(partner.type)}
                          <div>
                            <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                            <p className="text-sm text-gray-600">{partner.industry} • {partner.city}, {partner.country}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {partner.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {partner.specialties.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {partner.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{partner.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{partner.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Award className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-600">{partner.experience} years</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getCompatibilityColor(partner.compatibilityScore)}`} />
                            <span className="text-sm font-medium">{partner.compatibilityScore}% match</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(partner.id);
                        }}
                        className="ml-4"
                      >
                        <Heart className={`w-4 h-4 ${partner.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Partner Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-1"
          >
            {selectedPartner ? (
              <Card className="border-0 shadow-lg sticky top-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedPartner.name}</CardTitle>
                      <CardDescription>{selectedPartner.industry}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPartner(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-6">
                      {/* Compatibility Score */}
                      <div className="text-center">
                        <div className="relative inline-flex items-center justify-center w-24 h-24">
                          <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                          <div 
                            className="absolute inset-0 rounded-full bg-green-500"
                            style={{ clipPath: `inset(0 0 ${100 - selectedPartner.compatibilityScore}% 0)` }}
                          ></div>
                          <span className="relative text-2xl font-bold text-gray-900">
                            {selectedPartner.compatibilityScore}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Compatibility Score</p>
                      </div>

                      {/* Basic Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Company Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{selectedPartner.city}, {selectedPartner.country}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span>{selectedPartner.employees} employees</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span>Min Order: {selectedPartner.minOrder}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-gray-400" />
                            <span>Annual Revenue: {selectedPartner.annualRevenue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPartner.languages.map((language, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Globe className="w-3 h-3 mr-1" />
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPartner.certifications.map((cert, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Specialties */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPartner.specialties.map((specialty, index) => (
                            <Badge key={index} className="text-xs bg-purple-100 text-purple-800">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">About</h4>
                        <p className="text-sm text-gray-600">{selectedPartner.description}</p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-4 border-t border-gray-200">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Partner
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Heart className={`w-4 h-4 mr-2 ${selectedPartner.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                          {selectedPartner.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg h-full flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Partner</h3>
                  <p className="text-gray-600">
                    Click on a partner to view detailed information and compatibility score
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}