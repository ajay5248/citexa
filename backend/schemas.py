from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    company: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class WebsiteBase(BaseModel):
    url: str

class WebsiteCreate(WebsiteBase):
    pass

class Website(WebsiteBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AuditBase(BaseModel):
    website_id: int
    
class AuditCreate(AuditBase):
    pass

class Audit(AuditBase):
    id: int
    overall_score: float
    schema_score: float
    content_score: float
    citation_score: float
    status: str
    audit_data: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class GoogleToken(BaseModel):
    token: str

class ToolUsageBase(BaseModel):
    tool_name: str
    target_url: Optional[str] = None
    output_data: str

class ToolUsageCreate(ToolUsageBase):
    pass

class ToolUsage(ToolUsageBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CompetitorBase(BaseModel):
    website_id: int
    competitor_url: str

class CompetitorCreate(CompetitorBase):
    pass

class Competitor(CompetitorBase):
    id: int
    visibility_score: float
    analysis_data: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ReportBase(BaseModel):
    title: str
    report_type: str # executive_summary, deep_dive, technical_audit

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: int
    owner_id: int
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True

