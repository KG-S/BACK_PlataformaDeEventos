const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @swagger
 * tags:
 *   - name: Eventos
 *     description: Endpoints para gerenciamento de eventos
 *
 * components:
 *   schemas:
 *     Evento:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "evt-12345"
 *         organizador_id:
 *           type: string
 *           example: "org-001"
 *         title:
 *           type: string
 *           example: "Workshop de Programação"
 *         description:
 *           type: string
 *           example: "Treinamento intensivo de lógica, APIs e microserviços."
 *         location:
 *           type: string
 *           example: "São Paulo - Centro"
 *         start_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-10T09:00:00-03:00"
 *         end_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-10T17:00:00-03:00"
 *         capacity:
 *           type: integer
 *           example: 40
 *         price:
 *           type: number
 *           format: float
 *           example: 120.00
 *         status:
 *           type: string
 *           example: "published"
 *
 *     EventoInput:
 *       type: object
 *       required:
 *         - organizador_id
 *         - title
 *         - start_at
 *       properties:
 *         organizador_id:
 *           type: string
 *           example: "org-001"
 *         title:
 *           type: string
 *           example: "Encontro de Inteligência Artificial"
 *         description:
 *           type: string
 *           example: "Discussão sobre tendências de IA e aplicações práticas."
 *         location:
 *           type: string
 *           example: "Curitiba - Centro de Convenções"
 *         start_at:
 *           type: string
 *           format: date-time
 *           example: "2025-09-15T09:30:00-03:00"
 *         end_at:
 *           type: string
 *           format: date-time
 *           example: "2025-09-15T18:00:00-03:00"
 *         capacity:
 *           type: integer
 *           example: 100
 *         price:
 *           type: number
 *           format: float
 *           example: 200.00
 *         status:
 *           type: string
 *           example: "draft"
 *
 * /eventos:
 *   get:
 *     summary: Lista todos os eventos
 *     description: Retorna todos os registros de eventos cadastrados.
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *             examples:
 *               exemplo:
 *                 value:
 *                   - id: "evt-1001"
 *                     organizador_id: "org-001"
 *                     title: "Workshop de Programação"
 *                     description: "Treinamento intensivo de lógica, APIs e microserviços."
 *                     location: "São Paulo - Centro"
 *                     start_at: "2025-10-10T09:00:00-03:00"
 *                     end_at: "2025-10-10T17:00:00-03:00"
 *                     capacity: 40
 *                     price: 120.0
 *                     status: "published"
 *                   - id: "evt-1002"
 *                     organizador_id: "org-002"
 *                     title: "Tech Conference 2025"
 *                     description: "Palestras e networking com profissionais de tecnologia."
 *                     location: "Rio de Janeiro - Copacabana"
 *                     start_at: "2025-11-20T08:00:00-03:00"
 *                     end_at: "2025-11-22T18:00:00-03:00"
 *                     capacity: 300
 *                     price: 350.0
 *                     status: "published"
 *       500:
 *         description: Erro interno ao buscar eventos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao buscar eventos"
 *
 *   post:
 *     summary: Cria um novo evento
 *     description: Adiciona um novo evento ao sistema.
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventoInput'
 *           example:
 *             organizador_id: "org-003"
 *             title: "Festival de Música e Arte"
 *             description: "Shows ao vivo, exposições culturais e feiras temáticas."
 *             location: "Belo Horizonte - Praça Central"
 *             start_at: "2025-12-05T16:00:00-03:00"
 *             end_at: "2025-12-07T23:00:00-03:00"
 *             capacity: 500
 *             price: 0.00
 *             status: "draft"
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *             example:
 *               id: "evt-1050"
 *               organizador_id: "org-003"
 *               title: "Festival de Música e Arte"
 *               description: "Shows ao vivo, exposições culturais e feiras temáticas."
 *               location: "Belo Horizonte - Praça Central"
 *               start_at: "2025-12-05T16:00:00-03:00"
 *               end_at: "2025-12-07T23:00:00-03:00"
 *               capacity: 500
 *               price: 0.00
 *               status: "draft"
 *       500:
 *         description: Erro interno ao criar evento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao criar evento"
 *
 * /eventos/{id}:
 *   get:
 *     summary: Busca um evento pelo ID
 *     description: Retorna os dados de um evento específico.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *             example:
 *               id: "evt-1001"
 *               organizador_id: "org-001"
 *               title: "Workshop de Programação"
 *               description: "Treinamento intensivo de lógica, APIs e microserviços."
 *               location: "São Paulo - Centro"
 *               start_at: "2025-10-10T09:00:00-03:00"
 *               end_at: "2025-10-10T17:00:00-03:00"
 *               capacity: 40
 *               price: 120.0
 *               status: "published"
 *       404:
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Evento não encontrado"
 *
 *   put:
 *     summary: Atualiza um evento existente
 *     description: Modifica os atributos de um evento existente.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventoInput'
 *           example:
 *             title: "Workshop de Programação Avançado"
 *             location: "São Paulo - Bela Vista"
 *             capacity: 50
 *             price: 150.00
 *             status: "published"
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *             example:
 *               id: "evt-1001"
 *               organizador_id: "org-001"
 *               title: "Workshop de Programação Avançado"
 *               description: "Treinamento intensivo de APIs e microserviços com prática real."
 *               location: "São Paulo - Bela Vista"
 *               start_at: "2025-10-10T09:00:00-03:00"
 *               end_at: "2025-10-10T17:00:00-03:00"
 *               capacity: 50
 *               price: 150.0
 *               status: "published"
 *       404:
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Evento não encontrado"
 *
 *   delete:
 *     summary: Remove um evento
 *     description: Exclui permanentemente um evento do sistema.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Evento removido com sucesso"
 *       404:
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Evento não encontrado"
 */

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM evento");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      organizador_id,
      title,
      description,
      location,
      start_at,
      end_at,
      capacity,
      price,
      status,
    } = req.body;

    const result = await db.query(
      `INSERT INTO evento (organizador_id, title, description, location, start_at, end_at, capacity, price, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [organizador_id, title, description, location, start_at, end_at, capacity, price, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM evento WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Evento não encontrado" });
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

    if (fields.length === 0)
      return res.status(400).json({ msg: "Nenhum campo enviado para atualização." });

    values.push(req.params.id);

    const result = await db.query(
      `UPDATE evento SET ${fields.join(", ")} WHERE id=$${i} RETURNING *`,
      values
    );

    if (!result.rowCount) return res.status(404).json({ msg: "Evento não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM evento WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Evento não encontrado" });
    res.json({ msg: "Evento removido" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
