const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  
    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded ${currentPage === page ? 'bg-gray-900 text-white' : 'bg-gray-400 text-white'} hover:bg-gray-900`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    );
  };
  
  export default Pagination;
  