# BookStore Frontend

A modern React.js frontend for the Book Store API with user authentication, book browsing, cart management, and order processing.

## Features Implemented

### ✅ Phase 1 Complete
- **Project Setup**: React 18+ with all required dependencies
- **Authentication System**: Login/Register with JWT token management
- **State Management**: Context API with useReducer for Auth and Cart
- **API Integration**: Axios with interceptors for authentication and error handling
- **Responsive Design**: Tailwind CSS with mobile-first approach

### ✅ Core Components
- **Layout**: Header with navigation, search, cart icon, and user menu
- **Authentication**: Login and Register forms with validation
- **Book Components**: BookCard and BookFilters for browsing
- **Common Components**: LoadingSpinner, ProtectedRoute
- **Pages**: HomePage with hero section, featured books, and categories
- **Books Page**: With filters, sorting, pagination, and grid/list view

### 🚧 Coming Soon
- Book Details Page with reviews
- Shopping Cart functionality
- Checkout process
- Order management
- User profile
- Admin panel

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Backend API running on http://localhost:5000

### Installation

1. Navigate to the frontend directory:
```bash
cd bookstore-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open http://localhost:3000 in your browser

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── layout/          # Layout components
│   ├── auth/            # Authentication components
│   ├── books/           # Book-related components
│   ├── cart/            # Cart components (coming soon)
│   ├── orders/          # Order components (coming soon)
│   └── admin/           # Admin panel components (coming soon)
├── contexts/            # React contexts
├── hooks/               # Custom hooks (coming soon)
├── services/            # API services
├── utils/               # Utility functions (coming soon)
├── pages/               # Page components
└── styles/              # Global styles
```

## API Integration

The frontend integrates with the following API endpoints:
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/register` - User registration
- `GET /api/v1/books` - Get books with filtering/search
- `GET /api/v1/books/:id` - Get book details
- `GET /api/v1/authors` - Get authors
- `GET /api/v1/genres` - Get genres
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart` - Add to cart
- `PUT /api/v1/cart/:id` - Update cart item
- `DELETE /api/v1/cart/:id` - Remove from cart

## Features

### Authentication
- JWT-based authentication with automatic token refresh
- Protected routes with role-based access control
- Persistent login state

### Book Browsing
- Search functionality with debounced input
- Advanced filters (genre, author, price range, rating)
- Multiple sorting options
- Grid/list view toggle
- Pagination

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly navigation
- Optimized for all screen sizes

## Technologies Used

- **React 18+** - Frontend framework
- **React Router DOM v6** - Client-side routing
- **Context API + useReducer** - State management
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **React Hook Form + Yup** - Form handling and validation
- **React Hot Toast** - Notifications
- **Heroicons** - Icon library

## Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style
- Functional components with hooks
- Modern ES6+ syntax
- Consistent naming conventions
- Component-based architecture

## Next Steps

1. **Book Details Page** - Individual book view with reviews
2. **Shopping Cart** - Full cart management functionality
3. **Checkout Process** - Order placement and payment
4. **User Dashboard** - Profile management and order history
5. **Admin Panel** - Book, author, and order management
6. **Performance Optimization** - Code splitting and lazy loading
7. **Testing** - Unit and integration tests