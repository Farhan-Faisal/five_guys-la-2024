from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from RecommendationApp.similarity_retrival import PostSimilarityFinder
from fastapi.middleware.cors import CORSMiddleware

# Initialize the FastAPI app
app = FastAPI(title="Lecture Document Similarity API", version="1.1")

import os
print(os.getcwd())

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend's URL in production, e.g., ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the request model
class SimilarityRequest(BaseModel):
    input_post: str
    top_n: int = 3  # Default to top 3
    expand: bool = False  # Whether to expand the query with synonyms

# Define the response model
class SimilarityResponse(BaseModel):
    similar_posts: list

# Initialize the similarity finder
lec_similarity_finder = PostSimilarityFinder(lecture_doc_path='./RecommendationApp/lecture_notes.txt')
post_sim_finder = PostSimilarityFinder(lecture_doc_path='./RecommendationApp/message_list.txt')


@app.post("/similar_posts", response_model=SimilarityResponse)
def get_similar_posts(request: SimilarityRequest):
    """
    Endpoint to retrieve top N similar lecture documents based on the input post.
    """
    try:
        print(request.input_post)
        similar_lectures = lec_similarity_finder.find_similar_posts(
            input_post=request.input_post,
            top_n=request.top_n,
        )

        # similar_replies = post_sim_finder.find_similar_posts(
        #     input_post=request.input_post,
        #     top_n=request.top_n,
        # )

        # Format the response
        similar_lectures = [{"post": post, "score": score} for post, score in similar_lectures]

        return SimilarityResponse(similar_posts=similar_lectures)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))