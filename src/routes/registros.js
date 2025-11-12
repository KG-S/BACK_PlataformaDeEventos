const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @swagger
 * tags:
 *   - name: Registros
 *     description: Endpoints relacionados às inscrições de participantes em eventos.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Registro:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "b9a9e2c1-45a7-4f20-9f91-3f91c998d8b2"
 *         evento_id:
 *           type: string
 *           format: uuid
 *           example: "1a3b4c5d-6789-4abc-90de-f1234567890a"
 *         participante_id:
 *           type: string
 *           format: uuid
 *           example: "2f3e4d5c-6789-4abc-90de-f1234567890b"
 *         status:
 *           type: string
 *           enum: [pending, confirmed, canceled]
 *           example: "confirmed"
 *         paid_amount:
 *           type: number
 *           format: float
 *           example: 120.00
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-01T14:30:00Z"
 *         evento:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "Workshop de Programação"
 *             location:
 *               type: string
 *               example: "São Paulo - Centro"
 *             start_at:
 *               type: string
 *               example: "2025-10-10T09:00:00-03"
 *             price:
 *               type: number
 *               example: 120.00
 *         participante:
 *           type: object
 *           properties:
 *             full_name:
 *               type: string
 *               example: "Ana Maria Silva"
 *             email:
 *               type: string
 *               example: "ana.silva@example.com"
 *             phone:
 *               type: string
 *               example: "11991234567"
 */

/**
 * @swagger
 * /registros:
 *   get:
 *     summary: Lista todos os registros de inscrição com detalhes do evento e participante.
 *     description: Retorna todos os registros de inscrições, unindo dados das tabelas `evento` e `participante`.
 *     tags: [Registros]
 *     responses:
 *       200:
 *         description: Lista de registros retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Registro'
 *             examples:
 *               exemploReal:
 *                 summary: Registros reais de eventos
 *                 value:
 *                   - id: "b9a9e2c1-45a7-4f20-9f91-3f91c998d8b2"
 *                     evento_id: "1a3b4c5d-6789-4abc-90de-f1234567890a"
 *                     participante_id: "2f3e4d5c-6789-4abc-90de-f1234567890b"
 *                     status: "confirmed"
 *                     paid_amount: 120.00
 *                     created_at: "2025-10-01T14:30:00Z"
 *                     evento:
 *                       title: "Workshop de Programação"
 *                       location: "São Paulo - Centro"
 *                       start_at: "2025-10-10T09:00:00-03"
 *                       price: 120.00
 *                     participante:
 *                       full_name: "Ana Maria Silva"
 *                       email: "ana.silva@example.com"
 *                       phone: "11991234567"
 *                   - id: "c2e9f4d2-9b12-4f1a-87c2-456a7f11e8c1"
 *                     evento_id: "3f9e4c5d-6789-4abc-90de-f1234567890c"
 *                     participante_id: "4f3e4d5c-6789-4abc-90de-f1234567890d"
 *                     status: "pending"
 *                     paid_amount: 0.00
 *                     created_at: "2025-10-05T09:45:00Z"
 *                     evento:
 *                       title: "Tech Conference 2025"
 *                       location: "Rio de Janeiro - Copacabana"
 *                       start_at: "2025-11-20T08:00:00-03"
 *                       price: 350.00
 *                     participante:
 *                       full_name: "Lucas Andrade"
 *                       email: "lucas.andrade@example.com"
 *                       phone: "21999887766"
 *       500:
 *         description: Erro interno ao buscar registros.
 *         content:
 *           application/json:
 *             example:
 *               msg: "Erro ao buscar registros"
 *
 *   post:
 *     summary: Cria um novo registro de inscrição.
 *     description: Registra a inscrição de um participante em um evento específico.
 *     tags: [Registros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - evento_id
 *               - participante_id
 *             properties:
 *               evento_id:
 *                 type: string
 *                 example: "1a3b4c5d-6789-4abc-90de-f1234567890a"
 *               participante_id:
 *                 type: string
 *                 example: "2f3e4d5c-6789-4abc-90de-f1234567890b"
 *               status:
 *                 type: string
 *                 example: "pending"
 *               paid_amount:
 *                 type: number
 *                 example: 0.00
 *     responses:
 *       201:
 *         description: Registro criado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: "f8b1d2e3-4567-4a89-b123-4567abcd890f"
 *               evento_id: "1a3b4c5d-6789-4abc-90de-f1234567890a"
 *               participante_id: "2f3e4d5c-6789-4abc-90de-f1234567890b"
 *               status: "pending"
 *               paid_amount: 0.00
 *               created_at: "2025-10-11T13:22:00Z"
 *       500:
 *         description: Erro interno ao criar registro.
 *         content:
 *           application/json:
 *             example:
 *               msg: "Erro ao criar registro"
 */

/**
 * @swagger
 * /registros/{id}:
 *   get:
 *     summary: Busca um registro de inscrição pelo ID.
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "b9a9e2c1-45a7-4f20-9f91-3f91c998d8b2"
 *     responses:
 *       200:
 *         description: Registro encontrado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: "b9a9e2c1-45a7-4f20-9f91-3f91c998d8b2"
 *               status: "confirmed"
 *               paid_amount: 120.00
 *               evento:
 *                 title: "Workshop de Programação"
 *                 location: "São Paulo - Centro"
 *               participante:
 *                 full_name: "Ana Maria Silva"
 *                 email: "ana.silva@example.com"
 *       404:
 *         description: Registro não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               msg: "Registro não encontrado"
 *
 *   put:
 *     summary: Atualiza informações de um registro.
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "c2e9f4d2-9b12-4f1a-87c2-456a7f11e8c1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "confirmed"
 *               paid_amount:
 *                 type: number
 *                 example: 350.00
 *     responses:
 *       200:
 *         description: Registro atualizado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               msg: "Registro atualizado com sucesso"
 *               registro:
 *                 id: "c2e9f4d2-9b12-4f1a-87c2-456a7f11e8c1"
 *                 status: "confirmed"
 *                 paid_amount: 350.00
 *       404:
 *         description: Registro não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               msg: "Registro não encontrado"
 *
 *   delete:
 *     summary: Remove um registro de inscrição.
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "f8b1d2e3-4567-4a89-b123-4567abcd890f"
 *     responses:
 *       200:
 *         description: Registro removido com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               msg: "Registro removido com sucesso"
 *       404:
 *         description: Registro não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               msg: "Registro não encontrado"
 */

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, p.full_name, e.title
       FROM registro r
       JOIN participante p ON p.id = r.participante_id
       JOIN evento e ON e.id = r.evento_id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { evento_id, participante_id, status, paid_amount } = req.body;
    const result = await db.query(
      `INSERT INTO registro (evento_id, participante_id, status, paid_amount)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [evento_id, participante_id, status, paid_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM registro WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Registro não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(req.body)) {
      fields.push(`${key}=$${i}`);
      values.push(value);
      i++;
    }

    if (fields.length === 0) {
      return res.status(400).json({ msg: "Nenhum campo enviado para atualização." });
    }

    values.push(req.params.id);

    const result = await db.query(
      `UPDATE registro SET ${fields.join(", ")} WHERE id=$${i} RETURNING *`,
      values
    );

    if (!result.rowCount)
      return res.status(404).json({ msg: "Registro não encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM registro WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Registro não encontrado" });
    res.json({ msg: "Registro removido" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
