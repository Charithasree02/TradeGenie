import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Trade knowledge base for the chatbot
const tradeKnowledge = {
  tariffs: {
    'tea-india-usa': {
      hsCode: '0902.30',
      baseRate: 6.4,
      additionalDuties: 0,
      description: 'Tea from India to USA'
    },
    'silk-india-germany': {
      hsCode: '5007.90',
      baseRate: 0,
      additionalDuties: 0,
      description: 'Silk fabrics from India to Germany (under EU preferences)'
    },
    'textiles-india-france': {
      hsCode: '6201.92',
      baseRate: 12.0,
      additionalDuties: 0,
      description: 'Textile apparel from India to France'
    }
  },
  products: [
    // Agricultural Products (25)
    'Tea', 'Rice', 'Spices', 'Cotton', 'Coffee', 'Cocoa', 'Sugar', 'Wheat', 'Corn', 'Soybeans',
    'Pulses', 'Nuts', 'Dried Fruits', 'Fresh Fruits', 'Fresh Vegetables', 'Flowers', 'Honey', 'Tobacco',
    'Rubber', 'Jute', 'Coconut', 'Palm Oil', 'Olive Oil', 'Dairy Products', 'Meat Products',
    
    // Textiles & Apparel (30)
    'Silk', 'Textiles', 'Cotton Yarn', 'Wool', 'Synthetic Fabrics', 'Denim', 'Sportswear', 'Formal Wear',
    'Casual Wear', 'Children\'s Clothing', 'Baby Clothing', 'Undergarments', 'Socks', 'Handbags', 'Luggage',
    'Footwear', 'Leather Goods', 'Carpets', 'Rugs', 'Towels', 'Bed Linen', 'Curtains', 'Upholstery Fabric',
    'Industrial Textiles', 'Medical Textiles', 'Technical Textiles', 'Home Textiles', 'Fashion Accessories', 'Belts',
    
    // Chemicals & Pharmaceuticals (35)
    'Pharmaceuticals', 'Generic Drugs', 'Vaccines', 'Medical Devices', 'Surgical Instruments', 'Diagnostics',
    'Chemicals', 'Organic Chemicals', 'Inorganic Chemicals', 'Petrochemicals', 'Fertilizers', 'Pesticides',
    'Dyes', 'Paints', 'Cosmetics', 'Toiletries', 'Essential Oils', 'Flavors', 'Fragrances', 'Plastics',
    'Rubber Products', 'Adhesives', 'Cleaning Products', 'Industrial Gases', 'Laboratory Chemicals', 'Reagents',
    'Biotechnology Products', 'Veterinary Medicines', 'Medical Supplies', 'Hospital Equipment', 'Dental Products',
    'Orthopedic Devices', 'Cardiovascular Devices', 'Diagnostic Equipment', 'Imaging Equipment',
    
    // Engineering & Machinery (40)
    'Engineering Goods', 'Machinery', 'Agricultural Machinery', 'Construction Equipment', 'Machine Tools',
    'Industrial Robots', 'Automotive Parts', 'Engine Parts', 'Transmission Systems', 'Brake Systems',
    'Electrical Equipment', 'Generators', 'Transformers', 'Motors', 'Pumps', 'Valves', 'Compressors',
    'HVAC Systems', 'Refrigeration Equipment', 'Kitchen Appliances', 'Laundry Equipment', 'Power Tools',
    'Hand Tools', 'Welding Equipment', 'Material Handling Equipment', 'Conveyor Systems', 'Packaging Machinery',
    'Printing Machinery', 'Textile Machinery', 'Food Processing Equipment', 'Mining Equipment', 'Oil & Gas Equipment',
    'Renewable Energy Equipment', 'Solar Panels', 'Wind Turbines', 'Battery Storage', 'Power Electronics',
    'Industrial Automation', 'Control Systems', 'Measurement Instruments',
    
    // Electronics & IT (30)
    'Electronics', 'Consumer Electronics', 'Mobile Phones', 'Laptops', 'Tablets', 'Desktop Computers',
    'Computer Peripherals', 'Printers', 'Scanners', 'Monitors', 'Televisions', 'Audio Equipment', 'Cameras',
    'Semiconductors', 'Integrated Circuits', 'Electronic Components', 'Printed Circuit Boards', 'LED Products',
    'Telecommunication Equipment', 'Networking Equipment', 'Software', 'IT Services', 'Cloud Services',
    'Data Center Equipment', 'Security Equipment', 'Surveillance Systems', 'Smart Home Devices', 'Wearable Devices',
    'Gaming Equipment', 'Virtual Reality Equipment',
    
    // Metals & Minerals (25)
    'Gems & Jewelry', 'Gold Jewelry', 'Silver Jewelry', 'Diamond Jewelry', 'Precious Stones', 'Semi-Precious Stones',
    'Steel', 'Iron', 'Aluminum', 'Copper', 'Zinc', 'Lead', 'Nickel', 'Tin', 'Titanium', 'Stainless Steel',
    'Metal Fabrications', 'Pipes', 'Tubes', 'Wires', 'Cables', 'Fasteners', 'Metal Castings', 'Forgings',
    'Minerals', 'Rare Earth Metals',
    
    // Food & Beverages (25)
    'Food Products', 'Processed Foods', 'Bakery Products', 'Confectionery', 'Snacks', 'Beverages', 'Soft Drinks',
    'Mineral Water', 'Alcoholic Beverages', 'Wine', 'Beer', 'Spirits', 'Seafood', 'Fish Products', 'Meat Products',
    'Poultry Products', 'Frozen Foods', 'Canned Foods', 'Organic Foods', 'Health Foods', 'Dietary Supplements',
    'Infant Formula', 'Pet Food', 'Food Ingredients', 'Food Additives'
  ],
  countries: [
    // North America (3)
    'USA', 'Canada', 'Mexico',
    
    // Central America & Caribbean (20)
    'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama',
    'Bahamas', 'Barbados', 'Cuba', 'Dominican Republic', 'Haiti', 'Jamaica', 'Trinidad and Tobago',
    'Antigua and Barbuda', 'Dominica', 'Grenada', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
    
    // South America (12)
    'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Uruguay', 'Paraguay',
    'Bolivia', 'Ecuador', 'Guyana', 'Suriname',
    
    // Europe (44)
    'Germany', 'France', 'UK', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Sweden', 'Poland', 'Belgium',
    'Austria', 'Norway', 'Ireland', 'Denmark', 'Finland', 'Czech Republic', 'Romania', 'Portugal', 'Greece', 'Hungary',
    'Luxembourg', 'Slovakia', 'Belarus', 'Bulgaria', 'Croatia', 'Serbia', 'Slovenia', 'Lithuania', 'Latvia', 'Estonia',
    'Iceland', 'Malta', 'Cyprus', 'Albania', 'North Macedonia', 'Bosnia and Herzegovina', 'Montenegro', 'Moldova', 'Ukraine',
    'Russia', 'Turkey', 'Georgia', 'Armenia', 'Azerbaijan',
    
    // Africa (54)
    'South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Ghana', 'Morocco', 'Tanzania', 'Ethiopia', 'Uganda', 'Algeria',
    'Tunisia', 'Cameroon', 'Ivory Coast', 'Libya', 'Sudan', 'Angola', 'Mozambique', 'Zimbabwe', 'Zambia', 'Senegal',
    'Botswana', 'Mauritius', 'Madagascar', 'Namibia', 'Malawi', 'Rwanda', 'Burkina Faso', 'Mali', 'Niger', 'Chad',
    'Benin', 'Togo', 'Guinea', 'Sierra Leone', 'Liberia', 'Gambia', 'Guinea-Bissau', 'Cape Verde', 'Sao Tome and Principe',
    'Equatorial Guinea', 'Gabon', 'Congo', 'Democratic Republic of Congo', 'Central African Republic', 'South Sudan',
    'Eritrea', 'Djibouti', 'Somalia', 'Seychelles', 'Comoros', 'Mauritania', 'Lesotho', 'Eswatini', 'Burundi',
    
    // Middle East (15)
    'UAE', 'Saudi Arabia', 'Israel', 'Iran', 'Iraq', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Jordan',
    'Lebanon', 'Syria', 'Yemen', 'Palestine', 'Afghanistan',
    
    // Asia (48)
    'China', 'Japan', 'India', 'South Korea', 'Indonesia', 'Turkey', 'Saudi Arabia', 'Taiwan', 'Thailand', 'Singapore',
    'Malaysia', 'Philippines', 'Pakistan', 'Bangladesh', 'Vietnam', 'Israel', 'Hong Kong', 'Myanmar', 'Sri Lanka', 'Kuwait',
    'Iraq', 'Oman', 'Qatar', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Azerbaijan', 'Georgia',
    'Armenia', 'Bahrain', 'Jordan', 'Lebanon', 'Syria', 'Yemen', 'Cyprus', 'Maldives', 'Bhutan', 'Nepal',
    'Mongolia', 'North Korea', 'Laos', 'Cambodia', 'Brunei', 'Timor-Leste', 'Palestine', 'Afghanistan',
    
    // Oceania (14)
    'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu', 'Samoa', 'Kiribati',
    'Tonga', 'Micronesia', 'Palau', 'Marshall Islands', 'Nauru', 'Tuvalu'
  ],
  // Enhanced document requirements knowledge base
  documentRequirements: {
    'silk-india-usa': {
      product: 'Silk',
      origin: 'India',
      destination: 'USA',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed invoice with product description, value, and terms'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Proof of shipment and title to goods'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof that goods originate from India'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information including weights and dimensions'
        },
        {
          name: 'Import License',
          required: false,
          description: 'May be required depending on silk type and value'
        },
        {
          name: 'Textile Declaration',
          required: true,
          description: 'FCC textile declaration for silk products'
        }
      ],
      hsCode: '5007.90',
      specialNotes: 'Silk products from India may qualify for preferential duty rates under certain trade agreements.'
    },
    'textiles-india-germany': {
      product: 'Textiles',
      origin: 'India',
      destination: 'Germany',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Must include fiber composition and weight'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Required for preferential treatment under EU-India trade agreement'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing with roll numbers and weights'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Ocean or air freight documentation'
        },
        {
          name: 'EU Textile Label',
          required: true,
          description: 'Mandatory fiber composition label in German/English'
        },
        {
          name: 'REACH Compliance',
          required: true,
          description: 'Chemical safety compliance certificate'
        },
        {
          name: 'Import Declaration',
          required: true,
          description: 'German customs import declaration'
        }
      ],
      hsCode: '6201.92',
      specialNotes: 'Germany has strict labeling requirements for textile products. All labels must be in German and English.'
    },
    'agricultural-india-uk': {
      product: 'Agricultural Products',
      origin: 'India',
      destination: 'UK',
      documents: [
        {
          name: 'Phytosanitary Certificate',
          required: true,
          description: 'Plant health certificate from Indian authorities'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Indian origin'
        },
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed product description and value'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Health Certificate',
          required: true,
          description: 'Food safety and health certification'
        },
        {
          name: 'Import License',
          required: false,
          description: 'May be required for certain agricultural products'
        },
        {
          name: 'Organic Certificate',
          required: false,
          description: 'Required if products are certified organic'
        }
      ],
      hsCode: '0701.90',
      specialNotes: 'UK has strict import controls on agricultural products post-Brexit. Additional inspections may be required.'
    },
    'agricultural-india-uae': {
      product: 'Agricultural Products',
      origin: 'India',
      destination: 'UAE',
      documents: [
        {
          name: 'Halal Certificate',
          required: true,
          description: 'Required for all food products entering UAE'
        },
        {
          name: 'Health Certificate',
          required: true,
          description: 'Food safety certification'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Indian origin'
        },
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed invoice with product specifications'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Import Permit',
          required: true,
          description: 'UAE import permit for food products'
        }
      ],
      hsCode: '0701.90',
      specialNotes: 'UAE requires Halal certification for all food products. Products must comply with GCC food standards.'
    },
    'chemicals-india-usa': {
      product: 'Chemicals',
      origin: 'India',
      destination: 'USA',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed chemical composition and specifications'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Indian origin'
        },
        {
          name: 'MSDS (Material Safety Data Sheet)',
          required: true,
          description: 'Safety data sheet for chemical products'
        },
        {
          name: 'EPA Certification',
          required: true,
          description: 'Environmental Protection Agency certification'
        },
        {
          name: 'Import License',
          required: false,
          description: 'May be required for certain chemicals'
        },
        {
          name: 'Hazardous Materials Declaration',
          required: true,
          description: 'Required for hazardous chemicals'
        }
      ],
      hsCode: '2934.99',
      specialNotes: 'USA has strict regulations for chemical imports. EPA and TSCA compliance is mandatory.'
    },
    'machinery-india-australia': {
      product: 'Machinery',
      origin: 'India',
      destination: 'Australia',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed machinery specifications'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Indian origin'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing with weights and dimensions'
        },
        {
          name: 'Inspection Certificate',
          required: true,
          description: 'Pre-shipment inspection certificate'
        },
        {
          name: 'Electrical Compliance',
          required: true,
          description: 'Australian electrical safety compliance'
        },
        {
          name: 'Import Declaration',
          required: true,
          description: 'Australian customs import declaration'
        }
      ],
      hsCode: '8479.90',
      specialNotes: 'Australia has strict electrical safety standards. All machinery must comply with Australian standards.'
    },
    // Additional document requirements for major product-country combinations
    'pharmaceuticals-india-usa': {
      product: 'Pharmaceuticals',
      origin: 'India',
      destination: 'USA',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed product description and value'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Indian origin'
        },
        {
          name: 'FDA Approval',
          required: true,
          description: 'US Food and Drug Administration approval'
        },
        {
          name: 'GMP Certificate',
          required: true,
          description: 'Good Manufacturing Practices certificate'
        },
        {
          name: 'Product Registration',
          required: true,
          description: 'FDA product registration'
        },
        {
          name: 'Labeling Compliance',
          required: true,
          description: 'US labeling requirements compliance'
        },
        {
          name: 'Import License',
          required: false,
          description: 'May be required for certain pharmaceuticals'
        }
      ],
      hsCode: '3004.90',
      specialNotes: 'USA has stringent FDA requirements for pharmaceutical imports. All products must be FDA approved.'
    },
    'electronics-china-usa': {
      product: 'Electronics',
      origin: 'China',
      destination: 'USA',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed product specifications'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Chinese origin'
        },
        {
          name: 'FCC Certification',
          required: true,
          description: 'Federal Communications Commission certification'
        },
        {
          name: 'UL Certification',
          required: true,
          description: 'Underwriters Laboratories safety certification'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information'
        },
        {
          name: 'Import Declaration',
          required: true,
          description: 'US customs import declaration'
        },
        {
          name: 'Trade Agreement Documentation',
          required: false,
          description: 'May be required for preferential treatment'
        }
      ],
      hsCode: '8517.12',
      specialNotes: 'Electronics from China require FCC and UL certifications. Additional tariffs may apply.'
    },
    'automotive-parts-germany-usa': {
      product: 'Automotive Parts',
      origin: 'Germany',
      destination: 'USA',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed automotive part specifications'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of German origin'
        },
        {
          name: 'DOT Certification',
          required: true,
          description: 'Department of Transportation certification'
        },
        {
          name: 'EPA Compliance',
          required: true,
          description: 'Environmental Protection Agency compliance'
        },
        {
          name: 'Quality Certificate',
          required: true,
          description: 'ISO/TS 16949 quality certification'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information'
        },
        {
          name: 'Import Declaration',
          required: true,
          description: 'US customs import declaration'
        }
      ],
      hsCode: '8708.99',
      specialNotes: 'Automotive parts require DOT and EPA compliance. German parts generally have high quality standards.'
    },
    'agricultural-brazil-china': {
      product: 'Agricultural Products',
      origin: 'Brazil',
      destination: 'China',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed product description'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Brazilian origin'
        },
        {
          name: 'Phytosanitary Certificate',
          required: true,
          description: 'Plant health certificate'
        },
        {
          name: 'Health Certificate',
          required: true,
          description: 'Food safety certificate'
        },
        {
          name: 'Import License',
          required: true,
          description: 'Chinese import license'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information'
        },
        {
          name: 'Inspection Certificate',
          required: true,
          description: 'Pre-shipment inspection certificate'
        }
      ],
      hsCode: '1201.00',
      specialNotes: 'China has strict import requirements for agricultural products. Inspection and certification are mandatory.'
    },
    'textiles-bangladesh-uk': {
      product: 'Textiles',
      origin: 'Bangladesh',
      destination: 'UK',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed textile specifications'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Bangladeshi origin'
        },
        {
          name: 'Textile Declaration',
          required: true,
          description: 'UK textile declaration'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information'
        },
        {
          name: 'Import Declaration',
          required: true,
          description: 'UK customs import declaration'
        },
        {
          name: 'Compliance Certificate',
          required: true,
          description: 'UK product compliance certificate'
        },
        {
          name: 'Labeling Documentation',
          required: true,
          description: 'UK labeling requirements'
        }
      ],
      hsCode: '6204.63',
      specialNotes: 'UK has specific labeling requirements for textiles post-Brexit. Compliance with UK standards is essential.'
    },
    'gems-jewelry-india-uae': {
      product: 'Gems & Jewelry',
      origin: 'India',
      destination: 'UAE',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed jewelry description and value'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Indian origin'
        },
        {
          name: 'Hallmark Certificate',
          required: true,
          description: 'Gold purity hallmark certificate'
        },
        {
          name: 'Gemstone Certificate',
          required: true,
          description: 'Gemstone authenticity certificate'
        },
        {
          name: 'Insurance Certificate',
          required: true,
          description: 'Insurance coverage for valuable items'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information'
        },
        {
          name: 'Import License',
          required: false,
          description: 'May be required for certain jewelry items'
        }
      ],
      hsCode: '7113.19',
      specialNotes: 'UAE has specific requirements for precious metals and stones. Hallmarking is mandatory for gold jewelry.'
    },
    'machinery-japan-australia': {
      product: 'Machinery',
      origin: 'Japan',
      destination: 'Australia',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed machinery specifications'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Japanese origin'
        },
        {
          name: 'Inspection Certificate',
          required: true,
          description: 'Pre-shipment inspection certificate'
        },
        {
          name: 'Australian Standards Compliance',
          required: true,
          description: 'Australian standards compliance certificate'
        },
        {
          name: 'Electrical Safety Certificate',
          required: true,
          description: 'Australian electrical safety certification'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information'
        },
        {
          name: 'Import Declaration',
          required: true,
          description: 'Australian customs import declaration'
        }
      ],
      hsCode: '8479.90',
      specialNotes: 'Australia has strict machinery safety standards. Japanese machinery generally meets high quality standards.'
    },
    'coffee-colombia-germany': {
      product: 'Coffee',
      origin: 'Colombia',
      destination: 'Germany',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed coffee description and grade'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Colombian origin'
        },
        {
          name: 'Phytosanitary Certificate',
          required: true,
          description: 'Plant health certificate'
        },
        {
          name: 'Quality Certificate',
          required: true,
          description: 'Coffee quality grade certificate'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information'
        },
        {
          name: 'Import Declaration',
          required: true,
          description: 'German customs import declaration'
        },
        {
          name: 'Organic Certificate',
          required: false,
          description: 'Required if coffee is certified organic'
        }
      ],
      hsCode: '0901.11',
      specialNotes: 'Germany has high quality standards for coffee imports. Colombian coffee generally receives preferential treatment.'
    },
    'seafood-norway-japan': {
      product: 'Seafood',
      origin: 'Norway',
      destination: 'Japan',
      documents: [
        {
          name: 'Commercial Invoice',
          required: true,
          description: 'Detailed seafood description'
        },
        {
          name: 'Bill of Lading',
          required: true,
          description: 'Shipping documentation'
        },
        {
          name: 'Certificate of Origin',
          required: true,
          description: 'Proof of Norwegian origin'
        },
        {
          name: 'Health Certificate',
          required: true,
          description: 'Food safety and health certificate'
        },
        {
          name: 'Import License',
          required: true,
          description: 'Japanese import license for seafood'
        },
        {
          name: 'Packing List',
          required: true,
          description: 'Detailed packing information'
        },
        {
          name: 'Cold Chain Documentation',
          required: true,
          description: 'Temperature control documentation'
        },
        {
          name: 'Inspection Certificate',
          required: true,
          description: 'Pre-shipment inspection certificate'
        }
      ],
      hsCode: '0303.11',
      specialNotes: 'Japan has strict requirements for seafood imports. Cold chain maintenance is critical for fresh seafood.'
    }
  },
  // Profit analysis data
  profitAnalysis: {
    'usa': {
      country: 'USA',
      currency: 'USD',
      marketSize: '$25.5 trillion',
      topProducts: [
        {
          product: 'Pharmaceuticals',
          profitMargin: '25-35%',
          demand: 'Very High',
          competition: 'High',
          keyFactors: ['FDA approval', 'Patent protection', 'Quality standards']
        },
        {
          product: 'Engineering Goods',
          profitMargin: '18-25%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Quality certification', 'After-sales service', 'Technical support']
        },
        {
          product: 'Textiles',
          profitMargin: '15-20%',
          demand: 'Medium',
          competition: 'Very High',
          keyFactors: ['Brand recognition', 'Design innovation', 'Supply chain efficiency']
        },
        {
          product: 'Gems & Jewelry',
          profitMargin: '30-40%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Design uniqueness', 'Quality certification', 'Marketing strategy']
        },
        {
          product: 'Chemicals',
          profitMargin: '20-28%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Environmental compliance', 'Product consistency', 'Logistics efficiency']
        }
      ],
      insights: [
        'USA has high demand for quality pharmaceutical products with strict regulatory requirements',
        'Engineering goods market is growing with focus on automation and smart manufacturing',
        'Textile market is competitive but offers opportunities in sustainable and technical textiles',
        'Gems and jewelry market values design innovation and ethical sourcing'
      ]
    },
    'canada': {
      country: 'Canada',
      currency: 'CAD',
      marketSize: '$2.2 trillion',
      topProducts: [
        {
          product: 'Agricultural Products',
          profitMargin: '12-18%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Food safety', 'Organic certification', 'Seasonal supply']
        },
        {
          product: 'Pharmaceuticals',
          profitMargin: '22-30%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Health Canada approval', 'Bilingual labeling', 'Quality assurance']
        },
        {
          product: 'Engineering Goods',
          profitMargin: '16-22%',
          demand: 'Medium',
          competition: 'Medium',
          keyFactors: ['Cold climate specifications', 'Energy efficiency', 'Local standards']
        },
        {
          product: 'Textiles',
          profitMargin: '14-18%',
          demand: 'Medium',
          competition: 'High',
          keyFactors: ['Winter clothing', 'Sustainable materials', 'Bilingual packaging']
        },
        {
          product: 'Chemicals',
          profitMargin: '18-25%',
          demand: 'Medium',
          competition: 'Low',
          keyFactors: ['Environmental standards', 'Cold weather formulations', 'Safety compliance']
        }
      ],
      insights: [
        'Canada has strict requirements for agricultural products with focus on food safety',
        'Pharmaceutical market requires Health Canada approval and bilingual labeling',
        'Engineering goods must meet Canadian standards and cold weather specifications',
        'Textile market has strong demand for winter clothing and sustainable materials'
      ]
    },
    'australia': {
      country: 'Australia',
      currency: 'AUD',
      marketSize: '$1.7 trillion',
      topProducts: [
        {
          product: 'Pharmaceuticals',
          profitMargin: '24-32%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['TGA approval', 'Quality standards', 'Therapeutic goods registration']
        },
        {
          product: 'Engineering Goods',
          profitMargin: '20-26%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Australian standards', 'Mining industry needs', 'After-sales support']
        },
        {
          product: 'Agricultural Products',
          profitMargin: '15-22%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Biosecurity', 'Seasonal supply', 'Quality certification']
        },
        {
          product: 'Chemicals',
          profitMargin: '18-24%',
          demand: 'Medium',
          competition: 'Low',
          keyFactors: ['Environmental safety', 'Mining industry applications', 'Quality control']
        },
        {
          product: 'Textiles',
          profitMargin: '16-20%',
          demand: 'Medium',
          competition: 'High',
          keyFactors: ['UV protection', 'Sustainable materials', 'Outdoor clothing']
        }
      ],
      insights: [
        'Australia has strong demand for pharmaceuticals with TGA approval requirements',
        'Engineering goods market is driven by mining and construction industries',
        'Agricultural products must meet strict biosecurity requirements',
        'Chemical market focuses on mining and industrial applications'
      ]
    },
    'china': {
      country: 'China',
      currency: 'CNY',
      marketSize: '$17.7 trillion',
      topProducts: [
        {
          product: 'Electronics',
          profitMargin: '15-25%',
          demand: 'Very High',
          competition: 'Very High',
          keyFactors: ['Technology innovation', 'Supply chain integration', 'Cost efficiency']
        },
        {
          product: 'Machinery',
          profitMargin: '12-20%',
          demand: 'High',
          competition: 'High',
          keyFactors: ['Quality standards', 'After-sales service', 'Technology transfer']
        },
        {
          product: 'Automotive Parts',
          profitMargin: '10-18%',
          demand: 'High',
          competition: 'Very High',
          keyFactors: ['Local partnerships', 'Technology adaptation', 'Cost competitiveness']
        },
        {
          product: 'Pharmaceuticals',
          profitMargin: '20-30%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['CFDA approval', 'Clinical trials', 'Distribution network']
        },
        {
          product: 'Agricultural Products',
          profitMargin: '8-15%',
          demand: 'Very High',
          competition: 'Medium',
          keyFactors: ['Food safety', 'Quality standards', 'Supply chain reliability']
        }
      ],
      insights: [
        'China has massive consumer market with growing middle class',
        'Electronics and machinery sectors are highly competitive but offer scale opportunities',
        'Regulatory environment requires careful navigation and local partnerships',
        'Agricultural imports are growing due to food security concerns'
      ]
    },
    'japan': {
      country: 'Japan',
      currency: 'JPY',
      marketSize: '$4.9 trillion',
      topProducts: [
        {
          product: 'Electronics',
          profitMargin: '18-28%',
          demand: 'High',
          competition: 'High',
          keyFactors: ['Quality excellence', 'Technology leadership', 'Brand reputation']
        },
        {
          product: 'Automotive Parts',
          profitMargin: '15-25%',
          demand: 'Very High',
          competition: 'High',
          keyFactors: ['Just-in-time delivery', 'Quality certification', 'Long-term partnerships']
        },
        {
          product: 'Machinery',
          profitMargin: '12-22%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Precision engineering', 'Reliability', 'Technical support']
        },
        {
          product: 'Pharmaceuticals',
          profitMargin: '22-32%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['PMDA approval', 'Clinical data', 'Distribution network']
        },
        {
          product: 'Food Products',
          profitMargin: '10-18%',
          demand: 'Medium',
          competition: 'High',
          keyFactors: ['Quality standards', 'Food safety', 'Packaging innovation']
        }
      ],
      insights: [
        'Japan demands highest quality standards and precision',
        'Long-term business relationships are crucial for success',
        'Automotive and electronics sectors offer premium positioning opportunities',
        'Regulatory approval process is thorough but predictable'
      ]
    },
    'germany': {
      country: 'Germany',
      currency: 'EUR',
      marketSize: '$4.3 trillion',
      topProducts: [
        {
          product: 'Machinery',
          profitMargin: '20-30%',
          demand: 'High',
          competition: 'High',
          keyFactors: ['Engineering excellence', 'Innovation', 'Quality certification']
        },
        {
          product: 'Automotive Parts',
          profitMargin: '18-28%',
          demand: 'Very High',
          competition: 'Very High',
          keyFactors: ['Technical standards', 'Quality management', 'Supply chain integration']
        },
        {
          product: 'Chemicals',
          profitMargin: '15-25%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Environmental compliance', 'Technical specifications', 'Safety standards']
        },
        {
          product: 'Pharmaceuticals',
          profitMargin: '22-35%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['BfArM approval', 'Clinical trials', 'Quality assurance']
        },
        {
          product: 'Electronics',
          profitMargin: '12-20%',
          demand: 'Medium',
          competition: 'High',
          keyFactors: ['Technical standards', 'Innovation', 'Quality certification']
        }
      ],
      insights: [
        'Germany values engineering excellence and technical precision',
        'Automotive sector offers premium positioning for quality components',
        'Environmental and quality standards are among the highest globally',
        'Long-term partnerships and reliability are highly valued'
      ]
    },
    'uk': {
      country: 'UK',
      currency: 'GBP',
      marketSize: '$3.1 trillion',
      topProducts: [
        {
          product: 'Pharmaceuticals',
          profitMargin: '25-35%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['MHRA approval', 'Clinical trials', 'NHS compliance']
        },
        {
          product: 'Financial Services',
          profitMargin: '20-30%',
          demand: 'High',
          competition: 'High',
          keyFactors: ['Regulatory compliance', 'Technology innovation', 'Market expertise']
        },
        {
          product: 'Engineering Goods',
          profitMargin: '15-25%',
          demand: 'Medium',
          competition: 'High',
          keyFactors: ['Quality standards', 'Technical specifications', 'After-sales support']
        },
        {
          product: 'Chemicals',
          profitMargin: '12-22%',
          demand: 'Medium',
          competition: 'Medium',
          keyFactors: ['Environmental compliance', 'Safety standards', 'Quality control']
        },
        {
          product: 'Food Products',
          profitMargin: '10-18%',
          demand: 'High',
          competition: 'High',
          keyFactors: ['Food safety', 'Quality standards', 'Supply chain traceability']
        }
      ],
      insights: [
        'UK has strong pharmaceutical and financial services sectors',
        'Post-Brexit regulatory environment requires careful navigation',
        'Quality and compliance are paramount for market access',
        'Consumer market values quality and innovation'
      ]
    },
    'brazil': {
      country: 'Brazil',
      currency: 'BRL',
      marketSize: '$2.1 trillion',
      topProducts: [
        {
          product: 'Agricultural Products',
          profitMargin: '15-25%',
          demand: 'Very High',
          competition: 'Medium',
          keyFactors: ['Scale efficiency', 'Supply chain logistics', 'Quality certification']
        },
        {
          product: 'Mining Equipment',
          profitMargin: '18-28%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Technical specifications', 'After-sales support', 'Local partnerships']
        },
        {
          product: 'Automotive Parts',
          profitMargin: '12-22%',
          demand: 'High',
          competition: 'High',
          keyFactors: ['Cost competitiveness', 'Local manufacturing', 'Quality standards']
        },
        {
          product: 'Chemicals',
          profitMargin: '15-25%',
          demand: 'Medium',
          competition: 'Medium',
          keyFactors: ['Environmental compliance', 'Technical support', 'Distribution network']
        },
        {
          product: 'Machinery',
          profitMargin: '10-20%',
          demand: 'Medium',
          competition: 'High',
          keyFactors: ['Financing options', 'Technical support', 'Local service network']
        }
      ],
      insights: [
        'Brazil offers massive agricultural market with global export potential',
        'Mining and infrastructure sectors present significant opportunities',
        'Local manufacturing partnerships are increasingly important',
        'Economic volatility requires careful risk management'
      ]
    },
    'india': {
      country: 'India',
      currency: 'INR',
      marketSize: '$3.7 trillion',
      topProducts: [
        {
          product: 'Pharmaceuticals',
          profitMargin: '20-30%',
          demand: 'Very High',
          competition: 'High',
          keyFactors: ['CDSCO approval', 'Price competitiveness', 'Distribution network']
        },
        {
          product: 'Engineering Goods',
          profitMargin: '15-25%',
          demand: 'High',
          competition: 'Very High',
          keyFactors: ['Cost efficiency', 'Quality standards', 'After-sales service']
        },
        {
          product: 'Textiles',
          profitMargin: '12-20%',
          demand: 'Very High',
          competition: 'Very High',
          keyFactors: ['Scale production', 'Design innovation', 'Supply chain efficiency']
        },
        {
          product: 'Chemicals',
          profitMargin: '15-25%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Environmental compliance', 'Technical specifications', 'Cost competitiveness']
        },
        {
          product: 'Electronics',
          profitMargin: '10-18%',
          demand: 'Very High',
          competition: 'Very High',
          keyFactors: ['Price competitiveness', 'Technology adaptation', 'Local partnerships']
        }
      ],
      insights: [
        'India has rapidly growing consumer market with digital adoption',
        'Pharmaceutical sector offers strong export opportunities',
        'Price sensitivity requires careful positioning strategies',
        'Government initiatives support manufacturing and exports'
      ]
    },
    'uae': {
      country: 'UAE',
      currency: 'AED',
      marketSize: '$421 billion',
      topProducts: [
        {
          product: 'Gems & Jewelry',
          profitMargin: '25-40%',
          demand: 'Very High',
          competition: 'Medium',
          keyFactors: ['Quality certification', 'Design innovation', 'Market positioning']
        },
        {
          product: 'Electronics',
          profitMargin: '15-25%',
          demand: 'High',
          competition: 'High',
          keyFactors: ['Technology leadership', 'Brand reputation', 'Distribution network']
        },
        {
          product: 'Machinery',
          profitMargin: '18-28%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['Technical specifications', 'After-sales support', 'Regional hub strategy']
        },
        {
          product: 'Chemicals',
          profitMargin: '12-22%',
          demand: 'Medium',
          competition: 'Medium',
          keyFactors: ['Quality standards', 'Environmental compliance', 'Regional distribution']
        },
        {
          product: 'Food Products',
          profitMargin: '10-20%',
          demand: 'Very High',
          competition: 'High',
          keyFactors: ['Halal certification', 'Quality standards', 'Supply chain reliability']
        }
      ],
      insights: [
        'UAE serves as strategic hub for Middle East and Africa markets',
        'Luxury goods and high-value products have strong demand',
        'Free zones offer significant business advantages',
        'Quality and certification requirements are stringent'
      ]
    },
    'singapore': {
      country: 'Singapore',
      currency: 'SGD',
      marketSize: '$397 billion',
      topProducts: [
        {
          product: 'Electronics',
          profitMargin: '15-25%',
          demand: 'High',
          competition: 'High',
          keyFactors: ['Technology innovation', 'Quality standards', 'Regional hub positioning']
        },
        {
          product: 'Chemicals',
          profitMargin: '18-28%',
          demand: 'Medium',
          competition: 'Medium',
          keyFactors: ['Technical specifications', 'Environmental compliance', 'Regional distribution']
        },
        {
          product: 'Pharmaceuticals',
          profitMargin: '22-32%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['HSA approval', 'Quality assurance', 'Regional headquarters']
        },
        {
          product: 'Machinery',
          profitMargin: '12-22%',
          demand: 'Medium',
          competition: 'High',
          keyFactors: ['Technical support', 'Regional service center', 'Quality certification']
        },
        {
          product: 'Financial Services',
          profitMargin: '20-35%',
          demand: 'High',
          competition: 'High',
          keyFactors: ['Regulatory compliance', 'Technology innovation', 'Regional expertise']
        }
      ],
      insights: [
        'Singapore is premier regional hub for Southeast Asia',
        'Strong intellectual property protection and business environment',
        'Strategic location for regional distribution and management',
        'High-quality standards and regulatory efficiency'
      ]
    },
    'southkorea': {
      country: 'South Korea',
      currency: 'KRW',
      marketSize: '$1.8 trillion',
      topProducts: [
        {
          product: 'Electronics',
          profitMargin: '15-25%',
          demand: 'Very High',
          competition: 'Very High',
          keyFactors: ['Technology leadership', 'Quality excellence', 'Innovation speed']
        },
        {
          product: 'Automotive Parts',
          profitMargin: '12-22%',
          demand: 'High',
          competition: 'High',
          keyFactors: ['Quality standards', 'Technical specifications', 'Supply chain integration']
        },
        {
          product: 'Machinery',
          profitMargin: '10-20%',
          demand: 'Medium',
          competition: 'High',
          keyFactors: ['Technical innovation', 'Quality certification', 'After-sales support']
        },
        {
          product: 'Chemicals',
          profitMargin: '15-25%',
          demand: 'Medium',
          competition: 'Medium',
          keyFactors: ['Technical specifications', 'Environmental compliance', 'Quality control']
        },
        {
          product: 'Pharmaceuticals',
          profitMargin: '20-30%',
          demand: 'High',
          competition: 'Medium',
          keyFactors: ['MFDS approval', 'Clinical trials', 'Quality assurance']
        }
      ],
      insights: [
        'South Korea has advanced technology and manufacturing capabilities',
        'Electronics and automotive sectors are highly competitive',
        'Quality and innovation are critical for market success',
        'Strong domestic market with export orientation'
      ]
    }
  },
  riskFactors: {
    political: {
      brazil: 75,
      china: 65,
      russia: 85,
      india: 60,
      germany: 15,
      usa: 40
    },
    economic: {
      brazil: 70,
      china: 55,
      russia: 80,
      india: 65,
      germany: 25,
      usa: 35
    }
  }
};

