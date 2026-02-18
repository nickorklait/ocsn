import { Asset } from 'expo-asset';
import { chooseDisplayName, cleanPlainText } from './normalize';
import { Product } from './types';

const XML_ASSET = require('../../../assets/PIM/OCSN_Website_Export_Orion_Nidar.xml');

let productsCache: Product[] | null = null;
let inFlightLoad: Promise<Product[]> | null = null;

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
    const product: Product = {
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
      name,
      description: description || 'No description available.',
      ingredients: ingredients || 'Ingredients unavailable.',
    };

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

const loadXmlText = async (): Promise<string> => {
  const uri = await resolveBundledXmlUri();

  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error('Unable to read XML asset.');
  }

  return response.text();
};

export const clearProductsCache = () => {
  productsCache = null;
  inFlightLoad = null;
};

export const loadProducts = async (): Promise<Product[]> => {
  if (productsCache) {
    return productsCache;
  }

  if (inFlightLoad) {
    return inFlightLoad;
  }

  inFlightLoad = (async () => {
    const xml = await loadXmlText();
    const parsedProducts = parseProductsFromXml(xml);
    productsCache = parsedProducts;
    return parsedProducts;
  })();

  try {
    return await inFlightLoad;
  } finally {
    inFlightLoad = null;
  }
};
