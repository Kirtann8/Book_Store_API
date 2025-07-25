# Book Store API

Production Setup Instructions
===========================

1. **Environment Variables**
   - Copy `.env.example` to `.env` and fill in your secrets and config.

2. **Install Dependencies**
   - Run `npm install` to install all required packages.

3. **Start the Server**
   - For production: `npm start`
   - For development: `npm run dev`

4. **Security & Best Practices**
   - Uses Helmet for security headers.
   - CORS is configurable via `CORS_ORIGIN` env variable.
   - Rate limiting is enabled.
   - Logging via Morgan.
   - Error handling and graceful shutdown are implemented.

5. **Health Check**
   - GET `/health` returns `{ status: 'ok' }` if running.

6. **Environment Variables**
   - See `.env.example` for all required variables.

7. **Database**
   - Ensure MongoDB is running and accessible via `MONGO_URI`.

8. **HTTPS**
   - For production, use a reverse proxy (e.g., Nginx) to terminate SSL.

9. **Monitoring**
   - Integrate with monitoring tools as needed (e.g., PM2, New Relic).

10. **Error Reporting**
    - Errors are logged to the console. Integrate with external logging if needed.

