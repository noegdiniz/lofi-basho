# schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    email: str
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

class HaikuBase(BaseModel):
    text: str
    color: str
    is_draft: bool
    tags: List[str]  # Add tags as a list of str

class HaikuCreate(HaikuBase):
    pass

class Haiku(HaikuBase):
    id: int
    date: datetime
    owner_id: int
    owner: User  # Include owner details
    likes_count: int  # Add likes count

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str