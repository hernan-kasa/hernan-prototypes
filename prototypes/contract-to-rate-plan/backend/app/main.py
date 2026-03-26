from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import extraction, lookups

app = FastAPI(title="Contract-to-Rate-Plan API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5177",
        "http://localhost:5177",
        "https://hernan-prototypes.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(extraction.router)
app.include_router(lookups.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
