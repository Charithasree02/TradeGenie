'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Plus, 
  X,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Truck,
  Shield
} from 'lucide-react';

interface DocumentField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date';
  required: boolean;
  options?: string[];
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fields: DocumentField[];
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'commercial-invoice',
    name: 'Commercial Invoice',
    description: 'Standard commercial invoice for international trade',
    icon: <FileText className="w-6 h-6 text-blue-600" />,
    fields: [
      { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', required: true },
      { name: 'invoiceDate', label: 'Invoice Date', type: 'date', required: true },
      { name: 'sellerName', label: 'Seller Name', type: 'text', required: true },
      { name: 'sellerAddress', label: 'Seller Address', type: 'textarea', required: true },
      { name: 'buyerName', label: 'Buyer Name', type: 'text', required: true },
      { name: 'buyerAddress', label: 'Buyer Address', type: 'textarea', required: true },
      { name: 'countryOfOrigin', label: 'Country of Origin', type: 'select', required: true, options: ['India', 'China', 'USA', 'Germany', 'Japan'] },
      { name: 'countryOfDestination', label: 'Country of Destination', type: 'select', required: true, options: ['USA', 'Germany', 'France', 'UK', 'Japan'] },
      { name: 'currency', label: 'Currency', type: 'select', required: true, options: ['USD', 'EUR', 'GBP', 'JPY', 'INR'] },
      { name: 'paymentTerms', label: 'Payment Terms', type: 'text', required: true },
      { name: 'shippingMethod', label: 'Shipping Method', type: 'select', required: true, options: ['Air', 'Sea', 'Land', 'Rail'] },
      { name: 'products', label: 'Products', type: 'textarea', required: true },
      { name: 'totalAmount', label: 'Total Amount', type: 'number', required: true }
    ]
  },
  {
    id: 'proforma-invoice',
    name: 'Proforma Invoice',
    description: 'Preliminary invoice for customs purposes',
    icon: <Package className="w-6 h-6 text-green-600" />,
    fields: [
      { name: 'proformaNumber', label: 'Proforma Invoice Number', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'validUntil', label: 'Valid Until', type: 'date', required: true },
      { name: 'exporter', label: 'Exporter Name', type: 'text', required: true },
      { name: 'consignee', label: 'Consignee Name', type: 'text', required: true },
      { name: 'description', label: 'Goods Description', type: 'textarea', required: true },
      { name: 'hsCode', label: 'HS Code', type: 'text', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'unitPrice', label: 'Unit Price', type: 'number', required: true },
      { name: 'totalValue', label: 'Total Value', type: 'number', required: true }
    ]
  },
  {
    id: 'bill-of-lading',
    name: 'Bill of Lading',
    description: 'Document of title for goods shipment',
    icon: <Truck className="w-6 h-6 text-purple-600" />,
    fields: [
      { name: 'bolNumber', label: 'B/L Number', type: 'text', required: true },
      { name: 'exporter', label: 'Exporter', type: 'text', required: true },
      { name: 'importer', label: 'Importer', type: 'text', required: true },
      { name: 'vesselName', label: 'Vessel Name', type: 'text', required: true },
      { name: 'portOfLoading', label: 'Port of Loading', type: 'text', required: true },
      { name: 'portOfDischarge', label: 'Port of Discharge', type: 'text', required: true },
      { name: 'description', label: 'Goods Description', type: 'textarea', required: true },
      { name: 'grossWeight', label: 'Gross Weight', type: 'number', required: true },
      { name: 'netWeight', label: 'Net Weight', type: 'number', required: true },
      { name: 'freightCharges', label: 'Freight Charges', type: 'number', required: true }
    ]
  },
  {
    id: 'certificate-of-origin',
    name: 'Certificate of Origin',
    description: 'Document certifying the origin of goods',
    icon: <MapPin className="w-6 h-6 text-yellow-600" />,
    fields: [
      { name: 'certificateNumber', label: 'Certificate Number', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'exporter', label: 'Exporter Name', type: 'text', required: true },
      { name: 'producer', label: 'Producer Name', type: 'text', required: true },
      { name: 'consignee', label: 'Consignee Name', type: 'text', required: true },
      { name: 'countryOfOrigin', label: 'Country of Origin', type: 'select', required: true, options: ['India', 'China', 'USA', 'Germany', 'Japan'] },
      { name: 'transportDetails', label: 'Transport Details', type: 'textarea', required: true },
      { name: 'remarks', label: 'Remarks', type: 'textarea', required: false }
    ]
  },
  {
    id: 'packing-list',
    name: 'Export Packing List',
    description: 'Detailed list of package contents',
    icon: <Package className="w-6 h-6 text-red-600" />,
    fields: [
      { name: 'packingListNumber', label: 'Packing List Number', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'exporter', label: 'Exporter', type: 'text', required: true },
      { name: 'consignee', label: 'Consignee', type: 'text', required: true },
      { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', required: true },
      { name: 'totalPackages', label: 'Total Packages', type: 'number', required: true },
      { name: 'totalWeight', label: 'Total Weight', type: 'number', required: true },
      { name: 'totalVolume', label: 'Total Volume', type: 'number', required: true },
      { name: 'packageDetails', label: 'Package Details', type: 'textarea', required: true }
    ]
  },
  {
    id: 'sales-contract',
    name: 'Sales Contract',
    description: 'Legally binding sales agreement',
    icon: <Shield className="w-6 h-6 text-indigo-600" />,
    fields: [
      { name: 'contractNumber', label: 'Contract Number', type: 'text', required: true },
      { name: 'contractDate', label: 'Contract Date', type: 'date', required: true },
      { name: 'seller', label: 'Seller', type: 'text', required: true },
      { name: 'buyer', label: 'Buyer', type: 'text', required: true },
      { name: 'productDescription', label: 'Product Description', type: 'textarea', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'unitPrice', label: 'Unit Price', type: 'number', required: true },
      { name: 'totalValue', label: 'Total Value', type: 'number', required: true },
      { name: 'deliveryTerms', label: 'Delivery Terms', type: 'text', required: true },
      { name: 'paymentTerms', label: 'Payment Terms', type: 'text', required: true },
      { name: 'warranty', label: 'Warranty', type: 'textarea', required: false }
    ]
  }
];

