CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE dice (
    die_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- We use JSONB to store the array of 6 strings
    -- Example data: '["A", "B", "C", "D", "E", "F"]'
    sides JSONB NOT NULL,
    
    name VARCHAR(50), -- Optional: Give the die a name like "Vowel Die"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADDING AN EXAMPLE DICE
INSERT INTO dice (user_id, sides, name)
VALUES (
    3, -- The ID for user 'cristian'
    '["C", "R", "I", "S", "T", "I"]'::jsonb, -- The 6 sides stored as JSONB
    'Cristian''s Custom Die' -- A descriptive name for the die
);