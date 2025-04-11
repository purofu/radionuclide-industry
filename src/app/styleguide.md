# Design System Styleguide

## Components

### DataTabs Component

The DataTabs component is a reusable UI element for toggling between different datasets in visualizations.

```tsx
// Usage Example
import { DataTabs } from './component/DataTabs';

const MyComponent = () => {
  const [activeTab, setActiveTab] = useState<'trials' | 'companies'>('trials');
  
  return (
    <DataTabs 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
    />
  );
};
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| activeTab | string | The currently active tab ('trials' or 'companies') |
| setActiveTab | function | Callback function to update the active tab |

#### Styling

- Active tab: Black background with white text
- Inactive tab: Light grey background with black text
- Font: Helvetica Now in text-body-small size
- Rounded corners: border-radius from the rounded-md class
- Animation: Fades in with a slight upward movement

## Colors

### Text Colors
- `text-a-text-colour`: Used for α-Particle related text
- `text-g-text-colour`: Used for γ-Particle related text

### Background Colors
- `bg-a-colour`: Used for α-Particle bars in charts
- `bg-primary-blue`: Used for β-Particle bars in charts
- `bg-purple`: Used for Positron emitter bars in charts
- `bg-g-color`: Used for γ-Particle bars in charts
- `bg-light-therapy`: Light background for therapy tags
- `bg-light-diagnostic`: Light background for diagnostic tags

## Data Visualization

### Bar Charts

Bar charts should dynamically resize based on data values:

1. Calculate the maximum value in the dataset
2. Scale all bars relative to the maximum value
3. Use a consistent maximum height for the chart (500px recommended)
4. Include smooth growth animations using Framer Motion
5. Use consistent text styling for values and labels

```tsx
// Example of dynamic height calculation
const calculateHeight = (value: number) => {
  const maxValue = getMaxValue();
  const heightPercentage = (value / maxValue) * 100;
  return Math.round((heightPercentage / 100) * 448);
};
```

## Layout Guidelines

### Dividers
- Use full-bleed dividers for major section separations: `w-screen -mx-4`
- Use contained dividers for subsections: `w-full`
- All dividers should use `border-t border-light-grey` for consistent styling

### Spacing
- Header spacing: `h-32 md:h-40`
- Section padding: `py-12 md:py-24`
- Inner content padding: `px-8 md:px-16 lg:px-24` 