# README

## ENVIRONMENT VARIABLES

If someone wants to clone this project and run it locally, you must first create a .env.development file and a .env.test file. Inside each file, set the PGDATABASE as nc_news and nc_news_test respectively in the format: PGDATABASE=nc_news

## HOSTED API

https://backend-api-project-2.onrender.com

## PROJECT SUMMARY

This is an api that allows you to query the database of a website like Reddit with articles, comments, users and topics. You can get data from the api using different endpoints. You can create, read, update and delete and also sort by topic.

## INSTRUCTIONS

First, clone this project in the terminal. Then once opened, run npm install so all dependencies are installed. This project requires dotenv, pg, express and supertest. Then run npm run-seed so the local database is seeded. For tests, run npm test.

Minimum version of Node.js: >=10.0.0
Minumum version of Postgres: ^8.8.0
