'use client';

import { useState, useRef } from 'react';
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
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  File,
  Image as ImageIcon,
  FileSpreadsheet
} from 'lucide-react';

interface ComplianceIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  regulation: string;
  suggestedFix: string;
  location: string;
}

interface ComplianceReport {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: Date;
  country: string;
  overallScore: number;
  issues: ComplianceIssue[];
  regulations: string[];
  status: 'analyzing' | 'completed' | 'error';
}

const countries = [
  'USA', 'Germany', 'China', 'Japan', 'India', 'Brazil', 
  'UK', 'France', 'Canada', 'Australia', 'Mexico', 'South Korea'
];

const mockComplianceIssues: ComplianceIssue[] = [
  {
    id: '1',
    severity: 'critical',
    category: 'Missing Information',
    description: 'Harmonized System (HS) Code is missing from the commercial invoice',
    regulation: 'Customs Harmonized System Code Requirement',
    suggestedFix: 'Add the appropriate 6-digit HS code for the product being exported',
    location: 'Page 1, Section 3 - Product Description'
  },
  {
    id: '2',
    severity: 'high',
    category: 'Incorrect Format',
    description: 'Country of origin format does not meet ISO 3166-1 alpha-2 standards',
    regulation: 'ISO 3166-1 Country Code Standard',
    suggestedFix: 'Use two-letter country codes (e.g., US for United States, DE for Germany)',
    location: 'Page 1, Section 2 - Exporter Information'
  },
  {
    id: '3',
    severity: 'medium',
    category: 'Missing Certification',
    description: 'No certificate of origin attached or referenced',
    regulation: 'Rules of Origin Requirements',
    suggestedFix: 'Attach a valid certificate of origin or reference the certificate number',
    location: 'Document Level - Supporting Documentation'
  },
  {
    id: '4',
    severity: 'medium',
    category: 'Incomplete Payment Terms',
    description: 'Payment terms are not clearly specified or are ambiguous',
    regulation: 'International Chamber of Commerce (ICC) Payment Terms',
    suggestedFix: 'Specify payment terms using standard ICC incoterms (e.g., FOB, CIF, EXW)',
    location: 'Page 2, Section 5 - Payment Terms'
  },
  {
    id: '5',
    severity: 'low',
    category: 'Formatting Issue',
    description: 'Currency symbol placement inconsistent throughout the document',
    regulation: 'International Financial Reporting Standards',
    suggestedFix: 'Standardize currency symbol placement (before or after amounts)',
    location: 'Multiple locations - Financial sections'
  }
];

