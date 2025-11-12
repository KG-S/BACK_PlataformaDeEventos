const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @swagger
 * tags:
 *   - name: Participantes
 *     description: Endpoints para gerenciamento de participantes
 *
 * components:
 *   schemas:
 *     Participante:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         full_name:
 *           type: string
 *           example: "Ana Maria Silva"
 *         email:
 *           type: string
 *           example: "ana.silva@example.com"
 *         phone:
 *           type: string
 *           example: "11991234567"
 *         date_of_birth:
 *           type: string
 *           format: date
 *           example: "1995-03-12"
 *         profile:
 *           type: object
 *           example:
 *             interests: ["tecnologia", "workshops"]
 *             newsletter: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-10T09:00:00-03:00"
 *
 *     ParticipanteInput:
 *       type: object
 *       required:
 *         - full_name
 *         - email
 *       properties:
 *         full_name:
 *           type: string
 *           example: "Carla Moura"
 *         email:
 *           type: string
 *           example: "carla.moura@example.com"
 *         phone:
 *           type: string
 *           example: "31988774455"
 *         date_of_birth:
 *           type: string
 *           format: date
 *           example: "1988-05-30"
 *         profile:
 *           type: object
 *           example:
 *             preferences:
 *               seat: "front"
 *               food: "vegan"
 *
 * /participantes:
 *   get:
 *     summary: Lista todos os participantes
 *     description: Retorna todos os registros de participantes cadastrados.
 *     tags: [Participantes]
 *     responses:
 *       200:
 *         description: Lista de participantes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participante'
 *             examples:
 *               exemplo:
 *                 value:
 *                   - id: "d1f6e9b4-1234-4fbb-9d44-2f87e45a1c02"
 *                     full_name: "Ana Maria Silva"
 *                     email: "ana.silva@example.com"
 *                     phone: "11991234567"
 *                     date_of_birth: "1995-03-12"
 *                     profile:
 *                       interests: ["tecnologia", "workshops"]
 *                       newsletter: true
 *                     created_at: "2025-10-10T09:00:00-03:00"
 *                   - id: "b2a3f7c9-789a-4bb3-84f5-7c2d24d9bcd3"
 *                     full_name: "Lucas Andrade"
 *                     email: "lucas.andrade@example.com"
 *                     phone: "21999887766"
 *                     date_of_birth: "1990-07-22"
 *                     profile:
 *                       vip: true
 *                       instagram: "@lucasdev"
 *                     created_at: "2025-10-11T10:20:00-03:00"
 *       500:
 *         description: Erro interno ao buscar participantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao buscar participantes"
 *
 *   post:
 *     summary: Cria um novo participante
 *     description: Adiciona um novo participante ao sistema.
 *     tags: [Participantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipanteInput'
 *           example:
 *             full_name: "João Pedro"
 *             email: "joao.pedro@example.com"
 *             phone: "11988776655"
 *             date_of_birth: "1998-11-10"
 *             profile:
 *               interests: ["música", "festivais"]
 *               newsletter: false
 *     responses:
 *       201:
 *         description: Participante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participante'
 *             example:
 *               id: "f3e2c7d8-4455-4bcd-a123-ffb7a9c43210"
 *               full_name: "João Pedro"
 *               email: "joao.pedro@example.com"
 *               phone: "11988776655"
 *               date_of_birth: "1998-11-10"
 *               profile:
 *                 interests: ["música", "festivais"]
 *                 newsletter: false
 *               created_at: "2025-11-11T21:40:00-03:00"
 *       500:
 *         description: Erro interno ao criar participante.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao criar participante"
 *
 * /participantes/{id}:
 *   get:
 *     summary: Busca um participante pelo ID
 *     description: Retorna os dados de um participante específico.
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "d1f6e9b4-1234-4fbb-9d44-2f87e45a1c02"
 *         description: ID do participante
 *     responses:
 *       200:
 *         description: Participante encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participante'
 *             example:
 *               id: "d1f6e9b4-1234-4fbb-9d44-2f87e45a1c02"
 *               full_name: "Ana Maria Silva"
 *               email: "ana.silva@example.com"
 *               phone: "11991234567"
 *               date_of_birth: "1995-03-12"
 *               profile:
 *                 interests: ["tecnologia", "workshops"]
 *                 newsletter: true
 *               created_at: "2025-10-10T09:00:00-03:00"
 *       404:
 *         description: Participante não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Participante não encontrado"
 *       500:
 *         description: Erro interno ao buscar participante.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao buscar participante"
 *
 *   put:
 *     summary: Atualiza os dados de um participante
 *     description: Modifica os atributos de um participante existente.
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "b2a3f7c9-789a-4bb3-84f5-7c2d24d9bcd3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipanteInput'
 *           example:
 *             full_name: "Lucas Andrade"
 *             email: "lucas.andrade@example.com"
 *             phone: "21999887766"
 *             date_of_birth: "1990-07-22"
 *             profile:
 *               vip: true
 *               instagram: "@lucasdev"
 *     responses:
 *       200:
 *         description: Participante atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participante'
 *             example:
 *               id: "b2a3f7c9-789a-4bb3-84f5-7c2d24d9bcd3"
 *               full_name: "Lucas Andrade"
 *               email: "lucas.andrade@example.com"
 *               phone: "21999887766"
 *               date_of_birth: "1990-07-22"
 *               profile:
 *                 vip: true
 *                 instagram: "@lucasdev"
 *               created_at: "2025-10-11T10:20:00-03:00"
 *       404:
 *         description: Participante não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Participante não encontrado"
 *       500:
 *         description: Erro interno ao atualizar participante.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao atualizar participante"
 *
 *   delete:
 *     summary: Remove um participante
 *     description: Exclui permanentemente um participante do sistema.
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "d1f6e9b4-1234-4fbb-9d44-2f87e45a1c02"
 *     responses:
 *       200:
 *         description: Participante removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Participante removido com sucesso"
 *       404:
 *         description: Participante não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Participante não encontrado"
 *       500:
 *         description: Erro interno ao deletar participante.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao deletar participante"
 */


router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM participante");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { full_name, email, phone, date_of_birth, profile } = req.body;
    const result = await db.query(
      `INSERT INTO participante (full_name, email, phone, date_of_birth, profile)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [full_name, email, phone, date_of_birth, profile]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM participante WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Participante não encontrado" });
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
      `UPDATE participante SET ${fields.join(", ")} WHERE id=$${i} RETURNING *`,
      values
    );

    if (!result.rowCount)
      return res.status(404).json({ msg: "Participante não encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM participante WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Participante não encontrado" });
    res.json({ msg: "Participante removido" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
