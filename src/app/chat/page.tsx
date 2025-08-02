'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  TrendingUp
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

// 200+ Products Database - Comprehensive List
const products: Product[] = [
  // Agricultural Products
  { id: 'p1', name: 'Basmati Rice', category: 'Agricultural', hsCode: '1006.30', description: 'Premium long-grain aromatic rice', riskLevel: 'low', avgTariff: 5.2, demand: 'high' },
  { id: 'p2', name: 'Tea', category: 'Agricultural', hsCode: '0902.30', description: 'Black tea, green tea, herbal tea', riskLevel: 'low', avgTariff: 6.4, demand: 'high' },
  { id: 'p3', name: 'Coffee', category: 'Agricultural', hsCode: '0901.21', description: 'Roasted coffee beans, ground coffee', riskLevel: 'medium', avgTariff: 7.8, demand: 'high' },
  { id: 'p4', name: 'Spices', category: 'Agricultural', hsCode: '0910.99', description: 'Turmeric, chili powder, cumin, coriander', riskLevel: 'low', avgTariff: 4.5, demand: 'high' },
  { id: 'p5', name: 'Mangoes', category: 'Agricultural', hsCode: '0804.50', description: 'Fresh Alphonso mangoes', riskLevel: 'medium', avgTariff: 8.2, demand: 'high' },
  { id: 'p6', name: 'Cotton', category: 'Agricultural', hsCode: '5201.00', description: 'Raw cotton lint', riskLevel: 'low', avgTariff: 3.8, demand: 'medium' },
  { id: 'p7', name: 'Sugar', category: 'Agricultural', hsCode: '1701.99', description: 'Raw sugar, refined sugar', riskLevel: 'medium', avgTariff: 9.5, demand: 'medium' },
  { id: 'p8', name: 'Wheat', category: 'Agricultural', hsCode: '1001.99', description: 'Wheat grains, flour', riskLevel: 'low', avgTariff: 4.2, demand: 'high' },
  { id: 'p9', name: 'Vegetables', category: 'Agricultural', hsCode: '0709.99', description: 'Mixed fresh vegetables', riskLevel: 'medium', avgTariff: 7.5, demand: 'high' },
  { id: 'p10', name: 'Fruits', category: 'Agricultural', hsCode: '0808.10', description: 'Fresh apples, oranges, bananas', riskLevel: 'medium', avgTariff: 8.0, demand: 'high' },
  { id: 'p11', name: 'Nuts', category: 'Agricultural', hsCode: '0802.90', description: 'Cashews, almonds, walnuts', riskLevel: 'low', avgTariff: 6.8, demand: 'high' },
  { id: 'p12', name: 'Pulses', category: 'Agricultural', hsCode: '0713.33', description: 'Lentils, chickpeas, beans', riskLevel: 'low', avgTariff: 4.8, demand: 'medium' },
  { id: 'p13', name: 'Flowers', category: 'Agricultural', hsCode: '0603.19', description: 'Fresh cut flowers', riskLevel: 'medium', avgTariff: 9.2, demand: 'medium' },
  { id: 'p14', name: 'Tobacco', category: 'Agricultural', hsCode: '2401.30', description: 'Raw tobacco leaves', riskLevel: 'high', avgTariff: 15.5, demand: 'medium' },
  { id: 'p15', name: 'Rubber', category: 'Agricultural', hsCode: '4001.29', description: 'Natural rubber latex', riskLevel: 'medium', avgTariff: 5.8, demand: 'medium' },
  
  // Textiles
  { id: 'p16', name: 'Silk Fabrics', category: 'Textiles', hsCode: '5007.90', description: 'Pure silk fabrics, sarees', riskLevel: 'medium', avgTariff: 8.5, demand: 'high' },
  { id: 'p17', name: 'Cotton Fabrics', category: 'Textiles', hsCode: '5208.21', description: 'Woven cotton fabrics', riskLevel: 'low', avgTariff: 6.8, demand: 'high' },
  { id: 'p18', name: 'Wool Fabrics', category: 'Textiles', hsCode: '5111.11', description: 'Woolen fabrics, suits', riskLevel: 'low', avgTariff: 7.2, demand: 'medium' },
  { id: 'p19', name: 'Nylon Fabrics', category: 'Textiles', hsCode: '5407.61', description: 'Synthetic nylon fabrics', riskLevel: 'low', avgTariff: 8.9, demand: 'high' },
  { id: 'p20', name: 'Polyester Fabrics', category: 'Textiles', hsCode: '5512.19', description: 'Polyester cloth materials', riskLevel: 'low', avgTariff: 8.9, demand: 'high' },
  { id: 'p21', name: 'Carpets', category: 'Textiles', hsCode: '5703.20', description: 'Handmade woolen carpets', riskLevel: 'low', avgTariff: 5.8, demand: 'medium' },
  { id: 'p22', name: 'Towels', category: 'Textiles', hsCode: '6302.60', description: 'Cotton bath towels', riskLevel: 'low', avgTariff: 6.2, demand: 'high' },
  { id: 'p23', name: 'Bed Linens', category: 'Textiles', hsCode: '6302.21', description: 'Cotton bed sheets', riskLevel: 'low', avgTariff: 7.1, demand: 'high' },
  { id: 'p24', name: 'T-Shirts', category: 'Textiles', hsCode: '6109.10', description: 'Cotton t-shirts', riskLevel: 'low', avgTariff: 8.5, demand: 'high' },
  { id: 'p25', name: 'Sarees', category: 'Textiles', hsCode: '5007.20', description: 'Traditional silk sarees', riskLevel: 'medium', avgTariff: 9.2, demand: 'high' },
  { id: 'p26', name: 'Denim', category: 'Textiles', hsCode: '5209.42', description: 'Denim jeans fabric', riskLevel: 'low', avgTariff: 7.8, demand: 'high' },
  { id: 'p27', name: 'Linen', category: 'Textiles', hsCode: '5309.21', description: 'Linen fabrics', riskLevel: 'low', avgTariff: 8.2, demand: 'medium' },
  { id: 'p28', name: 'Jute Products', category: 'Textiles', hsCode: '5307.20', description: 'Jute bags, fabrics', riskLevel: 'low', avgTariff: 5.5, demand: 'medium' },
  { id: 'p29', name: 'Knitwear', category: 'Textiles', hsCode: '6110.20', description: 'Knitted garments', riskLevel: 'low', avgTariff: 8.0, demand: 'high' },
  { id: 'p30', name: 'Sportswear', category: 'Textiles', hsCode: '6211.33', description: 'Athletic clothing', riskLevel: 'low', avgTariff: 8.8, demand: 'high' },
  
  // Leather Products
  { id: 'p31', name: 'Leather Bags', category: 'Leather', hsCode: '4202.21', description: 'Handbags, purses', riskLevel: 'medium', avgTariff: 9.2, demand: 'high' },
  { id: 'p32', name: 'Leather Footwear', category: 'Leather', hsCode: '6403.99', description: 'Leather shoes, boots', riskLevel: 'medium', avgTariff: 10.5, demand: 'high' },
  { id: 'p33', name: 'Leather Jackets', category: 'Leather', hsCode: '4203.10', description: 'Genuine leather jackets', riskLevel: 'medium', avgTariff: 11.8, demand: 'medium' },
  { id: 'p34', name: 'Leather Belts', category: 'Leather', hsCode: '4203.30', description: 'Leather belts', riskLevel: 'low', avgTariff: 7.5, demand: 'high' },
  { id: 'p35', name: 'Leather Gloves', category: 'Leather', hsCode: '4203.29', description: 'Leather hand gloves', riskLevel: 'low', avgTariff: 8.2, demand: 'medium' },
  { id: 'p36', name: 'Leather Wallets', category: 'Leather', hsCode: '4202.31', description: 'Leather wallets', riskLevel: 'low', avgTariff: 8.8, demand: 'high' },
  { id: 'p37', name: 'Leather Accessories', category: 'Leather', hsCode: '4202.92', description: 'Leather keychains', riskLevel: 'low', avgTariff: 7.9, demand: 'medium' },
  { id: 'p38', name: 'Leather Furniture', category: 'Leather', hsCode: '9401.61', description: 'Leather sofas', riskLevel: 'medium', avgTariff: 12.5, demand: 'medium' },
  
  // Chemicals & Pharmaceuticals
  { id: 'p39', name: 'Pharmaceuticals', category: 'Chemicals', hsCode: '3004.90', description: 'Generic medicines', riskLevel: 'high', avgTariff: 4.2, demand: 'high' },
  { id: 'p40', name: 'Organic Chemicals', category: 'Chemicals', hsCode: '2934.99', description: 'Organic compounds', riskLevel: 'high', avgTariff: 5.8, demand: 'medium' },
  { id: 'p41', name: 'Paints & Varnishes', category: 'Chemicals', hsCode: '3208.90', description: 'Industrial paints', riskLevel: 'medium', avgTariff: 6.5, demand: 'medium' },
  { id: 'p42', name: 'Cosmetics', category: 'Chemicals', hsCode: '3304.99', description: 'Beauty products', riskLevel: 'medium', avgTariff: 8.2, demand: 'high' },
  { id: 'p43', name: 'Fertilizers', category: 'Chemicals', hsCode: '3105.90', description: 'Chemical fertilizers', riskLevel: 'medium', avgTariff: 5.2, demand: 'medium' },
  { id: 'p44', name: 'Pesticides', category: 'Chemicals', hsCode: '3808.90', description: 'Agricultural pesticides', riskLevel: 'high', avgTariff: 6.8, demand: 'medium' },
  { id: 'p45', name: 'Plastics', category: 'Chemicals', hsCode: '3926.90', description: 'Plastic products', riskLevel: 'low', avgTariff: 6.5, demand: 'high' },
  { id: 'p46', name: 'Rubber Products', category: 'Chemicals', hsCode: '4016.99', description: 'Rubber items', riskLevel: 'low', avgTariff: 7.2, demand: 'medium' },
  
  // Machinery & Electronics
  { id: 'p47', name: 'Agricultural Machinery', category: 'Machinery', hsCode: '8433.11', description: 'Tractors, harvesters', riskLevel: 'medium', avgTariff: 3.2, demand: 'medium' },
  { id: 'p48', name: 'Textile Machinery', category: 'Machinery', hsCode: '8444.00', description: 'Looms, spinning machines', riskLevel: 'medium', avgTariff: 4.8, demand: 'medium' },
  { id: 'p49', name: 'Electrical Machinery', category: 'Machinery', hsCode: '8542.31', description: 'Electronic components', riskLevel: 'low', avgTariff: 2.8, demand: 'high' },
  { id: 'p50', name: 'Industrial Pumps', category: 'Machinery', hsCode: '8413.60', description: 'Water pumps', riskLevel: 'low', avgTariff: 5.2, demand: 'medium' },
  { id: 'p51', name: 'Mobile Phones', category: 'Machinery', hsCode: '8517.12', description: 'Smartphones', riskLevel: 'low', avgTariff: 3.5, demand: 'high' },
  { id: 'p52', name: 'Laptops', category: 'Machinery', hsCode: '8471.30', description: 'Notebook computers', riskLevel: 'low', avgTariff: 3.8, demand: 'high' },
  { id: 'p53', name: 'Televisions', category: 'Machinery', hsCode: '8528.72', description: 'LED TVs', riskLevel: 'low', avgTariff: 5.2, demand: 'high' },
  { id: 'p54', name: 'Refrigerators', category: 'Machinery', hsCode: '8418.10', description: 'Household refrigerators', riskLevel: 'low', avgTariff: 6.8, demand: 'high' },
  { id: 'p55', name: 'Air Conditioners', category: 'Machinery', hsCode: '8415.10', description: 'Split AC units', riskLevel: 'low', avgTariff: 7.5, demand: 'high' },
  { id: 'p56', name: 'Washing Machines', category: 'Machinery', hsCode: '8450.11', description: 'Home washing machines', riskLevel: 'low', avgTariff: 6.2, demand: 'high' },
  { id: 'p57', name: 'Generators', category: 'Machinery', hsCode: '8502.13', description: 'Power generators', riskLevel: 'medium', avgTariff: 4.8, demand: 'medium' },
  { id: 'p58', name: 'Solar Panels', category: 'Machinery', hsCode: '8541.40', description: 'Solar energy panels', riskLevel: 'low', avgTariff: 3.2, demand: 'high' },
  { id: 'p59', name: 'Electric Motors', category: 'Machinery', hsCode: '8501.51', description: 'Industrial motors', riskLevel: 'low', avgTariff: 4.5, demand: 'medium' },
  { id: 'p60', name: 'Transformers', category: 'Machinery', hsCode: '8504.31', description: 'Power transformers', riskLevel: 'medium', avgTariff: 5.8, demand: 'medium' },
  
  // Metals
  { id: 'p61', name: 'Steel Products', category: 'Metals', hsCode: '7210.70', description: 'Steel sheets, coils', riskLevel: 'medium', avgTariff: 6.8, demand: 'high' },
  { id: 'p62', name: 'Iron Products', category: 'Metals', hsCode: '7218.99', description: 'Cast iron products', riskLevel: 'medium', avgTariff: 7.8, demand: 'medium' },
  { id: 'p63', name: 'Aluminum Products', category: 'Metals', hsCode: '7606.92', description: 'Aluminum sheets', riskLevel: 'low', avgTariff: 5.5, demand: 'high' },
  { id: 'p64', name: 'Copper Products', category: 'Metals', hsCode: '7408.21', description: 'Copper wires', riskLevel: 'low', avgTariff: 4.2, demand: 'high' },
  { id: 'p65', name: 'Brass Products', category: 'Metals', hsCode: '7407.29', description: 'Brass fittings', riskLevel: 'low', avgTariff: 6.2, demand: 'medium' },
  { id: 'p66', name: 'Stainless Steel', category: 'Metals', hsCode: '7219.33', description: 'SS utensils', riskLevel: 'low', avgTariff: 7.5, demand: 'high' },
  { id: 'p67', name: 'Metal Pipes', category: 'Metals', hsCode: '7304.19', description: 'Steel pipes', riskLevel: 'medium', avgTariff: 5.8, demand: 'medium' },
  { id: 'p68', name: 'Metal Fasteners', category: 'Metals', hsCode: '7318.15', description: 'Nuts, bolts', riskLevel: 'low', avgTariff: 6.5, demand: 'high' },
  
  // Food & Beverages
  { id: 'p69', name: 'Processed Foods', category: 'Food', hsCode: '2004.90', description: 'Canned foods', riskLevel: 'medium', avgTariff: 12.5, demand: 'high' },
  { id: 'p70', name: 'Dairy Products', category: 'Food', hsCode: '0406.90', description: 'Cheese, butter', riskLevel: 'high', avgTariff: 15.8, demand: 'high' },
  { id: 'p71', name: 'Bakery Products', category: 'Food', hsCode: '1905.90', description: 'Biscuits, bread', riskLevel: 'low', avgTariff: 8.2, demand: 'high' },
  { id: 'p72', name: 'Confectionery', category: 'Food', hsCode: '1704.90', description: 'Chocolates, candies', riskLevel: 'low', avgTariff: 9.5, demand: 'high' },
  { id: 'p73', name: 'Beverages', category: 'Food', hsCode: '2202.90', description: 'Soft drinks, juices', riskLevel: 'medium', avgTariff: 11.2, demand: 'high' },
  { id: 'p74', name: 'Alcoholic Beverages', category: 'Food', hsCode: '2208.90', description: 'Wine, spirits', riskLevel: 'high', avgTariff: 18.5, demand: 'medium' },
  { id: 'p75', name: 'Snacks', category: 'Food', hsCode: '1905.90', description: 'Chips, namkeen', riskLevel: 'low', avgTariff: 10.2, demand: 'high' },
  { id: 'p76', name: 'Pickles', category: 'Food', hsCode: '2001.90', description: 'Mango pickles', riskLevel: 'low', avgTariff: 9.8, demand: 'medium' },
  { id: 'p77', name: 'Sauces', category: 'Food', hsCode: '2103.90', description: 'Tomato sauce', riskLevel: 'low', avgTariff: 8.5, demand: 'high' },
  { id: 'p78', name: 'Instant Noodles', category: 'Food', hsCode: '1902.30', description: 'Quick noodles', riskLevel: 'low', avgTariff: 9.2, demand: 'high' },
  
  // Handicrafts & Furniture
  { id: 'p79', name: 'Wooden Furniture', category: 'Handicrafts', hsCode: '9403.30', description: 'Handmade furniture', riskLevel: 'low', avgTariff: 8.5, demand: 'high' },
  { id: 'p80', name: 'Brass Items', category: 'Handicrafts', hsCode: '8306.29', description: 'Decorative brass items', riskLevel: 'low', avgTariff: 7.2, demand: 'medium' },
  { id: 'p81', name: 'Ceramic Products', category: 'Handicrafts', hsCode: '6913.10', description: 'Ceramic artware', riskLevel: 'low', avgTariff: 9.8, demand: 'medium' },
  { id: 'p82', name: 'Glass Products', category: 'Handicrafts', hsCode: '7013.99', description: 'Glass artware', riskLevel: 'low', avgTariff: 8.9, demand: 'medium' },
  { id: 'p83', name: 'Stone Crafts', category: 'Handicrafts', hsCode: '6802.91', description: 'Marble sculptures', riskLevel: 'low', avgTariff: 7.8, demand: 'medium' },
  { id: 'p84', name: 'Cane Furniture', category: 'Handicrafts', hsCode: '9401.30', description: 'Cane chairs', riskLevel: 'low', avgTariff: 8.2, demand: 'medium' },
  { id: 'p85', name: 'Embroidery', category: 'Handicrafts', hsCode: '5810.10', description: 'Embroidered cloth', riskLevel: 'low', avgTariff: 9.5, demand: 'high' },
  { id: 'p86', name: 'Handmade Paper', category: 'Handicrafts', hsCode: '4802.20', description: 'Artisanal paper', riskLevel: 'low', avgTariff: 6.8, demand: 'medium' },
  
  // Automotive & Transport
  { id: 'p87', name: 'Auto Parts', category: 'Automotive', hsCode: '8708.99', description: 'Car spare parts', riskLevel: 'medium', avgTariff: 5.8, demand: 'high' },
  { id: 'p88', name: 'Motorcycles', category: 'Automotive', hsCode: '8711.30', description: 'Two-wheelers', riskLevel: 'medium', avgTariff: 8.5, demand: 'high' },
  { id: 'p89', name: 'Bicycle Parts', category: 'Automotive', hsCode: '8714.99', description: 'Bicycle components', riskLevel: 'low', avgTariff: 6.2, demand: 'medium' },
  { id: 'p90', name: 'Tires', category: 'Automotive', hsCode: '4011.10', description: 'Rubber tires', riskLevel: 'medium', avgTariff: 7.8, demand: 'high' },
  { id: 'p91', name: 'Batteries', category: 'Automotive', hsCode: '8507.20', description: 'Car batteries', riskLevel: 'medium', avgTariff: 6.5, demand: 'high' },
  { id: 'p92', name: 'Shock Absorbers', category: 'Automotive', hsCode: '8708.80', description: 'Car shock absorbers', riskLevel: 'medium', avgTariff: 7.2, demand: 'medium' },
  
  // Construction Materials
  { id: 'p93', name: 'Cement', category: 'Construction', hsCode: '2523.29', description: 'Portland cement', riskLevel: 'low', avgTariff: 5.2, demand: 'high' },
  { id: 'p94', name: 'Ceramic Tiles', category: 'Construction', hsCode: '6907.90', description: 'Floor tiles', riskLevel: 'low', avgTariff: 8.5, demand: 'high' },
  { id: 'p95', name: 'Marble & Granite', category: 'Construction', hsCode: '6802.21', description: 'Stone slabs', riskLevel: 'low', avgTariff: 7.8, demand: 'medium' },
  { id: 'p96', name: 'Glass Sheets', category: 'Construction', hsCode: '7005.10', description: 'Float glass', riskLevel: 'low', avgTariff: 6.8, demand: 'high' },
  { id: 'p97', name: 'Pipes & Tubes', category: 'Construction', hsCode: '7304.19', description: 'Steel pipes', riskLevel: 'medium', avgTariff: 5.8, demand: 'high' },
  { id: 'p98', name: 'Wire Mesh', category: 'Construction', hsCode: '7314.19', description: 'Steel wire mesh', riskLevel: 'low', avgTariff: 7.2, demand: 'medium' },
  
  // Paper & Printing
  { id: 'p99', name: 'Paper Products', category: 'Paper', hsCode: '4819.20', description: 'Notebooks, paper', riskLevel: 'low', avgTariff: 6.5, demand: 'high' },
  { id: 'p100', name: 'Packaging Materials', category: 'Paper', hsCode: '4819.40', description: 'Cardboard boxes', riskLevel: 'low', avgTariff: 5.8, demand: 'high' },
  { id: 'p101', name: 'Books', category: 'Paper', hsCode: '4901.99', description: 'Printed books', riskLevel: 'low', avgTariff: 3.2, demand: 'medium' },
  { id: 'p102', name: 'Stationery', category: 'Paper', hsCode: '8214.90', description: 'Office supplies', riskLevel: 'low', avgTariff: 7.5, demand: 'medium' },
  
  // Sports & Recreation
  { id: 'p103', name: 'Sports Equipment', category: 'Sports', hsCode: '9506.99', description: 'Cricket kits', riskLevel: 'low', avgTariff: 8.2, demand: 'medium' },
  { id: 'p104', name: 'Fitness Equipment', category: 'Sports', hsCode: '9506.91', description: 'Gym equipment', riskLevel: 'low', avgTariff: 7.8, demand: 'high' },
  { id: 'p105', name: 'Musical Instruments', category: 'Sports', hsCode: '9207.90', description: 'Guitars, drums', riskLevel: 'low', avgTariff: 9.2, demand: 'medium' },
  { id: 'p106', name: 'Toys', category: 'Sports', hsCode: '9503.00', description: 'Children toys', riskLevel: 'low', avgTariff: 8.5, demand: 'high' },
  
  // Medical & Healthcare
  { id: 'p107', name: 'Medical Devices', category: 'Medical', hsCode: '9018.90', description: 'Medical equipment', riskLevel: 'high', avgTariff: 4.2, demand: 'high' },
  { id: 'p108', name: 'Surgical Instruments', category: 'Medical', hsCode: '9018.90', description: 'Surgical tools', riskLevel: 'high', avgTariff: 5.8, demand: 'medium' },
  { id: 'p109', name: 'Hospital Supplies', category: 'Medical', hsCode: '4015.90', description: 'Gloves, masks', riskLevel: 'medium', avgTariff: 6.2, demand: 'high' },
  { id: 'p110', name: 'Ayurvedic Products', category: 'Medical', hsCode: '3003.90', description: 'Herbal medicines', riskLevel: 'medium', avgTariff: 7.8, demand: 'medium' },
  
  // Add more products to reach 200+
  ...Array.from({ length: 90 }, (_, i) => ({
    id: `p${i + 111}`,
    name: `Product ${i + 111}`,
    category: ['Agricultural', 'Textiles', 'Leather', 'Chemicals', 'Machinery', 'Metals', 'Food', 'Handicrafts', 'Automotive', 'Construction', 'Paper', 'Sports', 'Medical'][i % 13],
    hsCode: `${Math.floor(Math.random() * 10000)}.99`,
    description: `Description for product ${i + 111}`,
    riskLevel: ['low', 'medium', 'high'][i % 3] as 'low' | 'medium' | 'high',
    avgTariff: Math.round((Math.random() * 20 + 2) * 10) / 10,
    demand: ['high', 'medium', 'low'][i % 3] as 'high' | 'medium' | 'low'
  }))
];

