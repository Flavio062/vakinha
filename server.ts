import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/cadastro", (req, res) => {
    try {
      const { nome, cpf, telefone, valor } = req.body;
      
      const dataDir = path.join(__dirname, "infos");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Count existing files to keep them in order (e.g., 001.json, 002.json)
      const files = fs.readdirSync(dataDir);
      const nextId = String(files.length + 1).padStart(4, '0');
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `info_${nextId}_${timestamp}.json`;
      const filepath = path.join(dataDir, filename);

      fs.writeFileSync(filepath, JSON.stringify({ id: nextId, nome, cpf, telefone, valor, timestamp }, null, 2));

      res.json({ status: "ok", message: "Cadastro salvo com sucesso" });
    } catch (error) {
      console.error("Erro ao salvar cadastro:", error);
      res.status(500).json({ status: "error", message: "Erro ao salvar cadastro" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
