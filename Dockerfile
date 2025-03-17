# Build stage
FROM node:23-alpine AS builder
WORKDIR /app
# RUN apk add --no-cache python3 make g++

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

# Production stage
FROM node:23-alpine AS production
RUN apk add --no-cache curl

# Create non-root user
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /usr/app

# Copy built artifacts
COPY --from=builder /app/dist/angular-starter/server ./server
COPY --from=builder /app/dist/angular-starter/browser ./browser
COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

# Set ownership to non-root user
# RUN chown -R appuser:appgroup /usr/app

# Switch to non-root user
# USER appuser

# Health check
# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:4000/health || exit 1

# Expose port
EXPOSE 4000

# Start the app
CMD ["node", "/usr/app/server/server.mjs"]
