import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import jsPDF from 'jspdf';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DocumentTemplate {
  id: string;
  name: string;
  fields: string[];
  requiredFields: string[];
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'commercial-invoice',
    name: 'Commercial Invoice',
    fields: ['invoiceNumber', 'invoiceDate', 'sellerName', 'sellerAddress', 'buyerName', 'buyerAddress', 'countryOfOrigin', 'countryOfDestination', 'currency', 'paymentTerms', 'shippingMethod', 'products', 'totalAmount'],
    requiredFields: ['invoiceNumber', 'invoiceDate', 'sellerName', 'sellerAddress', 'buyerName', 'buyerAddress', 'countryOfOrigin', 'countryOfDestination', 'currency', 'paymentTerms', 'products', 'totalAmount']
  },
  {
    id: 'proforma-invoice',
    name: 'Proforma Invoice',
    fields: ['proformaNumber', 'date', 'validUntil', 'exporter', 'consignee', 'description', 'hsCode', 'quantity', 'unitPrice', 'totalValue'],
    requiredFields: ['proformaNumber', 'date', 'validUntil', 'exporter', 'consignee', 'description', 'hsCode', 'quantity', 'unitPrice', 'totalValue']
  },
  {
    id: 'bill-of-lading',
    name: 'Bill of Lading',
    fields: ['bolNumber', 'exporter', 'importer', 'vesselName', 'portOfLoading', 'portOfDischarge', 'description', 'grossWeight', 'netWeight', 'freightCharges'],
    requiredFields: ['bolNumber', 'exporter', 'importer', 'vesselName', 'portOfLoading', 'portOfDischarge', 'description', 'grossWeight', 'netWeight', 'freightCharges']
  },
  {
    id: 'certificate-of-origin',
    name: 'Certificate of Origin',
    fields: ['certificateNumber', 'date', 'exporter', 'producer', 'consignee', 'countryOfOrigin', 'transportDetails', 'remarks'],
    requiredFields: ['certificateNumber', 'date', 'exporter', 'producer', 'consignee', 'countryOfOrigin', 'transportDetails']
  },
  {
    id: 'packing-list',
    name: 'Export Packing List',
    fields: ['packingListNumber', 'date', 'exporter', 'consignee', 'invoiceNumber', 'totalPackages', 'totalWeight', 'totalVolume', 'packageDetails'],
    requiredFields: ['packingListNumber', 'date', 'exporter', 'consignee', 'invoiceNumber', 'totalPackages', 'totalWeight', 'totalVolume', 'packageDetails']
  },
  {
    id: 'sales-contract',
    name: 'Sales Contract',
    fields: ['contractNumber', 'contractDate', 'seller', 'buyer', 'productDescription', 'quantity', 'unitPrice', 'totalValue', 'deliveryTerms', 'paymentTerms', 'warranty'],
    requiredFields: ['contractNumber', 'contractDate', 'seller', 'buyer', 'productDescription', 'quantity', 'unitPrice', 'totalValue', 'deliveryTerms', 'paymentTerms']
  }
];

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

    const { documentType, data, format = 'pdf' } = await request.json();

    if (!documentType || !data) {
      return NextResponse.json(
        { error: 'Document type and data are required' },
        { status: 400 }
      );
    }

    // Find document template
    const template = documentTemplates.find(t => t.id === documentType);
    if (!template) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // Validate required fields
    const missingFields = template.requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields 
        },
        { status: 400 }
      );
    }

    // Generate document content based on format
    let documentContent: string | Uint8Array;
    let contentType: string;
    let filename: string;

    if (format === 'pdf') {
      documentContent = generatePDFDocument(template, data);
      contentType = 'application/pdf';
      filename = `${template.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    } else {
      // Default to text format
      documentContent = generateTextDocument(template, data);
      contentType = 'text/plain';
      filename = `${template.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    }

    // Save document record to database
    const document = await db.document.create({
      data: {
        userId: decodedToken.userId,
        type: documentType,
        fields: data,
        resultPath: `/documents/${decodedToken.userId}/${filename}`,
        status: 'completed'
      }
    });

    // Return document as response
    if (format === 'pdf') {
      return new NextResponse(documentContent as Uint8Array, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    } else {
      return new NextResponse(documentContent as string, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }

  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateTextDocument(template: DocumentTemplate, data: any): string {
  let content = `${template.name.toUpperCase()}\n`;
  content += `${'='.repeat(template.name.length)}\n\n`;
  content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  
  // Add all fields
  template.fields.forEach(field => {
    if (data[field]) {
      content += `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:\n${data[field]}\n\n`;
    }
  });
  
  content += '\n---\n';
  content += 'Generated by TradeGenie AI\n';
  content += 'This is a computer-generated document. Please verify all information before use.\n';
  
  return content;
}

function generatePDFDocument(template: DocumentTemplate, data: any): Uint8Array {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Title
  doc.setFontSize(20);
  doc.text(template.name.toUpperCase(), 20, 30);
  
  // Date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 50, 190, 50);
  
  let yPosition = 65;
  
  // Add all fields
  template.fields.forEach(field => {
    if (data[field] && yPosition < 280) {
      // Field name
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      doc.text(fieldName + ':', 20, yPosition);
      
      // Field value (handle multi-line text)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const fieldValue = String(data[field]);
      const lines = doc.splitTextToSize(fieldValue, 170);
      
      if (yPosition + (lines.length * 5) > 280) {
        // Add new page if content exceeds current page
        doc.addPage();
        yPosition = 30;
      }
      
      doc.text(lines, 20, yPosition + 5);
      yPosition += (lines.length * 5) + 10;
    }
  });
  
  // Footer
  const finalY = yPosition > 250 ? 270 : yPosition + 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Generated by TradeGenie AI', 20, finalY);
  doc.text('This is a computer-generated document. Please verify all information before use.', 20, finalY + 5);
  
  return doc.output('arraybuffer') as Uint8Array;
}