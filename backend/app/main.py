from fastapi import FastAPI
from .routers import profiles, assets, portfolios, clubs, follows, posts, insights
from .routers import community, inspiration, clubs_extras, startups, donations
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Social Investing API", version="0.2.0")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
  allow_credentials=True,
)

app.include_router(profiles.router)
app.include_router(assets.router)
app.include_router(portfolios.router)
app.include_router(clubs.router)
app.include_router(follows.router)
app.include_router(posts.router)
app.include_router(insights.router)
app.include_router(startups.router)
app.include_router(community.router)
app.include_router(inspiration.router)
app.include_router(clubs_extras.router)
app.include_router(donations.router)
