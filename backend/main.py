from fastapi import FastAPI, HTTPException, Response, Depends
from models import GeneratorRequest, ProjectCreate, ProjectSummary
from engine import DataEngine
from exporters import DataExporter
import uvicorn
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from database import init_db, get_db, ProjectDB

load_dotenv()

try:
    init_db()
except Exception as e:
    print(f"Warning: DB connection failed on startup. Ensure DB is running. Error: {e}")

app = FastAPI(
    title="LLM Data Generator API",
    description="Relational Data Generator API",
    version="0.3.0" # Bump version
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data_engine = DataEngine()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Relational Generator API is running"}

@app.post("/generate")
def generate_data(request: GeneratorRequest):
    print(f"Received job: {request.config.job_name} with {len(request.tables)} tables.")
    
    try:
        generated_data = data_engine.generate(request)
        
        format_type = request.config.output_format.lower()
        
        if format_type == "json":
            total_rows = sum(len(rows) for rows in generated_data.values())
            return {
                "status": "success",
                "job_name": request.config.job_name,
                "tables_count": len(generated_data),
                "total_rows": total_rows,
                "data": generated_data 
            }
            
        elif format_type == "csv":
            zip_content = DataExporter.to_csv_zip(generated_data)
            return Response(
                content=zip_content,
                media_type="application/zip",
                headers={"Content-Disposition": f"attachment; filename={request.config.job_name}.zip"}
            )
            
        elif format_type == "sql":
            file_name = request.config.job_name.replace(" ", "_").lower()
            sql_content = DataExporter.to_sql(generated_data)
            return Response(
                content=sql_content,
                media_type="application/sql",
                headers={"Content-Disposition": f"attachment; filename={file_name}.sql"}
            )
            
        else:
            raise HTTPException(status_code=400, detail="Unsupported output format")

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/projects", response_model=ProjectSummary)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    schema_json = project.schema_data.model_dump()
    
    db_project = ProjectDB(
        name=project.name,
        description=project.description,
        schema_data=schema_json
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/projects", response_model=List[ProjectSummary])
def list_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = db.query(ProjectDB).order_by(ProjectDB.updated_at.desc()).offset(skip).limit(limit).all()
    return projects

@app.get("/projects/{project_id}", response_model=GeneratorRequest)
def get_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return db_project.schema_data

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return {"status": "success", "message": "Project deleted"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)