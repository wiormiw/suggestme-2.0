# Stage 1: Build
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build:binary

# Stage 2: Production (Debian slim for glibc)
FROM debian:bookworm-slim

WORKDIR /app

# Copy the binary and keep the name 'suggestme-api'
COPY --from=builder /app/suggestme-api ./suggestme-api

# Install certs (needed for API requests)
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run the binary
CMD ["./suggestme-api"]