// Performance optimizations for expanded database
const productIndex: { [key: string]: string } = {};
const countryIndex: { [key: string]: string } = {};
const countryAliases: { [key: string]: string } = {
  'usa': 'usa', 'us': 'usa', 'america': 'usa', 'united states': 'usa',
  'uk': 'uk', 'britain': 'uk', 'united kingdom': 'uk', 'england': 'uk',
  'uae': 'uae', 'dubai': 'uae', 'emirates': 'uae',
  'canadian': 'canada', 'canada': 'canada',
  'australian': 'australia', 'australia': 'australia',
  'china': 'china', 'chinese': 'china',
  'japan': 'japan', 'japanese': 'japan',
  'germany': 'germany', 'german': 'germany',
  'france': 'france', 'french': 'france',
  'italy': 'italy', 'italian': 'italy',
  'spain': 'spain', 'spanish': 'spain',
  'brazil': 'brazil', 'brazilian': 'brazil',
  'india': 'india', 'indian': 'india',
  'russia': 'russia', 'russian': 'russia',
  'mexico': 'mexico', 'mexican': 'mexico',
  'south korea': 'southkorea', 'korea': 'southkorea', 'korean': 'southkorea',
  'singapore': 'singapore', 'singaporean': 'singapore'
};

// Build indexes for faster lookup
function buildIndexes() {
  // Build product index
  tradeKnowledge.products.forEach(product => {
    const key = product.toLowerCase();
    productIndex[key] = product;
    
    // Add common variations
    if (product.includes(' ')) {
      const words = product.split(' ');
      words.forEach(word => {
        if (word.length > 3) {
          productIndex[word.toLowerCase()] = product;
        }
      });
    }
  });
  
  // Build country index
  tradeKnowledge.countries.forEach(country => {
    const key = country.toLowerCase();
    countryIndex[key] = country;
    
    // Add multi-word countries
    if (country.includes(' ')) {
      const words = country.split(' ');
      words.forEach(word => {
        if (word.length > 2) {
          countryIndex[word.toLowerCase()] = country;
        }
      });
    }
  });
}

