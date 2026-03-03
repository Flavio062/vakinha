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
  app.post("/api/pix", async (req, res) => {
    try {
      const { amount, name, cpf, email, phone } = req.body;
      const token = '8cb6a372-6b5a-47dc-a8cd-378176c53786';

      const response = await fetch('https://api.syncpayments.com.br/api/partner/v1/cash-in', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Number(amount),
          description: "Doação SOS Minas Gerais",
          webhook_url: "https://seusite.com/webhook",
          client: {
            name: name || "Doador",
            cpf: cpf ? cpf.replace(/\D/g, '') : "00000000000",
            email: email || "doador@email.com",
            phone: phone ? phone.replace(/\D/g, '') : "00000000000"
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro SyncPay:', data);
        return res.status(response.status).json({ error: 'Erro ao gerar PIX na SyncPay', details: data });
      }

      res.json(data);
    } catch (error) {
      console.error('Erro interno:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

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

  app.get("/api/cadastros", (req, res) => {
    try {
      const dataDir = path.join(__dirname, "infos");
      if (!fs.existsSync(dataDir)) {
        return res.json([]);
      }

      const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
      const cadastros = files.map(file => {
        const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
        return JSON.parse(content);
      });

      // Sort by timestamp descending
      cadastros.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      res.json(cadastros);
    } catch (error) {
      console.error("Erro ao buscar cadastros:", error);
      res.status(500).json({ status: "error", message: "Erro ao buscar cadastros" });
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
