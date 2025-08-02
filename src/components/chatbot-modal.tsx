'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Download, 
  FileText, 
  Users, 
  Shield, 
  Globe,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Languages,
  Bot,
  Zap,
  TrendingUp,
  X
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  category?: 'tariff' | 'risk' | 'general' | 'market' | 'compliance';
}

interface Product {
  id: string;
  name: string;
  category: string;
  hsCode: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  avgTariff: number;
  demand: 'high' | 'medium' | 'low';
}

interface Country {
  id: string;
  name: string;
  code: string;
  region: string;
  currency: string;
  language: string;
  riskLevel: 'low' | 'medium' | 'high';
  easeOfBusiness: number;
}

interface TariffInfo {
  product: string;
  country: string;
  hsCode: string;
  baseTariff: number;
  additionalDuties: number;
  totalTariff: number;
  documentation: string[];
  restrictions: string[];
}

// Sample products for quick responses
const sampleProducts: Product[] = [
  { id: 'p1', name: 'Basmati Rice', category: 'Agricultural', hsCode: '1006.30', description: 'Premium long-grain aromatic rice', riskLevel: 'low', avgTariff: 5.2, demand: 'high' },
  { id: 'p2', name: 'Silk Fabrics', category: 'Textiles', hsCode: '5007.90', description: 'Pure silk fabrics, sarees', riskLevel: 'medium', avgTariff: 8.5, demand: 'high' },
  { id: 'p3', name: 'Mobile Phones', category: 'Machinery', hsCode: '8517.12', description: 'Smartphones', riskLevel: 'low', avgTariff: 3.5, demand: 'high' },
  { id: 'p4', name: 'Steel Products', category: 'Metals', hsCode: '7210.70', description: 'Steel sheets, coils', riskLevel: 'medium', avgTariff: 6.8, demand: 'high' },
  { id: 'p5', name: 'Processed Foods', category: 'Food', hsCode: '2004.90', description: 'Canned foods', riskLevel: 'medium', avgTariff: 12.5, demand: 'high' },
];

