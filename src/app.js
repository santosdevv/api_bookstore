import express from "express";
import cors from "cors";
import { conn } from "./config/sequelize.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

//TABELAS
import './models/association.js'

//ROTAS
import autorRoutes from "./routes/autorRoutes.js"
import livroRoutes from "./routes/livroRouter.js"

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    creditials: true,
  })
);
app.use(express.json());// ACEITA receber de JSON
app.use(express.urlencoded({extended: true})) //ACEITA receber de Imagens

//Qual pasta que vou armazenar
app.use('/public', express.static(path.join(__dirname, '../public')))

conn
  .sync()
  .then(() => {
    console.log("Banco de dados conectado 🫥");
  })
  .catch((error) => console.log(error));

//USAR/REGISTRAR AS ROTAS
app.use("/api/autores", autorRoutes)
app.use("/api/livros", livroRoutes)

app.get("/", (request, response) => {
  response.status(200).json({ mensagem: "Olá, Mundo!" });
});

export default app;