// Initialize indexes
buildIndexes();

// Optimized product extraction
function extractProductOptimized(message: string): string | undefined {
  const messageLower = message.toLowerCase();
  
  // First try exact matches from index
  for (const [key, product] of Object.entries(productIndex)) {
    if (messageLower.includes(key)) {
      return product;
    }
  }
  
  // Fallback to partial matching for longer products
  const words = messageLower.split(' ');
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j <= Math.min(i + 3, words.length); j++) {
      const phrase = words.slice(i, j).join(' ');
      if (productIndex[phrase]) {
        return productIndex[phrase];
      }
    }
  }
  
  return undefined;
}

// Optimized country extraction
function extractCountryOptimized(message: string): { origin?: string, destination?: string } {
  const messageLower = message.toLowerCase();
  let origin: string | undefined;
  let destination: string | undefined;
  
  // Check for country names and aliases
  for (const [alias, country] of Object.entries(countryAliases)) {
    if (messageLower.includes(alias)) {
      const countryObj = countryIndex[country] || country;
      
      // Determine if origin or destination based on context
      const exportFromIndex = messageLower.indexOf('export from');
      const exportToIndex = messageLower.indexOf('export to');
      const fromIndex = messageLower.indexOf(' from ');
      const toIndex = messageLower.indexOf(' to ');
      const aliasIndex = messageLower.indexOf(alias);
      
      if (exportFromIndex !== -1 && exportFromIndex < aliasIndex) {
        origin = countryObj;
      } else if (exportToIndex !== -1 && exportToIndex < aliasIndex) {
        destination = countryObj;
      } else if (fromIndex !== -1 && fromIndex < aliasIndex) {
        origin = countryObj;
      } else if (toIndex !== -1 && toIndex < aliasIndex) {
        destination = countryObj;
      } else if (!origin) {
        origin = countryObj;
      } else if (!destination) {
        destination = countryObj;
      }
    }
  }
  
  // Check direct country names
  for (const [key, country] of Object.entries(countryIndex)) {
    if (messageLower.includes(key) && !countryAliases[key]) {
      const countryIndexInMessage = messageLower.indexOf(key);
      
      // Determine if origin or destination based on context
      const exportFromIndex = messageLower.indexOf('export from');
      const exportToIndex = messageLower.indexOf('export to');
      const fromIndex = messageLower.indexOf(' from ');
      const toIndex = messageLower.indexOf(' to ');
      
      if (exportFromIndex !== -1 && exportFromIndex < countryIndexInMessage) {
        origin = country;
      } else if (exportToIndex !== -1 && exportToIndex < countryIndexInMessage) {
        destination = country;
      } else if (fromIndex !== -1 && fromIndex < countryIndexInMessage) {
        origin = country;
      } else if (toIndex !== -1 && toIndex < countryIndexInMessage) {
        destination = country;
      } else if (!origin) {
        origin = country;
      } else if (!destination) {
        destination = country;
      }
    }
  }
  
  return { origin, destination };
}

