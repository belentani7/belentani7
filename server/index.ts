import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // API: Health check
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      engine: "Belentani Mission Engine",
      version: "0.2.0",
      timestamp: new Date().toISOString()
    });
  });

  // API: List missions
  app.get("/api/missions", (req, res) => {
    const python = spawn("python", ["-c", `
import sys
sys.path.insert(0, '.')
from engine.cli import DB
try:
    missions = DB.list_missions()
    print(missions)
except Exception as e:
    print(f"ERROR:{e}")
    `], { cwd: path.resolve(__dirname, "..") });

    let output = "";
    python.stdout.on("data", (data) => { output += data.toString(); });
    python.stderr.on("data", (data) => { console.error(data.toString()); });
    python.on("close", (code) => {
      if (output.startsWith("ERROR:")) {
        res.status(500).json({ error: output.substring(6).trim() });
      } else {
        try {
          const missions = JSON.parse(output.trim());
          res.json({ missions });
        } catch {
          res.json({ missions: [] });
        }
      }
    });
  });

  // API: Get mission by ID
  app.get("/api/missions/:id", (req, res) => {
    const missionId = req.params.id;
    const python = spawn("python", ["-c", `
import sys
sys.path.insert(0, '.')
from engine.cli import DB
try:
    mission = DB.get_mission("${missionId}")
    print(mission)
except Exception as e:
    print(f"ERROR:{e}")
    `], { cwd: path.resolve(__dirname, "..") });

    let output = "";
    python.stdout.on("data", (data) => { output += data.toString(); });
    python.on("close", () => {
      if (output.startsWith("ERROR:")) {
        res.status(404).json({ error: output.substring(6).trim() });
      } else {
        try {
          const mission = JSON.parse(output.trim());
          res.json(mission);
        } catch {
          res.status(404).json({ error: "Mission not found" });
        }
      }
    });
  });

  // API: Create and run mission
  app.post("/api/missions", (req, res) => {
    const { objective, urls, max_pages = 3 } = req.body;
    
    if (!objective || objective.length < 3) {
      return res.status(400).json({ error: "Objective must be at least 3 characters" });
    }

    const spec = JSON.stringify({ objective, urls: urls || [], max_pages });
    const python = spawn("python", ["-c", `
import sys
sys.path.insert(0, '.')
from engine.cli import DB, ENGINE
spec = ${spec}
mission_id = DB.create_mission(ENGINE.normalize_spec(spec))
ENGINE.run(spec, mission_id)
results = DB.get_mission(mission_id)
print(results)
    `], { cwd: path.resolve(__dirname, "..") });

    let output = "";
    python.stdout.on("data", (data) => { output += data.toString(); });
    python.stderr.on("data", (data) => { console.error("Python error:", data.toString()); });
    python.on("close", (code) => {
      if (code !== 0) {
        res.status(500).json({ error: "Mission execution failed" });
      } else {
        try {
          const result = JSON.parse(output.trim());
          res.json(result);
        } catch {
          res.json({ status: "completed", output: output.trim() });
        }
      }
    });
  });

  // API: Export mission results
  app.get("/api/missions/:id/export/:format", (req, res) => {
    const { id, format } = req.params;
    const allowedFormats = ["csv", "json"];
    
    if (!allowedFormats.includes(format)) {
      return res.status(400).json({ error: `Format must be one of: ${allowedFormats.join(", ")}` });
    }

    const python = spawn("python", ["-c", `
import sys
sys.path.insert(0, '.')
from engine.cli import DB
results = DB.get_results("${id}")
if "${format}" == "csv":
    import csv
    import io
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=results[0].keys() if results else [])
    if results:
        writer.writeheader()
        writer.writerows(results)
    print(output.getvalue())
else:
    import json
    print(json.dumps(results, indent=2))
    `], { cwd: path.resolve(__dirname, "..") });

    let output = "";
    python.stdout.on("data", (data) => { output += data.toString(); });
    python.on("close", () => {
      if (format === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="mission-${id}.csv"`);
      }
      res.send(output);
    });
  });

  // Serve static files
  app.use(express.static(staticPath));

  // Handle client-side routing
  app.get("/{*splat}", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Frontend not built. Run 'pnpm run build' first." });
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`🚀 Belentani Server running on http://localhost:${port}/`);
    console.log(`📡 API available at http://localhost:${port}/api/`);
  });
}

startServer().catch(console.error);
