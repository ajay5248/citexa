import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.pool import NullPool

# Reads the connection string from the environment (or a local .env file); never hard-code it
load_dotenv()
url = os.getenv('DATABASE_URL')
if not url:
    raise SystemExit('Set DATABASE_URL in your environment or .env file first.')

engine = create_engine(url, poolclass=NullPool)
try:
    with engine.connect() as conn:
        result = conn.execute(text('SELECT 1'))
        print('SUCCESS:', result.scalar())
except Exception as e:
    print('ERROR:', str(e))
