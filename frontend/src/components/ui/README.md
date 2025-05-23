# UI Component Library

This directory contains a collection of reusable UI components that follow the Astelium design system. These components are built with React and Tailwind CSS, and they provide a consistent look and feel across the application.

## Design System

The design system is defined in `src/design-system.css` and includes:

- **Color Palette**: A premium color palette with primary, secondary, and accent colors
- **Typography**: A consistent typography hierarchy with custom font integration
- **Spacing**: Consistent spacing values for margins, padding, and gaps
- **Shadows**: A set of shadow values for different elevation levels
- **Transitions**: Smooth transitions for interactive elements

## Components

### Button

A versatile button component with different variants, sizes, and states.

```tsx
import { Button } from 'components/ui';

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// Loading state
<Button isLoading>Loading</Button>

// With icons
<Button leftIcon={<Icon />}>Left Icon</Button>
<Button rightIcon={<Icon />}>Right Icon</Button>

// Full width
<Button fullWidth>Full Width</Button>
```

### Card

A card component for displaying content in a contained area.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from 'components/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

### Input

An input component for collecting user input.

```tsx
import { Input } from 'components/ui';

// Basic usage
<Input />

// With label
<Input label="Email" />

// With placeholder
<Input placeholder="Enter your email" />

// With error
<Input error="Please enter a valid email" />

// With helper text
<Input helperText="We'll never share your email with anyone else." />
```

### Typography

A set of typography components for consistent text styling.

```tsx
import { H1, H2, H3, H4, H5, H6, P, Blockquote, Lead, Large, Small, Muted } from 'components/ui';

<H1>Heading 1</H1>
<H2>Heading 2</H2>
<H3>Heading 3</H3>
<H4>Heading 4</H4>
<H5>Heading 5</H5>
<H6>Heading 6</H6>
<P>Paragraph</P>
<Blockquote>Blockquote</Blockquote>
<Lead>Lead paragraph</Lead>
<Large>Large text</Large>
<Small>Small text</Small>
<Muted>Muted text</Muted>
```

### Container

A container component for consistent layout and spacing.

```tsx
import { Container } from 'components/ui';

// Basic usage
<Container>Content</Container>

// Sizes
<Container size="sm">Small</Container>
<Container size="md">Medium</Container>
<Container size="lg">Large</Container>
<Container size="xl">Extra Large</Container>
<Container size="full">Full Width</Container>

// Padding
<Container padding="none">No Padding</Container>
<Container padding="sm">Small Padding</Container>
<Container padding="md">Medium Padding</Container>
<Container padding="lg">Large Padding</Container>

// Not centered
<Container centered={false}>Not Centered</Container>
```

### Grid

A grid component for creating responsive layouts.

```tsx
import { Grid, GridItem } from 'components/ui';

// Basic usage
<Grid cols={2} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
</Grid>

// Responsive columns
<Grid cols={1} colsMd={2} colsLg={3} colsXl={4} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>

// With GridItem for spanning columns
<Grid cols={12} gap="md">
  <GridItem span={12} spanMd={6} spanLg={4}>Item 1</GridItem>
  <GridItem span={12} spanMd={6} spanLg={4}>Item 2</GridItem>
  <GridItem span={12} spanMd={12} spanLg={4}>Item 3</GridItem>
</Grid>
```

### Icons

A set of SVG icons for consistent iconography.

```tsx
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, Minus, X, Check, Search, Edit, Trash, Settings, User, Bell } from 'components/ui';

<ChevronDown />
<ChevronUp />
<ChevronLeft />
<ChevronRight />
<Plus />
<Minus />
<X />
<Check />
<Search />
<Edit />
<Trash />
<Settings />
<User />
<Bell />

// Customizing icons
<User size={32} color="blue" strokeWidth={1.5} />
```

## Usage Guidelines

1. **Consistency**: Use these components consistently throughout the application to maintain a cohesive user experience.
2. **Customization**: Customize components using the provided props rather than adding custom styles.
3. **Accessibility**: Ensure that all components are used in an accessible manner, providing appropriate labels and ARIA attributes.
4. **Responsiveness**: Use the responsive props (e.g., `colsMd`, `spanLg`) to create layouts that work well on all screen sizes.
5. **Dark Mode**: The design system supports both light and dark modes. Test your components in both modes to ensure they look good.
