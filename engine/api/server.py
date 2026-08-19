from __future__ import annotations

import os
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from engine.cli import DB, ENGINE

app = FastAPI(title='Bellentani Mission Engine', version='0.1.0')
pool = ThreadPoolExecutor(max_workers=2)

class MissionRequest(BaseModel):
    objective: str = Field(min_length=3)
    urls: list[str] = Field(default_factory=list)
    max_pages: int = Field(default=3, ge=1, le=50)
    retries: int = Field(default=2, ge=0, le=5)
    rate_limit: float = Field(default=0.8, ge=0.0)
    timeout: float = Field(default=20, ge=1, le=120)

@app.get('/health')
def health(): return {'ok': True, 'engine': 'Bellentani'}

@app.post('/missions', status_code=202)
async def create(req: MissionRequest):
    spec = req.model_dump()
    mission_id = DB.create_mission(spec)
    def run_existing():
        # Reuse the persisted id by executing the same lifecycle with a worker-safe wrapper.
        ENGINE.run(spec, mission_id)
    pool.submit(run_existing)
    return {'id': mission_id, 'status': 'queued'}

@app.get('/missions')
def list_missions(): return DB.list_missions()

@app.get('/missions/{mission_id}')
def get(mission_id: str):
    mission = DB.get_mission(mission_id)
    if not mission: raise HTTPException(404, 'Misión no encontrada')
    return mission

@app.get('/missions/{mission_id}/status')
def status(mission_id: str):
    mission = DB.get_mission(mission_id)
    if not mission: raise HTTPException(404, 'Misión no encontrada')
    tasks = DB.get_tasks(mission_id)
    return {'id': mission_id, 'status': mission['status'], 'tasks': [{'id': t['id'], 'url': t['url'], 'status': t['status'], 'attempts': t['attempts'], 'error': t['error']} for t in tasks]}

@app.get('/missions/{mission_id}/results')
def results(mission_id: str):
    mission = DB.get_mission(mission_id)
    if not mission: raise HTTPException(404, 'Misión no encontrada')
    return {'mission': mission, 'results': DB.get_tasks(mission_id), 'events': DB.events(mission_id), 'costs': DB.costs(mission_id)}
