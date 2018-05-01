FROM node

COPY ./ /usr/local/src/smtp

WORKDIR /usr/local/src/smtp

#RUN npm install

CMD [ "npm", "start" ]