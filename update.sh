#!/bin/bash

NUMBER=$1

echo "Building frontend"
cd ~/Cookify/frontend
npm run build


echo "Building and submitting the image with tag: gcr.io/{GOOGLE_CLOUD_PROJECT}/cookify:${NUMBER}.0.0"
cd ~/Cookify/backend
gcloud builds submit --tag gcr.io/${GOOGLE_CLOUD_PROJECT}/cookify:${NUMBER}.0.0 .

kubectl set image deployment/cookify cookify=gcr.io/${GOOGLE_CLOUD_PROJECT}/cookify:${NUMBER}.0.0