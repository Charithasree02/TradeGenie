'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Globe,
  BarChart3,
  Download,
  MapPin,
  DollarSign,
  FileText,
  Eye,
  Info
} from 'lucide-react';

interface RiskAnalysis {
  country: string;
  industry: string;
  overallRisk: number;
  riskFactors: {
    political: number;
    tariff: number;
    market: number;
    compliance: number;
  };
  tariffRates: {
    baseRate: number;
    additionalDuties: number;
    totalRate: number;
  };
  marketSize: {
    value: string;
    growth: number;
    competition: 'Low' | 'Medium' | 'High';
  };
  recommendations: string[];
  keyRisks: string[];
  opportunities: string[];
  regulations: string[];
}

const countries = [
  'Brazil', 'China', 'Germany', 'India', 'Japan', 'Mexico', 
  'Russia', 'Saudi Arabia', 'South Korea', 'USA', 'UK', 'France'
];

const industries = [
  'Food & Beverages',
  'Textiles & Apparel',
  'Electronics',
  'Machinery',
  'Chemicals',
  'Pharmaceuticals',
  'Automotive',
  'Agriculture',
  'Metals & Mining',
  'Construction'
];

const mockRiskAnalyses: Record<string, Record<string, RiskAnalysis>> = {
  'Brazil': {
    'Food & Beverages': {
      country: 'Brazil',
      industry: 'Food & Beverages',
      overallRisk: 72,
      riskFactors: {
        political: 75,
        tariff: 68,
        market: 70,
        compliance: 75
      },
      tariffRates: {
        baseRate: 14.2,
        additionalDuties: 0,
        totalRate: 14.2
      },
      marketSize: {
        value: '$45B',
        growth: 5.2,
        competition: 'High'
      },
      recommendations: [
        'Focus on premium products with less local competition',
        'Establish strong local partnerships for distribution',
        'Invest in brand building and consumer education',
        'Consider local manufacturing to reduce import costs'
      ],
      keyRisks: [
        'High import tariffs on processed foods',
        'Complex regulatory requirements for food safety',
        'Currency volatility affecting profit margins',
        'Strong local competition in staple foods'
      ],
      opportunities: [
        'Growing middle class demanding premium products',
        'Increasing health consciousness among consumers',
        'E-commerce expansion in food retail',
        'Government incentives for food processing investments'
      ],
      regulations: [
        'ANVISA food safety certification required',
        'Portuguese language labeling mandatory',
        'Specific nutritional information requirements',
        'Import license for food products'
      ]
    },
    'Electronics': {
      country: 'Brazil',
      industry: 'Electronics',
      overallRisk: 68,
      riskFactors: {
        political: 75,
        tariff: 85,
        market: 55,
        compliance: 60
      },
      tariffRates: {
        baseRate: 16.0,
        additionalDuties: 0,
        totalRate: 16.0
      },
      marketSize: {
        value: '$35B',
        growth: 8.5,
        competition: 'Medium'
      },
      recommendations: [
        'Target high-end electronics with less local production',
        'Partner with local retailers for market access',
        'Invest in after-sales service network',
        'Consider local assembly for tax benefits'
      ],
      keyRisks: [
        'High import duties on electronics',
        'Complex tax structure (ICMS, IPI, PIS, COFINS)',
        'Logistics challenges in distribution',
        'Counterfeit products in market'
      ],
      opportunities: [
        'Growing smartphone and computer market',
        'Government digital inclusion programs',
        'Increasing demand for smart home devices',
        '5G infrastructure investments'
      ],
      regulations: [
        'ANATEL certification required',
        'Inmetro quality standards',
        'Energy efficiency labeling',
        'WEEE compliance for electronic waste'
      ]
    }
  },
  'Germany': {
    'Textiles & Apparel': {
      country: 'Germany',
      industry: 'Textiles & Apparel',
      overallRisk: 25,
      riskFactors: {
        political: 15,
        tariff: 35,
        market: 25,
        compliance: 25
      },
      tariffRates: {
        baseRate: 12.0,
        additionalDuties: 0,
        totalRate: 12.0
      },
      marketSize: {
        value: '$28B',
        growth: 2.1,
        competition: 'High'
      },
      recommendations: [
        'Focus on sustainable and organic textiles',
        'Leverage German preference for quality and durability',
        'Develop B2B relationships with German retailers',
        'Comply with strict environmental standards'
      ],
      keyRisks: [
        'High competition from established European brands',
        'Strict environmental and labor regulations',
        'Consumer preference for locally produced goods',
        'Seasonal demand fluctuations'
      ],
      opportunities: [
        'Growing demand for sustainable fashion',
        'Strong B2B market for workwear and uniforms',
        'E-commerce growth in apparel retail',
        'German leadership in technical textiles'
      ],
      regulations: [
        'REACH compliance for chemical substances',
        'OEKO-TEX certification recommended',
        'GPSR (General Product Safety Regulation)',
        'Waste Framework Directive compliance'
      ]
    }
  },
  'USA': {
    'Pharmaceuticals': {
      country: 'USA',
      industry: 'Pharmaceuticals',
      overallRisk: 45,
      riskFactors: {
        political: 40,
        tariff: 25,
        market: 60,
        compliance: 55
      },
      tariffRates: {
        baseRate: 0,
        additionalDuties: 0,
        totalRate: 0
      },
      marketSize: {
        value: '$450B',
        growth: 6.8,
        competition: 'High'
      },
      recommendations: [
        'Invest in FDA compliance and quality systems',
        'Develop strong relationships with distributors',
        'Focus on niche therapeutic areas',
        'Consider partnerships with US pharmaceutical companies'
      ],
      keyRisks: [
        'Complex and lengthy FDA approval process',
        'High liability and litigation risks',
        'Intense competition from established players',
        'Healthcare policy changes affecting pricing'
      ],
      opportunities: [
        'World\'s largest pharmaceutical market',
        'Growing demand for generic drugs',
        'Increasing focus on personalized medicine',
        'Aging population driving demand'
      ],
      regulations: [
        'FDA approval required for all drugs',
        'Current Good Manufacturing Practices (cGMP)',
        'Drug Supply Chain Security Act (DSCSA)',
        'Pharmaceutical Quality/Chemistry Manufacturing Controls (PMC/CMC)'
      ]
    }
  }
};

