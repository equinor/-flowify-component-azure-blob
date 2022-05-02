FROM node:16-alpine
LABEL org.opencontainers.image.source = "https://github.com/equinor/flowify-component-azure-blob"
WORKDIR /app

COPY package*.json ./
RUN npm install --production 
COPY ./src ./src
ENV DOWNLOAD_PATH=/tmp/flowify
RUN mkdir -p ${DOWNLOAD_PATH}
RUN chown -R 1000:1000 ${DOWNLOAD_PATH}
RUN mkdir /artifacts
RUN chmod -R 777 /artifacts
USER 1000
ENTRYPOINT ["node", "./src/index.js"]
