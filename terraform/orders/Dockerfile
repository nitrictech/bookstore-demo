# Builder
FROM node:18 AS builder

WORKDIR /app

# Model module
COPY common/package*.json /app/common/
COPY common/tsconfig*.json /app/common/
COPY common/src ./common/src
RUN cd /app/common && yarn install && yarn run build

# Delivery module
COPY orders/package*.json /app/orders/
COPY orders/tsconfig*.json /app/orders/
COPY orders/src /app/orders/src

RUN cd /app/orders && yarn install && yarn run build

# Runner
FROM node:18

WORKDIR /app

# Model module
COPY --from=builder /app/common/dist /app/common/dist
COPY --from=builder /app/common/package*.json /app/common/

# Delivery service
COPY --from=builder /app/orders/dist /app/orders/dist
COPY --from=builder /app/orders/package*.json /app/orders/

RUN cd /app/common && yarn install --production
RUN cd /app/orders && yarn install --production

EXPOSE 3000

CMD ["node", "./orders/dist/app.js"]