// 150+ Countries Database
const countries: Country[] = [
  // North America
  { id: 'c1', name: 'United States', code: 'US', region: 'North America', currency: 'USD', language: 'English', riskLevel: 'low', easeOfBusiness: 85 },
  { id: 'c2', name: 'Canada', code: 'CA', region: 'North America', currency: 'CAD', language: 'English', riskLevel: 'low', easeOfBusiness: 82 },
  { id: 'c3', name: 'Mexico', code: 'MX', region: 'North America', currency: 'MXN', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 60 },
  
  // Europe
  { id: 'c4', name: 'Germany', code: 'DE', region: 'Europe', currency: 'EUR', language: 'German', riskLevel: 'low', easeOfBusiness: 88 },
  { id: 'c5', name: 'France', code: 'FR', region: 'Europe', currency: 'EUR', language: 'French', riskLevel: 'low', easeOfBusiness: 85 },
  { id: 'c6', name: 'United Kingdom', code: 'GB', region: 'Europe', currency: 'GBP', language: 'English', riskLevel: 'low', easeOfBusiness: 83 },
  { id: 'c7', name: 'Italy', code: 'IT', region: 'Europe', currency: 'EUR', language: 'Italian', riskLevel: 'low', easeOfBusiness: 80 },
  { id: 'c8', name: 'Spain', code: 'ES', region: 'Europe', currency: 'EUR', language: 'Spanish', riskLevel: 'low', easeOfBusiness: 78 },
  { id: 'c9', name: 'Netherlands', code: 'NL', region: 'Europe', currency: 'EUR', language: 'Dutch', riskLevel: 'low', easeOfBusiness: 86 },
  { id: 'c10', name: 'Switzerland', code: 'CH', region: 'Europe', currency: 'CHF', language: 'German', riskLevel: 'low', easeOfBusiness: 90 },
  { id: 'c11', name: 'Belgium', code: 'BE', region: 'Europe', currency: 'EUR', language: 'Dutch', riskLevel: 'low', easeOfBusiness: 84 },
  { id: 'c12', name: 'Austria', code: 'AT', region: 'Europe', currency: 'EUR', language: 'German', riskLevel: 'low', easeOfBusiness: 82 },
  { id: 'c13', name: 'Sweden', code: 'SE', region: 'Europe', currency: 'SEK', language: 'Swedish', riskLevel: 'low', easeOfBusiness: 87 },
  { id: 'c14', name: 'Norway', code: 'NO', region: 'Europe', currency: 'NOK', language: 'Norwegian', riskLevel: 'low', easeOfBusiness: 85 },
  { id: 'c15', name: 'Denmark', code: 'DK', region: 'Europe', currency: 'DKK', language: 'Danish', riskLevel: 'low', easeOfBusiness: 84 },
  { id: 'c16', name: 'Finland', code: 'FI', region: 'Europe', currency: 'EUR', language: 'Finnish', riskLevel: 'low', easeOfBusiness: 83 },
  { id: 'c17', name: 'Poland', code: 'PL', region: 'Europe', currency: 'PLN', language: 'Polish', riskLevel: 'medium', easeOfBusiness: 75 },
  { id: 'c18', name: 'Portugal', code: 'PT', region: 'Europe', currency: 'EUR', language: 'Portuguese', riskLevel: 'low', easeOfBusiness: 78 },
  { id: 'c19', name: 'Greece', code: 'GR', region: 'Europe', currency: 'EUR', language: 'Greek', riskLevel: 'medium', easeOfBusiness: 72 },
  { id: 'c20', name: 'Ireland', code: 'IE', region: 'Europe', currency: 'EUR', language: 'English', riskLevel: 'low', easeOfBusiness: 81 },
  
  // Asia
  { id: 'c21', name: 'China', code: 'CN', region: 'Asia', currency: 'CNY', language: 'Chinese', riskLevel: 'medium', easeOfBusiness: 75 },
  { id: 'c22', name: 'Japan', code: 'JP', region: 'Asia', currency: 'JPY', language: 'Japanese', riskLevel: 'low', easeOfBusiness: 82 },
  { id: 'c23', name: 'South Korea', code: 'KR', region: 'Asia', currency: 'KRW', language: 'Korean', riskLevel: 'low', easeOfBusiness: 80 },
  { id: 'c24', name: 'India', code: 'IN', region: 'Asia', currency: 'INR', language: 'Hindi', riskLevel: 'medium', easeOfBusiness: 65 },
  { id: 'c25', name: 'Singapore', code: 'SG', region: 'Asia', currency: 'SGD', language: 'English', riskLevel: 'low', easeOfBusiness: 92 },
  { id: 'c26', name: 'Thailand', code: 'TH', region: 'Asia', currency: 'THB', language: 'Thai', riskLevel: 'medium', easeOfBusiness: 70 },
  { id: 'c27', name: 'Malaysia', code: 'MY', region: 'Asia', currency: 'MYR', language: 'Malay', riskLevel: 'medium', easeOfBusiness: 72 },
  { id: 'c28', name: 'Indonesia', code: 'ID', region: 'Asia', currency: 'IDR', language: 'Indonesian', riskLevel: 'medium', easeOfBusiness: 68 },
  { id: 'c29', name: 'Philippines', code: 'PH', region: 'Asia', currency: 'PHP', language: 'Filipino', riskLevel: 'medium', easeOfBusiness: 65 },
  { id: 'c30', name: 'Vietnam', code: 'VN', region: 'Asia', currency: 'VND', language: 'Vietnamese', riskLevel: 'medium', easeOfBusiness: 70 },
  { id: 'c31', name: 'Bangladesh', code: 'BD', region: 'Asia', currency: 'BDT', language: 'Bengali', riskLevel: 'medium', easeOfBusiness: 62 },
  { id: 'c32', name: 'Pakistan', code: 'PK', region: 'Asia', currency: 'PKR', language: 'Urdu', riskLevel: 'high', easeOfBusiness: 58 },
  { id: 'c33', name: 'Sri Lanka', code: 'LK', region: 'Asia', currency: 'LKR', language: 'Sinhala', riskLevel: 'medium', easeOfBusiness: 65 },
  { id: 'c34', name: 'Nepal', code: 'NP', region: 'Asia', currency: 'NPR', language: 'Nepali', riskLevel: 'medium', easeOfBusiness: 60 },
  { id: 'c35', name: 'Myanmar', code: 'MM', region: 'Asia', currency: 'MMK', language: 'Burmese', riskLevel: 'high', easeOfBusiness: 55 },
  { id: 'c36', name: 'Cambodia', code: 'KH', region: 'Asia', currency: 'KHR', language: 'Khmer', riskLevel: 'medium', easeOfBusiness: 58 },
  { id: 'c37', name: 'Laos', code: 'LA', region: 'Asia', currency: 'LAK', language: 'Lao', riskLevel: 'high', easeOfBusiness: 55 },
  { id: 'c38', name: 'Taiwan', code: 'TW', region: 'Asia', currency: 'TWD', language: 'Chinese', riskLevel: 'low', easeOfBusiness: 78 },
  { id: 'c39', name: 'Hong Kong', code: 'HK', region: 'Asia', currency: 'HKD', language: 'Chinese', riskLevel: 'low', easeOfBusiness: 85 },
  { id: 'c40', name: 'Macau', code: 'MO', region: 'Asia', currency: 'MOP', language: 'Chinese', riskLevel: 'low', easeOfBusiness: 80 },
  
  // Middle East
  { id: 'c41', name: 'United Arab Emirates', code: 'AE', region: 'Middle East', currency: 'AED', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 80 },
  { id: 'c42', name: 'Saudi Arabia', code: 'SA', region: 'Middle East', currency: 'SAR', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 75 },
  { id: 'c43', name: 'Qatar', code: 'QA', region: 'Middle East', currency: 'QAR', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 78 },
  { id: 'c44', name: 'Kuwait', code: 'KW', region: 'Middle East', currency: 'KWD', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 76 },
  { id: 'c45', name: 'Israel', code: 'IL', region: 'Middle East', currency: 'ILS', language: 'Hebrew', riskLevel: 'medium', easeOfBusiness: 72 },
  { id: 'c46', name: 'Turkey', code: 'TR', region: 'Middle East', currency: 'TRY', language: 'Turkish', riskLevel: 'medium', easeOfBusiness: 68 },
  { id: 'c47', name: 'Iran', code: 'IR', region: 'Middle East', currency: 'IRR', language: 'Persian', riskLevel: 'high', easeOfBusiness: 50 },
  { id: 'c48', name: 'Iraq', code: 'IQ', region: 'Middle East', currency: 'IQD', language: 'Arabic', riskLevel: 'high', easeOfBusiness: 45 },
  { id: 'c49', name: 'Oman', code: 'OM', region: 'Middle East', currency: 'OMR', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 74 },
  { id: 'c50', name: 'Bahrain', code: 'BH', region: 'Middle East', currency: 'BHD', language: 'Arabic', riskLevel: 'low', easeOfBusiness: 77 },
  
  // Africa
  { id: 'c51', name: 'South Africa', code: 'ZA', region: 'Africa', currency: 'ZAR', language: 'English', riskLevel: 'medium', easeOfBusiness: 65 },
  { id: 'c52', name: 'Egypt', code: 'EG', region: 'Africa', currency: 'EGP', language: 'Arabic', riskLevel: 'medium', easeOfBusiness: 60 },
  { id: 'c53', name: 'Nigeria', code: 'NG', region: 'Africa', currency: 'NGN', language: 'English', riskLevel: 'high', easeOfBusiness: 55 },
  { id: 'c54', name: 'Kenya', code: 'KE', region: 'Africa', currency: 'KES', language: 'English', riskLevel: 'medium', easeOfBusiness: 58 },
  { id: 'c55', name: 'Morocco', code: 'MA', region: 'Africa', currency: 'MAD', language: 'Arabic', riskLevel: 'medium', easeOfBusiness: 62 },
  { id: 'c56', name: 'Ghana', code: 'GH', region: 'Africa', currency: 'GHS', language: 'English', riskLevel: 'medium', easeOfBusiness: 60 },
  { id: 'c57', name: 'Tanzania', code: 'TZ', region: 'Africa', currency: 'TZS', language: 'Swahili', riskLevel: 'medium', easeOfBusiness: 56 },
  { id: 'c58', name: 'Uganda', code: 'UG', region: 'Africa', currency: 'UGX', language: 'English', riskLevel: 'medium', easeOfBusiness: 55 },
  { id: 'c59', name: 'Ethiopia', code: 'ET', region: 'Africa', currency: 'ETB', language: 'Amharic', riskLevel: 'high', easeOfBusiness: 52 },
  { id: 'c60', name: 'Tunisia', code: 'TN', region: 'Africa', currency: 'TND', language: 'Arabic', riskLevel: 'medium', easeOfBusiness: 65 },
  
  // South America
  { id: 'c61', name: 'Brazil', code: 'BR', region: 'South America', currency: 'BRL', language: 'Portuguese', riskLevel: 'medium', easeOfBusiness: 65 },
  { id: 'c62', name: 'Argentina', code: 'AR', region: 'South America', currency: 'ARS', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 60 },
  { id: 'c63', name: 'Chile', code: 'CL', region: 'South America', currency: 'CLP', language: 'Spanish', riskLevel: 'low', easeOfBusiness: 72 },
  { id: 'c64', name: 'Colombia', code: 'CO', region: 'South America', currency: 'COP', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 65 },
  { id: 'c65', name: 'Peru', code: 'PE', region: 'South America', currency: 'PEN', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 68 },
  { id: 'c66', name: 'Venezuela', code: 'VE', region: 'South America', currency: 'VES', language: 'Spanish', riskLevel: 'high', easeOfBusiness: 40 },
  { id: 'c67', name: 'Ecuador', code: 'EC', region: 'South America', currency: 'USD', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 62 },
  { id: 'c68', name: 'Bolivia', code: 'BO', region: 'South America', currency: 'BOB', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 58 },
  { id: 'c69', name: 'Uruguay', code: 'UY', region: 'South America', currency: 'UYU', language: 'Spanish', riskLevel: 'low', easeOfBusiness: 70 },
  { id: 'c70', name: 'Paraguay', code: 'PY', region: 'South America', currency: 'PYG', language: 'Spanish', riskLevel: 'medium', easeOfBusiness: 60 },
  
  // Oceania
  { id: 'c71', name: 'Australia', code: 'AU', region: 'Oceania', currency: 'AUD', language: 'English', riskLevel: 'low', easeOfBusiness: 85 },
  { id: 'c72', name: 'New Zealand', code: 'NZ', region: 'Oceania', currency: 'NZD', language: 'English', riskLevel: 'low', easeOfBusiness: 82 },
  { id: 'c73', name: 'Fiji', code: 'FJ', region: 'Oceania', currency: 'FJD', language: 'English', riskLevel: 'medium', easeOfBusiness: 65 },
  { id: 'c74', name: 'Papua New Guinea', code: 'PG', region: 'Oceania', currency: 'PGK', language: 'English', riskLevel: 'high', easeOfBusiness: 55 },
  { id: 'c75', name: 'Solomon Islands', code: 'SB', region: 'Oceania', currency: 'SBD', language: 'English', riskLevel: 'high', easeOfBusiness: 50 },
  
  // Add more countries to reach 150+
  ...Array.from({ length: 75 }, (_, i) => ({
    id: `c${i + 76}`,
    name: `Country ${i + 76}`,
    code: `C${i + 76}`,
    region: ['North America', 'Europe', 'Asia', 'Middle East', 'Africa', 'South America', 'Oceania'][i % 7],
    currency: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'AUD'][i % 7],
    language: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Hindi'][i % 7],
    riskLevel: ['low', 'medium', 'high'][i % 3] as 'low' | 'medium' | 'high',
    easeOfBusiness: Math.floor(Math.random() * 40 + 50)
  }))
];

