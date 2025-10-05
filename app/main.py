from fastapi import FastAPI
from .routers import profiles, assets, portfolios, clubs, follows, posts, insights

app = FastAPI(title="Social Investing API", version="0.1.0")

# Routers
app.include_router(profiles.router)
app.include_router(assets.router)
app.include_router(portfolios.router)
app.include_router(clubs.router)
app.include_router(follows.router)
app.include_router(posts.router)
app.include_router(insights.router)

@app.get("/health")
def health():
    return {"status": "ok"}
