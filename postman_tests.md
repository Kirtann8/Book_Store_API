# Book Store API - Postman Test Guide

## Setup Instructions

1. Open Postman
2. Create a new Collection named "Book Store API"
3. Create an Environment named "Book Store Local" with these variables:
   - `base_url`: http://localhost:5000
   - `token`: (leave empty, will be filled after login)

## Test Sequence

### 1. User Authentication

#### Register User
- Method: POST
- URL: {{base_url}}/api/users/register
- Body (raw JSON):
```json
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
}
```

#### Login User
- Method: POST
- URL: {{base_url}}/api/users/login
- Body (raw JSON):
```json
{
    "email": "test@example.com",
    "password": "password123"
}
```
- After successful login, copy the token and set it in your environment variables

### 2. Author Management

#### Create Author
- Method: POST
- URL: {{base_url}}/api/authors
- Headers: 
  - Authorization: Bearer {{token}}
- Body (raw JSON):
```json
{
    "name": "J.K. Rowling",
    "biography": "British author best known for the Harry Potter series"
}
```

#### Get All Authors
- Method: GET
- URL: {{base_url}}/api/authors
- Headers: 
  - Authorization: Bearer {{token}}

### 3. Genre Management

#### Create Genre
- Method: POST
- URL: {{base_url}}/api/genres
- Headers: 
  - Authorization: Bearer {{token}}
- Body (raw JSON):
```json
{
    "name": "Fantasy"
}
```

#### Get All Genres
- Method: GET
- URL: {{base_url}}/api/genres
- Headers: 
  - Authorization: Bearer {{token}}

### 4. Book Management

#### Create Book
- Method: POST
- URL: {{base_url}}/api/books
- Headers: 
  - Authorization: Bearer {{token}}
- Body (raw JSON):
```json
{
    "title": "Harry Potter and the Philosopher's Stone",
    "author": "{{author_id}}", // Replace with actual author ID
    "genre": "{{genre_id}}",   // Replace with actual genre ID
    "price": 19.99,
    "rating": 4.8,
    "description": "The first book in the Harry Potter series"
}
```

#### Get All Books
- Method: GET
- URL: {{base_url}}/api/books
- Headers: 
  - Authorization: Bearer {{token}}

#### Update Book
- Method: PUT
- URL: {{base_url}}/api/books/{{book_id}} // Replace with actual book ID
- Headers: 
  - Authorization: Bearer {{token}}
- Body (raw JSON):
```json
{
    "title": "Harry Potter and the Philosopher's Stone",
    "price": 24.99,
    "rating": 4.9
}
```

#### Delete Book
- Method: DELETE
- URL: {{base_url}}/api/books/{{book_id}} // Replace with actual book ID
- Headers: 
  - Authorization: Bearer {{token}}

### 5. Cart Management

#### Add to Cart
- Method: POST
- URL: {{base_url}}/api/cart
- Headers: 
  - Authorization: Bearer {{token}}
- Body (raw JSON):
```json
{
    "bookId": "{{book_id}}", // Replace with actual book ID
    "quantity": 2
}
```

#### Get Cart
- Method: GET
- URL: {{base_url}}/api/cart
- Headers: 
  - Authorization: Bearer {{token}}

### 6. Order Management

#### Create Order
- Method: POST
- URL: {{base_url}}/api/orders
- Headers: 
  - Authorization: Bearer {{token}}
- Body (raw JSON):
```json
{
    "shippingAddress": {
        "street": "123 Test Street",
        "city": "Test City",
        "state": "Test State",
        "zipCode": "12345",
        "country": "Test Country"
    },
    "paymentMethod": "credit_card"
}
```

#### Get All Orders
- Method: GET
- URL: {{base_url}}/api/orders
- Headers: 
  - Authorization: Bearer {{token}}

## Test Data Sequence

1. First, register and login to get the token
2. Create an author and note the author_id
3. Create a genre and note the genre_id
4. Create a book using the author_id and genre_id
5. Add the book to cart
6. Create an order
7. Test other operations (update, delete, etc.)

## Expected Responses

### Successful Response
```json
{
    "success": true,
    "data": {
        // Response data
    }
}
```

### Error Response
```json
{
    "success": false,
    "error": "Error message"
}
```

## Tips

1. Save the IDs (author_id, genre_id, book_id) in environment variables for easy access
2. Use the "Tests" tab in Postman to write test scripts
3. Use the "Pre-request Script" tab to set up variables before the request
4. Use the "Collection Runner" to run all tests in sequence 