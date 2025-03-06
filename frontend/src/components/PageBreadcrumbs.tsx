interface PageBreadcrumbsProps {
  title: string;
  breadcrumbs: string[];
}

const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({breadcrumbs}) => {
  return (
    <div className='text-zinc-600 font-medium'>
      {breadcrumbs.map((crumb, index) => (
        <span key={index}>
          {index > 0 && ' / '}
          {crumb}
        </span>
      ))}
    </div>
  );
};

export default PageBreadcrumbs;
