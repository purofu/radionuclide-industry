# Radioisotope Data Visualization Style Guide

This style guide defines the design system using Tailwind CSS for the radioisotope data visualization application.

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Theme Configuration](#theme-configuration)
   - [Colors](#colors)
   - [Typography](#typography)
   - [Spacing](#spacing)
   - [Breakpoints](#breakpoints)
3. [Common Patterns](#common-patterns)
   - [Layouts](#layouts)
   - [Components](#components)
   - [Data Visualization](#data-visualization)
4. [Usage Guidelines](#usage-guidelines)

## Design Philosophy

The application follows a clean, professional aesthetic with a focus on data clarity and scientific precision. The design aims to:
- Present complex radioisotope data in an accessible, visually appealing format
- Maintain consistency across components and visualizations
- Support intuitive navigation and interaction with data
- Scale appropriately across device sizes

## Theme Configuration

> **Note:** Our theme is now fully Tailwind-focused. CSS variables are defined in `globals.css` and consumed by Tailwind in `tailwind.config.js`.

### Colors

All colors are configured in the Tailwind theme and defined as CSS variables in globals.css:

```js
// tailwind.config.js (referencing CSS variables from globals.css)
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'black': 'var(--color-black)', // #25332b
        'grey': 'var(--color-grey)', // #86898e
        'purple': 'var(--color-purple)', // #6f608f
        'primary-blue': 'var(--color-primary-blue)', // #0000ff
        
        // Secondary Colors
        'light-therapy': 'var(--color-light-therapy)', // #ebeef4
        'light-diagnostic': 'var(--color-light-diagnostic)', // #d8cece
        'light-grey': 'var(--color-light-grey)', // #e3e3e3
        
        // Periodic Table Colors
        'per-background': 'var(--color-per-background)', // #302a38
        'per-text': 'var(--color-per-text)', // #9aa1ba
        'per-line': 'var(--color-per-line)', // #645a71
        
        // Data Specific Colors
        'a-colour': 'var(--color-a-colour)', // #2ffbcf
        'g-color': 'var(--color-g-color)', // #dfff2f
        'a-text': 'var(--color-a-text)', // #5164df
        'g-text': 'var(--color-g-text)', // #5a3ee3
      }
    }
  }
}
```

**Usage:**
```html
<div class="text-black bg-light-therapy">
  <span class="text-a-text">Alpha content</span>
</div>
```

### Typography

Typography uses Tailwind's font size, line height, and font weight utilities which reference CSS variables:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'helvetica-now': ['Helvetica Now Display', 'sans-serif'],
      },
      fontSize: {
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
        }],
        'body-small': ['var(--font-size-body-small)', {
          lineHeight: 'var(--line-height-body-small)',
          fontWeight: 'var(--font-weight-medium)',
        }],
      }
    }
  }
}
```

**Usage:**
```html
<h2 class="font-helvetica-now text-h2">Heading</h2>
<p class="font-helvetica-now text-body">Body text</p>
```

### Spacing

Spacing follows a consistent scale defined in CSS variables and referenced in Tailwind:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        0: 'var(--spacing-0)', // 0
        1: 'var(--spacing-1)', // 4px
        2: 'var(--spacing-2)', // 8px
        3: 'var(--spacing-3)', // 12px
        4: 'var(--spacing-4)', // 16px
        6: 'var(--spacing-6)', // 24px
        8: 'var(--spacing-8)', // 32px
        12: 'var(--spacing-12)', // 48px
        16: 'var(--spacing-16)', // 64px
        20: 'var(--spacing-20)', // 80px
        24: 'var(--spacing-24)', // 96px
        32: 'var(--spacing-32)', // 128px
      }
    }
  }
}
```

**Usage:**
```html
<!-- Uses Tailwind spacing utilities referencing our variables -->
<div class="p-4 mb-8 gap-6">Content</div>
```

### Breakpoints

Using Tailwind's default breakpoints:

- `sm`: 640px (Small devices, phones in landscape)
- `md`: 768px (Medium devices, tablets)
- `lg`: 1024px (Large devices, desktops)
- `xl`: 1280px (Extra large devices)
- `2xl`: 1536px (Very large screens)

**Usage:**
```html
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  <!-- Responsive grid that adapts to screen size -->
</div>
```

### Other Theme Properties

Additional theme properties like `borderRadius`, `boxShadow`, `zIndex`, `transitionDuration`, and `transitionTimingFunction` are also defined in the Tailwind configuration.

## Common Patterns

### Layouts

#### Standard Section Layout

```html
<section class="py-8 md:py-12 lg:py-16">
  <div class="container mx-auto px-4 md:px-6">
    <div class="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-4 md:gap-6">
      <!-- Content goes here -->
    </div>
  </div>
</section>
```

#### Introduction Section

```html
<section class="py-12 md:py-16 lg:py-24">
  <div class="container mx-auto px-4 md:px-6">
    <div class="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-6 md:gap-8">
      <!-- Title Area -->
      <div class="col-span-4 sm:col-span-8 md:col-span-5">
        <h5 class="text-h5 text-grey mb-4">Subtitle</h5>
        <h2 class="text-h2 text-black mb-6">Main Title</h2>
        <p class="text-body text-black">Description text</p>
      </div>
      
      <!-- Chart Area -->
      <div class="col-span-4 sm:col-span-8 md:col-span-7 h-[300px] md:h-[400px]">
        <!-- Chart visualization -->
      </div>
    </div>
  </div>
</section>
```

#### Two-Column Data Display

```html
<div class="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-8">
  <!-- Left Column -->
  <div class="col-span-4 md:col-span-6">
    <h5 class="text-h5 font-helvetica-now text-black mb-6">Column Title</h5>
    
    <div class="flex flex-col gap-8">
      <!-- Category Items -->
    </div>
  </div>
  
  <!-- Right Column -->
  <div class="col-span-4 md:col-span-6">
    <!-- Similar structure -->
  </div>
</div>
```

### Components

#### Cards

##### Data Card

```html
<div class="bg-white rounded-lg shadow-md p-4 md:p-6">
  <h4 class="text-h4 font-helvetica-now font-bold text-black mb-4">Card Title</h4>
  <div class="text-body text-grey">Card content</div>
</div>
```

##### Stat Card

```html
<div class="bg-white rounded-lg shadow-md p-4 md:p-6">
  <h5 class="text-h5 font-helvetica-now text-black mb-6">Metric Title</h5>
  <div class="flex flex-col items-end">
    <span class="text-h3 font-medium text-black">123</span>
    <span class="text-body-small text-grey">Description</span>
  </div>
</div>
```

#### Tabs

```html
<div class="flex space-x-2 mb-6">
  <button class="px-4 py-2 rounded-md bg-black text-white">Active Tab</button>
  <button class="px-4 py-2 rounded-md bg-light-grey text-black hover:bg-grey/20">Inactive Tab</button>
</div>
```

#### Scrollable Container

```html
<div class="overflow-y-auto h-[400px] pr-2 scrollbar-thin scrollbar-thumb-grey/30 scrollbar-track-light-grey">
  <!-- List items here -->
</div>
```

### Data Visualization

#### Periodic Table Elements

```html
<div class="grid grid-cols-18 gap-1">
  <!-- Element Tile -->
  <div class="w-7 h-7 md:w-8 md:h-8 bg-per-background text-per-text flex flex-col items-center justify-center relative">
    <span class="absolute top-0.5 left-0.5 text-[8px]">1</span>
    <span class="text-[12px] font-bold">H</span>
    <span class="absolute bottom-0.5 right-0.5 text-[8px]">1.0</span>
  </div>
  <!-- Additional elements -->
</div>
```

#### Tooltip

```html
<div class="bg-black text-white rounded-md shadow-lg p-3 max-w-xs">
  <h6 class="font-medium mb-1">Tooltip Title</h6>
  <p class="text-body-small">Tooltip content with detailed information</p>
</div>
```

## Usage Guidelines

### General Principles

1. **Tailwind-First Approach**
   - Use Tailwind utility classes for styling needs
   - Use CSS variables for theming via Tailwind's configuration
   - Avoid custom CSS when possible

2. **Maintain Consistency**
   - Use the same spacing, colors, and type scales throughout the app
   - Follow the patterns in this guide for layout and components

3. **Responsive Design**
   - Start with mobile design and enhance for larger screens
   - Use responsive utilities (sm:, md:, lg:, xl:) consistently

### Best Practices

- Group related utilities logically (positioning, sizing, typography, colors, etc.)
- Extract common patterns to components for reusability
- Use Tailwind's `@apply` directive in component styles only when absolutely necessary
- Follow mobile-first responsive approach
- Use semantic HTML elements appropriately

### Example Implementation

Here's how to implement a section with cards using the design system:

```jsx
import React from 'react';
import { cn } from '../theme/utils';

export function DataSection({ title, items, className }) {
  return (
    <section className={cn("py-8 md:py-12", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-h2 font-helvetica-now text-black mb-8">{title}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h4 className="text-h4 font-helvetica-now text-black mb-4">{item.title}</h4>
              <p className="text-body text-grey mb-4">{item.description}</p>
              {item.value && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-light-grey">
                  <span className="text-body-small text-grey">Value:</span>
                  <span className="text-h5 text-black">{item.value}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 