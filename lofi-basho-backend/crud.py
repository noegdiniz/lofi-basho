from sqlalchemy.orm import Session, joinedload
from auth import get_password_hash
from models import User, Haiku, Like
from schemas import UserCreate, HaikuCreate

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_haiku(db: Session, haiku: HaikuCreate, owner_id: int):
    tags = ",".join(haiku.tags)

    db_haiku = Haiku(
        text=haiku.text,
        color=haiku.color,
        tags=tags,
        is_draft=haiku.is_draft,
        owner_id=owner_id
    )

    db.add(db_haiku)
    db.commit()
    db.refresh(db_haiku)

    db_haiku.tags = tags
    db_haiku.likes_count = 0
    return db_haiku

def get_haikus(db: Session, owner_id: int = None, is_draft: bool = False, skip: int = 0, limit: int = 10):
    query = db.query(Haiku).options(joinedload(Haiku.owner)).filter(Haiku.is_draft == is_draft)
    if owner_id:
        query = query.filter(Haiku.owner_id == owner_id)
    
    haikus = query.distinct().order_by(Haiku.id).offset(skip).limit(limit).all()
    for haiku in haikus:
        haiku.likes_count = len(haiku.likes)
        haiku.tags = haiku.tags.split(",")
    
    return haikus

def get_haiku_by_id(db: Session, haiku_id: int):
    haiku = db.query(Haiku).options(joinedload(Haiku.owner)).filter(Haiku.id == haiku_id).first()
    if haiku:
        haiku.likes_count = len(haiku.likes)
        haiku.tags = haiku.tags.split(",")
    
    return haiku

def get_liked_haikus(db: Session, user_id: int):
    haikus = db.query(Haiku).join(Like).filter(Like.user_id == user_id).options(joinedload(Haiku.owner)).all()
    for haiku in haikus:
        haiku.likes_count = len(haiku.likes)
        haiku.tags = haiku.tags.split(",")

    return haikus

def toggle_like(db: Session, haiku_id: int, user_id: int):
    like = db.query(Like).filter(Like.haiku_id == haiku_id, Like.user_id == user_id).first()
    if like:
        db.delete(like)
        db.commit()
        return False
    else:
        db_like = Like(haiku_id=haiku_id, user_id=user_id)
        db.add(db_like)
        db.commit()
        return True