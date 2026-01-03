def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "API Running (Protected)"}

def test_login(client, test_user):
    response = client.post("/token", data={"username": "testadmin", "password": "testpass"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_failed(client):
    response = client.post("/token", data={"username": "wrong", "password": "wrong"})
    assert response.status_code == 401

def test_create_project_unauthorized(client):
    response = client.post("/projects", json={"name": "Test", "schema_data": {}})
    assert response.status_code == 401

def test_create_project(client, auth_headers):
    payload = {
        "name": "Integration Test Project",
        "description": "Created by pytest",
        "schema_data": {
            "config": {"job_name": "test"},
            "tables": []
        }
    }
    response = client.post("/projects", json=payload, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Integration Test Project"
    assert "id" in data

def test_generate_sync(client, auth_headers):
    payload = {
        "config": {
            "job_name": "Test Job",
            "global_context": "test",
            "output_format": "json",
            "locale": "en_US"
        },
        "tables": [
            {
                "id": "t1",
                "name": "users",
                "rows_count": 5,
                "fields": [
                    {"name": "id", "type": "faker", "params": {"provider": "uuid4"}}
                ]
            }
        ]
    }
    response = client.post("/generate", json=payload, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total_rows"] == 5
    assert len(data["data"]["users"]) == 5