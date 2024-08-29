#!/bin/bash

printf "Setting GCP Zone...\n"
gcloud config set compute/zone us-central1-a

printf "Creating aGKE Cluster...\n"
gcloud container clusters create cookify-cluster --num-nodes 3

printf "Enabling Cloud Build APIs...\n"
gcloud services enable cloudbuild.googleapis.com
printf "Completed.\n\n"

printf "Building Cookify Container...\n"
cd ~/Cookify/backend
gcloud builds submit --tag gcr.io/${GOOGLE_CLOUD_PROJECT}/cookify:1.0.0 .
printf "Completed.\n\n"

printf "Deploying Cookify To GKE Cluster...\n"
kubectl create deployment cookify --image=gcr.io/${GOOGLE_CLOUD_PROJECT}/cookify:1.0.0
kubectl expose deployment cookify --type=LoadBalancer --port 80 --target-port 9080
printf "Completed.\n\n"

printf "Please run the following command to find the IP address for the cookify service: kubectl get service cookify\n\n"

printf "Deployment completed successfully!\n"