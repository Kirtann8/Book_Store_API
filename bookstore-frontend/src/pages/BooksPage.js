import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookService } from '../services/bookService';
import BookCard from '../components/books/BookCard';
import BookFilters from '../components/books/BookFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('title');
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    genre: searchParams.get('genre') || '',
    author: searchParams.get('author') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    limit: 12,
  });

  useEffect(() => {
    fetchBooks();
  }, [filters, sortBy, pagination.currentPage]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const queryParams = {
        ...filters,
        sort: sortBy,
        page: pagination.currentPage,
        limit: pagination.limit,
      };

      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) delete queryParams[key];
      });

      const response = await bookService.getBooks(queryParams);
      setBooks(response.data);
      setPagination(prev => ({
        ...prev,
        totalPages: response.pagination?.totalPages || 1,
        totalBooks: response.pagination?.totalBooks || 0,
      }));
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <BookFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Books
                {filters.search && (
                  <span className="text-lg font-normal text-gray-600">
                    {' '}for "{filters.search}"
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                {pagination.totalBooks} books found
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="title">Title A-Z</option>
                <option value="-title">Title Z-A</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-averageRating">Highest Rated</option>
                <option value="-createdAt">Newest First</option>
              </select>
            </div>
          </div>

          {/* Books Grid/List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : books.length > 0 ? (
            <>
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm border rounded-lg ${
                          page === pagination.currentPage
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => handleFiltersChange({})}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;