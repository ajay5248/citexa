from sqlalchemy import create_engine, text
from sqlalchemy.pool import NullPool

url = 'postgresql://postgres.msgslpbvkrykzuzvyusp:%40Ajay5241%23%23@aws-0-ap-south-1.pooler.supabase.com:6543/postgres'
engine = create_engine(url, poolclass=NullPool)
try:
    with engine.connect() as conn:
        result = conn.execute(text('SELECT 1'))
        print('SUCCESS:', result.scalar())
except Exception as e:
    print('ERROR:', str(e))
