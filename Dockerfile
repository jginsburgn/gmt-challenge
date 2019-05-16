FROM node:10.15.1

WORKDIR /root
COPY ./src ./src
COPY index.js package.json package-lock.json ./
RUN npm install

ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENTRYPOINT [ "npm", "run" ]
CMD [ "serve" ]
