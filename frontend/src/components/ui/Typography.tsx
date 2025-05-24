import React from 'react';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'blockquote'
    | 'lead'
    | 'large'
    | 'small'
    | 'muted';
  as?: keyof React.JSX.IntrinsicElements;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({className = '', variant = 'p', as, children, ...props}, ref) => {
    const variantClasses = {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
      h6: 'scroll-m-20 text-base font-semibold tracking-tight',
      p: 'leading-7',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
    };

    const Component = as || variant;

    return React.createElement(
      Component,
      {
        ref: ref as any,
        className: `${variantClasses[variant]} ${className}`,
        ...props,
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

// Convenience components
const H1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='h1' {...props} />
);
const H2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='h2' {...props} />
);
const H3 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='h3' {...props} />
);
const H4 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='h4' {...props} />
);
const H5 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='h5' {...props} />
);
const H6 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='h6' {...props} />
);
const P = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='p' {...props} />
);
const Blockquote = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='blockquote' {...props} />
);
const Lead = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='lead' {...props} />
);
const Large = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='large' {...props} />
);
const Small = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='small' {...props} />
);
const Muted = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant='muted' {...props} />
);

export {
  Typography,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Blockquote,
  Lead,
  Large,
  Small,
  Muted,
};

export type {TypographyProps};
