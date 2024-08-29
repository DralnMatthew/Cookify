# COOKIFY social platform

## Index

- [Requirements](#requirements)
- [Usage](#usage)
- [Initial Deployment](#deployment)
- [Update Deployment](#update)

## Requirements

This project requires:

- MongoDB
- Express.js
- React
- Node.js
- Google Cloud Platform

## Usage

1. Create a file `.env` in `Cookify/backend`, which stores the environment secret data

- MONGO_URI=
- JWT_KEY=
- GMAIL_USER=
- GMAIL_PASS=
- CLOUDINARY_CLOUD_NAME=
- CLOUDINARY_APIKEY=
- CLOUDINARY_API_SECRET=
- BACKEND_URL=
- PORT=9080

2. Under `Cookify` folder, open one terminal, and run `cd backend` and `npm install` to install environment for backend. Run `npm start` to start the backend service.

3. Under `Cookify` folder, open another terminal, and run `cd frontend` and `npm install` to install environment for frontend. Run `npm start` to start the frontend service.

Visit http://localhost:3000

## Initial Deployment

1. Set your Google Cloud Platform account

2. Create a project

3. Run `git clone https://github.com/DralnMatthew/Cookify` in Google Shell

4. Create a file `.env` in Cookify/backend, which stores the environment secret data

- MONGO_URI=
- JWT_KEY=
- GMAIL_USER=
- GMAIL_PASS=
- CLOUDINARY_CLOUD_NAME=
- CLOUDINARY_APIKEY=
- CLOUDINARY_API_SECRET=
- BACKEND_URL=
- PORT=9080

5. Run `bash setup.sh` in Google Shell to install environment

6. Run `bash deploy.sh` in Google Shell to make deployment on GCP

7. Run `kubectl get service` in Google Shell to get the IP address.

## Update Deployment

1. Run `bash update.sh X` in Google Shell to make deployment on GCP, where X is the version number, like 2, 3, 4...

2. Run `kubectl get service` in Google Shell to get the IP address.
