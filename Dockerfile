FROM node:12-alpine

WORKDIR /app

COPY package.json ./
RUN yarn install --production

COPY dist/ ./dist/

CMD ["yarn", "run", "start"]
