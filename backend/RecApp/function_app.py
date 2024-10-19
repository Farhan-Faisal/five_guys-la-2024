import azure.functions as func
import logging


import fastapi
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet, stopwords
from nltk.tokenize import word_tokenize
from nltk.util import ngrams
from rank_bm25 import BM25Okapi
import numpy as np
import os

# Append the directory where nltk_data is located


# Ensure necessary NLTK data packages are downloaded
nltk.download('punkt', download_dir='./nltk_data')
nltk.download('wordnet', download_dir='./nltk_data')
nltk.download('omw-1.4', download_dir='./nltk_data')
nltk.download('stopwords', download_dir='./nltk_data')
# nltk.data.path.append('./nltk_data')

class PostSimilarityFinder:
    def __init__(self, lecture_doc_path=None, lecture_docs=None):
        """
        Initialize the PostSimilarityFinder with lecture documents.

        :param lecture_doc_path: Path to the lecture documents file (each line is a document)
        :param lecture_docs: List of lecture documents as strings
        """
        if lecture_doc_path and lecture_docs:
            raise ValueError(
                "Provide either lecture_doc_path or lecture_docs, not both."
            )
        elif lecture_doc_path:
            self.lecture_docs = self._load_documents_from_file(lecture_doc_path)
        elif lecture_docs:
            self.lecture_docs = lecture_docs
        else:
            raise ValueError(
                "You must provide either lecture_doc_path or lecture_docs."
            )

        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words("english"))
        self.tokenized_lecture_docs = [
            self._lemmatize_tokens(self._tokenize_and_create_ngrams(doc))
            for doc in self.lecture_docs
        ]
        self.bm25 = BM25Okapi(self.tokenized_lecture_docs)

    def _load_documents_from_file(self, file_path):
        """
        Load documents from a file, each line is considered a separate document.

        :param file_path: Path to the text file containing documents
        :return: List of documents as strings
        """
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                documents = [line.strip() for line in f if line.strip()]
            print(f"Loaded {len(documents)} documents from {file_path}.")
            return documents
        except FileNotFoundError:
            raise FileNotFoundError(f"The file {file_path} does not exist.")
        except Exception as e:
            raise Exception(f"An error occurred while reading the file: {str(e)}")

    def _tokenize_and_create_ngrams(self, doc):
        """
        Tokenize the document and create bigrams.

        :param doc: String of the document
        :return: List of tokens and bigrams
        """
        tokens = word_tokenize(doc.lower())
        tokens = [
            token
            for token in tokens
            if token.isalnum() and token not in self.stop_words
        ]
        bigrams = list(ngrams(tokens, 2))
        bigram_tokens = ["_".join(bigram) for bigram in bigrams]
        return tokens + bigram_tokens

    def _lemmatize_tokens(self, tokens):
        """
        Lemmatize the list of tokens.

        :param tokens: List of tokens
        :return: List of lemmatized tokens
        """
        return [self.lemmatizer.lemmatize(token) for token in tokens]

    def find_similar_posts(self, input_post, top_n=3,):
        """
        Find the top N similar posts to the input_post.

        :param input_post: String of the input post
        :param top_n: Number of top similar posts to return
        :param expand: Boolean indicating whether to expand the query with synonyms
        :return: List of tuples (post, score)
        """
        # Tokenize and lemmatize the input post
        tokenized_input = self._lemmatize_tokens(
            self._tokenize_and_create_ngrams(input_post)
        )

        # Get BM25 scores
        scores = self.bm25.get_scores(tokenized_input)

        # Get the top N scores
        top_n_indices = np.argsort(scores)[-top_n:][::-1]

        # Retrieve the top N posts with their scores
        top_posts = [
            (self.lecture_docs[index], scores[index]) for index in top_n_indices
        ]

        return top_posts
    
# Initialize the FastAPI ap
# app = fastapi.FastAPI(title="Lecture Document Similarity API", version="1.1")
app = func.FunctionApp()



@app.route(route="test", auth_level=func.AuthLevel.FUNCTION)
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Test function processed a request.")
    # nltk.data.path.append('./nltk_data')
    nltk.data.path.append(os.path.join(os.getcwd(), 'nltk_data'))
    similarity_finder = PostSimilarityFinder(lecture_doc_path='./lecture_notes.txt')

    request_input_post = 'i like ketchup'

    top_n = 3

    similar = similarity_finder.find_similar_posts(
        input_post=request_input_post,
        top_n=top_n,
    )

    similar_posts = [{"post": post, "score": score} for post, score in similar]

    return func.HttpResponse(similar_posts, status_code=200)