// Comprehensive Countries Database (150+ countries)
const countries: Country[] = [
  // North America
  { id: 'c1', name: 'United States', code: 'US', region: 'North America', currency: 'USD', language: 'English', riskLevel: 'low', easeOfBusiness: 85 },
  { id: 'c2', name: 'Canada', code: 'CA', region: 'North America', currency: 'CAD', language: 'English', riskLevel: 'low', easeOfBusiness: 82 },
  { id: 'c3', name: 'Mexico', code: 'MX', region: 'North America', currency: 'MXN', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 60 },
  
  // South America
  { id: 'c4', name: 'Brazil', code: 'BR', region: 'South America', currency: 'BRL', language: 'Portuguese', riskLevel: 'medium', easeOfBusiness: 65 },
  { id: 'c5', name: 'Argentina', code: 'AR', region: 'South America', currency: 'ARS', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 58 },
  { id: 'c6', name: 'Chile', code: 'CL', region: 'South America', currency: 'CLP', language: 'Spanish', riskLevel: 'low', easeOfBusiness: 73 },
  { id: 'c7', name: 'Colombia', code: 'CO', region: 'South America', currency: 'COP', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 67 },
  { id: 'c8', name: 'Peru', code: 'PE', region: 'South America', currency: 'PEN', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 68 },
  { id: 'c9', name: 'Venezuela', code: 'VE', region: 'South America', currency: 'VES', language: 'Spanish', riskLevel: 'high', easeOfBusiness: 35 },
  { id: 'c10', name: 'Ecuador', code: 'EC', region: 'South America', currency: 'USD', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 62 },
  { id: 'c11', name: 'Bolivia', code: 'BO', region: 'South America', currency: 'BOB', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 55 },
  { id: 'c12', name: 'Paraguay', code: 'PY', region: 'South America', currency: 'PYG', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 59 },
  { id: 'c13', name: 'Uruguay', code: 'UY', region: 'South America', currency: 'UYU', language: 'Spanish', riskLevel: 'low', easeOfBusiness: 70 },
  { id: 'c14', name: 'Guyana', code: 'GY', region: 'South America', currency: 'GYD', language: 'English', riskLevel: 'medium', easeOfBusiness: 57 },
  { id: 'c15', name: 'Suriname', code: 'SR', region: 'South America', currency: 'SRD', language: 'Dutch', riskLevel: 'medium', easeOfBusiness: 56 },
  
  // Europe
  { id: 'c16', name: 'United Kingdom', code: 'GB', region: 'Europe', currency: 'GBP', language: 'English', riskLevel: 'low', easeOfBusiness: 82 },
  { id: 'c17', name: 'Germany', code: 'DE', region: 'Europe', currency: 'EUR', language: 'German', riskLevel: 'low', easeOfBusiness: 78 },
  { id: 'c18', name: 'France', code: 'FR', region: 'Europe', currency: 'EUR', language: 'French', riskLevel: 'low', easeOfBusiness: 76 },
  { id: 'c19', name: 'Italy', code: 'IT', region: 'Europe', currency: 'EUR', language: 'Italian', riskLevel: 'low', easeOfBusiness: 74 },
  { id: 'c20', name: 'Spain', code: 'ES', region: 'Europe', currency: 'EUR', language: 'Spanish', riskLevel: 'low', easeOfBusiness: 75 },
  { id: 'c21', name: 'Netherlands', code: 'NL', region: 'Europe', currency: 'EUR', language: 'Dutch', riskLevel: 'low', easeOfBusiness: 80 },
  { id: 'c22', name: 'Switzerland', code: 'CH', region: 'Europe', currency: 'CHF', language: 'German', riskLevel: 'low', easeOfBusiness: 84 },
  { id: 'c23', name: 'Belgium', code: 'BE', region: 'Europe', currency: 'EUR', language: 'Dutch', riskLevel: 'low', easeOfBusiness: 77 },
  { id: 'c24', name: 'Austria', code: 'AT', region: 'Europe', currency: 'EUR', language: 'German', riskLevel: 'low', easeOfBusiness: 79 },
  { id: 'c25', name: 'Sweden', code: 'SE', region: 'Europe', currency: 'SEK', language: 'Swedish', riskLevel: 'low', easeOfBusiness: 81 },
  { id: 'c26', name: 'Norway', code: 'NO', region: 'Europe', currency: 'NOK', language: 'Norwegian', riskLevel: 'low', easeOfBusiness: 83 },
  { id: 'c27', name: 'Denmark', code: 'DK', region: 'Europe', currency: 'DKK', language: 'Danish', riskLevel: 'low', easeOfBusiness: 80 },
  { id: 'c28', name: 'Finland', code: 'FI', region: 'Europe', currency: 'EUR', language: 'Finnish', riskLevel: 'low', easeOfBusiness: 78 },
  { id: 'c29', name: 'Poland', code: 'PL', region: 'Europe', currency: 'PLN', language: 'Polish', riskLevel: 'low', easeOfBusiness: 72 },
  { id: 'c30', name: 'Czech Republic', code: 'CZ', region: 'Europe', currency: 'CZK', language: 'Czech', riskLevel: 'low', easeOfBusiness: 74 },
  { id: 'c31', name: 'Hungary', code: 'HU', region: 'Europe', currency: 'HUF', language: 'Hungarian', riskLevel: 'low', easeOfBusiness: 69 },
  { id: 'c32', name: 'Portugal', code: 'PT', region: 'Europe', currency: 'EUR', language: 'Portuguese', riskLevel: 'low', easeOfBusiness: 71 },
  { id: 'c33', name: 'Greece', code: 'GR', region: 'Europe', currency: 'EUR', language: 'Greek', riskLevel: 'medium', easeOfBusiness: 67 },
  { id: 'c34', name: 'Ireland', code: 'IE', region: 'Europe', currency: 'EUR', language: 'English', riskLevel: 'low', easeOfBusiness: 81 },
  { id: 'c35', name: 'Romania', code: 'RO', region: 'Europe', currency: 'RON', language: 'Romanian', riskLevel: 'medium', easeOfBusiness: 65 },
  { id: 'c36', name: 'Bulgaria', code: 'BG', region: 'Europe', currency: 'BGN', language: 'Bulgarian', riskLevel: 'medium', easeOfBusiness: 61 },
  { id: 'c37', name: 'Croatia', code: 'HR', region: 'Europe', currency: 'EUR', language: 'Croatian', riskLevel: 'low', easeOfBusiness: 70 },
  { id: 'c38', name: 'Slovakia', code: 'SK', region: 'Europe', currency: 'EUR', language: 'Slovak', riskLevel: 'low', easeOfBusiness: 73 },
  { id: 'c39', name: 'Slovenia', code: 'SI', region: 'Europe', currency: 'EUR', language: 'Slovenian', riskLevel: 'low', easeOfBusiness: 75 },
  { id: 'c40', name: 'Lithuania', code: 'LT', region: 'Europe', currency: 'EUR', language: 'Lithuanian', riskLevel: 'low', easeOfBusiness: 71 },
  { id: 'c41', name: 'Latvia', code: 'LV', region: 'Europe', currency: 'EUR', language: 'Latvian', riskLevel: 'low', easeOfBusiness: 68 },
  { id: 'c42', name: 'Estonia', code: 'EE', region: 'Europe', currency: 'EUR', language: 'Estonian', riskLevel: 'low', easeOfBusiness: 72 },
  { id: 'c43', name: 'Luxembourg', code: 'LU', region: 'Europe', currency: 'EUR', language: 'Luxembourgish', riskLevel: 'low', easeOfBusiness: 83 },
  
  // Africa
  { id: 'c44', name: 'South Africa', code: 'ZA', region: 'Africa', currency: 'ZAR', language: 'English', riskLevel: 'medium', easeOfBusiness: 66 },
  { id: 'c45', name: 'Nigeria', code: 'NG', region: 'Africa', currency: 'NGN', language: 'English', riskLevel: 'high', easeOfBusiness: 45 },
  { id: 'c46', name: 'Egypt', code: 'EG', region: 'Africa', currency: 'EGP', language: 'Arabic', riskLevel: 'medium', easeOfBusiness: 52 },
  { id: 'c47', name: 'Kenya', code: 'KE', region: 'Africa', currency: 'KES', language: 'English', riskLevel: 'medium', easeOfBusiness: 56 },
  { id: 'c48', name: 'Ghana', code: 'GH', region: 'Africa', currency: 'GHS', language: 'English', riskLevel: 'medium', easeOfBusiness: 58 },
  { id: 'c49', name: 'Morocco', code: 'MA', region: 'Africa', currency: 'MAD', language: 'Arabic', riskLevel: 'medium', easeOfBusiness: 53 },
  { id: 'c50', name: 'Tunisia', code: 'TN', region: 'Africa', currency: 'TND', language: 'Arabic', riskLevel: 'medium', easeOfBusiness: 54 },
  { id: 'c51', name: 'Algeria', code: 'DZ', region: 'Africa', currency: 'DZD', language: 'Arabic', riskLevel: 'medium', easeOfBusiness: 48 },
  { id: 'c52', name: 'Ethiopia', code: 'ET', region: 'Africa', currency: 'ETB', language: 'Amharic', riskLevel: 'high', easeOfBusiness: 43 },
  { id: 'c53', name: 'Tanzania', code: 'TZ', region: 'Africa', currency: 'TZS', language: 'Swahili', riskLevel: 'medium', easeOfBusiness: 51 },
  { id: 'c54', name: 'Uganda', code: 'UG', region: 'Africa', currency: 'UGX', language: 'English', riskLevel: 'medium', easeOfBusiness: 49 },
  { id: 'c55', name: 'Zambia', code: 'ZM', region: 'Africa', currency: 'ZMW', language: 'English', riskLevel: 'medium', easeOfBusiness: 47 },
  { id: 'c56', name: 'Zimbabwe', code: 'ZW', region: 'Africa', currency: 'USD', language: 'English', riskLevel: 'high', easeOfBusiness: 38 },
  { id: 'c57', name: 'Botswana', code: 'BW', region: 'Africa', currency: 'BWP', language: 'English', riskLevel: 'low', easeOfBusiness: 63 },
  { id: 'c58', name: 'Namibia', code: 'NA', region: 'Africa', currency: 'NAD', language: 'English', riskLevel: 'low', easeOfBusiness: 61 },
  { id: 'c59', name: 'Mozambique', code: 'MZ', region: 'Africa', currency: 'MZN', language: 'Portuguese', riskLevel: 'high', easeOfBusiness: 42 },
  { id: 'c60', name: 'Angola', code: 'AO', region: 'Africa', currency: 'AOA', language: 'Portuguese', riskLevel: 'high', easeOfBusiness: 44 },
  { id: 'c61', name: 'Cameroon', code: 'CM', region: 'Africa', currency: 'XAF', language: 'French', riskLevel: 'medium', easeOfBusiness: 50 },
  { id: 'c62', name: 'Ivory Coast', code: 'CI', region: 'Africa', currency: 'XOF', language: 'French', riskLevel: 'medium', easeOfBusiness: 55 },
  { id: 'c63', name: 'Senegal', code: 'SN', region: 'Africa', currency: 'XOF', language: 'French', riskLevel: 'medium', easeOfBusiness: 57 },
  { id: 'c64', name: 'Mali', code: 'ML', region: 'Africa', currency: 'XOF', language: 'French', riskLevel: 'high', easeOfBusiness: 41 },
  { id: 'c65', name: 'Burkina Faso', code: 'BF', region: 'Africa', currency: 'XOF', language: 'French', riskLevel: 'high', easeOfBusiness: 40 },
  { id: 'c66', name: 'Niger', code: 'NE', region: 'Africa', currency: 'XOF', language: 'French', riskLevel: 'high', easeOfBusiness: 39 },
  { id: 'c67', name: 'Chad', code: 'TD', region: 'Africa', currency: 'XAF', language: 'French', riskLevel: 'high', easeOfBusiness: 37 },
  { id: 'c68', name: 'Sudan', code: 'SD', region: 'Africa', currency: 'SDG', language: 'Arabic', riskLevel: 'high', easeOfBusiness: 36 },
  { id: 'c69', name: 'Libya', code: 'LY', region: 'Africa', currency: 'LYD', language: 'Arabic', riskLevel: 'high', easeOfBusiness: 46 },
  
  // Middle East
  { id: 'c70', name: 'United Arab Emirates', code: 'AE', region: 'Middle East', currency: 'AED', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 75 },
  { id: 'c71', name: 'Saudi Arabia', code: 'SA', region: 'Middle East', currency: 'SAR', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 62 },
  { id: 'c72', name: 'Israel', code: 'IL', region: 'Middle East', currency: 'ILS', language: 'Hebrew', riskLevel: 'medium', easeOfBusiness: 64 },
  { id: 'c73', name: 'Turkey', code: 'TR', region: 'Middle East', currency: 'TRY', language: 'Turkish', riskLevel: 'medium', easeOfBusiness: 59 },
  { id: 'c74', name: 'Iran', code: 'IR', region: 'Middle East', currency: 'IRR', language: 'Persian', riskLevel: 'high', easeOfBusiness: 41 },
  { id: 'c75', name: 'Iraq', code: 'IQ', region: 'Middle East', currency: 'IQD', language: 'Arabic', riskLevel: 'high', easeOfBusiness: 34 },
  { id: 'c76', name: 'Qatar', code: 'QA', region: 'Middle East', currency: 'QAR', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 68 },
  { id: 'c77', name: 'Kuwait', code: 'KW', region: 'Middle East', currency: 'KWD', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 71 },
  { id: 'c78', name: 'Bahrain', code: 'BH', region: 'Middle East', currency: 'BHD', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 66 },
  { id: 'c79', name: 'Oman', code: 'OM', region: 'Middle East', currency: 'OMR', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 64 },
  { id: 'c80', name: 'Jordan', code: 'JO', region: 'Middle East', currency: 'JOD', language: 'Arabic', riskLevel: 'medium', easeOfBusiness: 60 },
  { id: 'c81', name: 'Lebanon', code: 'LB', region: 'Middle East', currency: 'LBP', language: 'Arabic', riskLevel: 'high', easeOfBusiness: 32 },
  { id: 'c82', name: 'Syria', code: 'SY', region: 'Middle East', currency: 'SYP', language: 'Arabic', riskLevel: 'high', easeOfBusiness: 31 },
  { id: 'c83', name: 'Yemen', code: 'YE', region: 'Middle East', currency: 'YER', language: 'Arabic', riskLevel: 'high', easeOfBusiness: 33 },
  
  // Asia
  { id: 'c84', name: 'China', code: 'CN', region: 'Asia', currency: 'CNY', language: 'Chinese', riskLevel: 'medium', easeOfBusiness: 77 },
  { id: 'c85', name: 'Japan', code: 'JP', region: 'Asia', currency: 'JPY', language: 'Japanese', riskLevel: 'low', easeOfBusiness: 76 },
  { id: 'c86', name: 'South Korea', code: 'KR', region: 'Asia', currency: 'KRW', language: 'Korean', riskLevel: 'low', easeOfBusiness: 74 },
  { id: 'c87', name: 'India', code: 'IN', region: 'Asia', currency: 'INR', language: 'Hindi', riskLevel: 'medium', easeOfBusiness: 63 },
  { id: 'c88', name: 'Indonesia', code: 'ID', region: 'Asia', currency: 'IDR', language: 'Indonesian', riskLevel: 'medium', easeOfBusiness: 68 },
  { id: 'c89', name: 'Thailand', code: 'TH', region: 'Asia', currency: 'THB', language: 'Thai', riskLevel: 'medium', easeOfBusiness: 71 },
  { id: 'c90', name: 'Vietnam', code: 'VN', region: 'Asia', currency: 'VND', language: 'Vietnamese', riskLevel: 'medium', easeOfBusiness: 70 },
  { id: 'c91', name: 'Malaysia', code: 'MY', region: 'Asia', currency: 'MYR', language: 'Malay', riskLevel: 'low', easeOfBusiness: 72 },
  { id: 'c92', name: 'Singapore', code: 'SG', region: 'Asia', currency: 'SGD', language: 'English', riskLevel: 'low', easeOfBusiness: 86 },
  { id: 'c93', name: 'Philippines', code: 'PH', region: 'Asia', currency: 'PHP', language: 'Filipino', riskLevel: 'medium', easeOfBusiness: 62 },
  { id: 'c94', name: 'Pakistan', code: 'PK', region: 'Asia', currency: 'PKR', language: 'Urdu', riskLevel: 'high', easeOfBusiness: 54 },
  { id: 'c95', name: 'Bangladesh', code: 'BD', region: 'Asia', currency: 'BDT', language: 'Bengali', riskLevel: 'medium', easeOfBusiness: 56 },
  { id: 'c96', name: 'Sri Lanka', code: 'LK', region: 'Asia', currency: 'LKR', language: 'Sinhala', riskLevel: 'medium', easeOfBusiness: 53 },
  { id: 'c97', name: 'Myanmar', code: 'MM', region: 'Asia', currency: 'MMK', language: 'Burmese', riskLevel: 'high', easeOfBusiness: 45 },
  { id: 'c98', name: 'Nepal', code: 'NP', region: 'Asia', currency: 'NPR', language: 'Nepali', riskLevel: 'medium', easeOfBusiness: 51 },
  { id: 'c99', name: 'Bhutan', code: 'BT', region: 'Asia', currency: 'BTN', language: 'Dzongkha', riskLevel: 'medium', easeOfBusiness: 52 },
  { id: 'c100', name: 'Maldives', code: 'MV', region: 'Asia', currency: 'MVR', language: 'Dhivehi', riskLevel: 'medium', easeOfBusiness: 65 },
  { id: 'c101', name: 'Afghanistan', code: 'AF', region: 'Asia', currency: 'AFN', language: 'Pashto', riskLevel: 'high', easeOfBusiness: 30 },
  { id: 'c102', name: 'Cambodia', code: 'KH', region: 'Asia', currency: 'KHR', language: 'Khmer', riskLevel: 'medium', easeOfBusiness: 48 },
  { id: 'c103', name: 'Laos', code: 'LA', region: 'Asia', currency: 'LAK', language: 'Lao', riskLevel: 'medium', easeOfBusiness: 46 },
  { id: 'c104', name: 'Brunei', code: 'BN', region: 'Asia', currency: 'BND', language: 'Malay', riskLevel: 'low', easeOfBusiness: 67 },
  { id: 'c105', name: 'Timor-Leste', code: 'TL', region: 'Asia', currency: 'USD', language: 'Tetum', riskLevel: 'high', easeOfBusiness: 44 },
  
  // Oceania
  { id: 'c106', name: 'Australia', code: 'AU', region: 'Oceania', currency: 'AUD', language: 'English', riskLevel: 'low', easeOfBusiness: 80 },
  { id: 'c107', name: 'New Zealand', code: 'NZ', region: 'Oceania', currency: 'NZD', language: 'English', riskLevel: 'low', easeOfBusiness: 78 },
  { id: 'c108', name: 'Fiji', code: 'FJ', region: 'Oceania', currency: 'FJD', language: 'English', riskLevel: 'medium', easeOfBusiness: 64 },
  { id: 'c109', name: 'Papua New Guinea', code: 'PG', region: 'Oceania', currency: 'PGK', language: 'English', riskLevel: 'high', easeOfBusiness: 42 },
  { id: 'c110', name: 'Solomon Islands', code: 'SB', region: 'Oceania', currency: 'SBD', language: 'English', riskLevel: 'high', easeOfBusiness: 43 },
  { id: 'c111', name: 'Vanuatu', code: 'VU', region: 'Oceania', currency: 'VUV', language: 'English', riskLevel: 'medium', easeOfBusiness: 61 },
  { id: 'c112', name: 'Samoa', code: 'WS', region: 'Oceania', currency: 'WST', language: 'Samoan', riskLevel: 'medium', easeOfBusiness: 60 },
  { id: 'c113', name: 'Tonga', code: 'TO', region: 'Oceania', currency: 'TOP', language: 'Tongan', riskLevel: 'medium', easeOfBusiness: 59 },
  { id: 'c114', name: 'Kiribati', code: 'KI', region: 'Oceania', currency: 'AUD', language: 'English', riskLevel: 'medium', easeOfBusiness: 58 },
  { id: 'c115', name: 'Tuvalu', code: 'TV', region: 'Oceania', currency: 'AUD', language: 'English', riskLevel: 'medium', easeOfBusiness: 57 },
  { id: 'c116', name: 'Nauru', code: 'NR', region: 'Oceania', currency: 'AUD', language: 'English', riskLevel: 'medium', easeOfBusiness: 56 },
  { id: 'c117', name: 'Palau', code: 'PW', region: 'Oceania', currency: 'USD', language: 'English', riskLevel: 'medium', easeOfBusiness: 63 },
  { id: 'c118', name: 'Micronesia', code: 'FM', region: 'Oceania', currency: 'USD', language: 'English', riskLevel: 'medium', easeOfBusiness: 62 },
  { id: 'c119', name: 'Marshall Islands', code: 'MH', region: 'Oceania', currency: 'USD', language: 'English', riskLevel: 'medium', easeOfBusiness: 61 },
  
  // Additional European Countries
  { id: 'c120', name: 'Russia', code: 'RU', region: 'Europe', currency: 'RUB', language: 'Russian', riskLevel: 'high', easeOfBusiness: 40 },
  { id: 'c121', name: 'Ukraine', code: 'UA', region: 'Europe', currency: 'UAH', language: 'Ukrainian', riskLevel: 'high', easeOfBusiness: 35 },
  { id: 'c122', name: 'Belarus', code: 'BY', region: 'Europe', currency: 'BYN', language: 'Belarusian', riskLevel: 'high', easeOfBusiness: 38 },
  { id: 'c123', name: 'Moldova', code: 'MD', region: 'Europe', currency: 'MDL', language: 'Moldovan', riskLevel: 'medium', easeOfBusiness: 49 },
  { id: 'c124', name: 'Albania', code: 'AL', region: 'Europe', currency: 'ALL', language: 'Albanian', riskLevel: 'medium', easeOfBusiness: 54 },
  { id: 'c125', name: 'North Macedonia', code: 'MK', region: 'Europe', currency: 'MKD', language: 'Macedonian', riskLevel: 'medium', easeOfBusiness: 56 },
  { id: 'c126', name: 'Serbia', code: 'RS', region: 'Europe', currency: 'RSD', language: 'Serbian', riskLevel: 'medium', easeOfBusiness: 58 },
  { id: 'c127', name: 'Montenegro', code: 'ME', region: 'Europe', currency: 'EUR', language: 'Montenegrin', riskLevel: 'medium', easeOfBusiness: 60 },
  { id: 'c128', name: 'Bosnia and Herzegovina', code: 'BA', region: 'Europe', currency: 'BAM', language: 'Bosnian', riskLevel: 'medium', easeOfBusiness: 55 },
  { id: 'c129', name: 'Kosovo', code: 'XK', region: 'Europe', currency: 'EUR', language: 'Albanian', riskLevel: 'medium', easeOfBusiness: 53 },
  { id: 'c130', name: 'Malta', code: 'MT', region: 'Europe', currency: 'EUR', language: 'Maltese', riskLevel: 'low', easeOfBusiness: 76 },
  { id: 'c131', name: 'Cyprus', code: 'CY', region: 'Europe', currency: 'EUR', language: 'Greek', riskLevel: 'low', easeOfBusiness: 72 },
  { id: 'c132', name: 'Iceland', code: 'IS', region: 'Europe', currency: 'ISK', language: 'Icelandic', riskLevel: 'low', easeOfBusiness: 75 },
  
  // Additional Asian Countries
  { id: 'c133', name: 'Taiwan', code: 'TW', region: 'Asia', currency: 'TWD', language: 'Chinese', riskLevel: 'low', easeOfBusiness: 73 },
  { id: 'c134', name: 'Hong Kong', code: 'HK', region: 'Asia', currency: 'HKD', language: 'Chinese', riskLevel: 'low', easeOfBusiness: 85 },
  { id: 'c135', name: 'Macau', code: 'MO', region: 'Asia', currency: 'MOP', language: 'Chinese', riskLevel: 'low', easeOfBusiness: 82 },
  { id: 'c136', name: 'Mongolia', code: 'MN', region: 'Asia', currency: 'MNT', language: 'Mongolian', riskLevel: 'medium', easeOfBusiness: 50 },
  { id: 'c137', name: 'North Korea', code: 'KP', region: 'Asia', currency: 'KPW', language: 'Korean', riskLevel: 'high', easeOfBusiness: 25 },
  
  // Additional African Countries
  { id: 'c138', name: 'Madagascar', code: 'MG', region: 'Africa', currency: 'MGA', language: 'Malagasy', riskLevel: 'high', easeOfBusiness: 39 },
  { id: 'c139', name: 'Mauritius', code: 'MU', region: 'Africa', currency: 'MUR', language: 'English', riskLevel: 'low', easeOfBusiness: 69 },
  { id: 'c140', name: 'Seychelles', code: 'SC', region: 'Africa', currency: 'SCR', language: 'English', riskLevel: 'low', easeOfBusiness: 74 },
  { id: 'c141', name: 'Comoros', code: 'KM', region: 'Africa', currency: 'KMF', language: 'Comorian', riskLevel: 'high', easeOfBusiness: 41 },
  { id: 'c142', name: 'Mauritania', code: 'MR', region: 'Africa', currency: 'MRU', language: 'Arabic', riskLevel: 'high', easeOfBusiness: 42 },
  { id: 'c143', name: 'Cape Verde', code: 'CV', region: 'Africa', currency: 'CVE', language: 'Portuguese', riskLevel: 'medium', easeOfBusiness: 55 },
  { id: 'c144', name: 'Sao Tome and Principe', code: 'ST', region: 'Africa', currency: 'STN', language: 'Portuguese', riskLevel: 'high', easeOfBusiness: 44 },
  { id: 'c145', name: 'Guinea', code: 'GN', region: 'Africa', currency: 'GNF', language: 'French', riskLevel: 'high', easeOfBusiness: 43 },
  { id: 'c146', name: 'Guinea-Bissau', code: 'GW', region: 'Africa', currency: 'XOF', language: 'Portuguese', riskLevel: 'high', easeOfBusiness: 40 },
  { id: 'c147', name: 'Sierra Leone', code: 'SL', region: 'Africa', currency: 'SLL', language: 'English', riskLevel: 'high', easeOfBusiness: 38 },
  { id: 'c148', name: 'Liberia', code: 'LR', region: 'Africa', currency: 'LRD', language: 'English', riskLevel: 'high', easeOfBusiness: 37 },
  { id: 'c149', name: 'Burundi', code: 'BI', region: 'Africa', currency: 'BIF', language: 'French', riskLevel: 'high', easeOfBusiness: 36 },
  { id: 'c150', name: 'Djibouti', code: 'DJ', region: 'Africa', currency: 'DJF', language: 'French', riskLevel: 'high', easeOfBusiness: 45 },
  { id: 'c151', name: 'Somalia', code: 'SO', region: 'Africa', currency: 'SOS', language: 'Somali', riskLevel: 'high', easeOfBusiness: 30 },
  { id: 'c152', name: 'Eritrea', code: 'ER', region: 'Africa', currency: 'ERN', language: 'Tigrinya', riskLevel: 'high', easeOfBusiness: 33 },
  { id: 'c153', name: 'South Sudan', code: 'SS', region: 'Africa', currency: 'SSP', language: 'English', riskLevel: 'high', easeOfBusiness: 29 },
  { id: 'c154', name: 'Central African Republic', code: 'CF', region: 'Africa', currency: 'XAF', language: 'French', riskLevel: 'high', easeOfBusiness: 34 },
  { id: 'c155', name: 'Equatorial Guinea', code: 'GQ', region: 'Africa', currency: 'XAF', language: 'Spanish', riskLevel: 'high', easeOfBusiness: 46 },
  { id: 'c156', name: 'Gabon', code: 'GA', region: 'Africa', currency: 'XAF', language: 'French', riskLevel: 'medium', easeOfBusiness: 54 },
  { id: 'c157', name: 'Congo', code: 'CG', region: 'Africa', currency: 'XAF', language: 'French', riskLevel: 'medium', easeOfBusiness: 51 },
  { id: 'c158', name: 'Democratic Republic of Congo', code: 'CD', region: 'Africa', currency: 'CDF', language: 'French', riskLevel: 'high', easeOfBusiness: 35 },
  { id: 'c159', name: 'Rwanda', code: 'RW', region: 'Africa', currency: 'RWF', language: 'Kinyarwanda', riskLevel: 'medium', easeOfBusiness: 48 },
  { id: 'c160', name: 'Benin', code: 'BJ', region: 'Africa', currency: 'XOF', language: 'French', riskLevel: 'medium', easeOfBusiness: 52 },
  { id: 'c161', name: 'Togo', code: 'TG', region: 'Africa', currency: 'XOF', language: 'French', riskLevel: 'medium', easeOfBusiness: 49 },
  { id: 'c162', name: 'Gambia', code: 'GM', region: 'Africa', currency: 'GMD', language: 'English', riskLevel: 'medium', easeOfBusiness: 47 },
  { id: 'c163', name: 'Lesotho', code: 'LS', region: 'Africa', currency: 'LSL', language: 'English', riskLevel: 'medium', easeOfBusiness: 50 },
  { id: 'c164', name: 'Eswatini', code: 'SZ', region: 'Africa', currency: 'SZL', language: 'English', riskLevel: 'medium', easeOfBusiness: 51 },
  { id: 'c165', name: 'Comoros', code: 'KM', region: 'Africa', currency: 'KMF', language: 'Comorian', riskLevel: 'high', easeOfBusiness: 41 }
];

