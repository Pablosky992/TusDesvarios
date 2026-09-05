import websData from '../../data/red/webs.json';
import amazonData from '../../data/red/amazon.json';

export interface WebItem {
  id: string;
  titulo: string;
  url: string;
  tipo: 'creador' | 'destacada' | 'amiga' | 'comunidad';
  badge: string;
  badgeColor: string;
  descripcion: string;
  imagen: string;
  icono: string;
  tags: string[];
}

export interface AmazonProduct {
  id: string;
  titulo: string;
  categoria: 'tech' | 'setup' | 'regalos' | 'ocio';
  categoriaNombre: string;
  descripcion: string;
  precioAprox: string;
  estrellas: number;
  resenas: number;
  imagen: string;
  icono: string;
  etiqueta: string;
  color: string;
  amazonUrl?: string;
  amazonAsin?: string;
  amazonSearchQuery?: string;
}

// Global Amazon Affiliate Tag (User can change this to their personal Amazon Associates ID)
export const AMAZON_AFFILIATE_TAG = 'tusdesvarios-21';

export function getAmazonProductUrl(product: AmazonProduct): string {
  if (product.amazonUrl) {
    return product.amazonUrl;
  }
  const query = encodeURIComponent(product.amazonSearchQuery || product.titulo);
  return `https://www.amazon.es/s?k=${query}&tag=${AMAZON_AFFILIATE_TAG}`;
}

export async function getAllWebs(): Promise<WebItem[]> {
  return websData as WebItem[];
}

export async function getAllAmazonProducts(): Promise<AmazonProduct[]> {
  return amazonData as AmazonProduct[];
}