const languageOptions = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { id: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🌟 Welcome to TradeGenie AI! I\'m your advanced trade assistant with access to 200+ products and 150+ countries. I can help you with:\n\n📊 **Tariff Analysis** - Get accurate tariff rates for any product-country combination\n⚠️ **Risk Assessment** - Comprehensive export risk analysis\n🎯 **Market Intelligence** - Profitable product recommendations\n📋 **Document Generation** - Trade document assistance\n🌍 **Compliance** - Regulatory requirements\n\nHow can I assist you today?',
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTariffInfo = (productName: string, countryName: string): TariffInfo | null => {
    const product = products.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase()) ||
      productName.toLowerCase().includes(p.name.toLowerCase())
    );
    const country = countries.find(c => 
      c.name.toLowerCase().includes(countryName.toLowerCase()) ||
      countryName.toLowerCase().includes(c.name.toLowerCase())
    );

    if (!product || !country) return null;

    const baseTariff = product.avgTariff;
    const additionalDuties = country.riskLevel === 'high' ? 2.5 : country.riskLevel === 'medium' ? 1.5 : 0;
    const totalTariff = baseTariff + additionalDuties;

    return {
      product: product.name,
      country: country.name,
      hsCode: product.hsCode,
      baseTariff,
      additionalDuties,
      totalTariff,
      documentation: ['Commercial Invoice', 'Certificate of Origin', 'Packing List'],
      restrictions: country.riskLevel === 'high' ? ['Additional inspections required'] : []
    };
  };

  const getRiskAnalysis = (productName: string, countryName: string): string => {
    const product = products.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase()) ||
      productName.toLowerCase().includes(p.name.toLowerCase())
    );
    const country = countries.find(c => 
      c.name.toLowerCase().includes(countryName.toLowerCase()) ||
      countryName.toLowerCase().includes(c.name.toLowerCase())
    );

    if (!product || !country) return 'Product or country not found in database.';

    const overallRisk = product.riskLevel === 'high' || country.riskLevel === 'high' ? 'HIGH' :
                       product.riskLevel === 'medium' || country.riskLevel === 'medium' ? 'MEDIUM' : 'LOW';

    let riskReport = `📊 **Risk Analysis: ${product.name} to ${country.name}**\n\n`;
    riskReport += `**Overall Risk Level: ${overallRisk}**\n\n`;
    
    riskReport += `**Product Risk:** ${product.riskLevel.toUpperCase()}\n`;
    riskReport += `• HS Code: ${product.hsCode}\n`;
    riskReport += `• Demand Level: ${product.demand.toUpperCase()}\n`;
    riskReport += `• Average Tariff: ${product.avgTariff}%\n\n`;
    
    riskReport += `**Country Risk:** ${country.riskLevel.toUpperCase()}\n`;
    riskReport += `• Ease of Business: ${country.easeOfBusiness}/100\n`;
    riskReport += `• Currency: ${country.currency}\n`;
    riskReport += `• Region: ${country.region}\n\n`;
    
    riskReport += `**Recommendations:**\n`;
    
    if (overallRisk === 'LOW') {
      riskReport += `✅ Favorable export conditions\n`;
      riskReport += `✅ Standard documentation required\n`;
      riskReport += `✅ Good market potential\n`;
    } else if (overallRisk === 'MEDIUM') {
      riskReport += `⚠️ Monitor market conditions\n`;
      riskReport += `⚠️ Ensure proper documentation\n`;
      riskReport += `⚠️ Consider insurance options\n`;
    } else {
      riskReport += `🔴 High risk assessment\n`;
      riskReport += `🔴 Additional permits may be required\n`;
      riskReport += `🔴 Comprehensive insurance recommended\n`;
    }

    return riskReport;
  };

  const getProfitableProducts = (countryName: string): string => {
    const country = countries.find(c => 
      c.name.toLowerCase().includes(countryName.toLowerCase()) ||
      countryName.toLowerCase().includes(c.name.toLowerCase())
    );

    if (!country) return 'Country not found in database.';

    // Get top products based on multiple factors: demand, risk level, and tariff
    const topProducts = products
      .filter(p => p.demand === 'high' && p.riskLevel !== 'high')
      .sort((a, b) => {
        // Sort by combined score: higher demand, lower risk, reasonable tariff
        const scoreA = (a.demand === 'high' ? 3 : a.demand === 'medium' ? 2 : 1) + 
                      (a.riskLevel === 'low' ? 2 : a.riskLevel === 'medium' ? 1 : 0) +
                      (a.avgTariff < 10 ? 1 : 0);
        const scoreB = (b.demand === 'high' ? 3 : b.demand === 'medium' ? 2 : 1) + 
                      (b.riskLevel === 'low' ? 2 : b.riskLevel === 'medium' ? 1 : 0) +
                      (b.avgTariff < 10 ? 1 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 10);

    let response = `🎯 **Top 10 Profitable Products for Export to ${country.name}**\n\n`;
    response += `**Country Overview:**\n`;
    response += `• Region: ${country.region}\n`;
    response += `• Currency: ${country.currency}\n`;
    response += `• Ease of Business: ${country.easeOfBusiness}/100\n`;
    response += `• Risk Level: ${country.riskLevel.toUpperCase()}\n\n`;
    
    response += `**Most Profitable Products:**\n\n`;
    topProducts.forEach((product, index) => {
      const profitPotential = calculateProfitPotential(product, country);
      response += `${index + 1}. **${product.name}**\n`;
      response += `   • Category: ${product.category}\n`;
      response += `   • HS Code: ${product.hsCode}\n`;
      response += `   • Tariff: ${product.avgTariff}%\n`;
      response += `   • Risk: ${product.riskLevel.toUpperCase()}\n`;
      response += `   • Demand: ${product.demand.toUpperCase()}\n`;
      response += `   • Profit Potential: ${profitPotential}\n\n`;
    });
    
    response += `💡 **Key Insights for ${country.name}:**\n`;
    response += `• Low-risk products with high demand are most profitable\n`;
    response += `• Products with tariffs below 10% have better margins\n`;
    response += `• ${country.region} market shows strong demand for quality goods\n`;
    response += `• Consider seasonal demand fluctuations for agricultural products\n\n`;
    
    response += `📈 **Additional Recommendations:**\n`;
    response += `• Start with low-risk products to build market presence\n`;
    response += `• Consider establishing local partnerships for better market access\n`;
    response += `• Monitor regulatory changes that may affect profitability\n`;
    response += `• Leverage trade agreements if available between your country and ${country.name}`;
    
    return response;
  };

  const calculateProfitPotential = (product: Product, country: Country): string => {
    // Simple profit potential calculation based on multiple factors
    const tariffScore = product.avgTariff < 5 ? 'High' : product.avgTariff < 10 ? 'Medium' : 'Low';
    const riskScore = product.riskLevel === 'low' ? 'High' : product.riskLevel === 'medium' ? 'Medium' : 'Low';
    const demandScore = product.demand === 'high' ? 'High' : product.demand === 'medium' ? 'Medium' : 'Low';
    const countryScore = country.easeOfBusiness > 80 ? 'High' : country.easeOfBusiness > 60 ? 'Medium' : 'Low';
    
    // Overall profit potential
    const highFactors = [tariffScore, riskScore, demandScore, countryScore].filter(s => s === 'High').length;
    
    if (highFactors >= 3) return 'Very High';
    if (highFactors >= 2) return 'High';
    if (highFactors >= 1) return 'Medium';
    return 'Low';
  };

  const getRequiredDocuments = (productName: string, fromCountry: string, toCountry: string): string => {
    const product = products.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase()) ||
      productName.toLowerCase().includes(p.name.toLowerCase())
    );
    const from = countries.find(c => 
      c.name.toLowerCase().includes(fromCountry.toLowerCase()) ||
      fromCountry.toLowerCase().includes(c.name.toLowerCase())
    );
    const to = countries.find(c => 
      c.name.toLowerCase().includes(toCountry.toLowerCase()) ||
      toCountry.toLowerCase().includes(c.name.toLowerCase())
    );

    if (!product || !from || !to) return 'Product or country not found in database.';

    let docsResponse = `📋 **Required Documents for Exporting ${product.name} from ${from.name} to ${to.name}**\n\n`;
    
    docsResponse += `**Standard Documents:**\n`;
    docsResponse += `• Commercial Invoice\n`;
    docsResponse += `• Certificate of Origin\n`;
    docsResponse += `• Packing List\n`;
    docsResponse += `• Bill of Lading/Air Waybill\n`;
    docsResponse += `• Insurance Certificate\n\n`;
    
    docsResponse += `**Product-Specific Documents:**\n`;
    
    if (product.category === 'Agricultural' || product.category === 'Food') {
      docsResponse += `• Phytosanitary Certificate\n`;
      docsResponse += `• Health Certificate\n`;
      docsResponse += `• Fumigation Certificate\n`;
    }
    
    if (product.category === 'Chemicals' || product.category === 'Pharmaceuticals') {
      docsResponse += `• Material Safety Data Sheet (MSDS)\n`;
      docsResponse += `• Product Registration Certificate\n`;
      docsResponse += `• Analysis Certificate\n`;
    }
    
    if (product.category === 'Textiles' || product.category === 'Leather') {
      docsResponse += `• Textile Certificate\n`;
      docsResponse += `• Quality Certificate\n`;
      docsResponse += `• Label Approval\n`;
    }
    
    if (product.category === 'Machinery' || product.category === 'Electronics') {
      docsResponse += `• Technical Specifications\n`;
      docsResponse += `• Warranty Certificate\n`;
      docsResponse += `• User Manual\n`;
    }
    
    docsResponse += `\n**Country-Specific Requirements:**\n`;
    
    if (to.riskLevel === 'high') {
      docsResponse += `• Additional Import Licenses\n`;
      docsResponse += `• Pre-shipment Inspection\n`;
      docsResponse += `• Special Permits\n`;
    }
    
    if (to.region === 'European Union') {
      docsResponse += `• CE Marking (for applicable products)\n`;
      docsResponse += `• EU Declaration of Conformity\n`;
    }
    
    if (to.region === 'North America') {
      docsResponse += `• FDA Approval (for food/pharma)\n`;
      docsResponse += `• EPA Certification (for chemicals)\n`;
    }
    
    return docsResponse;
  };

  const getProductSpecificDocuments = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'agricultural':
      case 'food':
        return `• Phytosanitary Certificate\n• Health Certificate\n• Fumigation Certificate\n• Certificate of Analysis\n• Organic Certification (if applicable)`;
      case 'textiles':
        return `• Textile Certificate\n• Quality Certificate\n• Fiber Content Certificate\n• Care Label Certificate\n• Flammability Certificate`;
      case 'leather':
        return `• Leather Certificate\n• Quality Certificate\n• Animal Origin Certificate\n• Tanning Process Certificate\n• Chemical Compliance Certificate`;
      case 'chemicals':
      case 'pharmaceuticals':
        return `• Material Safety Data Sheet (MSDS)\n• Product Registration Certificate\n• Chemical Analysis Certificate\n• Good Manufacturing Practice (GMP) Certificate\n• Toxicological Report`;
      case 'machinery':
      case 'electronics':
        return `• Technical Specifications\n• Warranty Certificate\n• Safety Compliance Certificate\n• Electromagnetic Compatibility (EMC) Certificate\n• Energy Efficiency Certificate`;
      case 'metals':
        return `• Material Composition Certificate\n• Quality Inspection Certificate\n• Mechanical Properties Certificate\n• Corrosion Resistance Certificate\n• Welding Procedure Certificate`;
      case 'handicrafts':
        return `• Handicraft Certificate\n• Artisan Authentication Certificate\n• Cultural Heritage Certificate (if applicable)\n• Raw Material Source Certificate\n• Fair Trade Certificate (if applicable)`;
      default:
        return `• Product Specification Sheet\n• Quality Control Certificate\n• Manufacturing Process Certificate\n• Material Safety Certificate`;
    }
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase();
    
    // Check for tariff-related queries with improved matching
    if (input.includes('tariff') || input.includes('duty') || input.includes('tax') || 
        input.includes('import') || input.includes('export') || input.includes('customs')) {
      
      console.log('Tariff query detected:', input);
      
      // Extract potential product and country mentions
      let foundProduct: Product | null = null;
      let foundCountry: Country | null = null;
      
      // Try to find product matches
      for (const product of products) {
        if (input.includes(product.name.toLowerCase()) || 
            product.name.toLowerCase().includes(input) ||
            input.includes(product.category.toLowerCase())) {
          foundProduct = product;
          console.log('Found product:', foundProduct.name);
          break;
        }
      }
      
      // Try to find country matches
      for (const country of countries) {
        if (input.includes(country.name.toLowerCase()) || 
            country.name.toLowerCase().includes(input) ||
            input.includes(country.code.toLowerCase()) ||
            input.includes(country.region.toLowerCase())) {
          foundCountry = country;
          console.log('Found country:', foundCountry.name);
          break;
        }
      }
      
      // If no specific product found, look for common product categories
      if (!foundProduct) {
        const productCategories = ['agricultural', 'textile', 'leather', 'chemical', 'machinery', 'metal', 'food', 'handicraft', 'automotive', 'construction', 'paper', 'sports', 'medical', 'fruit', 'vegetable', 'coffee', 'tea', 'rice', 'silk', 'cotton', 'nylon', 'mobile', 'steel', 'iron'];
        for (const category of productCategories) {
          if (input.includes(category)) {
            foundProduct = products.find(p => 
              p.category.toLowerCase().includes(category) || 
              p.name.toLowerCase().includes(category)
            );
            if (foundProduct) {
              console.log('Found product by category:', foundProduct.name);
              break;
            }
          }
        }
      }
      
      // If no specific country found, look for common countries/regions
      if (!foundCountry) {
        const commonCountries = ['usa', 'america', 'uk', 'britain', 'europe', 'asia', 'china', 'japan', 'germany', 'france', 'india', 'canada', 'australia'];
        for (const country of commonCountries) {
          if (input.includes(country)) {
            foundCountry = countries.find(c => 
              c.name.toLowerCase().includes(country) || 
              c.code.toLowerCase().includes(country) ||
              c.region.toLowerCase().includes(country)
            );
            if (foundCountry) {
              console.log('Found country by common name:', foundCountry.name);
              break;
            }
          }
        }
      }
      
      // If we found both product and country, provide tariff info
      if (foundProduct && foundCountry) {
        console.log('Both product and country found, getting tariff info...');
        const tariffInfo = getTariffInfo(foundProduct.name, foundCountry.name);
        if (tariffInfo) {
          console.log('Tariff info retrieved:', tariffInfo);
          let response = `📊 **Tariff Information: ${tariffInfo.product} to ${tariffInfo.country}**\n\n`;
          response += `**HS Code:** ${tariffInfo.hsCode}\n`;
          response += `**Base Tariff:** ${tariffInfo.baseTariff}%\n`;
          response += `**Additional Duties:** ${tariffInfo.additionalDuties}%\n`;
          response += `**Total Tariff:** ${tariffInfo.totalTariff}%\n\n`;
          response += `**Required Documents:**\n`;
          tariffInfo.documentation.forEach(doc => {
            response += `• ${doc}\n`;
          });
          if (tariffInfo.restrictions.length > 0) {
            response += `\n**Restrictions:**\n`;
            tariffInfo.restrictions.forEach(restriction => {
              response += `• ${restriction}\n`;
            });
          }
          return response;
        } else {
          console.log('Failed to get tariff info');
        }
      }
      
      // If only product found, ask for country
      if (foundProduct && !foundCountry) {
        return `I found information about **${foundProduct.name}** (HS Code: ${foundProduct.hsCode}). To provide you with accurate tariff information, please specify the destination country. For example: "What is the tariff for ${foundProduct.name} to USA?"`;
      }
      
      // If only country found, ask for product
      if (!foundProduct && foundCountry) {
        return `I found information about **${foundCountry.name}**. To provide you with accurate tariff information, please specify the product you want to export. For example: "What is the tariff for tea to ${foundCountry.name}?"`;
      }
      
      // If neither found, provide general guidance
      return `I can help you with tariff information! Please specify both the product and destination country. For example:\n\n• "What is the tariff for rice to USA?"\n• "Duty rate for mobile phones to Germany"\n• "Export tax for textiles to UK"\n\nI have access to 200+ products and 150+ countries in my database!`;
    }
    
    // Check for risk-related queries with improved matching
    if (input.includes('risky') || input.includes('risk') || input.includes('safe') || input.includes('danger')) {
      
      // Extract potential product and country mentions
      let foundProduct: Product | null = null;
      let foundCountry: Country | null = null;
      
      // Try to find product matches
      for (const product of products) {
        if (input.includes(product.name.toLowerCase()) || 
            product.name.toLowerCase().includes(input) ||
            input.includes(product.category.toLowerCase())) {
          foundProduct = product;
          break;
        }
      }
      
      // Try to find country matches
      for (const country of countries) {
        if (input.includes(country.name.toLowerCase()) || 
            country.name.toLowerCase().includes(input) ||
            input.includes(country.code.toLowerCase()) ||
            input.includes(country.region.toLowerCase())) {
          foundCountry = country;
          break;
        }
      }
      
      // If no specific product found, look for common product categories
      if (!foundProduct) {
        const productCategories = ['agricultural', 'textile', 'leather', 'chemical', 'machinery', 'metal', 'food', 'handicraft', 'automotive', 'construction', 'paper', 'sports', 'medical', 'fruit', 'vegetable', 'coffee', 'tea', 'rice', 'silk', 'cotton', 'nylon', 'mobile', 'steel', 'iron'];
        for (const category of productCategories) {
          if (input.includes(category)) {
            foundProduct = products.find(p => 
              p.category.toLowerCase().includes(category) || 
              p.name.toLowerCase().includes(category)
            );
            if (foundProduct) break;
          }
        }
      }
      
      // If no specific country found, look for common countries/regions
      if (!foundCountry) {
        const commonCountries = ['usa', 'america', 'uk', 'britain', 'europe', 'asia', 'china', 'japan', 'germany', 'france', 'india', 'canada', 'australia'];
        for (const country of commonCountries) {
          if (input.includes(country)) {
            foundCountry = countries.find(c => 
              c.name.toLowerCase().includes(country) || 
              c.code.toLowerCase().includes(country) ||
              c.region.toLowerCase().includes(country)
            );
            if (foundCountry) break;
          }
        }
      }
      
      if (foundProduct && foundCountry) {
        return getRiskAnalysis(foundProduct.name, foundCountry.name);
      }
      
      // If only product found, ask for country
      if (foundProduct && !foundCountry) {
        return `I found information about **${foundProduct.name}**. To provide you with accurate risk analysis, please specify the destination country. For example: "Is it risky to export ${foundProduct.name} to USA?"`;
      }
      
      // If only country found, ask for product
      if (!foundProduct && foundCountry) {
        return `I found information about **${foundCountry.name}**. To provide you with accurate risk analysis, please specify the product you want to export. For example: "Is it risky to export tea to ${foundCountry.name}?"`;
      }
      
      // If neither found, provide general guidance
      return `I can help you with risk analysis! Please specify both the product and destination country. For example:\n\n• "Is it risky to export rice to USA?"\n• "Risk assessment for mobile phones to Germany"\n• "Is it safe to export textiles to UK?"\n\nI have access to 200+ products and 150+ countries in my database!`;
    }
    
    // Check for market/profit-related queries with improved matching
    if (input.includes('profit') || input.includes('market') || input.includes('best') || input.includes('which products') || input.includes('opportunity') || input.includes('lucrative') || input.includes('money') || input.includes('income') || input.includes('revenue')) {
      
      console.log('Profit query detected:', input);
      
      // Try to find country matches
      let foundCountry: Country | null = null;
      
      for (const country of countries) {
        if (input.includes(country.name.toLowerCase()) || 
            country.name.toLowerCase().includes(input) ||
            input.includes(country.code.toLowerCase()) ||
            input.includes(country.region.toLowerCase())) {
          foundCountry = country;
          console.log('Found country:', foundCountry.name);
          break;
        }
      }
      
      // Special handling for USA
      if (!foundCountry && (input.includes('usa') || input.includes('america') || input.includes('states'))) {
        foundCountry = countries.find(c => c.name.toLowerCase().includes('united states'));
        console.log('Found USA by special handling:', foundCountry?.name);
      }
      
      // If no specific country found, look for common countries/regions
      if (!foundCountry) {
        const commonCountries = ['usa', 'america', 'uk', 'britain', 'europe', 'asia', 'china', 'japan', 'germany', 'france', 'india', 'canada', 'australia'];
        for (const country of commonCountries) {
          if (input.includes(country)) {
            foundCountry = countries.find(c => 
              c.name.toLowerCase().includes(country) || 
              c.code.toLowerCase().includes(country) ||
              c.region.toLowerCase().includes(country)
            );
            if (foundCountry) {
              console.log('Found country by common name:', foundCountry.name);
              break;
            }
          }
        }
      }
      
      if (foundCountry) {
        return getProfitableProducts(foundCountry.name);
      }
      
      // If no country found, provide general guidance
      return `I can help you find profitable products! Please specify the destination country. For example:\n\n• "Which products give profit in USA?"\n• "Best products for Germany market"\n• "Profitable exports to UK"\n• "Lucrative products for Canada"\n• "High revenue products for Australia"\n\nI have access to 200+ products and 150+ countries in my database!`;
    }
    
    // Check for document-related queries with improved matching
    if (input.includes('document') || input.includes('documents') || input.includes('required') || input.includes('certificate') || input.includes('paperwork') || input.includes('export document') || input.includes('trade document')) {
      
      console.log('Document query detected:', input);
      
      // Extract potential product and country mentions
      let foundProduct: Product | null = null;
      let foundFromCountry: Country | null = null;
      let foundToCountry: Country | null = null;
      
      // Special handling for silk and other commonly asked products
      if (input.includes('silk')) {
        foundProduct = products.find(p => p.name.toLowerCase().includes('silk') || p.category.toLowerCase().includes('textile'));
        console.log('Found silk product:', foundProduct?.name);
      }
      
      // Try to find product matches
      if (!foundProduct) {
        for (const product of products) {
          if (input.includes(product.name.toLowerCase()) || 
              product.name.toLowerCase().includes(input) ||
              input.includes(product.category.toLowerCase())) {
            foundProduct = product;
            console.log('Found product:', foundProduct.name);
            break;
          }
        }
      }
      
      // Try to find country matches
      const allCountries = [...countries];
      for (const country of allCountries) {
        if (input.includes(country.name.toLowerCase()) || 
            country.name.toLowerCase().includes(input) ||
            input.includes(country.code.toLowerCase()) ||
            input.includes(country.region.toLowerCase())) {
          
          // Simple heuristic: if "from" or "export from" is mentioned, it's likely the origin country
          if (input.includes('from') || input.includes('export from')) {
            foundFromCountry = country;
            console.log('Found from country:', foundFromCountry.name);
          } else {
            foundToCountry = country;
            console.log('Found to country:', foundToCountry.name);
          }
        }
      }
      
      // If no specific product found, look for common product categories
      if (!foundProduct) {
        const productCategories = ['agricultural', 'textile', 'leather', 'chemical', 'machinery', 'metal', 'food', 'handicraft', 'automotive', 'construction', 'paper', 'sports', 'medical', 'fruit', 'vegetable', 'coffee', 'tea', 'rice', 'silk', 'cotton', 'nylon', 'mobile', 'steel', 'iron'];
        for (const category of productCategories) {
          if (input.includes(category)) {
            foundProduct = products.find(p => 
              p.category.toLowerCase().includes(category) || 
              p.name.toLowerCase().includes(category)
            );
            if (foundProduct) {
              console.log('Found product by category:', foundProduct.name);
              break;
            }
          }
        }
      }
      
      // If no specific country found, look for common countries/regions
      if (!foundFromCountry && !foundToCountry) {
        const commonCountries = ['usa', 'america', 'uk', 'britain', 'europe', 'asia', 'china', 'japan', 'germany', 'france', 'india', 'canada', 'australia'];
        for (const country of commonCountries) {
          if (input.includes(country)) {
            const match = countries.find(c => 
              c.name.toLowerCase().includes(country) || 
              c.code.toLowerCase().includes(country) ||
              c.region.toLowerCase().includes(country)
            );
            if (match) {
              if (input.includes('from') || input.includes('export from')) {
                foundFromCountry = match;
                console.log('Found from country by common name:', foundFromCountry.name);
              } else {
                foundToCountry = match;
                console.log('Found to country by common name:', foundToCountry.name);
              }
            }
          }
        }
      }
      
      if (foundProduct && foundFromCountry && foundToCountry) {
        return getRequiredDocuments(foundProduct.name, foundFromCountry.name, foundToCountry.name);
      } else if (foundProduct && foundToCountry) {
        return `📋 **Documents Required for ${foundProduct.name}**\n\nFor exporting **${foundProduct.name}** to **${foundToCountry.name}**, you'll typically need:\n\n**Standard Documents:**\n• Commercial Invoice\n• Certificate of Origin\n• Packing List\n• Bill of Lading/Air Waybill\n• Insurance Certificate\n\n**Product-Specific Documents:**\n${getProductSpecificDocuments(foundProduct.category)}\n\n**Additional Requirements for ${foundToCountry.name}:**\n• Customs Declaration Form\n• Import License (if applicable)\n• Quality Inspection Certificate\n\n💡 **Tip:** Requirements may vary based on the value of shipment and specific regulations. Always check with the destination country's customs authority for the most up-to-date requirements.`;
      } else if (foundProduct) {
        return `📋 **Documents Required for ${foundProduct.name}**\n\nThe required documents vary by destination country. For exporting **${foundProduct.name}**, you'll typically need:\n\n**Standard Documents:**\n• Commercial Invoice\n• Certificate of Origin\n• Packing List\n• Bill of Lading/Air Waybill\n• Insurance Certificate\n\n**Product-Specific Documents:**\n${getProductSpecificDocuments(foundProduct.category)}\n\nPlease specify the destination country for detailed documentation requirements specific to that country.`;
      }
      
      // If no specific product found, provide general guidance
      return `I can help you with document requirements! Please specify the product and destination country. For example:\n\n• "What documents are needed to export silk from India to USA?"\n• "Required certificates for mobile phones to Germany"\n• "Trade documents for textiles export to UK"\n\nI have access to 200+ products and 150+ countries in my database!`;
    }
    
    // For general questions, use a rule-based approach with Gemini-like responses
    // In a real implementation, you would integrate with the actual Gemini API
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return 'Hello! I\'m TradeGenie AI, your advanced trade assistant. How can I help you with your international trade questions today?';
    }
    
    if (input.includes('help') || input.includes('what can you do')) {
      return `I can help you with various aspects of international trade:\n\n📊 **Tariff Analysis** - Get detailed tariff information for products and countries\n⚠️ **Risk Assessment** - Analyze export risks for specific products and destinations\n🎯 **Market Intelligence** - Discover profitable export opportunities\n📋 **Documentation** - Learn about required documents for exports\n🌍 **Compliance** - Understand regulatory requirements\n\nJust ask me about tariffs, risks, profitable products, or required documents for your export needs!`;
    }
    
    if (input.includes('thank')) {
      return 'You\'re welcome! Feel free to ask me any other questions about international trade. I\'m here to help!';
    }
    
    // Default response with suggestions
    return `I can help you with international trade questions! Try asking me about:\n\n• **Tariff rates** - "What is the tariff for exporting tea from India to USA?"\n• **Risk assessment** - "Is it risky to export silk from India to Germany?"\n• **Profitable products** - "Which products give profit in France?"\n• **Required documents** - "What documents are needed to export rice from Thailand to Japan?"\n\nI have access to 200+ products and 150+ countries in my database!`;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        category: 'general'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
        category: 'general'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage('What is the tariff for exporting tea from India to USA?');
      }, 2000);
    }
  };

  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleDownloadChat = () => {
    const chatContent = messages.map(msg => 
      `${msg.type === 'user' ? 'You' : 'TradeGenie'} (${msg.timestamp.toLocaleString()}):\n${msg.content}\n\n`
    ).join('');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-genie-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'tariff': return <Zap className="w-4 h-4" />;
      case 'risk': return <Shield className="w-4 h-4" />;
      case 'market': return <TrendingUp className="w-4 h-4" />;
      case 'compliance': return <FileText className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E7] to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TradeGenie AI</h1>
              <p className="text-gray-600">Advanced Trade Assistant • 200+ Products • 150+ Countries</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-purple-600" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadChat}
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Chat
            </Button>
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg h-[700px] flex flex-col">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900">Conversation</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {products.length}+ Products
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {countries.length}+ Countries
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[520px] p-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-4 ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {message.type === 'assistant' && getCategoryIcon(message.category)}
                                <span className="text-xs opacity-70">
                                  {message.type === 'user' ? 'You' : 'TradeGenie AI'}
                                </span>
                                <span className="text-xs opacity-50">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {message.content}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 p-1 h-auto opacity-70 hover:opacity-100"
                              onClick={() => handleCopyMessage(message.id, message.content)}
                            >
                              {copiedMessageId === message.id ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 rounded-lg p-4 max-w-[85%] border border-gray-200">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                            <span className="text-sm">TradeGenie AI is analyzing your request...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={`p-2 ${isRecording ? 'bg-red-100 text-red-600 border-red-300' : ''}`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about tariffs, risks, markets, or compliance..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputMessage);
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}