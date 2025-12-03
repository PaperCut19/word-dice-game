import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import cors from "cors";
import bcrypt from "bcrypt";

// initialize the app
const app = express();
const PORT = process.env.PORT;

// database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// middleware -START-

// CORS configuration (allows frontend to talk to backend)
const corsOptions = {
  // only allow requests from your React app's origin
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

// JSON body parser
app.use(express.json());

// middleware -FINISHED- above

// test route: verifies express is running
app.get("/", (req, res) => {
  res.send("Express server is running");
});

// sign up route
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // 2. hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // insert into database
    const newUser = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword],
    );

    // respond
    res.json({ message: "User created!", user: newUser.rows[0] });
  } catch (error) {
    console.error(error.message);
    if (error.code === "23505") {
      // unique violation code
      return res.status(409).json({ error: "username already exists" });
    }
    res.status(500).send("server error");
  }
});

// server start logic
pool.connect((error) => {
  if (error) {
    // if the database connection fails, log the error and exit
    console.error("Database connection failed:", error.message);
    return;
  }
  console.log("Successfully connected to PostgreSQL.");

  // only start listening for web traffic once the database is connected
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
});
