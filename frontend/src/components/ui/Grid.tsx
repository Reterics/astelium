import React from 'react';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  colsMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  colsLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  colsXl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className = '',
      cols = 1,
      gap = 'md',
      colsMd,
      colsLg,
      colsXl,
      children,
      ...props
    },
    ref
  ) => {
    const colsClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
    };

    const colsMdClasses = colsMd
      ? {
          1: 'md:grid-cols-1',
          2: 'md:grid-cols-2',
          3: 'md:grid-cols-3',
          4: 'md:grid-cols-4',
          5: 'md:grid-cols-5',
          6: 'md:grid-cols-6',
          7: 'md:grid-cols-7',
          8: 'md:grid-cols-8',
          9: 'md:grid-cols-9',
          10: 'md:grid-cols-10',
          11: 'md:grid-cols-11',
          12: 'md:grid-cols-12',
        }
      : {
          1: '',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '',
          8: '',
          9: '',
          10: '',
          11: '',
          12: '',
        };

    const colsLgClasses = colsLg
      ? {
          1: 'lg:grid-cols-1',
          2: 'lg:grid-cols-2',
          3: 'lg:grid-cols-3',
          4: 'lg:grid-cols-4',
          5: 'lg:grid-cols-5',
          6: 'lg:grid-cols-6',
          7: 'lg:grid-cols-7',
          8: 'lg:grid-cols-8',
          9: 'lg:grid-cols-9',
          10: 'lg:grid-cols-10',
          11: 'lg:grid-cols-11',
          12: 'lg:grid-cols-12',
        }
      : {
          1: '',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '',
          8: '',
          9: '',
          10: '',
          11: '',
          12: '',
        };

    const colsXlClasses = colsXl
      ? {
          1: 'xl:grid-cols-1',
          2: 'xl:grid-cols-2',
          3: 'xl:grid-cols-3',
          4: 'xl:grid-cols-4',
          5: 'xl:grid-cols-5',
          6: 'xl:grid-cols-6',
          7: 'xl:grid-cols-7',
          8: 'xl:grid-cols-8',
          9: 'xl:grid-cols-9',
          10: 'xl:grid-cols-10',
          11: 'xl:grid-cols-11',
          12: 'xl:grid-cols-12',
        }
      : {
          1: '',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '',
          8: '',
          9: '',
          10: '',
          11: '',
          12: '',
        };

    const gapClasses = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };

    return (
      <div
        ref={ref}
        className={`grid ${colsClasses[cols]} ${colsMd ? colsMdClasses[colsMd] : ''} ${
          colsLg ? colsLgClasses[colsLg] : ''
        } ${colsXl ? colsXlClasses[colsXl] : ''} ${gapClasses[gap]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spanMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spanLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spanXl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({className = '', span, spanMd, spanLg, spanXl, children, ...props}, ref) => {
    const spanClasses = span
      ? {
          1: 'col-span-1',
          2: 'col-span-2',
          3: 'col-span-3',
          4: 'col-span-4',
          5: 'col-span-5',
          6: 'col-span-6',
          7: 'col-span-7',
          8: 'col-span-8',
          9: 'col-span-9',
          10: 'col-span-10',
          11: 'col-span-11',
          12: 'col-span-12',
        }
      : {
          1: '',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '',
          8: '',
          9: '',
          10: '',
          11: '',
          12: '',
        };

    const spanMdClasses = spanMd
      ? {
          1: 'md:col-span-1',
          2: 'md:col-span-2',
          3: 'md:col-span-3',
          4: 'md:col-span-4',
          5: 'md:col-span-5',
          6: 'md:col-span-6',
          7: 'md:col-span-7',
          8: 'md:col-span-8',
          9: 'md:col-span-9',
          10: 'md:col-span-10',
          11: 'md:col-span-11',
          12: 'md:col-span-12',
        }
      : {
          1: '',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '',
          8: '',
          9: '',
          10: '',
          11: '',
          12: '',
        };

    const spanLgClasses = spanLg
      ? {
          1: 'lg:col-span-1',
          2: 'lg:col-span-2',
          3: 'lg:col-span-3',
          4: 'lg:col-span-4',
          5: 'lg:col-span-5',
          6: 'lg:col-span-6',
          7: 'lg:col-span-7',
          8: 'lg:col-span-8',
          9: 'lg:col-span-9',
          10: 'lg:col-span-10',
          11: 'lg:col-span-11',
          12: 'lg:col-span-12',
        }
      : {
          1: '',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '',
          8: '',
          9: '',
          10: '',
          11: '',
          12: '',
        };

    const spanXlClasses = spanXl
      ? {
          1: 'xl:col-span-1',
          2: 'xl:col-span-2',
          3: 'xl:col-span-3',
          4: 'xl:col-span-4',
          5: 'xl:col-span-5',
          6: 'xl:col-span-6',
          7: 'xl:col-span-7',
          8: 'xl:col-span-8',
          9: 'xl:col-span-9',
          10: 'xl:col-span-10',
          11: 'xl:col-span-11',
          12: 'xl:col-span-12',
        }
      : {
          1: '',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '',
          8: '',
          9: '',
          10: '',
          11: '',
          12: '',
        };

    return (
      <div
        ref={ref}
        className={`${span ? spanClasses[span] : ''} ${spanMd ? spanMdClasses[spanMd] : ''} ${
          spanLg ? spanLgClasses[spanLg] : ''
        } ${spanXl ? spanXlClasses[spanXl] : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';

export {Grid, GridItem};
export type {GridProps, GridItemProps};
