FROM node:16.14.0-alpine

# set the working direction
WORKDIR /app/client

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/client/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn

# add app
COPY . ./

EXPOSE 5173

# start app
CMD ["yarn", "run", "dev", "--host"]