export default function DocumentsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'text'>('pdf');

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const validateForm = () => {
    if (!selectedTemplate) return false;
    
    // Check if all required fields are filled
    const requiredFields = selectedTemplate.fields.filter(f => f.required);
    const allRequiredFilled = requiredFields.every(field => {
      const value = formData[field.name];
      return value && value.trim() !== '';
    });
    
    return allRequiredFilled;
  };

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) return;
    
    if (!validateForm()) {
      setShowValidationErrors(true);
      return;
    }

    setIsGenerating(true);
    setShowValidationErrors(false);
    
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please sign in to generate documents');
        setIsGenerating(false);
        return;
      }

      // Call the API to generate the document
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentType: selectedTemplate.id,
          data: formData,
          format: selectedFormat
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate document');
      }

      // Get the document blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Document generation error:', error);
      alert(`Failed to generate document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDocumentContent = (template: DocumentTemplate, data: Record<string, string>): string => {
    let content = `${template.name.toUpperCase()}\n`;
    content += `${'='.repeat(template.name.length)}\n\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    template.fields.forEach(field => {
      if (data[field.name]) {
        content += `${field.label}:\n${data[field.name]}\n\n`;
      }
    });
    
    content += '\n---\n';
    content += 'Generated by TradeGenie AI\n';
    content += 'This is a computer-generated document. Please verify all information before use.\n';
    
    return content;
  };

  const renderFormField = (field: DocumentField) => {
    const value = formData[field.name] || '';
    const hasError = showValidationErrors && field.required && (!value || value.trim() === '');
    
    switch (field.type) {
      case 'textarea':
        return (
          <div>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => {
                handleInputChange(field.name, e.target.value);
                if (showValidationErrors) setShowValidationErrors(false);
              }}
              placeholder={field.label}
              required={field.required}
              className={`mt-1 ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {hasError && <p className="text-red-500 text-xs mt-1">This field is required</p>}
          </div>
        );
      
      case 'select':
        return (
          <div>
            <Select value={value} onValueChange={(v) => {
              handleInputChange(field.name, v);
              if (showValidationErrors) setShowValidationErrors(false);
            }}>
              <SelectTrigger className={`mt-1 ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}>
                <SelectValue placeholder={`Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && <p className="text-red-500 text-xs mt-1">This field is required</p>}
          </div>
        );
      
      case 'number':
        return (
          <div>
            <Input
              id={field.name}
              type="number"
              value={value}
              onChange={(e) => {
                handleInputChange(field.name, e.target.value);
                if (showValidationErrors) setShowValidationErrors(false);
              }}
              placeholder={field.label}
              required={field.required}
              className={`mt-1 ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {hasError && <p className="text-red-500 text-xs mt-1">This field is required</p>}
          </div>
        );
      
      case 'date':
        return (
          <div>
            <Input
              id={field.name}
              type="date"
              value={value}
              onChange={(e) => {
                handleInputChange(field.name, e.target.value);
                if (showValidationErrors) setShowValidationErrors(false);
              }}
              required={field.required}
              className={`mt-1 ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {hasError && <p className="text-red-500 text-xs mt-1">This field is required</p>}
          </div>
        );
      
      default:
        return (
          <div>
            <Input
              id={field.name}
              type="text"
              value={value}
              onChange={(e) => {
                handleInputChange(field.name, e.target.value);
                if (showValidationErrors) setShowValidationErrors(false);
              }}
              placeholder={field.label}
              required={field.required}
              className={`mt-1 ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {hasError && <p className="text-red-500 text-xs mt-1">This field is required</p>}
          </div>
        );
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Document Generator</h1>
              <p className="text-gray-600">Generate professional trade documents with AI assistance</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Document Templates */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Document Templates</CardTitle>
                <CardDescription>
                  Choose a document type to generate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documentTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedTemplate?.id === template.id
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {template.icon}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <Badge className="bg-purple-600 text-white">Selected</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Document Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            {selectedTemplate ? (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-900">{selectedTemplate.name}</CardTitle>
                      <CardDescription>{selectedTemplate.description}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTemplate(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {showValidationErrors && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">!</span>
                          </div>
                          <p className="text-red-700 text-sm font-medium">
                            Please fill in all required fields marked with *
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Format Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Document Format</Label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="format"
                            value="pdf"
                            checked={selectedFormat === 'pdf'}
                            onChange={(e) => setSelectedFormat(e.target.value as 'pdf' | 'text')}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">PDF (Recommended)</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="format"
                            value="text"
                            checked={selectedFormat === 'text'}
                            onChange={(e) => setSelectedFormat(e.target.value as 'pdf' | 'text')}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">Plain Text</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF format provides better formatting and professional appearance
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedTemplate.fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label htmlFor={field.name} className="text-sm font-medium text-gray-900">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          {renderFormField(field)}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        {selectedTemplate.fields.filter(f => f.required).length} required fields
                      </div>
                      <Button
                        onClick={handleGenerateDocument}
                        disabled={isGenerating || !validateForm()}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Generate Document
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg h-full flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Document Template</h3>
                  <p className="text-gray-600 mb-4">
                    Choose from our collection of professional trade document templates
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI-powered generation
                  </Badge>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}