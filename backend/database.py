from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.exc import OperationalError
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# ── Connection ──────────────────────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set.")

# Neon / standard PostgreSQL connection
# SQLAlchemy needs postgresql:// not postgres:// (Render/Neon may give postgres://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,          # auto-reconnect on stale connections
    pool_size=5,
    max_overflow=10,
    connect_args={"sslmode": "require"},  # Neon requires SSL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ── ORM Models ───────────────────────────────────────────────────────────────

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PredictionDB(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    diabetes_risk = Column(Float, nullable=False)
    hypertension_risk = Column(Float, nullable=False)
    diabetes_confidence = Column(String(50))
    hypertension_confidence = Column(String(50))
    risk_category_diabetes = Column(String(50))
    risk_category_hypertension = Column(String(50))
    metabolic_health_score = Column(Float)
    cardiovascular_health_score = Column(Float)
    input_data = Column(JSON)
    recommendations = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)


class TrackingDB(Base):
    __tablename__ = "tracking_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    email = Column(String(255))
    date = Column(String(50))
    daily_steps = Column(Integer, nullable=True)
    sleep_hours = Column(Float, nullable=True)
    water_intake = Column(Integer, nullable=True)
    gym_hours = Column(Float, nullable=True)
    calories = Column(Integer, nullable=True)
    protein_intake = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    blood_pressure = Column(Float, nullable=True)
    glucose_level = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# ── Table Creation ────────────────────────────────────────────────────────────
def init_db():
    """Create all tables if they don't exist."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created / verified successfully.")
    except OperationalError as e:
        logger.error(f"Failed to initialise database: {e}")
        raise


# ── Session Dependency (FastAPI) ──────────────────────────────────────────────
def get_db():
    """Yield a SQLAlchemy session; close it when done."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Legacy helpers used by auth.py / auth_routes.py ──────────────────────────
# These wrap the ORM so existing code needs minimal changes.

def get_users_collection():
    """Return a lightweight proxy that mimics PyMongo collection methods."""
    return _SQLCollection(UserDB)


def get_predictions_collection():
    return _SQLCollection(PredictionDB)


def get_tracking_collection():
    return _SQLCollection(TrackingDB)


class _SQLCollection:
    """
    Minimal PyMongo-like wrapper over SQLAlchemy so auth_routes.py /
    tracking_routes.py keep working without a full rewrite.
    """
    def __init__(self, model):
        self._model = model

    def _session(self) -> Session:
        return SessionLocal()

    def find_one(self, query: dict):
        db = self._session()
        try:
            q = db.query(self._model)
            for key, value in query.items():
                if key == "_id":
                    q = q.filter(self._model.id == int(value))
                else:
                    q = q.filter(getattr(self._model, key) == value)
            obj = q.first()
            return self._to_dict(obj) if obj else None
        finally:
            db.close()

    def insert_one(self, document: dict):
        db = self._session()
        try:
            doc = dict(document)
            doc.pop("_id", None)
            obj = self._model(**{k: v for k, v in doc.items()
                                 if hasattr(self._model, k)})
            db.add(obj)
            db.commit()
            db.refresh(obj)
            return _InsertResult(obj.id)
        finally:
            db.close()

    def update_one(self, query: dict, update: dict):
        db = self._session()
        try:
            q = db.query(self._model)
            for key, value in query.items():
                if key == "_id":
                    q = q.filter(self._model.id == int(value))
                else:
                    q = q.filter(getattr(self._model, key) == value)
            obj = q.first()
            if obj and "$set" in update:
                for k, v in update["$set"].items():
                    if hasattr(obj, k):
                        setattr(obj, k, v)
                db.commit()
        finally:
            db.close()

    def find(self, query: dict = None):
        db = self._session()
        try:
            q = db.query(self._model)
            if query:
                for key, value in query.items():
                    if key == "user_id":
                        q = q.filter(self._model.user_id == value)
                    elif key == "created_at" and isinstance(value, dict):
                        if "$gte" in value:
                            q = q.filter(self._model.created_at >= value["$gte"])
                        if "$lte" in value:
                            q = q.filter(self._model.created_at <= value["$lte"])
            return _Cursor(q, db, self._to_dict)
        except Exception:
            db.close()
            raise

    def _to_dict(self, obj) -> dict:
        if obj is None:
            return None
        d = {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
        d["_id"] = str(d["id"])
        return d


class _InsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class _Cursor:
    def __init__(self, query, db, to_dict_fn):
        self._query = query
        self._db = db
        self._to_dict = to_dict_fn
        self._order = None

    def sort(self, field, direction):
        model = self._query.column_descriptions[0]["entity"]
        col = getattr(model, field, None)
        if col is not None:
            self._query = (self._query.order_by(col.desc())
                           if direction == -1
                           else self._query.order_by(col.asc()))
        return self

    def limit(self, n):
        self._query = self._query.limit(n)
        return self

    def __iter__(self):
        try:
            results = self._query.all()
            return iter([self._to_dict(r) for r in results])
        finally:
            self._db.close()


# Initialise tables on import
init_db()
