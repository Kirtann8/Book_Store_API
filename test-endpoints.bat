@echo off
echo Testing Book Store API Endpoints
echo ==================================

set BASE_URL=http://localhost:5000

echo.
echo 1. Health Check
curl -X GET %BASE_URL%/health

echo.
echo.
echo 2. Register User
curl -X POST %BASE_URL%/api/v1/users/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"user\"}"

echo.
echo.
echo 3. Login User
curl -X POST %BASE_URL%/api/v1/users/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"

echo.
echo.
echo 4. Get All Books
curl -X GET %BASE_URL%/api/v1/books

echo.
echo.
echo 5. Search Books
curl -X GET "%BASE_URL%/api/v1/books/search?q=test"

echo.
echo.
echo 6. Get All Authors
curl -X GET %BASE_URL%/api/v1/authors

echo.
echo.
echo 7. Get All Genres
curl -X GET %BASE_URL%/api/v1/genres

echo.
echo.
echo Testing Complete!
pause