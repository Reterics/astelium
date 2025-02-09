import {FiChevronLeft, FiChevronRight} from 'react-icons/fi';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };
  const buttonClass =
    'p-1 border border-zinc-300 rounded-xs text-zinc-600 hover:bg-zinc-200 disabled:opacity-50 cursor-pointer';
  return (
    <div className='flex items-center justify-center space-x-2 p-2 border-t border-zinc-300'>
      <button
        className={buttonClass}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FiChevronLeft />
      </button>
      <span className='text-sm font-medium'>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={buttonClass}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