// Helper functions for enhanced chatbot functionality
function getDocumentRequirements(product: string, origin: string, destination: string): any {
  const key = `${product.toLowerCase()}-${origin.toLowerCase()}-${destination.toLowerCase()}`;
  return tradeKnowledge.documentRequirements[key];
}

function getProfitAnalysis(country: string): any {
  return tradeKnowledge.profitAnalysis[country.toLowerCase()];
}

function extractProductAndCountry(message: string): { product?: string, origin?: string, destination?: string } {
  // Use optimized functions for better performance
  const product = extractProductOptimized(message);
  const { origin, destination } = extractCountryOptimized(message);
  
  return { product, origin, destination };
}

function generateDocumentResponse(product: string, origin: string, destination: string, language: string = 'en'): string {
  const requirements = getDocumentRequirements(product, origin, destination);
  
  if (!requirements) {
    // Multilingual fallback response
    const fallbackResponses: { [key: string]: string } = {
      'en': `I don't have specific document requirements for ${product} from ${origin} to ${destination} in my current database. However, I can provide general guidance:

**General Trade Documents Required:**
• Commercial Invoice
• Bill of Lading or Air Waybill
• Certificate of Origin
• Packing List
• Insurance Certificate

**Product-Specific Documents:**
• **Agricultural Products**: Phytosanitary Certificate, Health Certificate
• **Textiles**: Textile Declaration, Labeling Compliance
• **Chemicals**: MSDS, Safety Certificates
• **Machinery**: Inspection Certificate, Compliance Documentation

Would you like me to help you with specific requirements for a different product or route?`,
      
      'es': `No tengo requisitos específicos de documentos para ${product} de ${origin} a ${destination} en mi base de datos actual. Sin embargo, puedo proporcionar orientación general:

**Documentos Comerciales Requeridos:**
• Factura Comercial
• Conocimiento de Embarque o Carta de Porte Aérea
• Certificado de Origen
• Lista de Empaque
• Certificado de Seguro

**Documentos Específicos por Producto:**
• **Productos Agrícolas**: Certificado Fitosanitario, Certificado Sanitario
• **Textiles**: Declaración Textil, Cumplimiento de Etiquetado
• **Químicos**: MSDS, Certificados de Seguridad
• **Maquinaria**: Certificado de Inspección, Documentación de Cumplimiento

¿Le gustaría que le ayude con requisitos específicos para un producto o ruta diferente?`,
      
      'fr': `Je n'ai pas d'exigences spécifiques en matière de documents pour ${product} de ${origin} vers ${destination} dans ma base de données actuelle. Cependant, je peux fournir des conseils généraux :

**Documents Commerciaux Requis :**
• Facture Commerciale
• Connaissement ou Lettre de Transport Aérien
• Certificat d'Origine
• Liste de Colisage
• Certificat d'Assurance

**Documents Spécifiques aux Produits :**
• **Produits Agricoles** : Certificat Phytosanitaire, Certificat Sanitaire
• **Textiles** : Déclaration Textile, Conformité d'Étiquetage
• **Produits Chimiques** : MSDS, Certificats de Sécurité
• **Machines** : Certificat d'Inspection, Documentation de Conformité

Souhaitez-vous que je vous aide avec des exigences spécifiques pour un produit ou une route différente ?`,
      
      'de': `Ich habe keine spezifischen Dokumentenanforderungen für ${product} von ${origin} nach ${destination} in meiner aktuellen Datenbank. Ich kann jedoch allgemeine Anleitungen geben:

**Allgemeine Handelsdokumente Erforderlich:**
• Handelsrechnung
• Konnossement oder Luftfrachtbrief
• Ursprungszertifikat
• Packliste
• Versicherungszertifikat

**Produktspezifische Dokumente:**
• **Landwirtschaftliche Produkte**: Phytosanitäres Zertifikat, Gesundheitszertifikat
• **Textilien**: Textilerklärung, Etikettenkonformität
• **Chemikalien**: Sicherheitsdatenblatt, Sicherheitszertifikate
• **Maschinen**: Inspektionszertifikat, Konformitätsdokumentation

Möchten Sie, dass ich Ihnen mit spezifischen Anforderungen für ein anderes Produkt oder eine andere Route helfe?`,
      
      'zh': `我的当前数据库中没有关于从${origin}到${destination}的${product}的具体文件要求。但是，我可以提供一般指导：

**一般贸易文件要求：**
• 商业发票
• 提单或空运单
• 原产地证书
• 装箱单
• 保险证书

**产品特定文件：**
• **农产品**：植物检疫证书，健康证书
• **纺织品**：纺织品声明，标签合规
• **化学品**：MSDS，安全证书
• **机械**：检验证书，合规文件

您希望我帮助您了解其他产品或路线的具体要求吗？`,
      
      'hi': `मेरे वर्तमान डेटाबेस में ${origin} से ${destination} तक ${product} के लिए विशिष्ट दस्तावेज़ आवश्यकताएं नहीं हैं। हालांकि, मैं सामान्य मार्गदर्शन प्रदान कर सकता हूं:

**सामान्य व्यापार दस्तावेज़ आवश्यक:**
• वाणिज्यिक चालान
• बिल ऑफ लेडिंग या एयर वेबिल
• मूल प्रमाणपत्र
• पैकिंग सूची
• बीमा प्रमाणपत्र

**उत्पाद-विशिष्ट दस्तावेज़:**
• **कृषि उत्पाद**: फाइटोसैनिटरी प्रमाणपत्र, स्वास्थ्य प्रमाणपत्र
• **वस्त्र**: वस्त्र घोषणा, लेबलिंग अनुपालन
• **रसायन**: MSDS, सुरक्षा प्रमाणपत्र
• **मशीनरी**: निरीक्षण प्रमाणपत्र, अनुपालन प्रलेखन

क्या आप चाहेंगे कि मैं आपको किसी अलग उत्पाद या मार्ग के लिए विशिष्ट आवश्यकताओं में मदद करूं?`,
      
      'ar': `ليس لدي متطلبات مستندات محددة لـ ${product} من ${origin} إلى ${destination} في قاعدة بياناتي الحالية. ومع ذلك، يمكنني تقديم إرشادات عامة:

**المستندات التجارية المطلوبة:**
• فاتورة تجارية
• بوليصة شحن أو بوليصة نقل جوي
• شهادة منشأ
• قائمة تعبئة
• شهادة تأمين

**المستندات الخاصة بالمنتج:**
• **المنتجات الزراعية**: شهادة صحية نباتية، شهادة صحية
• **المنسوجات**: إقرار منسوجات، الامتثال للتصنيف
• **المواد الكيميائية**: MSDS، شهادات السلامة
• **الآلات**: شهادة فحص، وثائق الامتثال

هل تود أن أساعدك بمتطلبات محددة لمنتج أو طريق مختلف؟`,
      
      'pt': `Não tenho requisitos específicos de documentos para ${product} de ${origin} para ${destination} no meu banco de dados atual. No entanto, posso fornecer orientação geral:

**Documentos Comerciais Requeridos:**
• Fatura Comercial
• Conhecimento de Embarque ou Conhecimento Aéreo
• Certificado de Origem
• Lista de Embalagem
• Certificado de Seguro

**Documentos Específicos do Produto:**
• **Produtos Agrícolas**: Certificado Fitossanitário, Certificado Sanitário
• **Têxteis**: Declaração Têxtil, Conformidade de Rotulagem
• **Produtos Químicos**: MSDS, Certificados de Segurança
• **Máquinas**: Certificado de Inspeção, Documentação de Conformidade

Gostaria que eu ajudasse com requisitos específicos para um produto ou rota diferente?`,
      
      'ru': `У меня нет конкретных требований к документам для ${product} из ${origin} в ${destination} в моей текущей базе данных. Однако я могу предоставить общие рекомендации:

**Общие торговые документы, требуемые:**
• Коммерческий счет
• Коносамент или авианакладная
• Сертификат происхождения
• Упаковочный лист
• Страховой сертификат

**Специфические документы для продуктов:**
• **Сельскохозяйственные продукты**: Фитосанитарный сертификат, Сертификат качества
• **Текстиль**: Декларация на текстиль, Соответствие маркировке
• **Химические продукты**: MSDS, Сертификаты безопасности
• **Машины**: Сертификат осмотра, Документация о соответствии

Хотите, чтобы я помог с конкретными требованиями для другого продукта или маршрута?`
    };
    
    return fallbackResponses[language] || fallbackResponses['en'];
  }
  
  // Multilingual response templates
  const responseTemplates: { [key: string]: any } = {
    'en': {
      title: `**Trade Documents Required for ${requirements.product} from ${requirements.origin} to ${requirements.destination}**`,
      hsCode: `**HS Code:** ${requirements.hsCode}`,
      documents: `**Required Documents:**`,
      required: '(Required)',
      optional: '(Optional)',
      specialNotes: `**Special Notes:**`,
      followUp: `Would you like me to help you generate any of these documents or provide more detailed information about specific requirements?`
    },
    'es': {
      title: `**Documentos Requeridos para Exportar ${requirements.product} de ${requirements.origin} a ${requirements.destination}**`,
      hsCode: `**Código HS:** ${requirements.hsCode}`,
      documents: `**Documentos Requeridos:**`,
      required: '(Requerido)',
      optional: '(Opcional)',
      specialNotes: `**Notas Especiales:**`,
      followUp: `¿Le gustaría que le ayude a generar alguno de estos documentos o proporcione información más detallada sobre requisitos específicos?`
    },
    'fr': {
      title: `**Documents Requis pour ${requirements.product} de ${requirements.origin} vers ${requirements.destination}**`,
      hsCode: `**Code HS:** ${requirements.hsCode}`,
      documents: `**Documents Requis:**`,
      required: '(Requis)',
      optional: '(Optionnel)',
      specialNotes: `**Notes Spéciales:**`,
      followUp: `Souhaitez-vous que je vous aide à générer l'un de ces documents ou à fournir des informations plus détaillées sur des exigences spécifiques ?`
    },
    'de': {
      title: `**Für den Export von ${requirements.product} von ${requirements.origin} nach ${requirements.destination} erforderliche Dokumente**`,
      hsCode: `**HS-Code:** ${requirements.hsCode}`,
      documents: `**Erforderliche Dokumente:**`,
      required: '(Erforderlich)',
      optional: '(Optional)',
      specialNotes: `**Besondere Hinweise:**`,
      followUp: `Möchten Sie, dass ich Ihnen bei der Erstellung dieser Dokumente helfe oder detailliertere Informationen zu spezifischen Anforderungen bereitstelle?`
    },
    'zh': {
      title: `**从${requirements.origin}出口${requirements.product}到${requirements.destination}所需文件**`,
      hsCode: `**HS代码：** ${requirements.hsCode}`,
      documents: `**所需文件：**`,
      required: '(必需)',
      optional: '(可选)',
      specialNotes: `**特别说明：**`,
      followUp: `您希望我帮您生成这些文件中的任何一个，或提供有关特定要求的更详细信息吗？`
    },
    'hi': {
      title: `**${requirements.origin} से ${requirements.destination} को ${requirements.product} निर्यात के लिए आवश्यक दस्तावेज़**`,
      hsCode: `**HS कोड:** ${requirements.hsCode}`,
      documents: `**आवश्यक दस्तावेज़:**`,
      required: '(आवश्यक)',
      optional: '(वैकल्पिक)',
      specialNotes: `**विशेष नोट्स:**`,
      followUp: `क्या आप चाहेंगे कि मैं इनमें से किसी भी दस्तावेज़ को जेनरेट करने में आपकी मदद करूं या विशिष्ट आवश्यकताओं के बारे में अधिक विस्तृत जानकारी प्रदान करूं?`
    },
    'ar': {
      title: `**المستندات المطلوبة لتصدير ${requirements.product} من ${requirements.origin} إلى ${requirements.destination}**`,
      hsCode: `**الكود HS:** ${requirements.hsCode}`,
      documents: `**المستندات المطلوبة:**`,
      required: '(مطلوب)',
      optional: '(اختياري)',
      specialNotes: `**ملاحظات خاصة:**`,
      followUp: `هل تود أن أساعدك في إنشاء أي من هذه المستندات أو توفير معلومات أكثر تفصيلاً حول المتطلبات المحددة؟`
    },
    'pt': {
      title: `**Documentos Requeridos para Exportar ${requirements.product} de ${requirements.origin} para ${requirements.destination}**`,
      hsCode: `**Código HS:** ${requirements.hsCode}`,
      documents: `**Documentos Requeridos:**`,
      required: '(Requerido)',
      optional: '(Opcional)',
      specialNotes: `**Notas Especiais:**`,
      followUp: `Gostaria que eu ajudasse a gerar algum destes documentos ou fornecesse informações mais detalhadas sobre requisitos específicos?`
    },
    'ru': {
      title: `**Документы, требуемые для экспорта ${requirements.product} из ${requirements.origin} в ${requirements.destination}**`,
      hsCode: `**Код HS:** ${requirements.hsCode}`,
      documents: `**Требуемые документы:**`,
      required: '(Требуется)',
      optional: '(Необязательно)',
      specialNotes: `**Особые примечания:**`,
      followUp: `Хотите, чтобы я помог вам сгенерировать какие-либо из этих документов или предоставить более подробную информацию о конкретных требованиях?`
    }
  };
  
  const template = responseTemplates[language] || responseTemplates['en'];
  
  let response = `${template.title}

${template.hsCode}

${template.documents}
`;
  
  requirements.documents.forEach((doc: any) => {
    response += `• **${doc.name}** ${doc.required ? template.required : template.optional}\n  ${doc.description}\n\n`;
  });
  
  if (requirements.specialNotes) {
    response += `${template.specialNotes}\n${requirements.specialNotes}\n\n`;
  }
  
  response += template.followUp;
  
  return response;
}

