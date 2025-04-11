/**
 * Component Style System
 * Reusable styling patterns for components across the application
 */

import { cn, colorVar, spacingVar, fontSizeVar, lineHeightVar, fontWeightVar } from './utils';

/***************************************
 * LAYOUT COMPONENTS
 ***************************************/

/**
 * Section styles - consistent container layouts
 */
export const section = {
  wrapper: (className = "") => 
    cn("w-full py-12 md:py-16 lg:py-20", className),
  
  container: (className = "") => 
    cn("max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24", className),
  
  grid: (className = "") => 
    cn("grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12", className),
  
  title: (className = "") => 
    cn("text-h2 md:text-h1 text-black mb-6 md:mb-8", className),
  
  subtitle: (className = "") => 
    cn("text-h3 text-grey mb-8 md:mb-10", className),
  
  introduction: (className = "") => 
    cn("grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 my-24 md:my-32", className),
  
  introContent: (className = "") => 
    cn("col-span-4 sm:col-span-6 md:col-span-8", className),
  
  divider: (className = "") => 
    cn("w-full border-t border-light-grey my-8 md:my-12", className),
    
  // Adding margin and padding utilities
  mb: (className = "") => 
    cn("mb-12 md:mb-16 lg:mb-20", className),
    
  mt: (className = "") => 
    cn("mt-12 md:mt-16 lg:mt-20", className),
    
  py: (className = "") => 
    cn("py-12 md:py-16 lg:py-20", className),
    
  fullSpan: (className = "") => 
    cn("col-span-4 sm:col-span-8 md:col-span-12", className),
    
  titleContainer: (className = "") => 
    cn("mb-10 md:mb-12", className),
};

/**
 * Grid layout styles - responsive grid layouts
 * Using standardized 12-column grid system
 */
export const grid = {
  two: (className = "") => 
    cn("grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8", className),
  
  three: (className = "") => 
    cn("grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8", className),
  
  four: (className = "") => 
    cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8", className),
  
  // Added more specific column spans for the 12-column grid system
  span: (columns: number, {sm, md, lg}: {sm?: number, md?: number, lg?: number} = {}, className = "") => {
    const baseClass = `col-span-${Math.min(4, columns)}`;
    const smClass = sm ? `sm:col-span-${Math.min(8, sm)}` : '';
    const mdClass = md ? `md:col-span-${Math.min(12, md)}` : '';
    const lgClass = lg ? `lg:col-span-${Math.min(12, lg)}` : '';
    
    return cn(baseClass, smClass, mdClass, lgClass, className);
  }
};

/**
 * Layout utility components
 */
export const layout = {
  responsive: {
    hidden: {
      mobile: "hidden sm:block",
      tablet: "hidden md:block",
      desktop: "hidden lg:block",
    },
    visible: {
      onlyMobile: "sm:hidden",
      onlyTablet: "hidden sm:block md:hidden",
      onlyDesktop: "hidden md:block",
    }
  },
  spacing: {
    section: "py-12 md:py-16 lg:py-20",
    container: "px-4 sm:px-8 md:px-12 lg:px-16",
  },
  background: {
    gradientGreyWhite: "bg-grey-to-white",
  }
};

/***************************************
 * UI COMPONENTS
 ***************************************/

/**
 * Card styles - consistently styled containers
 */
export const card = {
  base: (className = "") => 
    cn("bg-white rounded outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col", className),
  
  data: (className = "") => 
    cn("flex flex-col rounded-md border border-light-grey bg-white p-6", className),
  
  stat: (className = "") => 
    cn("flex flex-col rounded-md border border-light-grey bg-white p-6", className),
  
  hover: (className = "") => 
    cn("transition-shadow duration-150 ease-in-out hover:shadow-lg", className),
  
  statValueContainer: (className = "") => 
    cn("flex flex-col items-end w-full", className),
};

/**
 * Tab styles - consistent tab interfaces
 */
export const tabs = {
  container: (className = "") => 
    cn("flex flex-wrap justify-center gap-2 mb-6 md:mb-8", className),
  
  button: (isActive: boolean, className = "") => 
    cn(
      "px-4 py-2 rounded-md text-body-small font-helvetica-now transition-colors duration-150 ease-in-out",
      isActive 
        ? "bg-black text-white" 
        : "bg-gray-200 text-black hover:bg-gray-400 hover:text-white",
      className
    ),
};

/**
 * Badge styles - consistent badge components
 */
export const badge = {
  base: (className = "") => 
    cn("px-3 py-1 rounded-full flex justify-center items-center gap-1.5", className),
  
  disease: (className = "") => 
    cn("bg-light-diagnostic cursor-help", className),
  
  company: (className = "") => 
    cn("bg-light-grey cursor-help", className),
};

