FROM node:20

WORKDIR /app

COPY . .
COPY ./apps/api/.env.docker ./apps/api/.env

RUN npm i

RUN npx turbo generate
RUN cd apps/api
RUN npm run build

CMD ["npx", "turbo", "start", "--filter=api"] 
