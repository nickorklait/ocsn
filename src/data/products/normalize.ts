export const decodeHtmlEntities = (value: string): string => {
  return value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ');
};

export const stripTags = (value: string): string => {
  return value.replace(/<[^>]*>/g, ' ');
};

export const collapseWhitespace = (value: string): string => {
  return value.replace(/\s+/g, ' ').trim();
};

export const cleanPlainText = (value?: string): string => {
  if (!value) {
    return '';
  }

  return collapseWhitespace(stripTags(decodeHtmlEntities(value)));
};

export const chooseDisplayName = (
  productNameWeb?: string,
  productName?: string
): string => {
  const webName = cleanPlainText(productNameWeb);
  if (webName) {
    return webName;
  }

  const fallbackName = cleanPlainText(productName);
  return fallbackName || 'Unnamed Stratos Product';
};

