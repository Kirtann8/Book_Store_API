# API Testing Guide

## Available Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user

### Books
- `GET /api/v1/books` - Get all books
- `GET /api/v1/books/search?q=query` - Search books
- `GET /api/v1/books/:id` - Get book by ID
- `POST /api/v1/books` - Create book (Admin only)
- `PUT /api/v1/books/:id` - Update book (Admin only)
- `DELETE /api/v1/books/:id` - Delete book (Admin only)

### Authors
- `GET /api/v1/authors` - Get all authors

### Genres
- `GET /api/v1/genres` - Get all genres

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart` - Add to cart
- `PUT /api/v1/cart/:id` - Update cart item
- `DELETE /api/v1/cart/:id` - Remove from cart

### Orders
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create order

### Profile
- `GET /api/v1/profile` - Get user profile
- `PUT /api/v1/profile` - Update profile

### Analytics
- `GET /api/v1/analytics` - Get analytics data

### Health
- `GET /health` - Health check

## Testing Methods

### 1. Postman Collection
Import `postman/Book_Store_API_Complete.postman_collection.json` into Postman.

### 2. Automated Tests
```bash
npm install
npm test
```

### 3. Manual cURL Testing
```bash
test-endpoints.bat
```

## Quick Start Testing

1. Start server: `npm run dev`
2. Run batch script: `test-endpoints.bat`
3. Import Postman collection for detailed testing
4. Run automated tests: `npm test`