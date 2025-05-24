import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'interactive' | 'flat';
  isHoverable?: boolean;
  isClickable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = '',
      children,
      variant = 'default',
      isHoverable = false,
      isClickable = false,
      ...props
    },
    ref
  ) => {
    // Base styles that apply to all variants
    const baseStyles =
      'bg-white text-zinc-900 rounded-lg overflow-hidden transition-all duration-200';

    // Variant-specific styles
    const variantStyles = {
      default: 'border border-zinc-200 shadow-sm',
      outlined: 'border border-zinc-200',
      elevated: 'border border-zinc-100 shadow-md',
      interactive:
        'border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 cursor-pointer',
      flat: 'bg-zinc-50 border-none',
    };

    // Hover effect (only if isHoverable is true)
    const hoverStyles = isHoverable
      ? 'hover:shadow-md hover:translate-y-[-2px]'
      : '';

    // Clickable effect (only if isClickable is true)
    const clickableStyles = isClickable
      ? 'cursor-pointer active:shadow-inner active:translate-y-[1px]'
      : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${clickableStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  bordered?: boolean;
  compact?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {className = '', children, bordered = false, compact = false, ...props},
    ref
  ) => {
    const paddingClass = compact ? 'p-4' : 'p-6';
    const borderClass = bordered ? 'border-b border-zinc-200' : '';

    return (
      <div
        ref={ref}
        className={`flex flex-col space-y-2 ${paddingClass} ${borderClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({className = '', children, size = 'md', ...props}, ref) => {
    const sizeClasses = {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
    };

    return (
      <h3
        ref={ref}
        className={`${sizeClasses[size]} font-semibold leading-tight text-zinc-900 ${className}`}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({className = '', children, ...props}, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-zinc-500 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '2/3' | '3/4';
  overlay?: boolean;
  position?: 'top' | 'bottom';
}

const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  (
    {
      className = '',
      children,
      src,
      alt = '',
      aspectRatio = '16/9',
      overlay = false,
      position = 'top',
      ...props
    },
    ref
  ) => {
    const aspectRatioClass = {
      '16/9': 'aspect-video',
      '4/3': 'aspect-[4/3]',
      '1/1': 'aspect-square',
      '2/3': 'aspect-[2/3]',
      '3/4': 'aspect-[3/4]',
    };

    const positionClass = position === 'top' ? 'rounded-t-lg' : 'rounded-b-lg';

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${aspectRatioClass[aspectRatio]} ${positionClass} ${className}`}
        {...props}
      >
        {src && (
          <img src={src} alt={alt} className='w-full h-full object-cover' />
        )}
        {overlay && (
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'>
            {children}
          </div>
        )}
        {!overlay && children}
      </div>
    );
  }
);

CardMedia.displayName = 'CardMedia';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  compact?: boolean;
  padded?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (
    {className = '', children, compact = false, padded = true, ...props},
    ref
  ) => {
    const paddingClass = !padded ? '' : compact ? 'p-4' : 'p-6';
    const paddingTopClass = padded ? 'pt-0' : '';

    return (
      <div
        ref={ref}
        className={`${paddingClass} ${paddingTopClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  bordered?: boolean;
  compact?: boolean;
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (
    {
      className = '',
      children,
      bordered = false,
      compact = false,
      align = 'between',
      ...props
    },
    ref
  ) => {
    const paddingClass = compact ? 'p-4' : 'p-6';
    const borderClass = bordered ? 'border-t border-zinc-200' : '';
    const alignmentClass = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    return (
      <div
        ref={ref}
        className={`flex items-center ${alignmentClass[align]} ${paddingClass} ${borderClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardMedia,
  CardContent,
  CardFooter,
};
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardMediaProps,
  CardContentProps,
  CardFooterProps,
};