// Comprehensive Tariff Database for Indian Products
const tariffDatabase: Record<string, Record<string, TariffInfo>> = {};

// Initialize tariff data for Tea (HS Code: 0902.30) - Example for all countries
function initializeTeaTariffs() {
  const teaHSCode = '0902.30';
  const baseTariff = 6.4; // Base tariff rate for tea
  
  countries.forEach(country => {
    let countrySpecificTariff = baseTariff;
    let additionalDuties = 0;
    let restrictions: string[] = [];
    let documentation: string[] = [
      'Commercial Invoice',
      'Packing List',
      'Certificate of Origin',
      'Bill of Lading',
      'Phytosanitary Certificate',
      'Health Certificate',
      'Fumigation Certificate'
    ];

    // Adjust tariffs based on country groups and trade agreements
    if (country.region === 'South Asia') {
      countrySpecificTariff = 0; // SAARC preferential rates
      documentation.push('SAARC Certificate of Origin');
    } else if (country.region === 'ASEAN') {
      countrySpecificTariff = baseTariff * 0.5; // 50% reduction under FTA
      documentation.push('ASEAN Trade Agreement Certificate');
    } else if (country.code === 'US' || country.code === 'CA' || country.code === 'GB') {
      countrySpecificTariff = baseTariff;
      additionalDuties = 2; // Additional duties
    } else if (country.region === 'European Union') {
      countrySpecificTariff = baseTariff * 0.8; // EU preferential rates
      documentation.push('EUR.1 Certificate');
    } else if (country.region === 'Middle East') {
      countrySpecificTariff = baseTariff * 1.2; // Higher tariffs
      restrictions.push('Halal certification required');
    } else if (country.region === 'Africa') {
      countrySpecificTariff = baseTariff * 1.5; // Higher tariffs for African countries
      restrictions.push('Import license required');
    }

    // Add country-specific restrictions
    if (country.code === 'CN') {
      restrictions.push('Quality inspection required');
      documentation.push('China Compulsory Certificate');
    } else if (country.code === 'JP') {
      restrictions.push('Strict quality standards');
      documentation.push('Japanese Agricultural Standards Certificate');
    } else if (country.code === 'KR') {
      restrictions.push('KC certification required');
      documentation.push('Korea Certification Mark');
    }

    const totalTariff = countrySpecificTariff + additionalDuties;

    if (!tariffDatabase['Tea']) {
      tariffDatabase['Tea'] = {};
    }

    tariffDatabase['Tea'][country.name] = {
      product: 'Tea',
      country: country.name,
      hsCode: teaHSCode,
      baseTariff: countrySpecificTariff,
      additionalDuties: additionalDuties,
      totalTariff: totalTariff,
      documentation: documentation,
      restrictions: restrictions
    };
  });
}

