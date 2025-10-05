from fastapi import FastAPI
from .routers import profiles, assets, portfolios, clubs, follows, posts, insights
from .routers import community, inspiration, clubs_extras, donations, startups
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AdaHack2025 Social Investing API",
    version="0.3.0",
    description="API for social investing platform with Yahoo Finance integration",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
import os
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
  CORSMiddleware,
  allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
  allow_methods=["*"],
  allow_headers=["*"],
  allow_credentials=True,
)

# Health check endpoint for Render
@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "AdaHack2025 Backend API",
        "version": "0.3.0",
        "docs": "/docs"
    }

app.include_router(profiles.router)
app.include_router(assets.router)
app.include_router(portfolios.router)
app.include_router(clubs.router)
app.include_router(follows.router)
app.include_router(posts.router)
app.include_router(insights.router)
app.include_router(startups.router)
app.include_router(donations.router)
app.include_router(community.router)
app.include_router(inspiration.router)
app.include_router(clubs_extras.router)

