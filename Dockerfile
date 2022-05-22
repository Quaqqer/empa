FROM alpine:latest

# Environment stuff
WORKDIR /empa.xyz
EXPOSE 3000/tcp
ENV YARN_CACHE_FOLDER=/var/cache/yarn-cache
VOLUME /var/cache/yarn-cache

# Install yarn
RUN apk add yarn

# Copy package files and install dependencies
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --frozen-lockfile

COPY frontend/package.json /empa.xyz/frontend/package.json
COPY frontend/yarn.lock /empa.xyz/frontend/yarn.lock
RUN cd frontend && yarn install --frozen-lockfile

COPY backend/package.json /empa.xyz/backend/package.json
COPY backend/yarn.lock /empa.xyz/backend/yarn.lock
RUN cd backend && yarn install --frozen-lockfile

# Copy source code
COPY frontend /empa.xyz/frontend
COPY backend /empa.xyz/backend

# Install dependencies and build projects
RUN yarn build

# Run frontend and backend concurrently
CMD yarn start
