/**
 * Theme Utilities
 * Helper functions to use theme values in components
 */

// Type for specifying spacing key or direct value
type SpacingKey = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32;
type SpacingValue = SpacingKey | string;

// Type for colors
type ThemeColor = 
  | 'black' | 'grey' | 'purple' | 'primaryBlue' 
  | 'lightTherapy' | 'lightDiagnostic' | 'lightGrey'
  | 'perBackground' | 'perText' | 'perLine'
  | 'aColour' | 'gColor' | 'aText' | 'gText'
  | 'white'
  | 'grey100' | 'grey200' | 'grey300' | 'grey400' | 'grey500'
  | 'grey600' | 'grey700' | 'grey800' | 'grey900'
  | 'success' | 'warning' | 'error' | 'info';

// Type for typography elements
type TypographySize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'bodySmall';
type TypographyWeight = 'medium' | 'bold';
type TypographyLineHeight = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'bodySmall';

// Type for breakpoints
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Breakpoint values map (matching tailwind.config.js)
const breakpoints: Record<Breakpoint, string> = {
  'xs': '480px',
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
};

/**
 * Get spacing value from theme or use direct value
 * @param value - Space key from theme or direct CSS value
 * @returns CSS spacing value
 */
export const getSpacing = (value: SpacingValue): string => {
  if (typeof value === 'number') {
    return `var(--spacing-${value})`;
  }
  return value as string;
};

/**
 * Create responsive styles with breakpoints
 * @param property - CSS property
 * @param defaultValue - Default value
 * @param breakpointValues - Values for different breakpoints
 * @returns CSS-in-JS styles object
 */
export const responsive = (
  property: string,
  defaultValue: string,
  breakpointValues: Partial<Record<Breakpoint, string>>
): Record<string, string> => {
  const styles: Record<string, string> = {
    [property]: defaultValue,
  };

  Object.entries(breakpointValues).forEach(([breakpoint, value]) => {
    const breakpointSize = breakpoints[breakpoint as Breakpoint];
    styles[`@media (min-width: ${breakpointSize})`] = {
      [property]: value,
    } as unknown as string;
  });

  return styles;
};

/**
 * Combine multiple class names
 * @param classes - Class names to combine
 * @returns Combined class names string with falsy values filtered out
 */
export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get color value from theme or CSS variable
 * @param colorName - Color name from theme
 * @returns CSS color value or CSS variable
 */
export const getColor = (colorName: ThemeColor | string): string => {
  // Convert camelCase to kebab-case for CSS variable
  if (typeof colorName === 'string' && !colorName.startsWith('var(--') && !colorName.startsWith('#')) {
    const kebabCase = colorName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    return `var(--color-${kebabCase})`;
  }
  
  return colorName;
};

/**
 * Get semantic color for visualization components
 * @param category - Category (e.g. 'Therapy', 'Diagnosis')
 * @returns The appropriate color from the theme
 */
export const getVisualizationColor = (category: string): string => {
  const colorMap: Record<string, ThemeColor | string> = {
    'Therapy': 'primaryBlue',
    'Diagnosis': 'purple',
  };
  
  const themeColor = colorMap[category] || 'grey';
  return getColor(themeColor);
};

/**
 * Get a CSS variable for typography
 * @param type - Type of typography value (fontSize, lineHeight)
 * @param size - Size key (h1, h2, body, etc.)
 * @returns CSS variable string
 */
export const getTypographyVar = (
  type: 'fontSize' | 'lineHeight', 
  size: string
): string => {
  const kebabSize = size.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return `var(--${type.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}-${kebabSize})`;
};

/**
 * Get a typography style with proper font-size and line-height using CSS variables
 * @param size - Size key from typography (h1, h2, etc.)
 * @param weight - Weight key (medium, bold)
 * @returns Object with font-size, line-height, font-family and font-weight as CSS variables
 */
export const getTypographyStyle = (
  size: TypographySize | string,
  weight: TypographyWeight | string = 'medium'
): Record<string, string> => {
  const weightStr = typeof weight === 'string' 
    ? weight.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() 
    : weight;
    
  return {
    fontSize: getTypographyVar('fontSize', size),
    lineHeight: getTypographyVar('lineHeight', size),
    fontFamily: 'Helvetica Now Display, sans-serif',
    fontWeight: `var(--font-weight-${weightStr})`,
  };
};

/**
 * Get type scale for responsive typography using CSS variables
 * @param baseSize - Base size key from typography
 * @param breakpoints - Different sizes at different breakpoints
 * @returns Responsive typography styles
 */
export const getResponsiveTypography = (
  baseSize: TypographySize | string,
  breakpointValues: Partial<Record<Breakpoint, TypographySize | string>>
): Record<string, string> => {
  const styles = {
    ...getTypographyStyle(baseSize),
  };
  
  Object.entries(breakpointValues).forEach(([breakpoint, size]) => {
    const breakpointSize = breakpoints[breakpoint as Breakpoint];
    styles[`@media (min-width: ${breakpointSize})`] = {
      ...getTypographyStyle(size),
    } as unknown as string;
  });
  
  return styles;
};

/**
 * Create a function to generate consistent CSS variable strings
 * @param prefix - Variable name prefix
 * @returns Function to create CSS variable with the prefix
 */
export const createCssVarFunction = (prefix: string) => {
  return (name: string) => `var(--${prefix}-${name})`;
};

// Common CSS variable generators using standardized naming
export const colorVar = createCssVarFunction('color');
export const spacingVar = createCssVarFunction('spacing');
export const fontSizeVar = createCssVarFunction('font-size');
export const lineHeightVar = createCssVarFunction('line-height');
export const fontWeightVar = createCssVarFunction('font-weight');

export default {
  getSpacing,
  responsive,
  cn,
  getColor,
  getVisualizationColor,
  getTypographyStyle,
  getResponsiveTypography,
  getTypographyVar,
  colorVar,
  spacingVar,
  fontSizeVar,
  lineHeightVar,
  fontWeightVar,
}; 