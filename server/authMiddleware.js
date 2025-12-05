import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // 1. Extract the token from the 'Bearer <token>' string
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Access Denied: Token missing." });
  }

  try {
    // 2. Verify the signature using the Secret Key (the "comparison")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the user ID for the route to use
    req.userId = decoded.userId;

    // 4. Allow the request to proceed to the main route
    next();
  } catch (err) {
    // If jwt.verify fails, the token is invalid
    return res.status(401).json({ error: "Invalid Token." });
  }
};
