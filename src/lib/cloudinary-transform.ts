/**
 * Cloudinary Image Transformation Utilities
 * Provides easy-to-use functions for image transformations
 */

export interface TransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'limit';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
  effect?: string;
  radius?: number | 'max';
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  sharpen?: number;
  rotate?: number;
}

/**
 * Build Cloudinary transformation URL
 */
export function transformImage(url: string, options: TransformOptions = {}): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return original URL if not Cloudinary
  }

  // Parse the URL
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) return url;

  const transformations: string[] = [];

  // Dimensions
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);

  // Quality and format
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);

  // Effects
  if (options.effect) transformations.push(`e_${options.effect}`);
  if (options.radius !== undefined) transformations.push(`r_${options.radius}`);
  if (options.blur) transformations.push(`e_blur:${options.blur}`);
  if (options.brightness) transformations.push(`e_brightness:${options.brightness}`);
  if (options.contrast) transformations.push(`e_contrast:${options.contrast}`);
  if (options.saturation) transformations.push(`e_saturation:${options.saturation}`);
  if (options.sharpen) transformations.push(`e_sharpen:${options.sharpen}`);
  if (options.rotate) transformations.push(`a_${options.rotate}`);

  const transformString = transformations.join(',');
  return `${urlParts[0]}/upload/${transformString}/${urlParts[1]}`;
}

/**
 * Quick presets for common use cases
 */
export const ImagePresets = {
  // Thumbnails
  thumbnail: (url: string) => transformImage(url, {
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:good',
    format: 'auto',
  }),

  // Product cards
  productCard: (url: string) => transformImage(url, {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:good',
    format: 'auto',
  }),

  // Product detail - main image
  productDetail: (url: string) => transformImage(url, {
    width: 1200,
    height: 1200,
    crop: 'limit',
    quality: 'auto:best',
    format: 'auto',
  }),

  // Hero images
  hero: (url: string) => transformImage(url, {
    width: 1920,
    height: 1080,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:good',
    format: 'auto',
  }),

  // Compressed version for faster loading
  compressed: (url: string) => transformImage(url, {
    width: 800,
    height: 800,
    crop: 'limit',
    quality: 'auto:eco',
    format: 'auto',
  }),

  // Responsive - mobile
  mobile: (url: string) => transformImage(url, {
    width: 600,
    crop: 'limit',
    quality: 'auto:good',
    format: 'auto',
  }),

  // Responsive - tablet
  tablet: (url: string) => transformImage(url, {
    width: 900,
    crop: 'limit',
    quality: 'auto:good',
    format: 'auto',
  }),

  // Responsive - desktop
  desktop: (url: string) => transformImage(url, {
    width: 1600,
    crop: 'limit',
    quality: 'auto:good',
    format: 'auto',
  }),
};

/**
 * Effect presets
 */
export const EffectPresets = {
  grayscale: (url: string) => transformImage(url, { effect: 'grayscale' }),
  sepia: (url: string) => transformImage(url, { effect: 'sepia' }),
  blur: (url: string, amount: number = 300) => transformImage(url, { blur: amount }),
  sharpen: (url: string, amount: number = 100) => transformImage(url, { sharpen: amount }),
  brighten: (url: string, amount: number = 30) => transformImage(url, { brightness: amount }),
  darken: (url: string, amount: number = -30) => transformImage(url, { brightness: amount }),
  vintage: (url: string) => transformImage(url, { effect: 'sepia:50', contrast: -10, saturation: -20 }),
  vivid: (url: string) => transformImage(url, { saturation: 40, contrast: 20 }),
};

/**
 * Utility to get srcset for responsive images
 */
export function getResponsiveSrcSet(url: string): string {
  return [
    `${ImagePresets.mobile(url)} 600w`,
    `${ImagePresets.tablet(url)} 900w`,
    `${ImagePresets.desktop(url)} 1600w`,
  ].join(', ');
}

/**
 * Get optimized image with automatic format and quality
 */
export function getOptimizedImage(url: string, width?: number, height?: number): string {
  return transformImage(url, {
    width,
    height,
    crop: 'limit',
    quality: 'auto:good',
    format: 'auto',
  });
}
