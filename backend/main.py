from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.router import prediction

app = FastAPI(
    title="Wind Power Prediction API",
    description="API for predicting wind power generation based on environmental factors",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prediction.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to Wind Power Prediction API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)