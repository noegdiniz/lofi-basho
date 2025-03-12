from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserCreate, User, HaikuCreate, Haiku, Token
from crud import create_user, get_user_by_email, create_haiku, get_haikus, get_liked_haikus, get_user_by_id, toggle_like, get_haiku_by_id
from auth import authenticate_user, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from models import Like  # Import Like model for the new endpoint
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])


# Existing endpoints...

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, user)

@app.get("/users/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/haikus/", response_model=Haiku)
def create_new_haiku(haiku: HaikuCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_haiku(db, haiku, owner_id=current_user.id)

@app.get("/haikus/", response_model=List[Haiku])
def read_all_haikus(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_haikus(db, skip=skip, limit=limit)

@app.get("/haikus/{haiku_id}", response_model=Haiku)
def read_haiku(haiku_id: int, db: Session = Depends(get_db)):
    haiku = get_haiku_by_id(db, haiku_id)
    if not haiku:
        raise HTTPException(status_code=404, detail="Haiku not found")
    return haiku

@app.get("/haikus/mine/", response_model=List[Haiku])
def read_my_haikus(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_haikus(db, owner_id=current_user.id)

@app.get("/haikus/drafts/", response_model=List[Haiku])
def read_draft_haikus(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_haikus(db, owner_id=current_user.id, is_draft=True)

@app.get("/haikus/liked/", response_model=List[Haiku])
def read_liked_haikus(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_liked_haikus(db, user_id=current_user.id)

@app.post("/haikus/{haiku_id}/like/")
def like_haiku(haiku_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"liked": toggle_like(db, haiku_id, current_user.id)}

@app.get("/haikus/{haiku_id}/is-liked")
def is_haiku_liked(haiku_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    like = db.query(Like).filter(Like.haiku_id == haiku_id, Like.user_id == current_user.id).first()
    return {"is_liked": bool(like)}

@app.get("/users/{user_id}", response_model=User)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/users/{user_id}/haikus/", response_model=List[Haiku])
def get_user_haikus(user_id: int, db: Session = Depends(get_db)):
    return get_haikus(db, owner_id=user_id, is_draft=False)  # Only public haikus
