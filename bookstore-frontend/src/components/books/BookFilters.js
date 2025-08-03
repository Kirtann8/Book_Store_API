import React, { useState, useEffect } from 'react';
import { bookService } from '../../services/bookService';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const BookFilters = ({ filters, onFiltersChange }) => {
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isAuthorOpen, setIsAuthorOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  useEffect(() => {
    fetchGenres();
    fetchAuthors();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await bookService.getGenres();
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await bookService.getAuthors();
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleGenreChange = (genreId) => {
    const currentGenres = filters.genre ? filters.genre.split(',') : [];
    const updatedGenres = currentGenres.includes(genreId)
      ? currentGenres.filter(id => id !== genreId)
      : [...currentGenres, genreId];
    
    handleFilterChange('genre', updatedGenres.join(','));
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear All
        </button>
      </div>

      {/* Genre Filter */}
      <div className="mb-6">
        <button
          onClick={() => setIsGenreOpen(!isGenreOpen)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
        >
          Genre
          <ChevronDownIcon className={`w-5 h-5 transform transition-transform ${isGenreOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isGenreOpen && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {genres.map((genre) => (
              <label key={genre._id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.genre?.split(',').includes(genre._id) || false}
                  onChange={() => handleGenreChange(genre._id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{genre.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Author Filter */}
      <div className="mb-6">
        <button
          onClick={() => setIsAuthorOpen(!isAuthorOpen)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
        >
          Author
          <ChevronDownIcon className={`w-5 h-5 transform transition-transform ${isAuthorOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isAuthorOpen && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {authors.map((author) => (
              <label key={author._id} className="flex items-center">
                <input
                  type="radio"
                  name="author"
                  checked={filters.author === author._id}
                  onChange={() => handleFilterChange('author', author._id)}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{author.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <button
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
        >
          Price Range
          <ChevronDownIcon className={`w-5 h-5 transform transition-transform ${isPriceOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isPriceOpen && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div className="space-y-2">
              {[
                { label: 'Under $10', min: 0, max: 10 },
                { label: '$10 - $25', min: 10, max: 25 },
                { label: '$25 - $50', min: 25, max: 50 },
                { label: 'Over $50', min: 50, max: null },
              ].map((range) => (
                <label key={range.label} className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    onChange={() => {
                      handleFilterChange('minPrice', range.min);
                      handleFilterChange('maxPrice', range.max || '');
                    }}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating.toString()}
                onChange={() => handleFilterChange('rating', rating.toString())}
                className="border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {rating}+ Stars
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookFilters;