import express from 'express';
import cors from 'cors';
import { conn } from './config/sequelize.js';

import "./models/association.js"
import autorRoutes from './routes/autorRoutes.js';
import livroRoutes from './routes/livroRoutes.js'

import path from "node:path"
import { fileURLToPath } from "node:url";


const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use("/public", express.static(path.join(__dirname, "../public")))

conn
.sync()
.then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
})
.catch((error) => {
    console.log(error)
});

app.use('/api/autores', autorRoutes);
app.use('/api/livros', livroRoutes);

app.get('/', (req, res) => {
    res.status(200).json({mensagem: 'Hello, World!'});
});

export default app;