# DDACC Deployment & Environment Guide

## Prerequisites
- Node.js 18.x or 20.x+
- npm 9.x+ (or pnpm / yarn)
- Modern web browser with WebGL2 / Canvas support

## Local Development
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` to access the DDACC unified dashboard.

## Production Build & Run
1. Compile and optimize the application:
   ```bash
   npm run build
   ```
2. Launch the production server:
   ```bash
   npm start
   ```

## Environment Variables (Optional)
- `PORT`: Set custom listen port (default: 3000).
- `NEXT_PUBLIC_CONVENTION_YEAR`: Override default convention year (default: 2026).
- `NEXT_PUBLIC_VENUE_NAME`: Override default physical venue name (default: "Huntington Place Detroit").

## Docker Deployment
```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