// Initialize tariff data for Basmati Rice (HS Code: 1006.30)
function initializeRiceTariffs() {
  const riceHSCode = '1006.30';
  const baseTariff = 5.2;
  
  countries.forEach(country => {
    let countrySpecificTariff = baseTariff;
    let additionalDuties = 0;
    let restrictions: string[] = [];
    let documentation: string[] = [
      'Commercial Invoice',
      'Packing List',
      'Certificate of Origin',
      'Bill of Lading',
      'Phytosanitary Certificate',
      'Quality Certificate',
      'Fumigation Certificate'
    ];

    if (country.region === 'South Asia') {
      countrySpecificTariff = 0;
      documentation.push('SAARC Certificate of Origin');
    } else if (country.region === 'Middle East') {
      countrySpecificTariff = baseTariff * 0.5; // Middle East loves Basmati
      documentation.push('Halal Certificate');
    } else if (country.code === 'US') {
      countrySpecificTariff = baseTariff * 1.5; // Higher US tariffs
      restrictions.push('FDA approval required');
    } else if (country.region === 'European Union') {
      countrySpecificTariff = baseTariff * 1.2;
      documentation.push('EU Health Certificate');
    }

    const totalTariff = countrySpecificTariff + additionalDuties;

    if (!tariffDatabase['Basmati Rice']) {
      tariffDatabase['Basmati Rice'] = {};
    }

    tariffDatabase['Basmati Rice'][country.name] = {
      product: 'Basmati Rice',
      country: country.name,
      hsCode: riceHSCode,
      baseTariff: countrySpecificTariff,
      additionalDuties: additionalDuties,
      totalTariff: totalTariff,
      documentation: documentation,
      restrictions: restrictions
    };
  });
}

