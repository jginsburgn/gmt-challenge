# Gold Media Tech Challenge

This repo is an attempt to solve the *Software Engineer Candidate Gold Media Tech challenge*: a developer marketplace.

## Directions

The file containing the required functionality is [here](./docs/directions.pdf).

## Areas of Opportunity

1. Add code comments with JSDoc format.
1. Modularize routing.
1. Use a certificate for JWT signing.
1. Avoid usage of `global`s.
1. Refactor models to be object oriented.
1. Use a more robust tool for interval operations (`cron`-inspired packages under npm).
1. Implement testing.
1. Improve fault tolerance.
    * Check for email collisions of developers' creation.
1. Use l10n in response messages.

## Justifications

1. This would be run behind a reverse proxy/load balancer, therefore HTTPS would be taken care of in that service.

## How to Run?

1. Create a docker network: `docker network create gmt`.
1. Spin up a MongoDB container in that network: `docker run --name mongo --network gmt -d mongo`
1. Prepare the `.env` configuration file (see `sample.env`). Use the name of the `mongo` container as the authority of the MONGO_URL setting.
1. Run `docker build -t gmt-challenge`.
1. Run `docker container run -d -v ${PWD}/.env:/root/.env --network gmt -p <PORT>:<PORT> gmt-challenge`

## Documentation

The endpoints are listed in a [JSON file](./docs/GMT.postman_collection.json) compatible with [Postman](https://www.getpostman.com/).

## License

This code is property of Jonathan Ginsburg and Gold Media Tech. Do not use without written authorization. Licenses of used open source components supersede this imposition within their own scope.

## Contributors

* Gold Media Tech
* Jonathan Ginsburg <jginsburgn@gmail.com>