const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// TEST ROUTE
app.get('/', (req, res) => res.send('Teacher Coach Backend is Running! 🚀'));

// 1. RECEIVE TEACHER QUERY
app.post('/api/query', async (req, res) => {
  try {
    const { teacherId, grade, subject, query, studentProfiles } = req.body;
    
    // Store query
    const result = await db.query(
      `INSERT INTO queries (teacher_id, grade, subject, query, student_profiles) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [teacherId, grade, subject, query, JSON.stringify(studentProfiles)]
    );
    const queryId = result.rows[0].id;

    // SIMULATED AI RESPONSE
    const responseText = `(AI Coach): Based on NEPA 2020 guidelines for Grade ${grade} ${subject}:
1. 🧱 Use concrete examples to explain the concept.
2. 🤝 Pair students for peer learning.
3. ✅ Check for understanding with a quick game.`;

    await db.query(`UPDATE queries SET response = $1, status = 'answered' WHERE id = $2`, [responseText, queryId]);

    res.json({ success: true, queryId, response: responseText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. FETCH DASHBOARD DATA (Queries + Modules)
app.get('/api/dashboard', async (req, res) => {
  try {
    const queries = await db.query('SELECT * FROM queries ORDER BY created_at DESC LIMIT 10');
    const modules = await db.query('SELECT * FROM modules ORDER BY created_at DESC LIMIT 5');
    
    res.json({ 
      queries: queries.rows,
      modules: modules.rows 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. MAGIC BUTTON: TRIGGER SYSTEM ANALYSIS (Simulates Pattern Detection)
app.post('/api/trigger-analysis', async (req, res) => {
  try {
    // In a real app, this analyzes thousands of rows. 
    // For the demo, we FORCE a pattern detection.
    
    const fakeTopic = "Mastering Fractions in Grade 5";
    const content = "Training Module Plan:\n1. Introduction using Roti/Pizza examples.\n2. Activity: Paper folding.\n3. Assessment: Visual shading quiz.";
    
    // Check if we already added it so we don't duplicate too much
    await db.query(
      `INSERT INTO modules (subject, grade, title, content, generated_from_queries, success_rate, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      ['Math', 5, fakeTopic, content, 42, 88.5, 'pending_review']
    );

    res.json({ success: true, message: "Pattern Detected! Module Generated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. DEPLOY MODULE
app.post('/api/deploy-module/:id', async (req, res) => {
  try {
    await db.query("UPDATE modules SET status = 'deployed' WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ... existing code ...

// 5. ONE-TIME DATABASE SETUP (Run this once to create tables on Render)
app.get('/setup-db', async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS queries (
        id SERIAL PRIMARY KEY,
        teacher_id VARCHAR(255),
        grade INTEGER,
        subject VARCHAR(100),
        query TEXT,
        student_profiles JSONB,
        response TEXT,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS modules (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(100),
        grade INTEGER,
        title VARCHAR(200),
        content TEXT,
        generated_from_queries INTEGER,
        success_rate DECIMAL(5,2),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    res.send("✅ Database Tables Created Successfully! You can now use the app.");
  } catch (error) {
    res.status(500).send("❌ Error creating tables: " + error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