// Initialize tariff data for more products
function initializeProductTariffs() {
  // Textiles
  const textileProducts = ['Silk Fabrics', 'Cotton Fabrics', 'Wool Fabrics'];
  textileProducts.forEach(product => {
    const baseTariff = product === 'Silk Fabrics' ? 8.5 : product === 'Cotton Fabrics' ? 6.8 : 7.2;
    
    countries.forEach(country => {
      let countrySpecificTariff = baseTariff;
      let additionalDuties = 0;
      let restrictions: string[] = [];
      let documentation: string[] = [
        'Commercial Invoice',
        'Packing List',
        'Certificate of Origin',
        'Bill of Lading',
        'Textile Certification'
      ];

      if (country.region === 'European Union' || country.code === 'US') {
        restrictions.push('Textile labeling requirements');
        documentation.push('Textile Label Certificate');
      }

      const totalTariff = countrySpecificTariff + additionalDuties;

      if (!tariffDatabase[product]) {
        tariffDatabase[product] = {};
      }

      tariffDatabase[product][country.name] = {
        product: product,
        country: country.name,
        hsCode: product === 'Silk Fabrics' ? '5007.90' : product === 'Cotton Fabrics' ? '5208.21' : '5111.11',
        baseTariff: countrySpecificTariff,
        additionalDuties: additionalDuties,
        totalTariff: totalTariff,
        documentation: documentation,
        restrictions: restrictions
      };
    });
  });

  // Machinery and Electronics
  const machineryProducts = ['Mobile Phones', 'Laptops', 'Solar Panels'];
  machineryProducts.forEach(product => {
    const baseTariff = product === 'Mobile Phones' ? 3.5 : product === 'Laptops' ? 3.8 : 3.2;
    
    countries.forEach(country => {
      let countrySpecificTariff = baseTariff;
      let additionalDuties = 0;
      let restrictions: string[] = [];
      let documentation: string[] = [
        'Commercial Invoice',
        'Packing List',
        'Certificate of Origin',
        'Bill of Lading',
        'Technical Specifications',
        'Warranty Certificate'
      ];

      if (product === 'Mobile Phones' || product === 'Laptops') {
        restrictions.push('Safety certification required');
        documentation.push('Safety Certificate');
      }

      const totalTariff = countrySpecificTariff + additionalDuties;

      if (!tariffDatabase[product]) {
        tariffDatabase[product] = {};
      }

      tariffDatabase[product][country.name] = {
        product: product,
        country: country.name,
        hsCode: product === 'Mobile Phones' ? '8517.12' : product === 'Laptops' ? '8471.30' : '8541.40',
        baseTariff: countrySpecificTariff,
        additionalDuties: additionalDuties,
        totalTariff: totalTariff,
        documentation: documentation,
        restrictions: restrictions
      };
    });
  });
}

