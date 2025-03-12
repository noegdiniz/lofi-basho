from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    haikus = relationship("Haiku", back_populates="owner")
    liked_haikus = relationship("Haiku", secondary="likes", back_populates="likes")
    avatar = Column(String, default="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png")

class Haiku(Base):
    __tablename__ = "haikus"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    color = Column(String, default="bg-white/70")
    tags = Column(String)  # Store as comma-separated string
    date = Column(DateTime, default=datetime.utcnow)
    is_draft = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="haikus")
    likes = relationship("User", secondary="likes", back_populates="liked_haikus")

class Like(Base):
    __tablename__ = "likes"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    haiku_id = Column(Integer, ForeignKey("haikus.id"), primary_key=True)