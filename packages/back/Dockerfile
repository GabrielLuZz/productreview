FROM oven/bun:1.0.25
WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

ENV NODE_ENV=production
ENV PORT=8081

EXPOSE 8081
CMD ["bun", "run", "start"]