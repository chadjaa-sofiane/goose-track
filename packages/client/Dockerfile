FROM oven/bun

WORKDIR /app

COPY package.json .
RUN bun install 

COPY . .

EXPOSE 5173 

CMD ["bun", "dev", "--host"]