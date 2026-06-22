from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    company = Column(String, nullable=True)
    role = Column(String, default="user") # 'user' or 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    websites = relationship("Website", back_populates="owner")
    reports = relationship("Report", back_populates="owner")
    tool_usages = relationship("ToolUsage", back_populates="owner")

class ToolUsage(Base):
    __tablename__ = "tool_usages"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    tool_name = Column(String) # faq_generator, schema_generator, etc.
    target_url = Column(String, nullable=True)
    output_data = Column(Text) # The generated JSON or text content
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="tool_usages")

class Website(Base):
    __tablename__ = "websites"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="websites")
    audits = relationship("Audit", back_populates="website")
    competitors = relationship("Competitor", back_populates="website")


class Audit(Base):
    __tablename__ = "audits"

    id = Column(Integer, primary_key=True, index=True)
    website_id = Column(Integer, ForeignKey("websites.id"))
    overall_score = Column(Float, default=0.0)
    schema_score = Column(Float, default=0.0)
    content_score = Column(Float, default=0.0)
    citation_score = Column(Float, default=0.0)
    status = Column(String, default="pending") # pending, completed, failed
    audit_data = Column(Text, nullable=True) # JSON string of full results
    created_at = Column(DateTime, default=datetime.utcnow)

    website = relationship("Website", back_populates="audits")


class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(Integer, primary_key=True, index=True)
    website_id = Column(Integer, ForeignKey("websites.id"))
    competitor_url = Column(String)
    visibility_score = Column(Float, default=0.0)
    analysis_data = Column(Text, nullable=True) # JSON comparison results
    created_at = Column(DateTime, default=datetime.utcnow)

    website = relationship("Website", back_populates="competitors")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    report_type = Column(String) # audit, competitor
    file_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="reports")


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    company = Column(String, nullable=True)
    website = Column(String, nullable=True)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
