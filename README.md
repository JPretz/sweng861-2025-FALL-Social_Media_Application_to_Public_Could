# 🚀 Social Media Application to Public Cloud

This repository contains a **full-stack social media application** deployed to **Google Cloud Run**, with a React frontend, Node.js backend, PostgreSQL database, and CI/CD workflows via GitHub Actions.

--------------------------------------------------------------------------------------------------------

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Local Development](#setup--local-development)
- [Deployment](#deployment)
- [CI/CD](#cicd)
- [Environment Variables](#environment-variables)
- [References](#references)

---------------------------------------------------------------------------------------------------------

## Project Overview

This project is a social media app where users can:

- Log in
- View posts
- Interact with posts (future enhancements)

The application demonstrates **cloud deployment, containerization, and automated CI/CD pipelines**.

---------------------------------------------------------------------------------------------------------

## Architecture

Frontend (React) ---> Backend (Node.js/Express) ---> PostgreSQL (Cloud SQL)
### see screenshots diagram

----------------------------------------------------------------------------------------------------------

- Frontend is built with React and served using **Nginx**.
- Backend is built with Node.js/Express.
- Database is hosted on **Google Cloud SQL (PostgreSQL)**.
- Both frontend and backend are deployed to **Google Cloud Run**.

--------------------------------------------------------------------------------------------------------------

## Features

- User login using JWT
- Fetch and display posts
- CI/CD workflow for automated deployment
- Cloud-native architecture

---------------------------------------------------------------------------------------------------------------

## Tech Stack

- **Frontend:** React, Nginx, Docker
- **Backend:** Node.js, Express, Docker
- **Database:** PostgreSQL (Cloud SQL)
- **Cloud:** Google Cloud Run
- **CI/CD:** GitHub Actions
- **Authentication:** JSON Web Tokens (JWT)

------------------------------------------------------------------------------------------------------------------

## Setup & Local Development

1. Clone the repository:

```bash
git clone https://github.com/JPretz/sweng861-2025-FALL-Social_Media_Application_to_Public_Could.git
cd Social_Media_Application_to_Public_Could

2. Install dependencies:
    cd frontend
    npm install
    cd ../backend
    npm install

3. Run frontend locally:
    cd frontend
    npm start

 4. Run backend locally:
    cd backend
    npm run dev   
------------------------------------------------------------------------------------------------------------------------
## Deployment

Frontend: Google Cloud Run service URL: https://social-frontend-<PROJECT_ID>.run.app

Backend: Google Cloud Run service URL: https://social-backend-<PROJECT_ID>.run.app

Docker build & push example:

docker build -t gcr.io/<PROJECT_ID>/social-media-frontend 
docker push gcr.io/<PROJECT_ID>/social-media-frontend
-------------------------------------------------------------------------------------------------------------------------
## CI/CD

This project uses GitHub Actions to automatically:

Build Docker images for frontend and backend.

Push Docker images to Google Container Registry (GCR).

Deploy services to Google Cloud Run.

Workflow file: .github/workflows/deploy.yml

Environment Variables
Variable	Description
DB_HOST	Cloud SQL instance connection string
DB_USER	Database username
DB_PASSWORD	Database password
DB_NAME	Database name
DB_PORT	Database port (usually 5432)
JWT_SECRET	Secret key for signing JWT tokens
REACT_APP_API_BASE_URL	URL of the backend service
--------------------------------------------------------------------------------------------------------------------------

## References:

React Documentation

Dockerfile Reference

GitHub Actions & CI/CD

JSON Web Tokens (JWT)

Google Cloud Run
