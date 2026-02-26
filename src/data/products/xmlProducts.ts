import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { chooseDisplayName, cleanPlainText } from './normalize';
import { Product } from './types';
import { reportError } from '../../utils/errorReporting';

const XML_ASSET = require('../../../assets/PIM/OCSN_Website_Export_Orion_Nidar.xml');

let productsCache: Product[] | null = null;
let inFlightLoad: Promise<Product[]> | null = null;
let lastDiagnostics: {
  xmlUri?: string;
  xmlLength?: number;
  parsedCount?: number;
  lastError?: string;
} = {};

const unwrapCdata = (value: string): string => {
  const cdataMatch = value.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (!cdataMatch) {
    return value;
  }

  return cdataMatch[1];
};

const getTagValue = (xmlBlock: string, tagName: string): string | undefined => {
  const pattern = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xmlBlock.match(pattern);
  if (!match) {
    return undefined;
  }

  return unwrapCdata(match[1].trim());
};

const extractGtinFromUrl = (url?: string): string | undefined => {
  if (!url) {
    return undefined;
  }

  const match = url.match(/\/(\d{8,14})\//);
  return match ? match[1] : undefined;
};

const parseProductsFromXml = (xml: string): Product[] => {
  const productBlocks = xml.match(/<Product\b[\s\S]*?<\/Product>/gi) || [];
  const results: Product[] = [];

  productBlocks.forEach((block, index) => {
    const activeProduct = getTagValue(block, 'ActiveProduct');
    const productName = getTagValue(block, 'ProductName');
    const productNameWeb = getTagValue(block, 'ProductNameWeb');
    const productDescription = getTagValue(block, 'ProductDescription');
    const ingredientList = getTagValue(block, 'IngredientList');
    const productImageURL = getTagValue(block, 'ProductImageURL');
    const masterErpNumber = getTagValue(block, 'MasterERPNumber');

    if ((activeProduct || '').trim().toLowerCase() !== 'yes') {
      return;
    }

    if (!productName || !/stratos/i.test(productName)) {
      return;
    }

    const name = chooseDisplayName(productNameWeb, productName);
    const description = cleanPlainText(productDescription);
    const ingredients = cleanPlainText(ingredientList);
    const imageUrl = cleanPlainText(productImageURL);
    const gtin = extractGtinFromUrl(imageUrl);
    const product: Product = {
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
      name,
      description: description || 'No description available.',
      ingredients: ingredients || 'Ingredients unavailable.',
    };

    if (masterErpNumber) {
      product.masterErpNumber = cleanPlainText(masterErpNumber);
    }

    if (gtin) {
      product.gtin = gtin;
    }

    if (imageUrl) {
      product.imageUrl = imageUrl;
    }

    results.push(product);
  });

  return results;
};

const resolveBundledXmlUri = async (): Promise<string> => {
  const loadedAssets = await Asset.loadAsync(XML_ASSET);
  const asset = loadedAssets[0] ?? Asset.fromModule(XML_ASSET);

  const uri = asset.localUri || asset.uri;
  if (!uri) {
    throw new Error('Unable to resolve XML asset URI.');
  }

  return uri;
};

const fetchWithTimeout = async (uri: string, timeoutMs: number) => {
  return Promise.race([
    fetch(uri),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('XML load timeout.')), timeoutMs)
    ),
  ]);
};

const loadXmlText = async (): Promise<string> => {
  const uri = await resolveBundledXmlUri();
  lastDiagnostics = { ...lastDiagnostics, xmlUri: uri, lastError: undefined };

  if (uri.startsWith('file://')) {
    try {
      const text = await FileSystem.readAsStringAsync(uri);
      lastDiagnostics = { ...lastDiagnostics, xmlLength: text.length };
      return text;
    } catch (error) {
      reportError(error, 'xmlProducts.readAsStringAsync');
    }
  }

  const response = await fetchWithTimeout(uri, 8000);
  if (!response.ok) {
    throw new Error('Unable to read XML asset.');
  }

  const text = await response.text();
  lastDiagnostics = { ...lastDiagnostics, xmlLength: text.length };
  return text;
};

export const clearProductsCache = () => {
  productsCache = null;
  inFlightLoad = null;
  lastDiagnostics = {};
};

export const getProductsDiagnostics = () => lastDiagnostics;

export const loadProducts = async (): Promise<Product[]> => {
  if (productsCache) {
    return productsCache;
  }

  if (inFlightLoad) {
    return inFlightLoad;
  }

  inFlightLoad = (async () => {
    try {
      const xml = await loadXmlText();
      const parsedProducts = parseProductsFromXml(xml);
      productsCache = parsedProducts;
      lastDiagnostics = { ...lastDiagnostics, parsedCount: parsedProducts.length };
      return parsedProducts;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown product load error.';
      lastDiagnostics = { ...lastDiagnostics, lastError: message };
      reportError(error, 'xmlProducts.loadProducts');
      return [];
    }
  })();

  try {
    return await inFlightLoad;
  } finally {
    inFlightLoad = null;
  }
};