/***************************************
 * TYPOGRAPHY COMPONENTS
 ***************************************/

/**
 * Typography styles - text components with consistent styling using CSS variables
 */
export const typography = {
  displayValue: (className = "") => 
    cn("text-black text-7xl lg:text-8xl font-medium font-helvetica-now leading-tight", className),
  
  displayLabel: (colorClass: string = "text-black", className = "") => 
    cn(`${colorClass} text-xs md:text-sm font-medium font-helvetica-now leading-none`, className),
  
  cardTitle: (className = "") => 
    cn("text-black text-4xl md:text-5xl font-medium font-helvetica-now leading-tight", className),
  
  cardSubtitle: (className = "") => 
    cn("text-black text-lg font-bold font-helvetica-now leading-tight", className),
  
  cardBody: (className = "") => 
    cn("text-black text-sm font-medium font-helvetica-now leading-snug", className),
  
  introSubtitle: (className = "") => 
    cn("text-h5 font-helvetica-now text-grey mb-6", className),
    
  introTitle: (className = "") => 
    cn("text-h2 font-helvetica-now text-black mb-6", className),
    
  introBody: (className = "") => 
    cn("text-h5 font-helvetica-now text-grey", className),
  
  statTitle: (className = "") => 
    cn("text-black text-lg font-bold font-helvetica-now leading-tight mb-6", className),
  
  // Body text styles
  body: (className = "") => 
    cn("text-body font-helvetica-now", className),
    
  bodySmall: (className = "") => 
    cn("text-body-small font-helvetica-now", className),
  
  // Added inline style helpers for D3 visualizations
  getInlineStyleD3: (size: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'bodySmall', weight: 'medium' | 'bold' = 'medium') => {
    return {
      fontSize: fontSizeVar(size.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()),
      lineHeight: lineHeightVar(size.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()),
      fontFamily: "'Helvetica Now Display', sans-serif",
      fontWeight: fontWeightVar(weight),
    };
  }
};

/***************************************
 * VISUALIZATION COMPONENTS
 ***************************************/

/**
 * Data visualization styles - consistent data display elements
 */
export const viz = {
  container: (className = "") => 
    cn("bg-white rounded-md p-6 border border-light-grey", className),
  
  tooltip: (className = "") => 
    cn("bg-black text-white p-3 rounded-md shadow-lg text-xs max-w-xs z-50", className),
  
  legend: {
    item: (className = "") => 
      cn("flex items-center text-xs font-medium text-black mb-2", className),
    
    color: (color: string, className = "") => {
      const bgColor = color.startsWith('var(') ? color : `var(--color-${color})`;
      return {
        className: cn(`w-4 h-4 mr-2 rounded-sm border border-gray-300`, className),
        style: { backgroundColor: bgColor }
      };
    }
  },
  
  // D3 visualization helpers using original color names
  d3Colors: {
    getCategoryColor: (category: string): string => {
      // Map category names to CSS variable colors
      const colorMap: Record<string, string> = {
        'Therapy': 'var(--color-primary-blue)',
        'Diagnosis': 'var(--color-purple)',
      };
      return colorMap[category] || 'var(--color-grey)';
    },
    
    getAlphaColor: (): string => {
      return 'var(--color-a-colour)';
    },
    
    getGammaColor: (): string => {
      return 'var(--color-g-color)';
    },
    
    getAlphaTextColor: (): string => {
      return 'var(--color-a-text)';
    },
    
    getGammaTextColor: (): string => {
      return 'var(--color-g-text)';
    },
    
    getSubcategoryColor: (category: string, subcategory: string, index: number): string => {
      // Get base color
      const baseColor = category === 'Therapy' 
        ? 'var(--color-primary-blue)' 
        : 'var(--color-purple)';
      
      // Return opacity version for CSS if needed
      return baseColor;
    }
  }
};

/***************************************
 * ANIMATION COMPONENTS
 ***************************************/

/**
 * Motion and animation styles
 */
export const motion = {
  fadeIn: (className = "") => 
    cn("opacity-0 animate-[fade-in_0.5s_ease-in-out_forwards]", className),
  
  fadeUp: (className = "") => 
    cn("opacity-0 translate-y-4 animate-[fade-up_0.6s_ease-out_forwards]", className),
};

/**
 * Status indicator styles - consistent loading, error states
 */
export const status = {
  loading: (className = "") => 
    cn("text-center p-6 text-body text-gray-500", className),
  
  error: (className = "") => 
    cn("mb-4 p-4 bg-red-100 text-red-700 rounded-md text-center", className),
  
  empty: (className = "") => 
    cn("text-center p-10 text-gray-500", className),
};

export default {
  section,
  card,
  tabs,
  grid,
  viz,
  badge,
  typography,
  motion,
  status,
  layout
}; 