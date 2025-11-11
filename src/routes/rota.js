const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @swagger
 * tags:
 *   - name: Organizadores
 *   - name: Eventos
 *   - name: Participantes
 *   - name: Registros
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Organizador:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         contact_phone:
 *           type: string
 *
 *     Evento:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         organizador_id: { type: string }
 *         title: { type: string }
 *         description: { type: string }
 *         location: { type: string }
 *         start_at: { type: string, format: date-time }
 *         end_at: { type: string, format: date-time }
 *         capacity: { type: integer }
 *         price: { type: number }
 *         status: { type: string }
 *
 *     Participante:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         full_name: { type: string }
 *         email: { type: string }
 *         phone: { type: string }
 *         date_of_birth: { type: string, format: date }
 *         profile: { type: object }
 *         created_at: { type: string, format: date-time }
 *
 *     Registro:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         evento_id: { type: string }
 *         participante_id: { type: string }
 *         status: { type: string }
 *         paid_amount: { type: number }
 *         created_at: { type: string, format: date-time }
 */

/**
 * @swagger
 * /organizadores:
 *   get:
 *     tags: [Organizadores]
 *     summary: Lista todos os organizadores
 *     responses:
 *       200:
 *         description: Lista retornada
 */

/**
 * @swagger
 * /organizadores:
 *   post:
 *     tags: [Organizadores]
 *     summary: Cria um novo organizador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Organizador'
 *     responses:
 *       201:
 *         description: Criado
 */
router.get("/organizadores", async (req, res) => {
  const result = await db.query("SELECT * FROM organizador");
  res.json(result.rows);
});

router.post("/organizadores", async (req, res) => {
  const { name, email, contact_phone } = req.body;
  const result = await db.query(
    "INSERT INTO organizador (name, email, contact_phone) VALUES ($1,$2,$3) RETURNING *",
    [name, email, contact_phone]
  );
  res.status(201).json(result.rows[0]);
});

/**
 * @swagger
 * /organizadores/{id}:
 *   get:
 *     summary: Busca um organizador pelo ID.
 *     description: Retorna os dados de um organizador específico baseado no ID informado.
 *     tags: [Organizadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único do organizador.
 *     responses:
 *       200:
 *         description: Organizador encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organizador'
 *       404:
 *         description: Organizador não encontrado.
 */

