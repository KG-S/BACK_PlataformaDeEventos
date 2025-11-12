const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @swagger
 * tags:
 *   - name: Organizadores
 *     description: Endpoints para gerenciamento de organizadores
 *
 * components:
 *   schemas:
 *     Organizador:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "a7b9d3e2-5f41-4c6a-9b2f-2b7a3a2e0c9a"
 *         name:
 *           type: string
 *           example: "Eventos Brasil"
 *         email:
 *           type: string
 *           example: "contato@eventosbrasil.com"
 *         contact_phone:
 *           type: string
 *           example: "11987654321"
 *
 *     OrganizadorInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: "TechMasters"
 *         email:
 *           type: string
 *           example: "info@techmasters.com"
 *         contact_phone:
 *           type: string
 *           example: "21999887766"
 */

/**
 * @swagger
 * /organizadores:
 *   get:
 *     summary: Lista todos os organizadores
 *     description: Retorna todos os registros de organizadores cadastrados.
 *     tags: [Organizadores]
 *     responses:
 *       200:
 *         description: Lista de organizadores retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organizador'
 *             examples:
 *               exemplo:
 *                 value:
 *                   - id: "a7b9d3e2-5f41-4c6a-9b2f-2b7a3a2e0c9a"
 *                     name: "Eventos Brasil"
 *                     email: "contato@eventosbrasil.com"
 *                     contact_phone: "11987654321"
 *                   - id: "b1c2d3e4-8f65-4a7c-91de-9f8a1b2c3d4e"
 *                     name: "TechMasters"
 *                     email: "info@techmasters.com"
 *                     contact_phone: "21999887766"
 *                   - id: "c9d8e7f6-1a2b-3c4d-5e6f-7a8b9c0d1e2f"
 *                     name: "Cultura Viva"
 *                     email: "cultura@vivabrasil.com"
 *                     contact_phone: "31988776655"
 *       500:
 *         description: Erro interno ao buscar organizadores.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao buscar organizadores"
 *
 *   post:
 *     summary: Cria um novo organizador
 *     description: Adiciona um novo organizador ao sistema.
 *     tags: [Organizadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganizadorInput'
 *           examples:
 *             exemplo:
 *               value:
 *                 name: "Cultura Viva"
 *                 email: "cultura@vivabrasil.com"
 *                 contact_phone: "31988776655"
 *     responses:
 *       201:
 *         description: Organizador criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organizador'
 *       500:
 *         description: Erro interno ao criar organizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao criar organizador"
 */

/**
 * @swagger
 * /organizadores/{id}:
 *   get:
 *     summary: Busca um organizador pelo ID
 *     description: Retorna os dados de um organizador específico.
 *     tags: [Organizadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único do organizador.
 *         example: "a7b9d3e2-5f41-4c6a-9b2f-2b7a3a2e0c9a"
 *     responses:
 *       200:
 *         description: Organizador encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organizador'
 *             example:
 *               id: "a7b9d3e2-5f41-4c6a-9b2f-2b7a3a2e0c9a"
 *               name: "Eventos Brasil"
 *               email: "contato@eventosbrasil.com"
 *               contact_phone: "11987654321"
 *       404:
 *         description: Organizador não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Organizador não encontrado"
 *       500:
 *         description: Erro interno ao buscar organizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao buscar organizador"
 *
 *   put:
 *     summary: Atualiza os dados de um organizador
 *     description: Modifica os atributos de um organizador existente.
 *     tags: [Organizadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "b1c2d3e4-8f65-4a7c-91de-9f8a1b2c3d4e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganizadorInput'
 *           examples:
 *             exemplo:
 *               value:
 *                 name: "TechMasters Conference"
 *                 email: "contact@techmasters.com"
 *                 contact_phone: "21991234567"
 *     responses:
 *       200:
 *         description: Organizador atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organizador'
 *       404:
 *         description: Organizador não encontrado.
 *       500:
 *         description: Erro interno ao atualizar organizador.
 *
 *   delete:
 *     summary: Remove um organizador
 *     description: Exclui permanentemente um organizador do sistema.
 *     tags: [Organizadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "c9d8e7f6-1a2b-3c4d-5e6f-7a8b9c0d1e2f"
 *     responses:
 *       200:
 *         description: Organizador removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Organizador removido com sucesso"
 *       404:
 *         description: Organizador não encontrado.
 *       500:
 *         description: Erro interno ao deletar organizador.
 */

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM organizador");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, contact_phone } = req.body;
    const result = await db.query(
      "INSERT INTO organizador (name, email, contact_phone) VALUES ($1, $2, $3) RETURNING *",
      [name, email, contact_phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM organizador WHERE id = $1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Organizador não encontrado" });
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
      `UPDATE organizador SET ${fields.join(", ")} WHERE id=$${i} RETURNING *`,
      values
    );

    if (!result.rowCount)
      return res.status(404).json({ msg: "Organizador não encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM organizador WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ msg: "Organizador não encontrado" });
    res.json({ msg: "Organizador removido" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router; 