import express from 'express';
import cors from 'cors';
import { conn } from './config/sequelize.js';

import "./models/association.js"
import autorRoutes from './routes/autorRoutes.js';

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

conn
.sync()
.then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
})
.catch((error) => {
    console.log(error)
});

app.use('/api/autores', autorRoutes);

app.get('/', (req, res) => {
    res.status(200).json({mensagem: 'Hello, World!'});
});

export default app;