export default function CompliancePage() {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !selectedCountry) return;

    Array.from(files).forEach(file => {
      const newReport: ComplianceReport = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        fileType: file.type,
        fileSize: formatFileSize(file.size),
        uploadDate: new Date(),
        country: selectedCountry,
        overallScore: 0,
        issues: [],
        regulations: [],
        status: 'analyzing'
      };

      setReports(prev => [newReport, ...prev]);

      // Simulate analysis
      setTimeout(() => {
        setReports(prev => 
          prev.map(report => 
            report.id === newReport.id 
              ? {
                  ...report,
                  status: 'completed',
                  overallScore: Math.floor(Math.random() * 30) + 70,
                  issues: mockComplianceIssues,
                  regulations: [
                    'Customs Harmonized System Code Requirement',
                    'ISO 3166-1 Country Code Standard',
                    'Rules of Origin Requirements',
                    'International Chamber of Commerce (ICC) Payment Terms',
                    'International Financial Reporting Standards'
                  ]
                }
              : report
          )
        );
        
        if (!selectedReport) {
          setSelectedReport(newReport);
        }
      }, 3000);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-8 h-8 text-red-600" />;
    if (fileType.includes('image')) return <ImageIcon className="w-8 h-8 text-blue-600" />;
    if (fileType.includes('sheet') || fileType.includes('excel')) return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    return <File className="w-8 h-8 text-gray-600" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDownloadReport = (report: ComplianceReport) => {
    const reportContent = generateComplianceReport(report);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${report.fileName}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateComplianceReport = (report: ComplianceReport): string => {
    let content = `COMPLIANCE ANALYSIS REPORT\n`;
    content += `${'='.repeat(50)}\n\n`;
    content += `File Name: ${report.fileName}\n`;
    content += `File Type: ${report.fileType}\n`;
    content += `File Size: ${report.fileSize}\n`;
    content += `Upload Date: ${report.uploadDate.toLocaleDateString()}\n`;
    content += `Target Country: ${report.country}\n`;
    content += `Analysis Date: ${new Date().toLocaleDateString()}\n\n`;
    
    content += `OVERALL COMPLIANCE SCORE\n`;
    content += `${'='.repeat(30)}\n`;
    content += `Score: ${report.overallScore}%\n\n`;
    
    content += `ISSUES FOUND\n`;
    content += `${'='.repeat(30)}\n`;
    report.issues.forEach((issue, index) => {
      content += `${index + 1}. ${issue.description}\n`;
      content += `   Severity: ${issue.severity.toUpperCase()}\n`;
      content += `   Category: ${issue.category}\n`;
      content += `   Regulation: ${issue.regulation}\n`;
      content += `   Suggested Fix: ${issue.suggestedFix}\n`;
      content += `   Location: ${issue.location}\n\n`;
    });
    
    content += `APPLICABLE REGULATIONS\n`;
    content += `${'='.repeat(30)}\n`;
    report.regulations.forEach((regulation, index) => {
      content += `${index + 1}. ${regulation}\n`;
    });
    
    content += '\n---\n';
    content += 'Generated by TradeGenie AI Compliance Advisor\n';
    content += 'This report is for informational purposes. Please consult with legal experts for final compliance verification.\n';
    
    return content;
  };

  const handleReanalyze = (reportId: string) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: 'analyzing' }
          : report
      )
    );

    setTimeout(() => {
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { 
                ...report, 
                status: 'completed',
                overallScore: Math.floor(Math.random() * 30) + 70,
                issues: mockComplianceIssues,
                regulations: [
                  'Customs Harmonized System Code Requirement',
                  'ISO 3166-1 Country Code Standard',
                  'Rules of Origin Requirements',
                  'International Chamber of Commerce (ICC) Payment Terms',
                  'International Financial Reporting Standards'
                ]
              }
            : report
        )
      );
    }, 2000);
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Smart Compliance Advisor</h1>
              <p className="text-gray-600">AI-powered document compliance analysis</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Upload Document</CardTitle>
                <CardDescription>
                  Upload trade-related documents for compliance analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                  } ${!selectedCountry ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => selectedCountry && fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your document here
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supports PDF, DOC, DOCX, XLS, XLSX formats
                  </p>
                  <Button variant="outline" disabled={!selectedCountry}>
                    Browse Files
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />

                <div className="text-xs text-gray-500">
                  <p className="font-semibold mb-1">Supported Documents:</p>
                  <ul className="space-y-1">
                    <li>• Commercial Invoices</li>
                    <li>• Bills of Lading</li>
                    <li>• Certificates of Origin</li>
                    <li>• Packing Lists</li>
                    <li>• Sales Contracts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            {reports.length > 0 && (
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {reports.map((report) => (
                        <div
                          key={report.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedReport?.id === report.id
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                          onClick={() => setSelectedReport(report)}
                        >
                          <div className="flex items-start space-x-3">
                            {getFileIcon(report.fileType)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {report.fileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {report.fileSize} • {report.uploadDate.toLocaleDateString()}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  report.status === 'completed' ? 'bg-green-500' :
                                  report.status === 'analyzing' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                                <span className="text-xs text-gray-500 capitalize">
                                  {report.status}
                                </span>
                                {report.status === 'completed' && (
                                  <span className={`text-xs font-medium ${getScoreColor(report.overallScore)}`}>
                                    {report.overallScore}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            {selectedReport ? (
              <div className="space-y-6">
                {/* Report Header */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{selectedReport.fileName}</CardTitle>
                        <CardDescription>
                          {selectedReport.country} • {selectedReport.uploadDate.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReanalyze(selectedReport.id)}
                          disabled={selectedReport.status === 'analyzing'}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Re-analyze
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(selectedReport)}
                          disabled={selectedReport.status !== 'completed'}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReport(selectedReport.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedReport.status === 'analyzing' ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Analyzing document for compliance issues...</p>
                        <Progress value={75} className="mt-4" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="relative inline-flex items-center justify-center w-20 h-20">
                              <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                              <div 
                                className="absolute inset-0 rounded-full"
                                style={{ 
                                  background: `conic-gradient(${selectedReport.overallScore >= 90 ? '#10b981' : selectedReport.overallScore >= 70 ? '#f59e0b' : '#ef4444'} ${selectedReport.overallScore * 3.6}deg, transparent ${selectedReport.overallScore * 3.6}deg)` 
                                }}
                              ></div>
                              <span className="relative text-2xl font-bold text-gray-900">
                                {selectedReport.overallScore}%
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Compliance Score</p>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className={`w-5 h-5 ${selectedReport.overallScore >= 90 ? 'text-green-600' : selectedReport.overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`} />
                              <span className="font-medium">Analysis Complete</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {selectedReport.issues.length} issues found
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Document Type</p>
                          <Badge variant="outline">{selectedReport.fileType}</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Issues */}
                {selectedReport.status === 'completed' && (
                  <>
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg">Compliance Issues</CardTitle>
                        <CardDescription>
                          Issues found and recommended fixes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedReport.issues.map((issue) => (
                            <div key={issue.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  {getSeverityIcon(issue.severity)}
                                  <h4 className="font-medium text-gray-900">{issue.category}</h4>
                                  <Badge className={getSeverityColor(issue.severity)}>
                                    {issue.severity.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">{issue.description}</p>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-gray-900">Regulation:</span>
                                  <p className="text-gray-600">{issue.regulation}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">Suggested Fix:</span>
                                  <p className="text-gray-600">{issue.suggestedFix}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">Location:</span>
                                  <p className="text-gray-600">{issue.location}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Regulations */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg">Applicable Regulations</CardTitle>
                        <CardDescription>
                          Regulations checked during analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-3">
                          {selectedReport.regulations.map((regulation, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{regulation}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            ) : (
              <Card className="border-0 shadow-lg h-full flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload a Document</h3>
                  <p className="text-gray-600 mb-4">
                    Upload a trade-related document to begin compliance analysis
                  </p>
                  <div className="space-y-2 text-left max-w-md mx-auto">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Real-time compliance checking</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Country-specific regulation analysis</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Detailed issue reporting</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Actionable recommendations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}