// Initialize all tariff data
initializeTeaTariffs();
initializeRiceTariffs();
initializeProductTariffs();

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your TradeGenie AI assistant. I can help you with:\n\n📄 **Document Requirements** - Ask about needed documents for specific products and countries\n💰 **Profit Analysis** - Get detailed profit analysis for different markets\n🌍 **Market Intelligence** - Learn about market trends and opportunities\n📦 **Product Information** - Find details about products and HS codes\n🤝 **General Trade Assistance** - Any trade-related questions\n\nHow can I assist you today?",
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enhanced document requirements queries with comprehensive tariff data
    if (lowerMessage.includes('document') || lowerMessage.includes('requirement') || lowerMessage.includes('paperwork')) {
      // Try to find product in tariff database first
      let foundProduct = null;
      let foundCountry = null;
      
      // Check for products in tariff database
      for (const productName in tariffDatabase) {
        if (lowerMessage.includes(productName.toLowerCase())) {
          foundProduct = productName;
          break;
        }
      }
      
      // Check for countries
      for (const country of countries) {
        if (lowerMessage.includes(country.name.toLowerCase())) {
          foundCountry = country;
          break;
        }
      }
      
      if (foundProduct && foundCountry) {
        const tariffInfo = tariffDatabase[foundProduct]?.[foundCountry.name];
        if (tariffInfo) {
          return `**Document Requirements for ${foundProduct} to ${foundCountry.name}**\n\n**Tariff Information:**\n• **HS Code:** ${tariffInfo.hsCode}\n• **Base Tariff:** ${tariffInfo.baseTariff}%\n• **Additional Duties:** ${tariffInfo.additionalDuties}%\n• **Total Tariff:** ${tariffInfo.totalTariff}%\n\n**Required Documents:**\n${tariffInfo.documentation.map(doc => `• ${doc}`).join('\n')}\n\n**Restrictions:**\n${tariffInfo.restrictions.length > 0 ? tariffInfo.restrictions.map(r => `• ${r}`).join('\n') : '• No specific restrictions'}\n\n**Market Information:**\n• **Currency:** ${foundCountry.currency}\n• **Risk Level:** ${foundCountry.riskLevel.toUpperCase()}\n• **Ease of Business:** ${foundCountry.easeOfBusiness}/100\n\nWould you like me to help you generate any of these documents or provide profit analysis?`;
        }
      }
      
      // Fallback to sample products if not found in tariff database
      const product = sampleProducts.find(p => lowerMessage.includes(p.name.toLowerCase()));
      const country = countries.find(c => lowerMessage.includes(c.name.toLowerCase()));
      
      if (product && country) {
        return `**Document Requirements for ${product.name} to ${country.name}**\n\n**Required Documents:**\n• Commercial Invoice\n• Packing List\n• Certificate of Origin\n• Bill of Lading\n• Import License\n• Phytosanitary Certificate (for agricultural products)\n• Quality Inspection Certificate\n\n**HS Code:** ${product.hsCode}\n**Estimated Processing Time:** 7-14 days\n**Risk Level:** ${product.riskLevel.toUpperCase()}\n\nWould you like me to help you generate any of these documents?`;
      } else if (product) {
        return `For **${product.name}** (${product.hsCode}), you'll typically need:\n\n• Commercial Invoice\n• Packing List\n• Certificate of Origin\n• Bill of Lading\n• Product-specific certificates\n\nWhich country are you exporting to? I can provide more specific requirements.`;
      } else {
        return `I can help you with document requirements! Please specify:\n• What product are you exporting?\n• Which country are you exporting to?\n\nThen I'll provide you with the complete list of required documents.`;
      }
    }
    
    // Enhanced profit analysis queries with comprehensive tariff data
    if (lowerMessage.includes('profit') || lowerMessage.includes('margin') || lowerMessage.includes('revenue')) {
      // Try to find product in tariff database first
      let foundProduct = null;
      let foundCountry = null;
      
      for (const productName in tariffDatabase) {
        if (lowerMessage.includes(productName.toLowerCase())) {
          foundProduct = productName;
          break;
        }
      }
      
      for (const country of countries) {
        if (lowerMessage.includes(country.name.toLowerCase())) {
          foundCountry = country;
          break;
        }
      }
      
      if (foundProduct && foundCountry) {
        const tariffInfo = tariffDatabase[foundProduct]?.[foundCountry.name];
        if (tariffInfo) {
          const basePrice = 1000; // Sample base price
          const tariffAmount = basePrice * (tariffInfo.totalTariff / 100);
          const shippingCost = 150;
          const insuranceCost = 25;
          const totalCost = basePrice + tariffAmount + shippingCost + insuranceCost;
          const sellingPrice = totalCost * 1.25; // 25% margin
          const profit = sellingPrice - totalCost;
          const profitMargin = (profit / sellingPrice) * 100;
          
          return `**Profit Analysis: ${foundProduct} to ${foundCountry.name}**\n\n**Cost Breakdown:**\n• Base Product Cost: $${basePrice.toLocaleString()}\n• Tariff (${tariffInfo.totalTariff}%): $${tariffAmount.toFixed(2)}\n• Shipping: $${shippingCost}\n• Insurance: $${insuranceCost}\n• **Total Cost: $${totalCost.toFixed(2)}**\n\n**Revenue & Profit:**\n• Recommended Selling Price: $${sellingPrice.toFixed(2)}\n• Profit: $${profit.toFixed(2)}\n• Profit Margin: ${profitMargin.toFixed(1)}%\n\n**Market Information:**\n• **Currency:** ${foundCountry.currency}\n• **Risk Level:** ${foundCountry.riskLevel.toUpperCase()}\n• **Ease of Business:** ${foundCountry.easeOfBusiness}/100\n\n**Trade Barriers:**\n${tariffInfo.restrictions.length > 0 ? tariffInfo.restrictions.map(r => `• ${r}`).join('\n') : '• No significant barriers'}\n\nWould you like analysis for different quantities or markets?`;
        }
      }
      
      // Fallback to sample products
      const product = sampleProducts.find(p => lowerMessage.includes(p.name.toLowerCase()));
      const country = countries.find(c => lowerMessage.includes(c.name.toLowerCase()));
      
      if (product && country) {
        const basePrice = 1000; // Sample base price
        const tariffAmount = basePrice * (product.avgTariff / 100);
        const shippingCost = 150;
        const insuranceCost = 25;
        const totalCost = basePrice + tariffAmount + shippingCost + insuranceCost;
        const sellingPrice = totalCost * 1.25; // 25% margin
        const profit = sellingPrice - totalCost;
        const profitMargin = (profit / sellingPrice) * 100;
        
        return `**Profit Analysis: ${product.name} to ${country.name}**\n\n**Cost Breakdown:**\n• Base Product Cost: $${basePrice.toLocaleString()}\n• Tariff (${product.avgTariff}%): $${tariffAmount.toFixed(2)}\n• Shipping: $${shippingCost}\n• Insurance: $${insuranceCost}\n• **Total Cost: $${totalCost.toFixed(2)}**\n\n**Revenue & Profit:**\n• Recommended Selling Price: $${sellingPrice.toFixed(2)}\n• Profit: $${profit.toFixed(2)}\n• Profit Margin: ${profitMargin.toFixed(1)}%\n\n**Market Risk:** ${product.riskLevel.toUpperCase()}\n**Market Demand:** ${product.demand.toUpperCase()}\n\nWould you like analysis for different quantities or markets?`;
      } else {
        return `I can provide detailed profit analysis! Please tell me:\n• What product are you interested in?\n• Which target market?\n• What quantity?\n\nI'll calculate costs, tariffs, and profit margins for you.`;
      }
    }
    
    // Enhanced market intelligence queries
    if (lowerMessage.includes('market') || lowerMessage.includes('trend') || lowerMessage.includes('opportunity')) {
      const country = countries.find(c => lowerMessage.includes(c.name.toLowerCase()));
      
      if (country) {
        return `**Market Intelligence: ${country.name}**\n\n**Market Overview:**\n• Region: ${country.region}\n• Currency: ${country.currency}\n• Language: ${country.language}\n• Ease of Business: ${country.easeOfBusiness}/100\n• Risk Level: ${country.riskLevel.toUpperCase()}\n\n**Key Opportunities:**\n• Agricultural products: High demand\n• Textiles and garments: Growing market\n• Electronics: Steady demand\n• Machinery: Industrial growth\n\n**Market Entry Tips:**\n• Start with smaller orders to test the market\n• Build relationships with local distributors\n• Understand seasonal demand patterns\n• Consider local competition\n\n**Available Products for Export:**\n• Tea (HS Code: 0902.30)\n• Basmati Rice (HS Code: 1006.30)\n• Silk Fabrics (HS Code: 5007.90)\n• Mobile Phones (HS Code: 8517.12)\n• And many more...\n\nWould you like specific product recommendations for this market?`;
      } else {
        return `I can provide market intelligence for various countries! We have data for 150+ countries including:\n\n🇺🇸 **United States** - Large market, competitive\n🇬🇧 **United Kingdom** - Established trade relations\n🇩🇪 **Germany** - Strong manufacturing hub\n🇯🇵 **Japan** - High-quality standards\n🇦🇺 **Australia** - Growing agricultural demand\n🇸🇦 **Saudi Arabia** - Middle East opportunities\n🇧🇷 **Brazil** - South American market\n🇿🇦 **South Africa** - African hub\n\nWhich country are you interested in?`;
      }
    }
    
    // Enhanced product information queries with comprehensive data
    if (lowerMessage.includes('product') || lowerMessage.includes('hs code') || lowerMessage.includes('harmonized')) {
      // First check tariff database
      for (const productName in tariffDatabase) {
        if (lowerMessage.includes(productName.toLowerCase())) {
          const productCountries = Object.keys(tariffDatabase[productName] || {});
          const avgTariff = Object.values(tariffDatabase[productName] || {}).reduce((sum, info: any) => sum + info.totalTariff, 0) / productCountries.length;
          
          return `**Product Information: ${productName}**\n\n**Trade Statistics:**\n• **Available in:** ${productCountries.length} countries\n• **Average Global Tariff:** ${avgTariff.toFixed(1)}%\n• **Countries with Zero Tariff:** ${Object.values(tariffDatabase[productName] || {}).filter((info: any) => info.totalTariff === 0).length}\n\n**Top Markets:**\n${productCountries.slice(0, 5).map(countryName => {
            const info = tariffDatabase[productName][countryName];
            return `• **${countryName}**: ${info.totalTariff}% tariff, ${info.currency}`;
          }).join('\n')}\n\n**Common Requirements:**\n• Commercial Invoice\n• Certificate of Origin\n• Bill of Lading\n• Product-specific certificates\n\nWould you like detailed tariff information for a specific country?`;
        }
      }
      
      // Fallback to sample products
      const product = sampleProducts.find(p => lowerMessage.includes(p.name.toLowerCase()));
      
      if (product) {
        return `**Product Information: ${product.name}**\n\n**Details:**\n• **HS Code:** ${product.hsCode}\n• **Category:** ${product.category}\n• **Description:** ${product.description}\n• **Average Tariff:** ${product.avgTariff}%\n• **Risk Level:** ${product.riskLevel.toUpperCase()}\n• **Market Demand:** ${product.demand.toUpperCase()}\n\n**Trade Notes:**\n• This product has ${product.riskLevel === 'low' ? 'low' : product.riskLevel === 'medium' ? 'moderate' : 'high'} trade barriers\n• Documentation requirements are ${product.riskLevel === 'low' ? 'minimal' : 'extensive'}\n• Market demand is ${product.demand === 'high' ? 'strong' : product.demand === 'medium' ? 'moderate' : 'limited'}\n\nWould you like to know about specific country requirements for this product?`;
      } else {
        return `I can help you find product information! We have extensive tariff data for:\n\n**Agricultural Products:**\n• Tea, Basmati Rice, Spices, Coffee, etc.\n\n**Textiles:**\n• Silk Fabrics, Cotton Fabrics, Wool Fabrics, etc.\n\n**Electronics:**\n• Mobile Phones, Laptops, Solar Panels, etc.\n\n**And many more categories with data for 150+ countries!**\n\nWhat specific product are you looking for?`;
      }
    }
    
    // Enhanced tariff-specific queries
    if (lowerMessage.includes('tariff') || lowerMessage.includes('duty') || lowerMessage.includes('tax')) {
      // Try to find product and country combination
      let foundProduct = null;
      let foundCountry = null;
      
      for (const productName in tariffDatabase) {
        if (lowerMessage.includes(productName.toLowerCase())) {
          foundProduct = productName;
          break;
        }
      }
      
      for (const country of countries) {
        if (lowerMessage.includes(country.name.toLowerCase())) {
          foundCountry = country;
          break;
        }
      }
      
      if (foundProduct && foundCountry) {
        const tariffInfo = tariffDatabase[foundProduct]?.[foundCountry.name];
        if (tariffInfo) {
          return `**Tariff Information: ${foundProduct} to ${foundCountry.name}**\n\n**Detailed Tariff Breakdown:**\n• **HS Code:** ${tariffInfo.hsCode}\n• **Base Tariff Rate:** ${tariffInfo.baseTariff}%\n• **Additional Duties:** ${tariffInfo.additionalDuties}%\n• **Total Applied Tariff:** ${tariffInfo.totalTariff}%\n\n**Trade Agreement Benefits:**\n${tariffInfo.totalTariff < 6.4 ? '• Preferential tariff rate applied' : '• Standard WTO rate applied'}\n\n**Required Documentation:**\n${tariffInfo.documentation.slice(0, 5).map(doc => `• ${doc}`).join('\n')}\n\n**Trade Restrictions:**\n${tariffInfo.restrictions.length > 0 ? tariffInfo.restrictions.map(r => `• ${r}`).join('\n') : '• No specific restrictions'}\n\n**Market Context:**\n• **Currency:** ${foundCountry.currency}\n• **Risk Level:** ${foundCountry.riskLevel.toUpperCase()}\n• **Ease of Doing Business:** ${foundCountry.easeOfBusiness}/100\n\nWould you like profit analysis for this product-country combination?`;
        }
      } else if (foundProduct) {
        const productTariffs = Object.values(tariffDatabase[foundProduct] || {});
        const avgTariff = productTariffs.reduce((sum, info: any) => sum + info.totalTariff, 0) / productTariffs.length;
        const minTariff = Math.min(...productTariffs.map((info: any) => info.totalTariff));
        const maxTariff = Math.max(...productTariffs.map((info: any) => info.totalTariff));
        
        return `**Global Tariff Analysis for ${foundProduct}**\n\n**Tariff Summary (150+ countries):**\n• **Average Tariff:** ${avgTariff.toFixed(1)}%\n• **Minimum Tariff:** ${minTariff}%\n• **Maximum Tariff:** ${maxTariff}%\n• **Countries with Zero Tariff:** ${productTariffs.filter((info: any) => info.totalTariff === 0).length}\n\n**Best Markets (Lowest Tariffs):**\n${Object.entries(tariffDatabase[foundProduct] || {})
          .sort(([,a], [,b]) => (a as any).totalTariff - (b as any).totalTariff)
          .slice(0, 5)
          .map(([country, info]) => `• **${country}**: ${(info as any).totalTariff}% (${(info as any).currency})`)
          .join('\n')}\n\n**Most Challenging Markets:**\n${Object.entries(tariffDatabase[foundProduct] || {})
          .sort(([,a], [,b]) => (b as any).totalTariff - (a as any).totalTariff)
          .slice(0, 3)
          .map(([country, info]) => `• **${country}**: ${(info as any).totalTariff}% (${(info as any).currency})`)
          .join('\n')}\n\nWhich specific country would you like detailed information for?`;
      } else {
        return `I can provide detailed tariff information! We have comprehensive tariff data for:\n\n**Products with Complete Global Coverage:**\n• Tea (HS Code: 0902.30)\n• Basmati Rice (HS Code: 1006.30)\n• Silk Fabrics (HS Code: 5007.90)\n• Cotton Fabrics (HS Code: 5208.21)\n• Mobile Phones (HS Code: 8517.12)\n• Laptops (HS Code: 8471.30)\n• Solar Panels (HS Code: 8541.40)\n\n**Available for 150+ countries**\n\nPlease specify:\n• What product?\n• Which country?\n\nI'll provide detailed tariff breakdown including preferential rates!`;
      }
    }
    
    // General trade assistance
    if (lowerMessage.includes('how to') || lowerMessage.includes('help') || lowerMessage.includes('guide')) {
      return `**Trade Assistance Guide**\n\nI can help you with:\n\n📋 **Getting Started:**\n• Register your business\n• Obtain necessary licenses\n• Set up export documentation\n\n📦 **Export Process:**\n• Product classification and HS codes\n• Market research and selection\n• Documentation preparation\n• Logistics and shipping\n• Customs clearance\n\n💰 **Financial Planning:**\n• Cost analysis\n• Profit margin calculation\n• Risk assessment\n• Payment terms\n\n🤝 **Finding Partners:**\n• Importer matching\n• Distributor networks\n• Trade leads\n\n🌍 **Global Coverage:**\n• 150+ countries with detailed data\n• Comprehensive tariff information\n• Market intelligence\n• Documentation requirements\n\nWhat specific area would you like help with?`;
    }
    
    // Default response
    return `I'm here to help you with your trade-related questions! I can assist you with:\n\n📄 **Document Requirements** - Ask about needed documents for specific products and countries\n💰 **Profit Analysis** - Get detailed financial analysis for different markets\n🌍 **Market Intelligence** - Learn about market trends and opportunities\n📦 **Product Information** - Find details about products and HS codes\n🏛️ **Tariff Information** - Get detailed tariff breakdowns for 150+ countries\n🤝 **General Trade Assistance** - Any trade-related guidance\n\nPlease let me know what specific information you need, and I'll provide you with detailed assistance!`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Add typing indicator
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
    
    setMessages(prev => [...prev, typingMessage]);
    
    try {
      const response = await generateResponse(inputMessage);
      
      // Remove typing indicator and add actual response
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        category: 'general'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
        category: 'general'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `${msg.type === 'user' ? 'You' : 'TradeGenie'} (${msg.timestamp.toLocaleTimeString()}):\n${msg.content}\n`
    ).join('\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradegenie-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, you would integrate with Web Speech API
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-purple-600" />
            <span>TradeGenie AI Assistant</span>
            <Badge variant="secondary" className="ml-2">
              <Languages className="w-3 h-3 mr-1" />
              Multi-language
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[70vh]">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <Card className={`${message.type === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-50'}`}>
                      <CardContent className="p-4">
                        {message.isTyping ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${message.type === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.type === 'assistant' && !message.isTyping && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(message.content, message.id)}
                              className="h-6 w-6 p-0"
                            >
                              {copiedMessageId === message.id ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about document requirements, profit analysis, market intelligence..."
                  className="min-h-[44px]"
                  disabled={isTyping}
                />
              </div>
              <Button
                onClick={toggleRecording}
                variant="outline"
                size="sm"
                className={`h-[44px] w-[44px] p-0 ${isRecording ? 'bg-red-100 border-red-300' : ''}`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="h-[44px] w-[44px] p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={exportChat}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}