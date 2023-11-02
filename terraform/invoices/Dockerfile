# Builder
FROM node:18 AS builder

WORKDIR /app

# Model module
COPY common/package*.json /app/common/
COPY common/tsconfig*.json /app/common/
COPY common/src ./common/src
RUN cd /app/common && yarn install && yarn run build

# Invoices module
COPY invoices/package*.json /app/invoices/
COPY invoices/tsconfig*.json /app/invoices/
COPY invoices/src /app/invoices/src

RUN cd /app/invoices && yarn install && yarn run build

# Runner
FROM node:18

WORKDIR /app

# Model module
COPY --from=builder /app/common/dist /app/common/dist
COPY --from=builder /app/common/package*.json /app/common/

# Invoices service
COPY --from=builder /app/invoices/dist /app/invoices/dist
COPY --from=builder /app/invoices/package*.json /app/invoices/

RUN cd /app/common && yarn install --production
RUN cd /app/invoices && yarn install --production

EXPOSE 3000

CMD ["node", "./invoices/dist/app.js"]
