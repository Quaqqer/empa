FROM alpine:latest

# Environment stuff
WORKDIR /empa.xyz
EXPOSE 3000/tcp

# Install yarn
RUN apk add yarn

# Copy source code, and everything
COPY . .

# Install dependencies and build, remove dev dependencies and clean cache
RUN (cd schemas && yarn install && yarn build && yarn install --prod) &&\
    (cd frontend && yarn install && yarn build && yarn install --prod) &&\
    (cd backend && yarn install && yarn build && yarn install --prod) &&\
    (yarn install) &&\
    yarn cache clean

# Run frontend and backend concurrently
CMD yarn start
