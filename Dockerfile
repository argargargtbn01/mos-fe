# Stage 1: Build ứng dụng Next.js
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng Next.js (sẽ tạo ra thư mục .next)
RUN npm run build

# Stage 2: Chạy ứng dụng Next.js
FROM node:20-alpine

WORKDIR /app

# Copy toàn bộ dữ liệu từ giai đoạn build
COPY --from=builder /app ./

# Expose port mà ứng dụng chạy (thường là 3000)
EXPOSE 3000

# Chạy ứng dụng ở chế độ production (chạy lệnh "next start")
CMD ["npm", "start"]
