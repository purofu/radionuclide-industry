/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main colors from the style guide using CSS variables
        'black': 'var(--color-black)',
        'grey': 'var(--color-grey)',
        'purple': 'var(--color-purple)',
        'primary-blue': 'var(--color-primary-blue)',
        
        // Secondary Colors
        'light-therapy': 'var(--color-light-therapy)',
        'light-diagnostic': 'var(--color-light-diagnostic)',
        'light-grey': 'var(--color-light-grey)',
        
        // Periodic Table Colors
        'per-background': 'var(--color-per-background)',
        'per-text': 'var(--color-per-text)',
        'per-line': 'var(--color-per-line)',
        
        // Data Specific Colors
        'a-colour': 'var(--color-a-colour)',
        'g-color': 'var(--color-g-color)',
        'a-text': 'var(--color-a-text)',
        'g-text': 'var(--color-g-text)',
        
        // Grey scale
        'grey-100': 'var(--color-grey-100)',
        'grey-200': 'var(--color-grey-200)',
        'grey-300': 'var(--color-grey-300)',
        'grey-400': 'var(--color-grey-400)',
        'grey-500': 'var(--color-grey-500)',
        'grey-600': 'var(--color-grey-600)',
        'grey-700': 'var(--color-grey-700)',
        'grey-800': 'var(--color-grey-800)',
        'grey-900': 'var(--color-grey-900)',
        
        // Semantic colors
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'error': 'var(--color-error)',
        'info': 'var(--color-info)',
        
        // White is also defined as a variable for consistency
        'white': 'var(--color-white)',
      },
      
      fontFamily: {
        'helvetica-now': ['Helvetica Now Display', 'sans-serif'],
      },
      
      fontSize: {
        // Typography scale using CSS variables
        'h1': ['var(--font-size-h1)', {
          lineHeight: 'var(--line-height-h1)',
          fontWeight: 'var(--font-weight-medium)',
        }],
        'h2': ['var(--font-size-h2)', {
          lineHeight: 'var(--line-height-h2)',
          fontWeight: 'var(--font-weight-medium)',
        }],
        'h3': ['var(--font-size-h3)', {
          lineHeight: 'var(--line-height-h3)',
          fontWeight: 'var(--font-weight-medium)',
        }],
        'h4': ['var(--font-size-h4)', {
          lineHeight: 'var(--line-height-h4)',
          fontWeight: 'var(--font-weight-bold)',
        }],
        'h5': ['var(--font-size-h5)', {
          lineHeight: 'var(--line-height-h5)',
          fontWeight: 'var(--font-weight-medium)',
        }],
        'body': ['var(--font-size-body)', {
          lineHeight: 'var(--line-height-body)',
          fontWeight: 'var(--font-weight-medium)',
          letterSpacing: '0px',
          paragraphSpacing: '12px',
        }],
        'body-small': ['var(--font-size-body-small)', {
          lineHeight: 'var(--line-height-body-small)',
          fontWeight: 'var(--font-weight-medium)',
          letterSpacing: '0px',
          paragraphSpacing: '6px',
        }],
      },
      
      spacing: {
        // Spacing scale using CSS variables
        0: 'var(--spacing-0)',
        1: 'var(--spacing-1)',
        2: 'var(--spacing-2)',
        3: 'var(--spacing-3)',
        4: 'var(--spacing-4)',
        6: 'var(--spacing-6)',
        8: 'var(--spacing-8)',
        10: '40px',
        12: 'var(--spacing-12)',
        16: 'var(--spacing-16)',
        20: 'var(--spacing-20)',
        24: 'var(--spacing-24)',
        32: 'var(--spacing-32)',
        // Additional spacing values for specific components
        '[73px]': '73px',
        '[325px]': '325px',
        '[50px]': '50px',
        '[50vw]': '50vw',
      },
      
      backgroundImage: {
        'grey-to-white': 'linear-gradient(137.72deg, #ffffff 0%, #fafafa 100%)',
        'white-to-grey': 'linear-gradient(to bottom, #ffffff 0%, #FAFAFA 100%)',
      },
      
      gridTemplateColumns: {
        // Standardized grid columns matching the style guide
        // 4-column grid on mobile, 8-column on tablet, 12-column on desktop
        '1': 'repeat(1, minmax(0, 1fr))',
        '4': 'repeat(4, minmax(0, 1fr))',
        '8': 'repeat(8, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
        // Adding periodic table column support
        '18': 'repeat(18, minmax(0, 1fr))',
      },
      
      // Grid column span values for specific layouts
      gridColumn: {
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
        'span-5': 'span 5 / span 5',
        'span-6': 'span 6 / span 6',
        'span-7': 'span 7 / span 7',
        'span-8': 'span 8 / span 8',
        'span-9': 'span 9 / span 9',
        'span-10': 'span 10 / span 10',
        'span-11': 'span 11 / span 11',
        'span-12': 'span 12 / span 12',
      },
      
      // Additional configurations from theme/config.ts
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'full': '9999px',
      },
      
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      
      zIndex: {
        '0': 0,
        '10': 10,
        '20': 20,
        '30': 30,
        '40': 40,
        '50': 50,
        'auto': 'auto',
        'modal': 1000,
        'tooltip': 1100,
      },
      
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      
      transitionTimingFunction: {
        'ease': 'ease',
        'linear': 'linear',
        'ease-in': 'ease-in',
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
      },
      
      maxWidth: {
        'content': 'var(--max-content-width)',
        '[325px]': '325px',
      },
      
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    function({ addUtilities }) {
      const newUtilities = {
        '.mask-fade-bottom': {
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
        },
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbarWidth': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        // Add utilities for grid layouts
        '.grid-auto-rows-min': {
          gridAutoRows: 'min-content',
        },
        '.grid-auto-cols-min': {
          gridAutoColumns: 'min-content',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}