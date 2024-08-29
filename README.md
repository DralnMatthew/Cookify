# COOKIFY social platform

## Index

- [Requirements](#requirements)
- [Run Locally](#usage)
- [Run on Cloud](#deployment)

## Requirements

This project requires:

- MongoDB
- Express.js
- React
- Node.js
- Google Cloud Platform

## Run Locally

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

2. Set `baseURL` in `frontend/src/utils/baseURL.js` to `http://localhost:9080`

3. Under `Cookify` folder, open one terminal, and run `cd backend` and `npm install` to install environment for backend. Run `npm start` to start the backend service.

4. Under `Cookify` folder, open another terminal, and run `cd frontend` and `npm install` to install environment for frontend. Run `npm start` to start the frontend service.

Visit http://localhost:3000

## Run on Cloud

1. Set your Google Cloud Platform account

2. Create a project

3. Run `git clone https://github.com/DralnMatthew/Cookify` in Google Shell

4. Set `baseURL` in `frontend/src/utils/baseURL.js` to `/api/v1`

5. Like the environment variables in `.env` in Cookify/backend, modify them in `k8s/deployment.example.yaml`. In addition, change `<PROJECT_ID>`

- MONGO_URI=
- JWT_KEY=
- GMAIL_USER=
- GMAIL_PASS=
- CLOUDINARY_CLOUD_NAME=
- CLOUDINARY_APIKEY=
- CLOUDINARY_API_SECRET=
- BACKEND_URL=
- PORT=9080

6. Run `bash setup.sh` in Google Shell to install environment

7. Run `bash deploy.sh` in Google Shell to make deployment on GCP

8. Run `kubectl get service` in Google Shell to get the IP address.

9. Run `kubectl get pods` in Google Shell to see backend output information
