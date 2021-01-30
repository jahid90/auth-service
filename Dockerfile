FROM node:12-alpine

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY dist/ ./dist/

CMD ["node", "-r", "module-alias/register", "./dist", "--env=production"]
