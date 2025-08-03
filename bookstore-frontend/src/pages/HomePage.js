import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import BookCard from '../components/books/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [booksResponse, genresResponse] = await Promise.all([
        bookService.getBooks({ limit: 8, sort: '-createdAt' }),
        bookService.getGenres(),
      ]);

      setFeaturedBooks(booksResponse.data.slice(0, 4));
      setPopularBooks(booksResponse.data.slice(4, 8));
      setGenres(genresResponse.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Next Great Read
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Explore thousands of books across all genres
            </p>
            <Link
              to="/books"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Books
            </h2>
            <p className="text-lg text-gray-600">
              Discover our handpicked selection of amazing books
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/books"
              className="inline-block btn-primary"
            >
              View All Books
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find books in your favorite genres
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {genres.map((genre) => (
              <Link
                key={genre._id}
                to={`/books?genre=${genre._id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
              >
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                  {genre.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Books */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular This Week
            </h2>
            <p className="text-lg text-gray-600">
              See what other readers are loving
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Reading?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of book lovers and discover your next favorite book
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;