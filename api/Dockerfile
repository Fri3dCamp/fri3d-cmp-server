FROM node:6

WORKDIR /api
COPY ./package.json .
RUN npm install

EXPOSE 3100
CMD [ "node", "index.js" ]
