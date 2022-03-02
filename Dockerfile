FROM node:16.13 AS builder

COPY . /root/
RUN cd /root/ && npm i && npm run build

FROM node:16.13

COPY --from=builder /root/ /root/

WORKDIR /root/
ENTRYPOINT bash -c "npm run start"


