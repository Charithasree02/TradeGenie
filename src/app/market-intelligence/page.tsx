'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Globe, 
  DollarSign, 
  BarChart3, 
  Download,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const marketData = [
  {
    region: "North America",
    gdpGrowth: "+2.1%",
    marketOpportunity: "High",
    riskLevel: "Low",
    trends: ["Digital trade increasing", "Sustainability focus", "AI integration"],
    topSectors: ["Technology", "Healthcare", "Renewable Energy"]
  },
  {
    region: "European Union",
    gdpGrowth: "+1.8%",
    marketOpportunity: "Medium",
    riskLevel: "Low",
    trends: ["Green transition", "Digital sovereignty", "Supply chain diversification"],
    topSectors: ["Manufacturing", "Green Tech", "E-commerce"]
  },
  {
    region: "Asia-Pacific",
    gdpGrowth: "+4.2%",
    marketOpportunity: "Very High",
    riskLevel: "Medium",
    trends: ["Rapid digitalization", "Middle class growth", "Infrastructure development"],
    topSectors: ["Electronics", "E-commerce", "Infrastructure"]
  },
  {
    region: "Latin America",
    gdpGrowth: "+2.3%",
    marketOpportunity: "Medium",
    riskLevel: "Medium",
    trends: ["Agricultural modernization", "Mining growth", "Regional integration"],
    topSectors: ["Agriculture", "Mining", "Tourism"]
  },
  {
    region: "Africa",
    gdpGrowth: "+3.8%",
    marketOpportunity: "High",
    riskLevel: "High",
    trends: ["Mobile banking", "Urbanization", "Renewable energy adoption"],
    topSectors: ["Mobile Technology", "Agriculture", "Renewable Energy"]
  },
  {
    region: "Middle East",
    gdpGrowth: "+2.9%",
    marketOpportunity: "Medium",
    riskLevel: "Medium",
    trends: ["Economic diversification", "Digital transformation", "Renewable energy"],
    topSectors: ["Technology", "Renewable Energy", "Tourism"]
  }
];

const industryInsights = [
  {
    industry: "Technology",
    growth: "+12.5%",
    demand: "Very High",
    keyMarkets: ["USA", "China", "India", "Germany"],
    trends: ["AI & Machine Learning", "Cloud Computing", "Cybersecurity", "IoT"]
  },
  {
    industry: "Healthcare",
    growth: "+8.3%",
    demand: "High",
    keyMarkets: ["USA", "Germany", "Japan", "Switzerland"],
    trends: ["Telemedicine", "Biotechnology", "Medical Devices", "Health Tech"]
  },
  {
    industry: "Renewable Energy",
    growth: "+15.7%",
    demand: "Very High",
    keyMarkets: ["China", "USA", "Germany", "India"],
    trends: ["Solar Power", "Wind Energy", "Energy Storage", "Green Hydrogen"]
  },
  {
    industry: "E-commerce",
    growth: "+18.2%",
    demand: "Very High",
    keyMarkets: ["China", "USA", "UK", "Japan"],
    trends: ["Mobile Commerce", "Social Commerce", "Cross-border Trade", "AI Personalization"]
  }
];

export default function MarketIntelligence() {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity.toLowerCase()) {
      case 'low': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-blue-600 bg-blue-100';
      case 'very high': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Market Intelligence</h1>
                <p className="text-sm text-gray-500">Real-time market insights and analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Data
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Global Markets</p>
                  <p className="text-2xl font-bold text-gray-900">195</p>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Industries Tracked</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Points</p>
                  <p className="text-2xl font-bold text-gray-900">2.4M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-2xl font-bold text-gray-900">2h</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Regional Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Regional Market Analysis</span>
              </CardTitle>
              <CardDescription>
                Comprehensive analysis of global markets by region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {marketData.map((market, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {market.region}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="font-medium">GDP Growth:</span>
                                <span className="text-green-600 font-semibold">{market.gdpGrowth}</span>
                              </div>
                              <Badge className={getOpportunityColor(market.marketOpportunity)}>
                                {market.marketOpportunity} Opportunity
                              </Badge>
                              <Badge className={getRiskColor(market.riskLevel)}>
                                {market.riskLevel} Risk
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Key Trends</h4>
                            <div className="space-y-1">
                              {market.trends.map((trend, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                  <span>{trend}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Top Sectors</h4>
                            <div className="flex flex-wrap gap-2">
                              {market.topSectors.map((sector, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {sector}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industry Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Industry Insights</span>
              </CardTitle>
              <CardDescription>
                Deep dive into industry-specific market trends and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {industryInsights.map((industry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {industry.industry}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="font-medium">Growth:</span>
                                <span className="text-green-600 font-semibold">{industry.growth}</span>
                              </div>
                              <Badge className="bg-blue-100 text-blue-600">
                                {industry.demand} Demand
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Key Markets</h4>
                            <div className="flex flex-wrap gap-2">
                              {industry.keyMarkets.map((market, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {market}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Trends</h4>
                            <div className="space-y-1">
                              {industry.trends.map((trend, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                  <span>{trend}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}