FROM alpine:latest
MAINTAINER Chance Hudson

RUN apk add --no-cache nodejs npm git

COPY . /src
WORKDIR /src

RUN npm i --prod

CMD ["npm", "run", "server"]
