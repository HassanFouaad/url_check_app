# URL Checker application
### _URL Checker to track your website availability_

## Features
- [x] Authentication (Signup/Login)
- [x] Email verification
- [x] URL checker CRUD operations
- [x] Authenticated users can group their checks by tags and get reports by tag.
- [x] Authenticated users can get detailed uptime reports about their URLs availability, average response time, and total uptime/downtime.
- [x]  Authenticated users can receive a notification whenever one of their URLs goes down or up again:
  - Email.
  - Webhook *(optional)*.
  - Pushover *(optional)*.
- [x] Unit tests
- [x] New alerting notifications can be easily added
- [x] API Documentation (https://documenter.getpostman.com/view/11631463/UyrGAu2x)
- [x] Docker and Docker Compose.
- [x] Pushover integration to receive alerts on mobile devices.

## Tech
- Nodejs *(Typescript)*
- Expressjs
- PostgreSQL
- Redis Server *(Where tasks queue live)*
- Bull
- Docker
- Jest *(for testing)*

## Installation
URL Checker application requires [Node.js](https://nodejs.org/) v16.13.2+ to run.

##### Install the dependencies and devDependencies and start the server.
- Update .env file as .env.example file

```sh
cd url_check_app
npm i
npm run dev
```

For production environments...

```sh
npm run build
npm install --production
npm run start
```
## Test
URL Checker application uses Jest for testing
```sh
npm run test
```

## Docker
URL Checker is very easy to install and deploy in a Docker container.
By default, the Docker will expose port 900, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
cd dillinger
docker-compose up -d
```
This will create the the application image and pull in the necessary dependencies.
-   Redis-server image
-   Postgres-server image
-   Node application image

Once done, run the Docker image and map the port to whatever you wish on your host. 
The following command create new postgresql database for you 



## Screenshots
  #### Passed Auth tests
 ![alt text](https://i.imgur.com/71aIccA.png)
 #### Passed url tests
 ![alt text](https://i.imgur.com/WBpyNXQ.png)
  #### Postman api collection with examples
 ![alt text](https://i.imgur.com/IH1VeaS.png)
   #### Pushover integration
 ![alt text](https://i.imgur.com/Yv5mbMd.jpg)

