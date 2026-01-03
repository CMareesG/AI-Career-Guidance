from pdfreader import read_pdf
from chunker import chunk_pages
from embedder import embed_chunks
from vector_store import store_in_pinecone
from typing import List


pdf_path = "D:/FullStackDevelopment/AI Career Guidance/Backend/RAG_Chatbot/resources/CareerDetails.pdf"


def run():
    pages = read_pdf(pdf_path)

    chunks = chunk_pages(pages)

    embeddings = embed_chunks(chunks)

    store_in_pinecone(chunks, embeddings)


if __name__ == "__main__":
    run()
