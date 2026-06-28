const express = require("express");
const router = express.Router();
const db = require("../db");
const engine = require("../engine");

// Fallback in-memory store if database is offline
const memoryStore = {
  workflows: [
    { id: "wf_1", name: "Daily AI Thought Leadership", status: "active" },
    { id: "wf_2", name: "Blog to LinkedIn Auto-Promo", status: "draft" }
  ],
  nodes: [
    { id: "node_1", workflow_id: "wf_1", type: "trigger", label: "Schedule Trigger", config: { interval: "Daily @ 9:00 AM" } },
    { id: "node_2", workflow_id: "wf_1", type: "ai", label: "Gemini AI Generator", config: { topic: "Orchestration" } },
    { id: "node_3", workflow_id: "wf_1", type: "linkedin", label: "LinkedIn Publish", config: { action: "Save Draft" } }
  ],
  executions: [],
  posts: [
    { id: "post_1", content: "Orchestration vs Code boilerplate...", status: "published", likes: 42 },
    { id: "post_2", content: "Why 90% of founders fail...", status: "draft", likes: 0 }
  ]
};

// ---------------- WORKFLOW ENDPOINTS ----------------

// Fetch all workflows
router.get("/workflows", async (req, res) => {
  if (db.isConnected) {
    try {
      const result = await db.query("SELECT * FROM workflows ORDER BY created_at DESC");
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json(memoryStore.workflows);
});

// Create workflow
router.post("/workflows", async (req, res) => {
  const { name } = req.body;
  const id = `wf_${Date.now()}`;
  const newWf = { id, name, status: "active" };

  if (db.isConnected) {
    try {
      await db.query("INSERT INTO workflows (id, name, status) VALUES ($1, $2, $3)", [id, name, "active"]);
      return res.json(newWf);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  memoryStore.workflows.push(newWf);
  res.json(newWf);
});

// Save/update workflow configuration (nodes and parameters)
router.put("/workflows/:id", async (req, res) => {
  const workflowId = req.params.id;
  const { name, nodes } = req.body;

  if (db.isConnected) {
    try {
      await db.query("BEGIN");
      if (name) {
        await db.query("UPDATE workflows SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [name, workflowId]);
      }
      if (nodes) {
        // Clear old nodes
        await db.query("DELETE FROM nodes WHERE workflow_id = $1", [workflowId]);
        // Insert updated nodes
        for (const node of nodes) {
          await db.query(
            "INSERT INTO nodes (id, workflow_id, type, label, config, position_x, position_y) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [node.id, workflowId, node.data.type, node.data.label, node.data.config, node.position?.x, node.position?.y]
          );
        }
      }
      await db.query("COMMIT");
      return res.json({ message: "Workflow saved successfully." });
    } catch (err) {
      await db.query("ROLLBACK");
      return res.status(500).json({ error: err.message });
    }
  }

  // Update in memory
  const wf = memoryStore.workflows.find(w => w.id === workflowId);
  if (wf && name) wf.name = name;
  if (nodes) {
    memoryStore.nodes = memoryStore.nodes.filter(n => n.workflow_id !== workflowId);
    nodes.forEach(n => {
      memoryStore.nodes.push({
        id: n.id,
        workflow_id: workflowId,
        type: n.data.type,
        label: n.data.label,
        config: n.data.config
      });
    });
  }
  res.json({ message: "Workflow saved in-memory." });
});

// Execute a workflow
router.post("/workflows/:id/run", async (req, res) => {
  const workflowId = req.params.id;
  try {
    const executionResult = await engine.executeWorkflow(workflowId);
    res.json(executionResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CONTENT LIBRARY ENDPOINTS ----------------

// Fetch all posts in library
router.get("/posts", async (req, res) => {
  if (db.isConnected) {
    try {
      const { status } = req.query;
      let queryText = "SELECT * FROM posts ORDER BY published_at DESC, id DESC";
      let params = [];
      if (status) {
        queryText = "SELECT * FROM posts WHERE status = $1 ORDER BY published_at DESC, id DESC";
        params = [status];
      }
      const result = await db.query(queryText, params);
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json(memoryStore.posts);
});

// Create draft/custom post
router.post("/posts", async (req, res) => {
  const { content, status, tags } = req.body;
  const id = `post_${Date.now()}`;
  const newPost = { id, content, status: status || "draft", likes: 0, comments: 0, impressions: 0, tags };

  if (db.isConnected) {
    try {
      await db.query(
        "INSERT INTO posts (id, content, status, tags) VALUES ($1, $2, $3, $4)",
        [id, content, status || "draft", tags]
      );
      return res.json(newPost);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  memoryStore.posts.push(newPost);
  res.json(newPost);
});

// ---------------- ANALYTICS ENDPOINTS ----------------

// Fetch analytics statistics
router.get("/analytics", (req, res) => {
  // Return consistent statistics dashboard
  res.json({
    kpis: {
      totalImpressions: 42508,
      netFollowers: 482,
      avgEngagementRate: "5.84%",
      linkClicks: 842
    },
    demographics: [
      { sector: "Founders & C-Level", percentage: 42 },
      { sector: "Software Engineers", percentage: 28 },
      { sector: "Product Managers", percentage: 18 },
      { sector: "Marketers", percentage: 12 }
    ]
  });
});

module.exports = router;