export default function RiskAnalyzerPage() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedCountry || !selectedIndustry) return;

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const analysis = mockRiskAnalyses[selectedCountry]?.[selectedIndustry] || generateMockAnalysis(selectedCountry, selectedIndustry);
      setRiskAnalysis(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateMockAnalysis = (country: string, industry: string): RiskAnalysis => {
    return {
      country,
      industry,
      overallRisk: Math.floor(Math.random() * 40) + 30,
      riskFactors: {
        political: Math.floor(Math.random() * 40) + 30,
        tariff: Math.floor(Math.random() * 40) + 30,
        market: Math.floor(Math.random() * 40) + 30,
        compliance: Math.floor(Math.random() * 40) + 30
      },
      tariffRates: {
        baseRate: Math.random() * 20,
        additionalDuties: Math.random() * 5,
        totalRate: Math.random() * 25
      },
      marketSize: {
        value: `$${Math.floor(Math.random() * 100 + 10)}B`,
        growth: Math.random() * 10,
        competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High'
      },
      recommendations: [
        'Conduct thorough market research before entry',
        'Establish local partnerships for better market access',
        'Invest in understanding local regulations and compliance',
        'Develop risk mitigation strategies specific to this market'
      ],
      keyRisks: [
        'Regulatory changes affecting market access',
        'Economic volatility impacting demand',
        'Competition from local and international players',
        'Supply chain disruptions and logistics challenges'
      ],
      opportunities: [
        'Growing market demand in this sector',
        'Favorable trade agreements and policies',
        'Technological advancements creating new opportunities',
        'Untapped market segments with high potential'
      ],
      regulations: [
        'Industry-specific licensing requirements',
        'Quality and safety standards compliance',
        'Environmental regulations and certifications',
        'Import/export documentation and procedures'
      ]
    };
  };

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: 'Low', color: 'bg-green-500', text: 'text-green-700' };
    if (score <= 60) return { level: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-700' };
    return { level: 'High', color: 'bg-red-500', text: 'text-red-700' };
  };

  const getRiskIcon = (score: number) => {
    if (score <= 30) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score <= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  const handleDownloadReport = () => {
    if (!riskAnalysis) return;

    const reportContent = generateRiskReport(riskAnalysis);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-analysis-${riskAnalysis.country}-${riskAnalysis.industry}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateRiskReport = (analysis: RiskAnalysis): string => {
    const riskLevel = getRiskLevel(analysis.overallRisk);
    
    let report = `RISK ANALYSIS REPORT\n`;
    report += `${'='.repeat(50)}\n\n`;
    report += `Country: ${analysis.country}\n`;
    report += `Industry: ${analysis.industry}\n`;
    report += `Analysis Date: ${new Date().toLocaleDateString()}\n\n`;
    
    report += `EXECUTIVE SUMMARY\n`;
    report += `${'='.repeat(30)}\n`;
    report += `Overall Risk Level: ${riskLevel.level} (${analysis.overallRisk}%)\n\n`;
    
    report += `RISK FACTORS BREAKDOWN\n`;
    report += `${'='.repeat(30)}\n`;
    report += `Political Risk: ${analysis.riskFactors.political}%\n`;
    report += `Tariff Risk: ${analysis.riskFactors.tariff}%\n`;
    report += `Market Risk: ${analysis.riskFactors.market}%\n`;
    report += `Compliance Risk: ${analysis.riskFactors.compliance}%\n\n`;
    
    report += `TARIFF INFORMATION\n`;
    report += `${'='.repeat(30)}\n`;
    report += `Base Rate: ${analysis.tariffRates.baseRate.toFixed(1)}%\n`;
    report += `Additional Duties: ${analysis.tariffRates.additionalDuties.toFixed(1)}%\n`;
    report += `Total Rate: ${analysis.tariffRates.totalRate.toFixed(1)}%\n\n`;
    
    report += `MARKET OVERVIEW\n`;
    report += `${'='.repeat(30)}\n`;
    report += `Market Size: ${analysis.marketSize.value}\n`;
    report += `Growth Rate: ${analysis.marketSize.growth.toFixed(1)}%\n`;
    report += `Competition Level: ${analysis.marketSize.competition}\n\n`;
    
    report += `KEY RISKS\n`;
    report += `${'='.repeat(30)}\n`;
    analysis.keyRisks.forEach((risk, index) => {
      report += `${index + 1}. ${risk}\n`;
    });
    report += '\n';
    
    report += `OPPORTUNITIES\n`;
    report += `${'='.repeat(30)}\n`;
    analysis.opportunities.forEach((opportunity, index) => {
      report += `${index + 1}. ${opportunity}\n`;
    });
    report += '\n';
    
    report += `RECOMMENDATIONS\n`;
    report += `${'='.repeat(30)}\n`;
    analysis.recommendations.forEach((recommendation, index) => {
      report += `${index + 1}. ${recommendation}\n`;
    });
    report += '\n';
    
    report += `REGULATORY REQUIREMENTS\n`;
    report += `${'='.repeat(30)}\n`;
    analysis.regulations.forEach((regulation, index) => {
      report += `${index + 1}. ${regulation}\n`;
    });
    
    report += '\n---\n';
    report += 'Generated by TradeGenie AI Risk Analyzer\n';
    report += 'This report is for informational purposes only. Please consult with legal and trade experts before making business decisions.\n';
    
    return report;
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Global Risk Analyzer</h1>
              <p className="text-gray-600">AI-powered risk assessment for international trade</p>
            </div>
          </div>
        </motion.div>

        {/* Analysis Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="country">Target Country</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!selectedCountry || !selectedIndustry || isAnalyzing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing Risks...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Risk
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {riskAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Risk Analysis */}
              <div className="lg:col-span-2 space-y-6">
                {/* Overall Risk Score */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Risk Analysis Results</CardTitle>
                        <CardDescription>
                          {riskAnalysis.country} - {riskAnalysis.industry}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadReport}
                        className="text-purple-600 border-purple-600 hover:bg-purple-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="relative inline-flex items-center justify-center w-32 h-32">
                        <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                        <div 
                          className="absolute inset-0 rounded-full"
                          style={{ 
                            background: `conic-gradient(${getRiskLevel(riskAnalysis.overallRisk).color} ${riskAnalysis.overallRisk * 3.6}deg, transparent ${riskAnalysis.overallRisk * 3.6}deg)` 
                          }}
                        ></div>
                        <div className="relative flex flex-col items-center justify-center">
                          {getRiskIcon(riskAnalysis.overallRisk)}
                          <span className="text-3xl font-bold text-gray-900 mt-1">
                            {riskAnalysis.overallRisk}%
                          </span>
                          <span className="text-sm text-gray-600">
                            {getRiskLevel(riskAnalysis.overallRisk).level} Risk
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(riskAnalysis.riskFactors).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-sm font-medium text-gray-900 mb-2 capitalize">
                            {key} Risk
                          </div>
                          <div className="relative inline-flex items-center justify-center w-16 h-16">
                            <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                            <div 
                              className="absolute inset-0 rounded-full"
                              style={{ 
                                background: `conic-gradient(${getRiskLevel(value).color} ${value * 3.6}deg, transparent ${value * 3.6}deg)` 
                              }}
                            ></div>
                            <span className="relative text-lg font-bold text-gray-900">
                              {value}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key Risks */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                        Key Risks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {riskAnalysis.keyRisks.map((risk, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Opportunities */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                        Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {riskAnalysis.opportunities.map((opportunity, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Info className="w-5 h-5 text-blue-600 mr-2" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {riskAnalysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Market Info */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Globe className="w-5 h-5 text-purple-600 mr-2" />
                      Market Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Market Size</div>
                      <div className="text-lg font-semibold text-gray-900">{riskAnalysis.marketSize.value}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Growth Rate</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {riskAnalysis.marketSize.growth.toFixed(1)}%
                        </span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Competition</div>
                      <Badge 
                        variant={riskAnalysis.marketSize.competition === 'Low' ? 'secondary' : 
                                riskAnalysis.marketSize.competition === 'Medium' ? 'default' : 'destructive'}
                      >
                        {riskAnalysis.marketSize.competition}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Tariff Info */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="w-5 h-5 text-yellow-600 mr-2" />
                      Tariff Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Base Rate</span>
                      <span className="font-semibold">{riskAnalysis.tariffRates.baseRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Additional Duties</span>
                      <span className="font-semibold">{riskAnalysis.tariffRates.additionalDuties.toFixed(1)}%</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">Total Rate</span>
                        <span className="text-lg font-bold text-purple-600">
                          {riskAnalysis.tariffRates.totalRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Regulations */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                      Key Regulations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <ul className="space-y-2">
                        {riskAnalysis.regulations.map((regulation, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{regulation}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}