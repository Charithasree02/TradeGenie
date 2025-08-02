import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Compliance rules for different countries and document types
const complianceRules = {
  'usa': {
    'commercial-invoice': [
      {
        id: 'hs-code-required',
        severity: 'critical',
        category: 'Missing Information',
        description: 'Harmonized System (HS) Code is missing from the commercial invoice',
        regulation: 'Customs Harmonized System Code Requirement',
        suggestedFix: 'Add the appropriate 6-digit HS code for the product being exported',
        location: 'Product Description Section'
      },
      {
        id: 'country-code-format',
        severity: 'high',
        category: 'Incorrect Format',
        description: 'Country of origin format does not meet ISO 3166-1 alpha-2 standards',
        regulation: 'ISO 3166-1 Country Code Standard',
        suggestedFix: 'Use two-letter country codes (e.g., US for United States, DE for Germany)',
        location: 'Exporter/Importer Information'
      }
    ],
    'bill-of-lading': [
      {
        id: 'vessel-info-missing',
        severity: 'high',
        category: 'Missing Information',
        description: 'Vessel name and voyage number are missing',
        regulation: 'Maritime Transportation Documentation Requirements',
        suggestedFix: 'Include complete vessel identification and voyage information',
        location: 'Transport Information Section'
      }
    ]
  },
  'germany': {
    'commercial-invoice': [
      {
        id: 'eu-compliance-statement',
        severity: 'high',
        category: 'Missing Certification',
        description: 'EU compliance statement is missing',
        regulation: 'EU Product Compliance Directive',
        suggestedFix: 'Add EU compliance declaration and CE marking information if applicable',
        location: 'Certification Section'
      },
      {
        id: 'vat-number-required',
        severity: 'medium',
        category: 'Missing Information',
        description: 'VAT numbers for both buyer and seller are missing',
        regulation: 'EU VAT Directive',
        suggestedFix: 'Include valid VAT identification numbers for all parties',
        location: 'Party Information Section'
      }
    ]
  },
  'brazil': {
    'commercial-invoice': [
      {
        id: 'anvisa-requirements',
        severity: 'critical',
        category: 'Regulatory Compliance',
        description: 'ANVISA registration number missing for regulated products',
        regulation: 'ANVISA Regulatory Requirements',
        suggestedFix: 'Include ANVISA registration number for products requiring health surveillance',
        location: 'Regulatory Compliance Section'
      },
      {
        id: 'portuguese-language',
        severity: 'high',
        category: 'Language Requirements',
        description: 'Document not in Portuguese as required by Brazilian customs',
        regulation: 'Brazilian Customs Language Requirements',
        suggestedFix: 'Provide Portuguese translation or bilingual document',
        location: 'Document Level'
      }
    ]
  }
};

