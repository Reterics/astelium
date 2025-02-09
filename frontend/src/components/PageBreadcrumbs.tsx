interface PageBreadcrumbsProps {
  title: string;
  breadcrumbs: string[];
}

const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({
  title,
  breadcrumbs,
}) => {
  return (
    <div className='flex justify-between items-center mb-4 p-2 bg-zinc-100 border-b border-zinc-300'>
      <h1 className='text-lg font-semibold text-zinc-800'>{title}</h1>
      <nav className='text-sm text-zinc-600'>
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            {index > 0 && ' / '}
            {crumb}
          </span>
        ))}
      </nav>
    </div>
  );
};

export default PageBreadcrumbs;
