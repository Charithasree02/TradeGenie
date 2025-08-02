import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Risk data for different countries and industries
const riskData = {
  countries: {
    brazil: {
      political: 75,
      economic: 70,
      tariff: 68,
      compliance: 75,
      market: 70
    },
    china: {
      political: 65,
      economic: 55,
      tariff: 72,
      compliance: 60,
      market: 58
    },
    germany: {
      political: 15,
      economic: 25,
      tariff: 35,
      compliance: 25,
      market: 25
    },
    india: {
      political: 60,
      economic: 65,
      tariff: 58,
      compliance: 70,
      market: 62
    },
    usa: {
      political: 40,
      economic: 35,
      tariff: 45,
      compliance: 40,
      market: 38
    },
    russia: {
      political: 85,
      economic: 80,
      tariff: 75,
      compliance: 85,
      market: 78
    }
  },
  industries: {
    'food & beverages': {
      brazil: { tariff: 14.2, growth: 5.2, competition: 'High' },
      germany: { tariff: 8.5, growth: 2.1, competition: 'Medium' },
      usa: { tariff: 6.8, growth: 4.5, competition: 'High' }
    },
    'textiles & apparel': {
      brazil: { tariff: 18.5, growth: 3.8, competition: 'Medium' },
      germany: { tariff: 12.0, growth: 2.1, competition: 'High' },
      india: { tariff: 15.2, growth: 8.5, competition: 'High' }
    },
    'electronics': {
      china: { tariff: 8.2, growth: 12.5, competition: 'High' },
      germany: { tariff: 6.5, growth: 5.8, competition: 'Medium' },
      usa: { tariff: 3.5, growth: 7.2, competition: 'High' }
    },
    'pharmaceuticals': {
      usa: { tariff: 0, growth: 6.8, competition: 'High' },
      germany: { tariff: 4.2, growth: 5.5, competition: 'Medium' },
      india: { tariff: 10.5, growth: 12.8, competition: 'Medium' }
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };

    const { country, industry } = await request.json();

    if (!country || !industry) {
      return NextResponse.json(
        { error: 'Country and industry are required' },
        { status: 400 }
      );
    }

    // Generate risk analysis
    const analysis = await generateRiskAnalysis(country, industry);

    // Save analysis to database
    const savedAnalysis = await db.riskReport.create({
      data: {
        userId: decodedToken.userId,
        country: country.toLowerCase(),
        industry: industry.toLowerCase(),
        overallRisk: analysis.overallRisk,
        politicalRisk: analysis.riskFactors.political,
        economicRisk: analysis.riskFactors.economic,
        tariffRisk: analysis.riskFactors.tariff,
        complianceRisk: analysis.riskFactors.compliance,
        marketRisk: analysis.riskFactors.market,
        metrics: {
          tariffRates: analysis.tariffRates,
          marketSize: analysis.marketSize,
          regulations: analysis.regulations
        }
      }
    });

    return NextResponse.json({
      analysis,
      reportId: savedAnalysis.id
    });

  } catch (error) {
    console.error('Risk analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateRiskAnalysis(country: string, industry: string) {
  const countryKey = country.toLowerCase();
  const industryKey = industry.toLowerCase();

  // Get base risk factors
  const countryRisks = riskData.countries[countryKey] || {
    political: 50,
    economic: 50,
    tariff: 50,
    compliance: 50,
    market: 50
  };

  // Get industry-specific data
  const industryData = riskData.industries[industryKey]?.[countryKey] || {
    tariff: Math.random() * 20,
    growth: Math.random() * 10,
    competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
  };

  // Calculate overall risk
  const overallRisk = Math.round(
    (countryRisks.political + countryRisks.economic + countryRisks.tariff + 
     countryRisks.compliance + countryRisks.market) / 5
  );

  // Generate recommendations based on risk factors
  const recommendations = generateRecommendations(countryRisks, industryData);
  
  // Generate key risks
  const keyRisks = generateKeyRisks(countryRisks, industryData);
  
  // Generate opportunities
  const opportunities = generateOpportunities(countryRisks, industryData);

  return {
    country,
    industry,
    overallRisk,
    riskFactors: {
      political: countryRisks.political,
      economic: countryRisks.economic,
      tariff: countryRisks.tariff,
      compliance: countryRisks.compliance,
      market: countryRisks.market
    },
    tariffRates: {
      baseRate: industryData.tariff,
      additionalDuties: Math.random() * 5,
      totalRate: industryData.tariff + Math.random() * 5
    },
    marketSize: {
      value: `$${Math.floor(Math.random() * 100 + 10)}B`,
      growth: industryData.growth,
      competition: industryData.competition
    },
    recommendations,
    keyRisks,
    opportunities,
    regulations: generateRegulations(country, industry)
  };
}

function generateRecommendations(risks: any, industryData: any): string[] {
  const recommendations = [];

  if (risks.political > 60) {
    recommendations.push('Consider political risk insurance for investments');
    recommendations.push('Monitor political developments closely');
  }

  if (risks.economic > 60) {
    recommendations.push('Hedge against currency volatility');
    recommendations.push('Diversify market exposure');
  }

  if (risks.tariff > 60) {
    recommendations.push('Explore free trade agreement benefits');
    recommendations.push('Consider local manufacturing to reduce tariffs');
  }

  if (risks.compliance > 60) {
    recommendations.push('Invest in compliance management systems');
    recommendations.push('Consult with local legal experts');
  }

  if (industryData.competition === 'High') {
    recommendations.push('Focus on product differentiation');
    recommendations.push('Develop strong brand positioning');
  }

  if (industryData.growth > 7) {
    recommendations.push('Capitalize on high growth market opportunity');
    recommendations.push('Consider early market entry advantages');
  }

  return recommendations.length > 0 ? recommendations : [
    'Conduct thorough market research before entry',
    'Establish local partnerships for better market access',
    'Invest in understanding local regulations and compliance',
    'Develop risk mitigation strategies specific to this market'
  ];
}

function generateKeyRisks(risks: any, industryData: any): string[] {
  const risksList = [];

  if (risks.political > 70) {
    risksList.push('Political instability affecting business operations');
  }
  if (risks.economic > 70) {
    risksList.push('Economic volatility impacting demand and profitability');
  }
  if (risks.tariff > 70) {
    risksList.push('High import tariffs affecting price competitiveness');
  }
  if (risks.compliance > 70) {
    risksList.push('Complex regulatory environment and compliance requirements');
  }
  if (industryData.competition === 'High') {
    risksList.push('Intense competition from local and international players');
  }

  return risksList.length > 0 ? risksList : [
    'Regulatory changes affecting market access',
    'Economic fluctuations impacting consumer demand',
    'Competition from established market players',
    'Supply chain disruptions and logistics challenges'
  ];
}

function generateOpportunities(risks: any, industryData: any): string[] {
  const opportunities = [];

  if (risks.political < 40) {
    opportunities.push('Stable political environment conducive to business');
  }
  if (risks.economic < 40) {
    opportunities.push('Strong economic fundamentals supporting growth');
  }
  if (industryData.growth > 5) {
    opportunities.push('High market growth potential');
  }
  if (industryData.tariff < 5) {
    opportunities.push('Low tariff barriers facilitating market access');
  }

  return opportunities.length > 0 ? opportunities : [
    'Growing market demand in this sector',
    'Favorable trade agreements and policies',
    'Technological advancements creating new opportunities',
    'Untapped market segments with high potential'
  ];
}

function generateRegulations(country: string, industry: string): string[] {
  const baseRegulations = [
    'Import licensing requirements',
    'Product quality and safety standards',
    'Customs documentation and procedures',
    'Tax and duty compliance'
  ];

  const industrySpecific = {
    'food & beverages': [
      'Food safety certification (HACCP, FDA, etc.)',
      'Labeling and packaging requirements',
      'Health and sanitary regulations'
    ],
    'pharmaceuticals': [
      'Drug approval and registration',
      'Good Manufacturing Practices (GMP)',
      'Clinical trial requirements'
    ],
    'electronics': [
      'Electromagnetic compatibility (EMC) testing',
      'Energy efficiency standards',
      'WEEE compliance for electronic waste'
    ],
    'textiles': [
      'Fabric composition labeling',
      'Flammability standards',
      'Restricted substances compliance'
    ]
  };

  const countrySpecific = {
    brazil: [
      'ANVISA regulation for health products',
      'INMETRO certification requirements',
      'Complex tax structure (ICMS, IPI, PIS, COFINS)'
    ],
    eu: [
      'CE marking requirements',
      'REACH compliance for chemical substances',
      'GDPR data protection regulations'
    ],
    usa: [
      'FDA compliance for regulated products',
      'FTC labeling requirements',
      'EPA environmental regulations'
    ]
  };

  let regulations = [...baseRegulations];
  
  // Add industry-specific regulations
  const industryKey = industry.toLowerCase();
  if (industrySpecific[industryKey]) {
    regulations = [...regulations, ...industrySpecific[industryKey]];
  }

  // Add country-specific regulations
  if (country.toLowerCase() === 'brazil' && countrySpecific.brazil) {
    regulations = [...regulations, ...countrySpecific.brazil];
  } else if (['germany', 'france', 'italy'].includes(country.toLowerCase()) && countrySpecific.eu) {
    regulations = [...regulations, ...countrySpecific.eu];
  } else if (country.toLowerCase() === 'usa' && countrySpecific.usa) {
    regulations = [...regulations, ...countrySpecific.usa];
  }

  return regulations.slice(0, 6); // Return top 6 regulations
}