import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

// login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. look up user by username
    // we select the id, username, and the stored hash
    const userResult = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username],
    );

    const user = userResult.rows[0];

    // checkpoint A: user not found
    // if the user doesn't exist, we send an authentication error
    if (!user) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    // 2. BCRYPT comparison
    // we compare the submitted password against the hash stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    // checkpoint B: password does not match
    if (!passwordMatch) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    // JSON web token generation (login successful)
    // create the token payload with non-sensitive user data
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET, // the secret key from .env file
      { expiresIn: "1h" }, // token expires in 1 hour
    );

    // send success and token
    res.json({ message: "login successful!", token, username: user.username });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ error: "internal server error" });
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