// Common compliance issues across all countries
const commonIssues = [
  {
    id: 'payment-terms-ambiguous',
    severity: 'medium',
    category: 'Incomplete Information',
    description: 'Payment terms are not clearly specified or are ambiguous',
    regulation: 'International Chamber of Commerce (ICC) Payment Terms',
    suggestedFix: 'Specify payment terms using standard ICC incoterms (e.g., FOB, CIF, EXW)',
    location: 'Payment Terms Section'
  },
  {
    id: 'incoterms-missing',
    severity: 'medium',
    category: 'Missing Information',
    description: 'International commercial terms (Incoterms) are not specified',
    regulation: 'ICC Incoterms 2020',
    suggestedFix: 'Include appropriate Incoterms to clarify delivery terms and responsibilities',
    location: 'Delivery Terms Section'
  },
  {
    id: 'currency-inconsistent',
    severity: 'low',
    category: 'Formatting Issue',
    description: 'Currency symbol placement inconsistent throughout the document',
    regulation: 'International Financial Reporting Standards',
    suggestedFix: 'Standardize currency symbol placement (before or after amounts)',
    location: 'Financial Sections'
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

    // In a real implementation, you would process uploaded files here
    // For now, we'll simulate file analysis based on request data
    const { fileName, fileType, country, documentType } = await request.json();

    if (!fileName || !fileType || !country || !documentType) {
      return NextResponse.json(
        { error: 'File name, type, country, and document type are required' },
        { status: 400 }
      );
    }

    // Simulate document processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate compliance analysis
    const analysis = await generateComplianceAnalysis(fileName, fileType, country, documentType);

    // Save analysis to database
    const savedAnalysis = await db.complianceReport.create({
      data: {
        userId: decodedToken.userId,
        fileName,
        fileType,
        country: country.toLowerCase(),
        overallScore: analysis.overallScore,
        issues: analysis.issues,
        regulations: analysis.regulations,
        status: 'completed'
      }
    });

    return NextResponse.json({
      analysis,
      reportId: savedAnalysis.id
    });

  } catch (error) {
    console.error('Compliance analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateComplianceAnalysis(fileName: string, fileType: string, country: string, documentType: string): Promise<any> {
  const countryKey = country.toLowerCase();
  const documentTypeKey = documentType.toLowerCase().replace(/\s+/g, '-');

  // Get country and document specific rules
  const specificRules = complianceRules[countryKey]?.[documentTypeKey] || [];
  
  // Combine with common issues
  const allIssues = [...specificRules, ...commonIssues];
  
  // Randomly select issues (simulate finding issues in the document)
  const foundIssues = allIssues
    .filter(() => Math.random() > 0.3) // 70% chance of finding each issue
    .map(issue => ({
      ...issue,
      id: `${issue.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

  // Calculate overall score based on issues found
  let scoreDeduction = 0;
  foundIssues.forEach(issue => {
    switch (issue.severity) {
      case 'critical':
        scoreDeduction += 25;
        break;
      case 'high':
        scoreDeduction += 15;
        break;
      case 'medium':
        scoreDeduction += 8;
        break;
      case 'low':
        scoreDeduction += 3;
        break;
    }
  });

  const overallScore = Math.max(0, 100 - scoreDeduction);

  // Generate list of applicable regulations
  const regulations = Array.from(new Set([
    ...foundIssues.map(issue => issue.regulation),
    ...getAdditionalRegulations(country, documentType)
  ]));

  return {
    fileName,
    fileType,
    country,
    documentType,
    overallScore,
    issues: foundIssues,
    regulations,
    summary: generateComplianceSummary(foundIssues, overallScore)
  };
}

function getAdditionalRegulations(country: string, documentType: string): string[] {
  const baseRegulations = [
    'International Trade Documentation Standards',
    'World Trade Organization (WTO) Trade Facilitation Agreement',
    'United Nations Convention on Contracts for the International Sale of Goods (CISG)'
  ];

  const countrySpecific = {
    usa: [
      'U.S. Customs and Border Protection Regulations',
      'Federal Trade Commission (FTC) Rules',
      'Food and Drug Administration (FDA) Regulations'
    ],
    germany: [
      'German Customs Administration (Zoll) Regulations',
      'Federal Ministry of Economics and Technology Requirements',
      'German Commercial Code (HGB)'
    ],
    brazil: [
      'Brazilian Customs (Receita Federal) Regulations',
      'Ministry of Development, Industry and Trade (MDIC) Rules',
      'Brazilian Foreign Trade Chamber (CAMEX) Regulations'
    ]
  };

  const additional = countrySpecific[country.toLowerCase()] || [];
  return [...baseRegulations, ...additional];
}

function generateComplianceSummary(issues: any[], score: number): string {
  if (score >= 90) {
    return 'Excellent compliance. Minor formatting issues found that can be easily addressed.';
  } else if (score >= 70) {
    return 'Good overall compliance. Some issues identified that should be addressed before submission.';
  } else if (score >= 50) {
    return 'Moderate compliance concerns. Several issues require attention to ensure smooth customs clearance.';
  } else {
    return 'Significant compliance issues found. Immediate action required to avoid customs delays or penalties.';
  }
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const reports = await db.complianceReport.findMany({
      where: { userId: decodedToken.userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        fileName: true,
        fileType: true,
        country: true,
        overallScore: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      reports,
      total: await db.complianceReport.count({
        where: { userId: decodedToken.userId }
      })
    });

  } catch (error) {
    console.error('Get compliance reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}