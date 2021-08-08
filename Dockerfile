FROM node:14.11-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --save bcryptjs && npm uninstall --save bcrypt

RUN npm install

COPY . .

RUN npm run build

CMD ["npm","run", "start:prod"]
