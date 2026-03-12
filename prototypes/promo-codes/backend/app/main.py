import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

from app.database import Base, engine
from app.routers import promo_codes, rate_plans
from app.seed import SAMPLE_PROPERTIES, SAMPLE_RATE_PLANS, seed

# Create tables and seed on startup
Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="Promo Code Service", version="2.0.0")

# CORS — allow Vite dev server (local dev) and any Railway preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://hernan-prototypes.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(promo_codes.router, prefix="/api")
app.include_router(rate_plans.router, prefix="/api")


# Mock reference data endpoints (properties and rate plans are external systems)
# These return JSON:API format to match kontrol-api patterns
@app.get("/api/properties")
def list_properties():
    return {
        "data": [
            {"id": p["id"], "type": "property", "attributes": {"name": p["name"]}}
            for p in SAMPLE_PROPERTIES
        ]
    }


@app.get("/api/rate-plans")
def list_rate_plans():
    return {
        "data": [
            {
                "id": rp["id"],
                "type": "rate-plan",
                "attributes": {
                    "code": rp["code"],
                    "name": rp["name"],
                    "description": rp.get("description", ""),
                    "cancellation_policy": rp.get("cancellation_policy", "Flexible"),
                    "market_segment": rp.get("market_segment", "Leisure"),
                    "booking_type": rp.get("booking_type", "Direct"),
                },
            }
            for rp in SAMPLE_RATE_PLANS
        ]
    }


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ---------- Serve frontend static build in production ----------
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

if STATIC_DIR.is_dir():
    # Serve asset files (JS, CSS, images)
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    # Catch-all: serve index.html for any non-API route (SPA client-side routing)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # If the requested file exists in static dir, serve it (favicon, etc.)
        file_path = STATIC_DIR / full_path
        if full_path and file_path.is_file():
            return FileResponse(file_path)
        # Otherwise serve index.html for client-side routing
        return FileResponse(STATIC_DIR / "index.html")
