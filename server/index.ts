import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const engineRoot = path.resolve(__dirname, "..");

const pythonOptions = (env: Record<string, string>) => ({
  cwd: engineRoot,
  env: { ...process.env, ...env }
});

const isSafeMissionId = (value: string) => /^[A-Za-z0-9_-]{1,128}$/.test(value);

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
    const python = spawn("python", ["-c", [
      "import json",
      "import sys",
      "sys.path.insert(0, '.')",
      "from engine.cli import DB",
      "try:",
      "    print(json.dumps(DB.list_missions()))",
      "except Exception as e:",
      "    print(f'ERROR:{e}')"
    ].join("\n")], pythonOptions({}));

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

    if (!isSafeMissionId(missionId)) {
      return res.status(400).json({ error: "Invalid mission id" });
    }

    const python = spawn("python", ["-c", [
      "import json",
      "import os",
      "import sys",
      "sys.path.insert(0, '.')",
      "from engine.cli import DB",
      "try:",
      "    mission = DB.get_mission(os.environ['BELENTANI_MISSION_ID'])",
      "    print(json.dumps(mission))",
      "except Exception as e:",
      "    print(f'ERROR:{e}')"
    ].join("\n")], pythonOptions({
      BELENTANI_MISSION_ID: missionId
    }));

    let output = "";
    python.stdout.on("data", (data) => { output += data.toString(); });
    python.on("close", () => {
      if (output.startsWith("ERROR:")) {
        return res.status(404).json({ error: output.substring(6).trim() });
      }

      try {
        const mission = JSON.parse(output.trim());
        if (!mission) {
          return res.status(404).json({ error: "Mission not found" });
        }
        return res.json(mission);
      } catch {
        return res.status(404).json({ error: "Mission not found" });
      }
    });
  });

  // API: Create and run mission
  app.post("/api/missions", (req, res) => {
<<<<<<< HEAD
    const body = req.body ?? {};
    const objective = body.objective;
    const urls = body.urls ?? [];
    const max_pages = body.max_pages ?? 3;

    if (
      typeof objective !== "string" ||
      objective.trim().length < 3 ||
      objective.length > 2000
    ) {
      return res.status(400).json({ error: "Objective must be between 3 and 2000 characters" });
=======
    const { objective, urls, max_pages = 3 } = req.body;

    if (!objective || objective.length < 3) {
      return res.status(400).json({ error: "Objective must be at least 3 characters" });
>>>>>>> 94a6e99 (chore: consolidar estado del proyecto (28 archivos))
    }

    if (
      !Array.isArray(urls) ||
      urls.some((url: unknown) => typeof url !== "string" || url.length > 2048)
    ) {
      return res.status(400).json({ error: "URLs must be an array of strings" });
    }

    if (!Number.isInteger(max_pages) || max_pages < 1 || max_pages > 100) {
      return res.status(400).json({ error: "max_pages must be an integer between 1 and 100" });
    }

    const spec = JSON.stringify({
      objective: objective.trim(),
      urls,
      max_pages
    });

    const python = spawn("python", ["-c", [
      "import json",
      "import os",
      "import sys",
      "sys.path.insert(0, '.')",
      "from engine.cli import DB, ENGINE",
      "spec = json.loads(os.environ['BELENTANI_MISSION_SPEC'])",
      "mission_id = DB.create_mission(ENGINE.normalize_spec(spec))",
      "ENGINE.run(spec, mission_id)",
      "print(json.dumps(DB.get_mission(mission_id)))"
    ].join("\n")], pythonOptions({
      BELENTANI_MISSION_SPEC: spec
    }));

    let output = "";
    python.stdout.on("data", (data) => { output += data.toString(); });
    python.stderr.on("data", (data) => { console.error("Python error:", data.toString()); });
    python.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "Mission execution failed" });
      }

      try {
        return res.json(JSON.parse(output.trim()));
      } catch {
        return res.status(500).json({ error: "Mission returned invalid output" });
      }
    });
  });

  // API: Export mission results
  app.get("/api/missions/:id/export/:format", (req, res) => {
    const { id, format } = req.params;
    const allowedFormats = ["csv", "json"];

<<<<<<< HEAD
    if (!isSafeMissionId(id)) {
      return res.status(400).json({ error: "Invalid mission id" });
=======
    if (!allowedFormats.includes(format)) {
      return res.status(400).json({ error: `Format must be one of: ${allowedFormats.join(", ")}` });
>>>>>>> 94a6e99 (chore: consolidar estado del proyecto (28 archivos))
    }

    if (!allowedFormats.includes(format)) {
      return res.status(400).json({ error: "Format must be one of: " + allowedFormats.join(", ") });
    }

    const python = spawn("python", ["-c", [
      "import csv",
      "import io",
      "import json",
      "import os",
      "import sys",
      "sys.path.insert(0, '.')",
      "from engine.cli import DB",
      "mission_id = os.environ['BELENTANI_MISSION_ID']",
      "export_format = os.environ['BELENTANI_EXPORT_FORMAT']",
      "results = DB.get_tasks(mission_id)",
      "if export_format == 'csv':",
      "    output = io.StringIO()",
      "    writer = csv.DictWriter(output, fieldnames=results[0].keys() if results else [])",
      "    if results:",
      "        writer.writeheader()",
      "        writer.writerows(results)",
      "    print(output.getvalue())",
      "else:",
      "    print(json.dumps(results, indent=2))"
    ].join("\n")], pythonOptions({
      BELENTANI_MISSION_ID: id,
      BELENTANI_EXPORT_FORMAT: format
    }));

    let output = "";
    python.stdout.on("data", (data) => { output += data.toString(); });
    python.on("close", () => {
      if (format === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=mission-" + id + ".csv");
      }
      return res.send(output);
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
