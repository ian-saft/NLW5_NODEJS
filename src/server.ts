import express from 'express';

const app = express();
const PORT = 3333;

/**
 * GET    = Buscas
 * POST   = Criação
 * PUT    = Alteração
 * DELETE = Deletar
 * PATCH  = Alterar um informação específica
 */

app.get('/', (req, res) => {
    return res.json({
        message: "Hello NLW5!",
        by: "Ian Saft"
    })
})

app.post('/signup', (req, res) => {
    return res.json({
        message: "User successfully registered"
    })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}. URL: localhost:${PORT}`));