FROM node:20-alpine

WORKDIR /app

# 설치 전 package.json 먼저 복사
COPY package*.json ./

RUN npm install --only=production

# 🔥 .env 파일을 강제로 이미지 안에 포함
COPY .env .env

# 나머지 모든 코드 복사
COPY . .

ENV PORT=4000

EXPOSE 4000

CMD ["node", "src/server.js"]
