# NodeJS Version 16
FROM node:18-alpine

WORKDIR /app
# Work to Dir

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/

ENV VITE_API_BASE_PATH=http://test-loadbalancer-2071423490.us-east-1.elb.amazonaws.com
ENV VITE_PROMPT_API_BASE_PATH=http://test-loadbalancer-2071423490.us-east-1.elb.amazonaws.com/api
ENV VITE_SOCKET_BASE_PATH=/

# Install Node Package
RUN npm install --legacy-peer-deps

# Set Env
ENV NODE_ENV development

RUN npm run devbuild

EXPOSE 5173

# Cmd script
CMD ["npm", "run", "preview"]
