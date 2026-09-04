# Cloud Architecture Project - Frontend

A web-based frontend application developed for the Enterprise Cloud Architecture project.

This application demonstrates the functionality of a Spring Boot microservices backend deployed on Google Cloud Platform (GCP). The frontend communicates with the backend through an API Gateway and allows users to interact with the Product Service and Order Service.

## Features

- View all available products
- Add new products with image upload
- View order information
- Create and manage orders
- Communicate with backend microservices through the API Gateway
- Display data retrieved from services deployed on GCP
- Responsive web interface

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Fetch API
- Vercel

## Backend Architecture

The frontend communicates with the backend through a centralized API Gateway.

Backend components include:

- API Gateway
- Eureka Discovery Server
- Spring Cloud Config Server
- Product Service
- Order Service

The backend services are deployed on Google Cloud Platform using a microservices architecture.

## API Endpoints

### Product Service

GET

/api/product

POST

/api/product

### Order Service

GET

/api/order

POST

/api/order

All backend requests are routed through the API Gateway.


## Environment Variables

Create a `.env` file in the project root.

```env
VITE_PRODUCT_API_URL=/backend/api/product
VITE_ORDER_API_URL=/backend/api/order
```


<img width="1366" height="768" alt="Screenshot (666)" src="https://github.com/user-attachments/assets/8f8c0ce0-b66a-4aab-9837-4b47a6e074e0" />

<img width="1366" height="768" alt="Screenshot (667)" src="https://github.com/user-attachments/assets/0c50d75a-e334-498f-988a-e9d4a793cd78" />

<img width="1366" height="768" alt="Screenshot (668)" src="https://github.com/user-attachments/assets/f9a1d683-94be-4a7b-afe1-251b602e41e7" />



