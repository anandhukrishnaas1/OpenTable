
export enum Category {
  Produce = 'Produce',
  Bakery = 'Bakery',
  Dairy = 'Dairy'
}

export interface ScanResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  item: string;
  category: Category;
  expiresIn: string;
  safeToEat: 'Yes' | 'No';
  confidence: string;
}

export interface ParseError {
  error: string;
}