router.get("/organizadores/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM organizador WHERE id = $1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Organizador não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * @swagger
 * /organizadores/{id}:
 *   put:
 *     summary: Atualiza os dados de um organizador.
 *     description: Modifica os atributos de um organizador existente com base no ID informado.
 *     tags: [Organizadores]
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
 *             $ref: '#/components/schemas/Organizador'
 *     responses:
 *       200:
 *         description: Organizador atualizado com sucesso.
 *       400:
 *         description: Dados inválidos enviados.
 *       404:
 *         description: Organizador não encontrado.
 */

router.put("/organizadores/:id", async (req, res) => {
  try {
    const { name, email, contact_phone } = req.body;
    const result = await db.query(
      `UPDATE organizador SET name=$1, email=$2, contact_phone=$3 WHERE id=$4 RETURNING *`,
      [name, email, contact_phone, req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ msg: "Organizador não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * @swagger
 * /organizadores/{id}:
 *   delete:
 *     summary: Remove um organizador.
 *     description: Exclui permanentemente um organizador do sistema.
 *     tags: [Organizadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organizador removido com sucesso.
 *       404:
 *         description: Organizador não encontrado.
 */


router.delete("/organizadores/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM organizador WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Organizador não encontrado" });
    res.json({ msg: "Organizador removido" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ------------------------------------------------------
// EVENTOS
// ------------------------------------------------------

/**
 * @swagger
 * /eventos:
 *   get:
 *     tags: [Eventos]
 *     summary: Lista eventos
 *   post:
 *     tags: [Eventos]
 *     summary: Cria evento
 */
router.get("/eventos", async (req, res) => {
  const result = await db.query("SELECT * FROM evento");
  res.json(result.rows);
});

router.post("/eventos", async (req, res) => {
  const { organizador_id, title, description, location, start_at, end_at, capacity, price, status } =
    req.body;

  const result = await db.query(
    `INSERT INTO evento (organizador_id, title, description, location, start_at, end_at, capacity, price, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [organizador_id, title, description, location, start_at, end_at, capacity, price, status]
  );

  res.status(201).json(result.rows[0]);
});

/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Busca evento pelo ID.
 *     description: Retorna os detalhes completos de um evento específico.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado.
 *       404:
 *         description: Evento não encontrado.
 */

router.get("/eventos/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM evento WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Evento não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * @swagger
 * /eventos/{id}:
 *   put:
 *     summary: Atualiza um evento existente.
 *     description: Modifica os detalhes de um evento com base no ID informado.
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
 *             $ref: '#/components/schemas/Evento'
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       404:
 *         description: Evento não encontrado.
 */


router.put("/eventos/:id", async (req, res) => {
  try {
    const { title, description, location, start_at, end_at, capacity, price, status } = req.body;
    const result = await db.query(
      `UPDATE evento SET title=$1, description=$2, location=$3, start_at=$4, end_at=$5, capacity=$6,
       price=$7, status=$8 WHERE id=$9 RETURNING *`,
      [title, description, location, start_at, end_at, capacity, price, status, req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ msg: "Evento não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * @swagger
 * /eventos/{id}:
 *   delete:
 *     summary: Remove evento.
 *     description: Exclui definitivamente um evento do sistema.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento removido.
 *       404:
 *         description: Evento não encontrado.
 */

router.delete("/eventos/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM evento WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Evento não encontrado" });
    res.json({ msg: "Evento removido" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ------------------------------------------------------
// PARTICIPANTES
// ------------------------------------------------------

/**
 * @swagger
 * /participantes:
 *   get:
 *     tags: [Participantes]
 *     summary: Lista participantes
 *   post:
 *     tags: [Participantes]
 *     summary: Cria participante
 */
router.get("/participantes", async (req, res) => {
  const result = await db.query("SELECT * FROM participante");
  res.json(result.rows);
});

router.post("/participantes", async (req, res) => {
  const { full_name, email, phone, date_of_birth, profile } = req.body;
  const result = await db.query(
    `INSERT INTO participante (full_name,email,phone,date_of_birth,profile)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [full_name, email, phone, date_of_birth, profile]
  );
  res.status(201).json(result.rows[0]);
});

/**
 * @swagger
 * /participantes/{id}:
 *   get:
 *     summary: Busca um participante pelo ID.
 *     description: Retorna os dados cadastrados de um participante específico.
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participante encontrado.
 *       404:
 *         description: Participante não encontrado.
 */

router.get("/participantes/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM participante WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Participante não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * @swagger
 * /participantes/{id}:
 *   put:
 *     summary: Atualiza os dados de um participante.
 *     description: Permite modificar atributos cadastrais de um participante existente.
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Participante'
 *     responses:
 *       200:
 *         description: Participante atualizado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       404:
 *         description: Participante não encontrado.
 */


router.put("/participantes/:id", async (req, res) => {
  try {
    const { full_name, email, phone, date_of_birth, profile } = req.body;
    const result = await db.query(
      `UPDATE participante SET full_name=$1,email=$2,phone=$3,date_of_birth=$4,profile=$5
       WHERE id=$6 RETURNING *`,
      [full_name, email, phone, date_of_birth, profile, req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ msg: "Participante não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * @swagger
 * /participantes/{id}:
 *   delete:
 *     summary: Remove um participante.
 *     description: Exclui um participante do sistema.
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Participante removido.
 *       404:
 *         description: Participante não encontrado.
 */

router.delete("/participantes/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM participante WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Participante não encontrado" });
    res.json({ msg: "Participante removido" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ------------------------------------------------------
// REGISTROS
// ------------------------------------------------------

/**
 * @swagger
 * /registros:
 *   get:
 *     tags: [Registros]
 *     summary: Lista registros com join
 *   post:
 *     tags: [Registros]
 *     summary: Cria um novo registro de inscrição
 */
router.get("/registros", async (req, res) => {
  const result = await db.query(
    `SELECT r.*, p.full_name, e.title
     FROM registro r
     JOIN participante p ON p.id=r.participante_id
     JOIN evento e ON e.id=r.evento_id`
  );
  res.json(result.rows);
});

router.post("/registros", async (req, res) => {
  const { evento_id, participante_id, status, paid_amount } = req.body;
  const result = await db.query(
    `INSERT INTO registro (evento_id,participante_id,status,paid_amount)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [evento_id, participante_id, status, paid_amount]
  );
  res.status(201).json(result.rows[0]);
});

/**
 * @swagger
 * /registros/{id}:
 *   get:
 *     summary: Busca um registro pelo ID.
 *     description: Retorna informações específicas de um registro de inscrição.
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro encontrado.
 *       404:
 *         description: Registro não encontrado.
 */

router.get("/registros/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM registro WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Registro não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * @swagger
 * /registros/{id}:
 *   put:
 *     summary: Atualiza um registro de inscrição.
 *     description: Atualiza informações como status e pagamento do registro.
 *     tags: [Registros]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               paid_amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Registro atualizado.
 *       404:
 *         description: Registro não encontrado.
 */

router.put("/registros/:id", async (req, res) => {
  try {
    const { status, paid_amount } = req.body;
    const result = await db.query(
      `UPDATE registro SET status=$1, paid_amount=$2 WHERE id=$3 RETURNING *`,
      [status, paid_amount, req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ msg: "Registro não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * @swagger
 * /registros/{id}:
 *   delete:
 *     summary: Remove um registro.
 *     description: Exclui permanentemente um registro de inscrição.
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro removido.
 *       404:
 *         description: Registro não encontrado.
 */

router.delete("/registros/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM registro WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Registro não encontrado" });
    res.json({ msg: "Registro removido" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