function generateProfitResponse(country: string, language: string = 'en'): string {
  const analysis = getProfitAnalysis(country);
  
  if (!analysis) {
    // Multilingual fallback response
    const fallbackResponses: { [key: string]: string } = {
      'en': `I don't have specific profit analysis for ${country} in my current database. However, I can provide general guidance:

**General Profit Factors for International Trade:**
• Market demand and competition
• Regulatory requirements and compliance costs
• Logistics and shipping costs
• Currency exchange rates
• Trade agreements and tariffs

**High-Profit Product Categories:**
• Pharmaceuticals and medical devices
• Engineering and technical goods
• Specialty chemicals
• High-value textiles
• Agricultural products with certifications

Would you like me to provide profit analysis for a different country?`,
      
      'es': `No tengo análisis de ganancias específico para ${country} en mi base de datos actual. Sin embargo, puedo proporcionar orientación general:

**Factores Generales de Ganancias para Comercio Internacional:**
• Demanda del mercado y competencia
• Requisitos regulatorios y costos de cumplimiento
• Costos de logística y envío
• Tasas de cambio de moneda
• Acuerdos comerciales y aranceles

**Categorías de Productos de Alta Ganancia:**
• Productos farmacéuticos y dispositivos médicos
• Bienes de ingeniería y técnicos
• Químicos especializados
• Textiles de alto valor
• Productos agrícolas con certificaciones

¿Le gustaría que le proporcione análisis de ganancias para un país diferente?`,
      
      'fr': `Je n'ai pas d'analyse de rentabilité spécifique pour ${country} dans ma base de données actuelle. Cependant, je peux fournir des conseils généraux :

**Facteurs Généraux de Rentabilité pour le Commerce International :**
• Demande du marché et concurrence
• Exigences réglementaires et coûts de conformité
• Coûts de logistique et d'expédition
• Taux de change des devises
• Accords commerciaux et tarifs douaniers

**Catégories de Produits à Forte Rentabilité :**
• Produits pharmaceutiques et dispositifs médicaux
• Biens d'ingénierie et techniques
• Produits chimiques spécialisés
• Textiles de haute valeur
• Produits agricoles avec certifications

Souhaitez-vous que je fournisse une analyse de rentabilité pour un pays différent ?`,
      
      'de': `Ich habe keine spezifische Gewinnanalyse für ${country} in meiner aktuellen Datenbank. Ich kann jedoch allgemeine Anleitungen geben:

**Allgemeine Gewinnerfaktoren für den internationalen Handel:**
• Marktnachfrage und Wettbewerb
• Regulatorische Anforderungen und Compliance-Kosten
• Logistik- und Versandkosten
• Wechselkurse
• Handelsabkommen und Zölle

**Hochprofitable Produktkategorien:**
• Pharmazeutika und medizinische Geräte
• Ingenieur- und technischen Güter
• Spezialchemikalien
• Hochwertige Textilien
• Landwirtschaftliche Produkte mit Zertifizierungen

Möchten Sie, dass ich eine Gewinnanalyse für ein anderes Land bereitstelle?`,
      
      'zh': `我的当前数据库中没有关于${country}的具体利润分析。但是，我可以提供一般指导：

**国际贸易的一般利润因素：**
• 市场需求和竞争
• 监管要求和合规成本
• 物流和运输成本
• 货币汇率
• 贸易协定和关税

**高利润产品类别：**
• 药品和医疗设备
• 工程和技术产品
• 特种化学品
• 高价值纺织品
• 具有认证的农产品

您希望我为您提供不同国家的利润分析吗？`,
      
      'hi': `मेरे वर्तमान डेटाबेस में ${country} के लिए विशिष्ट लाभ विश्लेषण नहीं है। हालांकि, मैं सामान्य मार्गदर्शन प्रदान कर सकता हूं:

**अंतरराष्ट्रीय व्यापार के लिए सामान्य लाभ कारक:**
• बाजार की मांग और प्रतिस्पर्धा
• नियामक आवश्यकताएं और अनुपालन लागत
• रसद और शिपिंग लागत
• मुद्रा विनिमय दरें
• व्यापार समझौते और शुल्क

**उच्च-लाभ उत्पाद श्रेणियां:**
• फार्मास्यूटिकल्स और चिकित्सा उपकरण
• इंजीनियरिंग और तकनीकी वस्तुएं
• विशेष रसायन
• उच्च-मूल्य वस्त्र
• प्रमाणपत्र के साथ कृषि उत्पाद

क्या आप चाहेंगे कि मैं आपको किसी अलग देश के लिए लाभ विश्लेषण प्रदान करूं?`,
      
      'ar': `ليس لدي تحليل ربح محدد لـ ${country} في قاعدة بياناتي الحالية. ومع ذلك، يمكنني تقديم إرشادات عامة:

**عوامل الربح العامة للتجارة الدولية:**
• الطلب في السوق والمنافسة
• المتطلبات التنظيمية وتكاليف الامتثال
• تكاليف الخدمات اللوجستية والشحن
• أسعار صرف العملات
• الاتفاقيات التجارية والتعريفات الجمركية

**فئات المنتجات عالية الربح:**
• المنتجات الصيدلانية والأجهزة الطبية
• السلع الهندسية والتقنية
• المواد الكيميائية المتخصصة
• المنسوجات عالية القيمة
• المنتجات الزراعية مع الشهادات

هل تود أن أقدم لك تحليل ربح لدولة مختلفة؟`,
      
      'pt': `Não tenho análise de lucro específica para ${country} no meu banco de dados atual. No entanto, posso fornecer orientação geral:

**Fatores Gerais de Lucro para Comércio Internacional:**
• Demanda de mercado e concorrência
• Requisitos regulatórios e custos de conformidade
• Custos de logística e envio
• Taxas de câmbio de moeda
• Acordos comerciais e tarifas

**Categorias de Produtos de Alto Lucro:**
• Produtos farmacêuticos e dispositivos médicos
• Bens de engenharia e técnicos
• Produtos químicos especializados
• Têxteis de alto valor
• Produtos agrícolas com certificações

Gostaria que eu fornecesse análise de lucro para um país diferente?`,
      
      'ru': `У меня нет конкретного анализа прибыли для ${country} в моей текущей базе данных. Однако я могу предоставить общие рекомендации:

**Общие факторы прибыли для международной торговли:**
• Спрос на рынке и конкуренция
• Регуляторные требования и затраты на соответствие
• Затраты на логистику и доставку
• Обменные курсы валют
• Торговые соглашения и тарифы

**Категории продуктов с высокой прибылью:**
• Фармацевтические продукты и медицинские устройства
• Инженерные и технические товары
• Специализированные химические продукты
• Текстиль высокой ценности
• Сельскохозяйственные продукты с сертификацией

Хотите, чтобы я предоставил анализ прибыли для другой страны?`
    };
    
    return fallbackResponses[language] || fallbackResponses['en'];
  }
  
  // Multilingual response templates
  const responseTemplates: { [key: string]: any } = {
    'en': {
      title: `**Profit Analysis for Exporting to ${analysis.country}**`,
      marketSize: `**Market Size:** ${analysis.marketSize}`,
      currency: `**Currency:** ${analysis.currency}`,
      topProducts: `**Top Profitable Products:**`,
      profitMargin: 'Profit Margin:',
      demand: 'Demand:',
      competition: 'Competition:',
      keyFactors: 'Key Factors:',
      insights: `**Key Market Insights:**`,
      followUp: `Would you like more detailed information about any specific product or market entry strategy?`
    },
    'es': {
      title: `**Análisis de Ganancias para Exportar a ${analysis.country}**`,
      marketSize: `**Tamaño del Mercado:** ${analysis.marketSize}`,
      currency: `**Moneda:** ${analysis.currency}`,
      topProducts: `**Productos Más Rentables:**`,
      profitMargin: 'Margen de Ganancia:',
      demand: 'Demanda:',
      competition: 'Competencia:',
      keyFactors: 'Factores Clave:',
      insights: `**Ideas Clave del Mercado:**`,
      followUp: `¿Le gustaría información más detallada sobre algún producto específico o estrategia de entrada al mercado?`
    },
    'fr': {
      title: `**Analyse de Rentabilité pour l'Exportation vers ${analysis.country}**`,
      marketSize: `**Taille du Marché:** ${analysis.marketSize}`,
      currency: `**Devise:** ${analysis.currency}`,
      topProducts: `**Produits les Plus Rentables:**`,
      profitMargin: 'Marge Bénéficiaire:',
      demand: 'Demande:',
      competition: 'Concurrence:',
      keyFactors: 'Facteurs Clés:',
      insights: `**Informations Clés du Marché:**`,
      followUp: `Souhaitez-vous des informations plus détaillées sur un produit spécifique ou une stratégie d'entrée sur le marché ?`
    },
    'de': {
      title: `**Gewinnanalyse für den Export nach ${analysis.country}**`,
      marketSize: `**Marktgröße:** ${analysis.marketSize}`,
      currency: `**Währung:** ${analysis.currency}`,
      topProducts: `**Profitabelste Produkte:**`,
      profitMargin: 'Gewinnmarge:',
      demand: 'Nachfrage:',
      competition: 'Wettbewerb:',
      keyFactors: 'Schlüsselfaktoren:',
      insights: `**Wichtige Markteinblicke:**`,
      followUp: `Möchten Sie detailliertere Informationen zu einem bestimmten Produkt oder einer Markteintrittsstrategie?`
    },
    'zh': {
      title: `**出口到${analysis.country}的利润分析**`,
      marketSize: `**市场规模：** ${analysis.marketSize}`,
      currency: `**货币：** ${analysis.currency}`,
      topProducts: `**最赚钱的产品：**`,
      profitMargin: '利润率：',
      demand: '需求：',
      competition: '竞争：',
      keyFactors: '关键因素：',
      insights: `**关键市场洞察：**`,
      followUp: `您想要任何特定产品或市场进入策略的更详细信息吗？`
    },
    'hi': {
      title: `**${analysis.country} को निर्यात करने के लिए लाभ विश्लेषण**`,
      marketSize: `**बाजार आकार:** ${analysis.marketSize}`,
      currency: `**मुद्रा:** ${analysis.currency}`,
      topProducts: `**सबसे अधिक लाभदायक उत्पाद:**`,
      profitMargin: 'लाभ मार्जिन:',
      demand: 'मांग:',
      competition: 'प्रतिस्पर्धा:',
      keyFactors: 'मुख्य कारक:',
      insights: `**प्रमुख बाजार अंतर्दृष्टि:**`,
      followUp: `क्या आप किसी विशिष्ट उत्पाद या बाजार प्रवेश रणनीति के बारे में अधिक विस्तृत जानकारी चाहेंगे?`
    },
    'ar': {
      title: `**تحليل الربح للتصدير إلى ${analysis.country}**`,
      marketSize: `**حجم السوق:** ${analysis.marketSize}`,
      currency: `**العملة:** ${analysis.currency}`,
      topProducts: `**الأكثر ربحاً من المنتجات:**`,
      profitMargin: 'هامش الربح:',
      demand: 'الطلب:',
      competition: 'المنافسة:',
      keyFactors: 'العوامل الرئيسية:',
      insights: `**رؤى السوق الرئيسية:**`,
      followUp: `هل ترغب في معلومات أكثر تفصيلاً عن أي منتج محدد أو استراتيجية دخول السوق؟`
    },
    'pt': {
      title: `**Análise de Lucro para Exportar para ${analysis.country}**`,
      marketSize: `**Tamanho do Mercado:** ${analysis.marketSize}`,
      currency: `**Moeda:** ${analysis.currency}`,
      topProducts: `**Produtos Mais Lucrativos:**`,
      profitMargin: 'Margem de Lucro:',
      demand: 'Demanda:',
      competition: 'Concorrência:',
      keyFactors: 'Fatores Chave:',
      insights: `**Percepções Principais do Mercado:**`,
      followUp: `Gostaria de informações mais detalhadas sobre algum produto específico ou estratégia de entrada no mercado?`
    },
    'ru': {
      title: `**Анализ Прибыли для Экспорта в ${analysis.country}**`,
      marketSize: `**Размер Рынка:** ${analysis.marketSize}`,
      currency: `**Валюта:** ${analysis.currency}`,
      topProducts: `**Самые Прибыльные Продукты:**`,
      profitMargin: 'Маржа Прибыли:',
      demand: 'Спрос:',
      competition: 'Конкуренция:',
      keyFactors: 'Ключевые Факторы:',
      insights: `**Ключевые Инсайты Рынка:**`,
      followUp: `Хотите ли вы более подробную информацию о конкретном продукте или стратегии выхода на рынок?`
    }
  };
  
  const template = responseTemplates[language] || responseTemplates['en'];
  
  let response = `${template.title}

${template.marketSize}
${template.currency}

${template.topProducts}
`;
  
  analysis.topProducts.forEach((product: any, index: number) => {
    response += `${index + 1}. **${product.product}**
   • ${template.profitMargin} ${product.profitMargin}
   • ${template.demand} ${product.demand}
   • ${template.competition} ${product.competition}
   • ${template.keyFactors} ${product.keyFactors.join(', ')}
   
`;
  });
  
  response += `${template.insights}
`;
  
  analysis.insights.forEach((insight: string, index: number) => {
    response += `• ${insight}\n`;
  });
  
  response += `\n${template.followUp}`;
  
  return response;
}

