FROM node:17-alpine as builder

WORKDIR /assets

COPY package.json ./
RUN yarn install

COPY . ./
RUN yarn build

FROM node:17-alpine as production

WORKDIR /app

COPY --from=builder /assets/package.json ./
COPY --from=builder /assets/dist ./dist
RUN yarn install --production

CMD ["yarn", "run", "start"]
