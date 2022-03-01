FROM node
WORKDIR ./client
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 3000