# Styling System Documentation

This document provides guidance on how to use the styling system in the Radioisotope Data Visualization application.

## Overview

Our styling system is built on top of Tailwind CSS with additional abstractions for component-level consistency. The system has three main parts:

1. **Theme Configuration**: Core design tokens and values
2. **Component Styles**: Reusable styling patterns for components
3. **Utility Functions**: Helper functions for working with styles

## Getting Started

### Basic Usage

The most common way to use our styling system is through the component styles utility:

```tsx
import styles from "@/theme/components";

const MyComponent = () => {
  return (
    <section className={styles.section.wrapper()}>
      <div className={styles.section.container()}>
        <h2 className={styles.section.title()}>My Section</h2>
        
        {/* Content goes here */}
        
      </div>
    </section>
  );
};
```

### Extending Styles

You can extend predefined styles by passing a string parameter:

```tsx
<div className={styles.card.base("my-custom-class")}>
  Card content
</div>
```

This approach adds your custom class to the predefined styles.

## Core Components

### Sections

Use these for consistent page sections:

```tsx
<section className={styles.section.wrapper()}>
  <div className={styles.section.container()}>
    <h2 className={styles.section.title()}>Section Title</h2>
    <p className={styles.section.subtitle()}>Section subtitle text</p>
    
    {/* Content */}
    
  </div>
</section>
```

### Cards

For card-based layouts:

```tsx
<div className={styles.card.base(styles.card.hover())}>
  <h3 className={styles.typography.cardTitle()}>Card Title</h3>
  <p className={styles.typography.cardBody()}>Card content</p>
</div>
```

### Tabs

For tab interfaces:

```tsx
<div className={styles.tabs.container()}>
  {tabs.map(tab => (
    <button 
      key={tab.id}
      className={styles.tabs.button(activeTab === tab.id)} 
      onClick={() => setActiveTab(tab.id)}
    >
      {tab.label}
    </button>
  ))}
</div>
```

### Grids

Responsive grid layouts:

```tsx
<div className={styles.grid.four()}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

### Typography

Consistent text styling:

```tsx
<h1 className={styles.typography.displayValue()}>45</h1>
<span className={styles.typography.displayLabel()}>clinical trials</span>
<p className={styles.typography.cardBody()}>Descriptive text here</p>
```

### Status Indicators

For loading, error, and empty states:

```tsx
{isLoading && (
  <div className={styles.status.loading()}>
    <p>Loading data...</p>
  </div>
)}

{error && (
  <div className={styles.status.error()}>
    <p>{error}</p>
  </div>
)}

{items.length === 0 && !isLoading && (
  <div className={styles.status.empty()}>
    <p>No items found</p>
  </div>
)}
```

### Badges

For pill-style indicators:

```tsx
<div className={styles.badge.base(styles.badge.disease())}>
  <span>5 Diseases</span>
</div>
```

### Visualization Components

For data visualization elements:

```tsx
<div className={styles.viz.container()}>
  {/* Visualization content */}
  
  <div className={styles.viz.legend.item()}>
    <div className={styles.viz.legend.color("bg-primary-blue")}></div>
    <span>Legend label</span>
  </div>
</div>
```

### Animations

For motion effects:

```tsx
<div className={styles.motion.fadeIn()}>
  This content will fade in
</div>

<div className={styles.motion.fadeUp()}>
  This content will fade up and in
</div>
```

## Best Practices

1. **Component-First Approach**: Use the component styles for consistency rather than building styles from scratch with Tailwind classes

2. **Responsive Design**: The component styles are already responsive, but you can extend them for specific cases

3. **Theme Consistency**: Follow the style guide for colors, spacing, and typography

4. **Composability**: Combine style functions for more complex components

5. **Documentation**: When creating new component styles, add them to the styling system with proper documentation

## See Also

- [StyleGuide.md](./StyleGuide.md) - Comprehensive style guide
- [components.ts](./components.ts) - Component styling utility
- [config.ts](./config.ts) - Theme configuration
- [utils.ts](./utils.ts) - Style utility functions

For examples of implementation, see:
- `src/app/component/RefactoredTargetDisplay.tsx` 