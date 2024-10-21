# Sofos

## Overview

Sofos is a full-stack web application designed to enhance discussions on Canvas discussion boards. By providing personalized recommendations and evaluating the complexity of user replies, Sofos aims to foster deeper and more meaningful conversations among peers.

## App Demo
Visit [Sofos](https://sofos-2024.vercel.app)

## Features

- **Recommendation System**: Generates:
  - 2 relevant lecture note paragraphs
  - 2 relevant previous peer discussion replies
- **Complexity Assessment**: Analyzes user replies to provide feedback on the understanding level of concepts, enabling users to refine their responses before submission.
- **Seamless Integration**: Works directly with Canvas discussion boards to pull posts and titles.

## Tech Stack

- **Frontend**: 
  - Node.js
- **Backend**:
  - Microservices architecture
  - Node.js (Discussion service)
  - Python (FastAPI for recommendations and complexity assessment)
- **Deployment**:
  - Frontend: Vercel
  - Backend:
    - Discussion service: Render.com
    - Recommendation and complexity service: Render.com

## Architecture

1. **Discussion Service**: 
   - Pulls discussion posts and titles from the Canvas API.
   - Built using Node.js and deployed on Render.com.

2. **Recommendation and Complexity Service**:
   - Two endpoints:
     - **Recommendations**: Utilizes TF-IDF to generate relevant content.
     - **Complexity Assessment**: Calculates the complexity level of replies using the Dall-E chart formula.
   - Built using Python FastAPI and deployed on Render.com.

![Architecture Diagram](https://github.com/Farhan-Faisal/five_guys-la-2024/blob/67b174d9273ebdeb45ee62b93366abd8628e395e/frontend/public/architecture.png)

<img src="https://github.com/Farhan-Faisal/five_guys-la-2024/blob/67b174d9273ebdeb45ee62b93366abd8628e395e/frontend/public/architecture.png" alt="Architecture Diagram" />



## Installation

To run Sofos locally, follow these steps:

1. Clone the repository.  
2. Navigate to the frontend directory:
    ```bash
        cd sofos/frontend
    ```

3. Install dependencies:  
    ```bash
    cd backend/canvas_backend
    npm install

    cd ../RecommendationApp
    npm install

    cd ../../frontend
    npm install
    ```

4. Start the Python FastAPI service:
    ```bash
    cd ../backend/RecommendationApp
    uvicorn RecommendationApp.main:app --reload
    ```

5. Start the NodeJS RESTAPI :
    ```bash
    cd ../canvas_backend
    node server.js
    ```

6. Start the frontend :
    ```bash
    cd ../../frontend
    npm run dev
    ```

## Presentation
You can view our presentation [here](https://github.com/Farhan-Faisal/five_guys-la-2024/raw/refs/heads/main/useful_instructions/sofos.pptx).


## Team Members  
- Farhan Bin Faisal
- Yibin Long
- Jiayi Li
- Long Nguyen
- Jason Lee