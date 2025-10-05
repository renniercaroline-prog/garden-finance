from fastapi import FastAPI
from .routers import profiles, assets, portfolios, clubs, follows, posts, insights
from .routers import community, inspiration, clubs_extras

app = FastAPI(title="Social Investing API", version="0.2.0")

app.include_router(profiles.router)
app.include_router(assets.router)
app.include_router(portfolios.router)
app.include_router(clubs.router)
app.include_router(follows.router)
app.include_router(posts.router)
app.include_router(insights.router)

# new
app.include_router(community.router)
app.include_router(inspiration.router)
app.include_router(clubs_extras.router)

