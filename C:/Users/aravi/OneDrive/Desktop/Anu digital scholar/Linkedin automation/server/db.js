const { Pool } = require("pg");
require("dotenv").config();

// Create PostgreSQL connection pool
// Gracefully fallbacks to standard default ports if env credentials aren't loaded
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/linkedflow",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

let isConnected = false;

// Query wrapper helper
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Executed query: ${text.slice(0, 50)}... in ${duration}ms`);
    return res;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
};

// Auto-bootstrap schema tables
const initializeDatabase = async () => {
  try {
    // Basic connectivity test
    const client = await pool.connect();
    isConnected = true;
    console.log("PostgreSQL Database connected successfully.");
    client.release();

    // Create database tables sequentially
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS workflows (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS nodes (
        id VARCHAR(100) PRIMARY KEY,
        workflow_id VARCHAR(100) REFERENCES workflows(id) ON DELETE CASCADE,
        type VARCHAR(100) NOT NULL,
        label VARCHAR(100) NOT NULL,
        config JSONB DEFAULT '{}',
        position_x FLOAT,
        position_y FLOAT
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS executions (
        id VARCHAR(100) PRIMARY KEY,
        workflow_id VARCHAR(100) REFERENCES workflows(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'running',
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        finished_at TIMESTAMP,
        logs TEXT[],
        error_message TEXT
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(100) PRIMARY KEY,
        workflow_id VARCHAR(100) REFERENCES workflows(id) ON DELETE SET NULL,
        execution_id VARCHAR(100) REFERENCES executions(id) ON DELETE SET NULL,
        title VARCHAR(255),
        content TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        published_at TIMESTAMP,
        likes INT DEFAULT 0,
        comments INT DEFAULT 0,
        impressions INT DEFAULT 0,
        tags VARCHAR(100)[]
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS connections (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'disconnected',
        credentials JSONB DEFAULT '{}',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database schema initialized successfully.");

  } catch (err) {
    isConnected = false;
    console.warn("Database Connection Warning: PostgreSQL not reachable or credentials missing. Server running in mock-database mode.");
  }
};

module.exports = {
  query,
  initializeDatabase,
  pool,
  get isConnected() {
    return isConnected;
  }
};
