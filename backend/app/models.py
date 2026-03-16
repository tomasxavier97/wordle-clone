from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.database import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(String, primary_key=True, index=True)
    word = Column(String, nullable=True)
    status = Column(String, nullable=False, default="setup")
    guesses_used = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Guess(Base):
    __tablename__ = "guesses"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(String, ForeignKey("games.id"), nullable=False)
    word = Column(String, nullable=False)
    result = Column(Text, nullable=False)
    attempt_number = Column(Integer, nullable=False)