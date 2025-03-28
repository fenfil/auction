FROM node:20

WORKDIR /app

COPY . .
COPY ./apps/front/.env.docker ./apps/front/.env
RUN npm i

RUN cd apps/front
RUN npm run build

CMD ["npx", "turbo", "start", "--filter=front"] 
