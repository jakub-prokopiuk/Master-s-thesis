from sqlalchemy import create_engine, text
import pandas as pd
from typing import Dict, List, Any

class DatabaseConnector:
    @staticmethod
    def test_connection(connection_string: str) -> bool:
        try:
            engine = create_engine(connection_string)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return True
        except Exception as e:
            raise Exception(f"Connection failed: {str(e)}")

    @staticmethod
    def push_data(connection_string: str, data: Dict[str, List[Dict[str, Any]]]):
        engine = create_engine(connection_string)
        
        with engine.begin() as connection:
            for table_name, rows in data.items():
                if not rows:
                    continue
                
                df = pd.DataFrame(rows)
                
                df.to_sql(
                    name=table_name,
                    con=connection,
                    if_exists='replace', 
                    index=False
                )