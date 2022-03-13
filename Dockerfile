FROM node:16.13

RUN groupadd -g 0 -f wheel

USER root:wheel

COPY . /root/

WORKDIR /root/

RUN apt update -y && apt install -y ffmpeg && npm i && npm i -g ts-node

ENTRYPOINT ts-node src/index.ts