// Enhanced multilingual keyword mappings
const multilingualKeywords = {
  document: {
    'en': ['document', 'certificate', 'paperwork', 'required', 'export', 'import', 'requirements'],
    'es': ['documento', 'certificado', 'papeles', 'requerido', 'exportar', 'importar', 'requisitos'],
    'fr': ['document', 'certificat', 'papier', 'requis', 'exporter', 'importer', 'exigences'],
    'de': ['dokument', 'zertifikat', 'unterlagen', 'erforderlich', 'exportieren', 'importieren', 'anforderungen'],
    'zh': ['文件', '证书', '文件', '需要', '出口', '进口', '要求'],
    'hi': ['दस्तावेज', 'प्रमाणपत्र', 'कागजात', 'आवश्यक', 'निर्यात', 'आयात', 'आवश्यकताएं'],
    'ar': ['وثيقة', 'شهادة', 'أوراق', 'مطلوب', 'تصدير', 'استيراد', 'متطلبات'],
    'pt': ['documento', 'certificado', 'papéis', 'requerido', 'exportar', 'importar', 'requisitos'],
    'ru': ['документ', 'сертификат', 'бумаги', 'требуется', 'экспорт', 'импорт', 'требования']
  },
  profit: {
    'en': ['profit', 'lucrative', 'revenue', 'money', 'income', 'margin', 'analysis', 'market'],
    'es': ['ganancia', 'lucrativo', 'ingresos', 'dinero', 'renta', 'margen', 'análisis', 'mercado'],
    'fr': ['profit', 'lucratif', 'revenu', 'argent', 'revenu', 'marge', 'analyse', 'marché'],
    'de': ['gewinn', 'profitabel', 'umsatz', 'geld', 'einkommen', 'marge', 'analyse', 'markt'],
    'zh': ['利润', '有利可图', '收入', '钱', '收入', '利润率', '分析', '市场'],
    'hi': ['लाभ', 'लाभदायक', 'राजस्व', 'पैसा', 'आय', 'मार्जिन', 'विश्लेषण', 'बाजार'],
    'ar': ['ربح', 'مربح', 'إيرادات', 'مال', 'دخل', 'هامش', 'تحليل', 'سوق'],
    'pt': ['lucro', 'lucrativo', 'receita', 'dinheiro', 'renda', 'margem', 'análise', 'mercado'],
    'ru': ['прибыль', 'доходный', 'доход', 'деньги', 'доход', 'маржа', 'анализ', 'рынок']
  },
  product: {
    'en': ['product', 'goods', 'item', 'ship', 'send', 'export'],
    'es': ['producto', 'bienes', 'artículo', 'enviar', 'exportar'],
    'fr': ['produit', 'biens', 'article', 'envoyer', 'exporter'],
    'de': ['produkt', 'waren', 'artikel', 'versenden', 'exportieren'],
    'zh': ['产品', '货物', '物品', '发送', '出口'],
    'hi': ['उत्पाद', 'सामान', 'वस्तु', 'भेजना', 'निर्यात'],
    'ar': ['منتج', 'بضائع', 'صنف', 'شحن', 'تصدير'],
    'pt': ['produto', 'bens', 'item', 'enviar', 'exportar'],
    'ru': ['продукт', 'товары', 'товар', 'отправить', 'экспорт']
  }
};

