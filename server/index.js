import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- HELPER FUNCTIONS (the translators) ---
// 1. database -> frontend (used in GET)
const toFrontend = (row) => {
  return {
    id: row.dice_id,
    name: row.name,
    text1: row.sides[0] || "",
    text2: row.sides[1] || "",
    text3: row.sides[2] || "",
    text4: row.sides[3] || "",
    text5: row.sides[4] || "",
    text6: row.sides[5] || "",
    mainFace: row.sides[0] || "",
  };
};

// 2. frontend -> database (used in POST)
const toBackend = (body) => {
  // bundle the text fields into the JSON array
  const sides = JSON.stringify([
    body.text1 || "",
    body.text2 || "",
    body.text3 || "",
    body.text4 || "",
    body.text5 || "",
    body.text6 || "",
  ]);
  return { name: body.name, sides: sides, id: body.id };
};

// --- 1. CONFIGURATION ---
const app = express();
const PORT = process.env.PORT || 3000;

// [!] DATABASE CONNECTION (Updated for Production)
const isProduction = process.env.NODE_ENV === "production";

const poolConfig = isProduction
  ? {
      // Production (Railway)
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for most cloud Postgres providers
      },
    }
  : {
      // Local Development
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

const pool = new Pool(poolConfig);

// --- 2. GLOBAL MIDDLEWARE ---
// [!] CORS (Updated for Production)
// We allow either the local React port OR the production Netlify URL
const allowedOrigin = isProduction
  ? process.env.FRONTEND_URL // We will set this in Railway later!
  : "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json()); // parse JSON bodies

// --- 3. AUTHENTICATION MIDDLEWARE ---
// this function checks if the user has a valid Token.
// we will use this to protect the dice routes later
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // header looks like: 'Bearer <token>'
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "access denied. token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ error: "invalid or expired token" });
    }
    // success: attach the user data (id, username) to the request
    req.user = user;
    next();
  });
};

// 4. --- PUBLIC ROUTES (login/register) ---

// test route
app.get("/", (req, res) => {
  res.send("server is up and running");
});

// register
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "missing fields" });

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into database
    const newUser = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword],
    );

    res.json({ message: "User created!", user: newUser.rows[0] });
  } catch (error) {
    console.error("register error:", error.message);
    if (error.code === "23505") {
      return res.status(409).json({ error: "username already exists" });
    }
    res.status(500).json({ error: "server error" });
  }
});

// login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // find user
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "invalid credentials" });

    // check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ error: "invalid credentials" });

    // create token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // send token + user info (frontend needs both)
    res.json({
      message: "login successful",
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("login error:", error.message);
    res.status(500).json({ error: "server error" });
  }
});

// -- 5. PRIVATE ROUTES (dice data) ---
// all these routes require 'authenticateToken'

// GET: fetch all dice for the logged in user
app.get("/api/dice_objects", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM dice WHERE user_id = $1 ORDER BY dice_id ASC",
      [req.user.userId],
    );

    // use toFrontend helper function to translate the database information into something the frontend can use
    res.json(result.rows.map(toFrontend));
  } catch (error) {
    console.error("get dice error:", error.message);
    res.status(500).json({ error: "failed to fetch dice" });
  }
});

// POST: Save Dice (handles both create and update)
app.post("/api/dice_objects", authenticateToken, async (req, res) => {
  // translate frontend data into information the database can use by using toBackend helper function
  const { name, sides, id } = toBackend(req.body);
  const userId = req.user.userId;

  try {
    // strategy: try to update first. if no row matches (ID doesn't exist), then INSERT

    // 1. try update
    const updateQuery = `
    UPDATE dice
    SET name=$1, sides=$2::jsonb
    WHERE dice_id=$3 AND user_id=$4
    RETURNING dice_id, name, sides
    `;

    const updateResult = await pool.query(updateQuery, [
      name,
      sides,
      id,
      userId,
    ]);

    if (updateResult.rows.length > 0) {
      // it was an update, return the updated object
      // translate the backend data into something the frontend can use and give it to the frontend
      return res.json(toFrontend(updateResult.rows[0]));
    }

    // 2. if update found nothing, it's a new create (insert)
    // we ignore the 'id' sent from frontend (likely Date.now()) and let Postgres create a real ID
    const insertQuery = `
    INSERT INTO dice (user_id, name, sides)
    VALUES ($1, $2, $3::jsonb)
    RETURNING dice_id, name, sides
    `;

    const insertResult = await pool.query(insertQuery, [userId, name, sides]);

    // translate the data from the database and turn it into a new object the frontend can use (it will contain the new database ID)
    return res.json(toFrontend(insertResult.rows[0]));
  } catch (error) {
    console.error("save dice error:", error.message);
    res.status(500).json({ error: "failed to save dice" });
  }
});

// DELETE: delete a dice
app.delete("/api/dice_objects/:id", authenticateToken, async (req, res) => {
  try {
    const diceId = req.params.id;
    const userId = req.user.userId;

    const result = await pool.query(
      "DELETE FROM dice WHERE dice_id = $1 AND user_id = $2",
      [diceId, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "dice not found or not authorized" });
    }

    res.json({ message: "dice deleted successfully" });
  } catch (error) {
    console.error("delete dice error:", error.message);
    res.status(500).json({ error: "failed to delete dice" });
  }
});

// --- 6. START SERVER ---
pool.connect((error) => {
  if (error) {
    console.error("database connection failed", error.stack);
  } else {
    console.log("connected to PostgreSQL database");
    app.listen(PORT, () => {
      console.log(`server running on ${PORT}`);
    });
  }
});
