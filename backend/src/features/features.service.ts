import { Injectable } from '@nestjs/common';

@Injectable()
export class FeaturesService {
  getFeatures() {
    return {
      features: [
        'Smart Filing Assistant',
        'AI Tax Analyzer',
        'Document Upload & OCR',
        // Add more...
      ],
      message: 'Taxbridge features list',
    };
  }
}