// Language detection and multilingual support
function detectLanguage(message: string): string {
  // Simple language detection based on common words
  const languagePatterns: { [key: string]: string[] } = {
    'es': ['qué', 'cómo', 'dónde', 'cuándo', 'por', 'para', 'documentos', 'exportar', 'importar'],
    'fr': ['quoi', 'comment', 'où', 'quand', 'pour', 'documents', 'exporter', 'importer'],
    'de': ['was', 'wie', 'wo', 'wann', 'für', 'dokumente', 'exportieren', 'importieren'],
    'zh': ['什么', '如何', '哪里', '何时', '为什么', '文件', '出口', '进口'],
    'hi': ['क्या', 'कैसे', 'कहाँ', 'कब', 'क्यों', 'दस्तावेज', 'निर्यात', 'आयात'],
    'ar': ['ماذا', 'كيف', 'أين', 'متى', 'لماذا', 'وثائق', 'تصدير', 'استيراد'],
    'pt': ['o que', 'como', 'onde', 'quando', 'por que', 'documentos', 'exportar', 'importar'],
    'ru': ['что', 'как', 'где', 'когда', 'почему', 'документы', 'экспорт', 'импорт']
  };
  
  const lowerMessage = message.toLowerCase();
  
  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    const matches = patterns.filter(pattern => lowerMessage.includes(pattern)).length;
    if (matches >= 2) {
      return lang;
    }
  }
  
  return 'en'; // Default to English
}

