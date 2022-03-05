FROM node:16.13

COPY . /root/

WORKDIR /root/

RUN npm i && npm i -g ts-node

ENTRYPOINT bash -c "ts-node src/index.ts"