function getLanguageResponse(language: string, type: 'document' | 'profit' | 'general'): string {
  const responses: { [key: string]: { [key: string]: string } } = {
    'es': {
      'document': 'Puedo ayudarle con los requisitos de documentos de exportación. Por favor, especifique el producto, país de origen y país de destino.',
      'profit': 'Puedo proporcionar análisis de rentabilidad para diferentes países. ¿Para qué país le gustaría el análisis?',
      'general': 'Soy TradeGenie, su asistente de comercio internacional. ¿Cómo puedo ayudarle hoy?'
    },
    'fr': {
      'document': 'Je peux vous aider avec les exigences en matière de documents d\'exportation. Veuillez spécifier le produit, le pays d\'origine et le pays de destination.',
      'profit': 'Je peux fournir une analyse de rentabilité pour différents pays. Pour quel pays souhaitez-vous l\'analyse ?',
      'general': 'Je suis TradeGenie, votre assistant commercial international. Comment puis-je vous aider aujourd\'hui ?'
    },
    'de': {
      'document': 'Ich kann Ihnen mit den Anforderungen für Exportdokumente helfen. Bitte geben Sie das Produkt, das Herkunftsland und das Zielland an.',
      'profit': 'Ich kann Rentabilitätsanalysen für verschiedene Länder bereitstellen. Für welches Land möchten Sie die Analyse?',
      'general': 'Ich bin TradeGenie, Ihr internationaler Handelsassistent. Wie kann ich Ihnen heute helfen?'
    },
    'zh': {
      'document': '我可以帮助您了解出口文件要求。请指定产品、原产国和目的地国家。',
      'profit': '我可以为不同国家提供盈利能力分析。您想要哪个国家的分析？',
      'general': '我是TradeGenie，您的国际贸易助手。今天我能如何帮助您？'
    },
    'hi': {
      'document': 'मैं आपके निर्यात दस्तावेज़ आवश्यकताओं में आपकी सहायता कर सकता हूं। कृपया उत्पाद, मूल देश और गंतव्य देश निर्दिष्ट करें।',
      'profit': 'मैं विभिन्न देशों के लिए लाभप्रदता विश्लेषण प्रदान कर सकता हूं। आप किस देश के लिए विश्लेषण चाहते हैं?',
      'general': 'मैं TradeGenie हूं, आपका अंतरराष्ट्रीय व्यापार सहायक। आज मैं आपकी कैसे मदद कर सकता हूं?'
    },
    'ar': {
      'document': 'يمكنني مساعدتك في متطلبات وثائق التصدير. يرجى تحديد المنتج والدولة الأصلية والدولة الوجهة.',
      'profit': 'يمكنني توفير تحليل الربحية لبلدان مختلفة. لأي country تريد التحليل؟',
      'general': 'أنا TradeGenie، مساعد التجارة الدولية الخاص بك. كيف يمكنني مساعدتك اليوم؟'
    },
    'pt': {
      'document': 'Posso ajudar com os requisitos de documentos de exportação. Por favor, especifique o produto, país de origem e país de destino.',
      'profit': 'Posso fornecer análise de rentabilidade para diferentes países. Para qual país você gostaria da análise?',
      'general': 'Sou TradeGenie, seu assistente de comércio internacional. Como posso ajudar você hoje?'
    },
    'ru': {
      'document': 'Я могу помочь вам с требованиями к экспортным документам. Пожалуйста, укажите товар, страну происхождения и страну назначения.',
      'profit': 'Я могу предоставить анализ рентабельности для разных стран. Для какой страны вы хотели бы анализ?',
      'general': 'Я TradeGenie, ваш помощник по международной торговле. Как я могу помочь вам сегодня?'
    },
    'en': {
      'document': 'I can help you with export document requirements. Please specify the product, origin country, and destination country.',
      'profit': 'I can provide profitability analysis for different countries. Which country would you like the analysis for?',
      'general': 'I\'m TradeGenie, your international trade assistant. How can I help you today?'
    }
  };
  
  return responses[language]?.[type] || responses['en'][type];
}

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { message, language = 'en' } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Save user message to database
    await db.chatHistory.create({
      data: {
        userId: decodedToken.userId,
        type: 'user',
        content: message,
        language
      }
    });

    // Generate AI response
    let aiResponse = await generateAIResponse(message, language);

    // Save AI response to database
    const savedMessage = await db.chatHistory.create({
      data: {
        userId: decodedToken.userId,
        type: 'assistant',
        content: aiResponse,
        language
      }
    });

    return NextResponse.json({
      message: aiResponse,
      messageId: savedMessage.id,
      timestamp: savedMessage.createdAt
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateAIResponse(userMessage: string, language: string): Promise<string> {
  const message = userMessage.toLowerCase();
  
  // Detect language from message
  const detectedLanguage = detectLanguage(userMessage);
  const responseLanguage = detectedLanguage !== 'en' ? detectedLanguage : language;
  
  // Enhanced multilingual document query handling
  const documentKeywords = multilingualKeywords.document[responseLanguage] || multilingualKeywords.document['en'];
  const hasDocumentKeyword = documentKeywords.some(keyword => message.includes(keyword));
  
  if (hasDocumentKeyword) {
    const { product, origin, destination } = extractProductAndCountry(userMessage);
    
    if (product && origin && destination) {
      return generateDocumentResponse(product, origin, destination, responseLanguage);
    } else if (product || origin || destination) {
      // Partial information detected
      return getLanguageResponse(responseLanguage, 'document');
    }
  }
  
  // Enhanced multilingual profit analysis handling
  const profitKeywords = multilingualKeywords.profit[responseLanguage] || multilingualKeywords.profit['en'];
  const hasProfitKeyword = profitKeywords.some(keyword => message.includes(keyword));
  
  if (hasProfitKeyword) {
    // Extract country for profit analysis using optimized function
    const { origin, destination } = extractCountryOptimized(userMessage);
    const targetCountry = origin || destination;
    
    if (targetCountry) {
      return generateProfitResponse(targetCountry, responseLanguage);
    }
    
    // Fallback: check all countries in database
    for (const country of tradeKnowledge.countries) {
      if (message.toLowerCase().includes(country.toLowerCase())) {
        return generateProfitResponse(country, responseLanguage);
      }
    }
    
    // Check country aliases
    for (const [alias, country] of Object.entries(countryAliases)) {
      if (message.toLowerCase().includes(alias)) {
        return generateProfitResponse(country, responseLanguage);
      }
    }
    
    // No specific country found, provide general guidance
    return getLanguageResponse(responseLanguage, 'profit');
  }
  
  // Enhanced multilingual product query handling
  const productKeywords = multilingualKeywords.product[responseLanguage] || multilingualKeywords.product['en'];
  const hasProductKeyword = productKeywords.some(keyword => message.includes(keyword));
  
  if (hasProductKeyword) {
    const { product, origin, destination } = extractProductAndCountry(userMessage);
    
    if (product && (origin || destination)) {
      // Provide product-specific information
      if (origin && destination) {
        return generateDocumentResponse(product, origin, destination, responseLanguage);
      } else {
        return getLanguageResponse(responseLanguage, 'document');
      }
    }
  }
  
  // General assistance in detected language
  return getLanguageResponse(responseLanguage, 'general');
}

function generateFallbackResponse(message: string, language: string): string {
  // Handle document queries in fallback
  if (message.includes('document') || message.includes('certificate') || message.includes('paperwork')) {
    if (message.includes('silk') && message.includes('india') && message.includes('usa')) {
      return generateDocumentResponse('Silk', 'India', 'USA');
    }
    if (message.includes('textile') && message.includes('germany')) {
      return generateDocumentResponse('Textiles', 'India', 'Germany');
    }
    if (message.includes('agricultural') && message.includes('uk')) {
      return generateDocumentResponse('Agricultural Products', 'India', 'UK');
    }
    return getLanguageResponse(language, 'document');
  }
  
  // Handle profit analysis in fallback
  if (message.includes('profit') || message.includes('lucrative') || message.includes('revenue')) {
    if (message.includes('usa') || message.includes('america')) {
      return generateProfitResponse('USA');
    }
    if (message.includes('canada') || message.includes('canadian')) {
      return generateProfitResponse('Canada');
    }
    if (message.includes('australia') || message.includes('australian')) {
      return generateProfitResponse('Australia');
    }
    return getLanguageResponse(language, 'profit');
  }
  
  if (message.includes('tariff') || message.includes('exporting')) {
    if (message.includes('tea') && message.includes('india') && message.includes('usa')) {
      return `Based on current trade data, the tariff for exporting tea from India to the USA is as follows:

**HS Code**: 0902.30
**Base Tariff**: 6.4%
**Additional Duties**: None
**Total Rate**: 6.4%

The USA is one of the largest importers of Indian tea, with annual imports valued at approximately $250 million. The tariff rate is relatively low due to favorable trade relations between the two countries.

Would you like more detailed information about market access requirements or documentation needed for tea exports?`;
    }

    if (message.includes('silk') && message.includes('india') && message.includes('germany')) {
      return `Exporting silk from India to Germany has a **LOW TO MODERATE** risk profile:

**Risk Analysis:**
• **Political Risk**: Low (Stable EU relations)
• **Tariff Risk**: Low (EU standardized tariffs)
• **Market Risk**: Moderate (Competition from China)
• **Compliance Risk**: Low (Clear EU regulations)

**Current Tariff**: 0% (under EU-India trade preferences)

**Recommendations:**
• Ensure proper labeling and certification
• Consider organic certification for premium pricing
• Monitor competition from Chinese silk producers

Would you like me to provide more detailed market analysis?`;
    }
  }

  if (message.includes('generate') && (message.includes('invoice') || message.includes('document'))) {
    return `I can help you generate trade documents! Based on your request, I can assist with:

**Available Documents:**
• Commercial Invoice
• Proforma Invoice
• Bill of Lading
• Certificate of Origin
• Export Packing List
• Sales Contract

To generate a document, I'll need some information:
1. Document type
2. Product details
3. Origin and destination countries
4. Value and quantity
5. Payment terms

Which document would you like to generate, and can you provide these details?`;
  }

  if (message.includes('risk') && message.includes('exporting')) {
    if (message.includes('brazil') && message.includes('food')) {
      return `Risk analysis for exporting food products to Brazil:

**Overall Risk Level: HIGH (72%)**

**Risk Factors:**
• **Political Risk**: 75% (Economic volatility)
• **Tariff Risk**: 68% (High import duties)
• **Market Risk**: 70% (Strong local competition)
• **Compliance Risk**: 75% (Complex regulations)

**Key Challenges:**
• High import tariffs on processed foods (14.2% average)
• Complex ANVISA food safety requirements
• Currency volatility affecting profit margins
• Strong local competition in staple foods

**Opportunities:**
• Growing middle class demanding premium products
• Increasing health consciousness among consumers
• E-commerce expansion in food retail

Would you like specific recommendations for mitigating these risks?`;
    }
  }

  if (message.includes('partner') || message.includes('matching')) {
    return `I can help you find trade partners! To provide the best matches, I need to know:

**Required Information:**
• Industry/sector
• Target country/region
• Partner type (manufacturer, distributor, retailer, etc.)
• Product specifications
• Order volume requirements
• Quality certifications needed

**Available Filters:**
• Industry expertise
• Geographic location
• Language capabilities
• Certifications and compliance
• Company size and experience
• Ratings and reviews

Once you provide these details, I can search our database of verified partners and provide compatibility scores for each match.

What type of partner are you looking for and in which market?`;
  }

  // Default response with language support
  return getLanguageResponse(language, 'general');
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const messages = await db.chatHistory.findMany({
      where: { userId: decodedToken.userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        type: true,
        content: true,
        language: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      messages,
      total: await db.chatHistory.count({
        where: { userId: decodedToken.userId }
      })
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}