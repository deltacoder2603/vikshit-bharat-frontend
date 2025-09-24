const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Configure CORS - Allow all origins
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
};

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Neon PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Connect to database
async function connectDatabase() {
  try {
    await client.connect();
    console.log('Connected to Neon database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// ==================== UPDATED IMAGE ANALYSIS ====================

// Image Analysis using AI - IMPROVED VERSION
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    console.log('🔍 Starting image analysis...');
    
    if (!req.file) {
      console.log('❌ No image file provided');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('📸 Image received:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Use gemini-1.5-flash for better reliability
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // IMPROVED PROMPT - More specific and reliable
    const prompt = `Analyze this image for civic issues in Indian cities. 

Look for these specific problems:
1. Garbage & Waste - roadside dumps, overflowing bins, waste scattered around
2. Traffic & Roads - potholes, broken roads, traffic congestion, illegal parking
3. Pollution - dirty water bodies, smoke/emissions, burning waste
4. Drainage & Sewage - open drains, waterlogging, blocked sewers
5. Public Spaces - damaged public property, poor maintenance, encroachment
6. Housing & Slums - poor living conditions, lack of basic amenities
7. Infrastructure - broken streetlights, damaged signs, poor connectivity
8. Other Issues - stray animals, safety hazards, environmental problems

IMPORTANT: 
- Only return categories that are clearly visible in the image
- Be specific and accurate
- If no civic issues are found, return empty array
- Return ONLY a JSON array of category names

Examples of correct responses:
["Garbage & Waste", "Traffic & Roads"]
["Pollution"]
[]
["Drainage & Sewage", "Public Spaces"]

Return your response as a JSON array only.`;

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    };

    console.log('🤖 Sending request to Gemini AI...');
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('📝 Raw AI Response:', text);
    
    // IMPROVED PARSING LOGIC
    let categories = [];
    
    try {
      // Try direct JSON parsing first
      const jsonMatch = text.match(/\[.*?\]/s);
      if (jsonMatch) {
        categories = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed JSON:', categories);
      } else {
        // Fallback: extract categories from text
        const categoryKeywords = [
          'Garbage & Waste', 'Traffic & Roads', 'Pollution', 
          'Drainage & Sewage', 'Public Spaces', 'Housing & Slums',
          'Infrastructure', 'Other Issues'
        ];
        
        categories = categoryKeywords.filter(keyword => 
          text.toLowerCase().includes(keyword.toLowerCase())
        );
        
        console.log('🔄 Fallback parsing result:', categories);
      }
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      console.log('📝 Raw response that failed to parse:', text);
      
      // Final fallback - return empty array if parsing fails
      categories = [];
    }

    // Validate categories
    const validCategories = [
      'Garbage & Waste', 'Traffic & Roads', 'Pollution',
      'Drainage & Sewage', 'Public Spaces', 'Housing & Slums',
      'Infrastructure', 'Other Issues'
    ];
    
    const filteredCategories = categories.filter(cat => 
      validCategories.includes(cat)
    );

    console.log('🎯 Final categories:', filteredCategories);
    
    res.json({ categories: filteredCategories });
    
  } catch (error) {
    console.error('❌ Image analysis error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({ 
      error: 'Failed to analyze image', 
      details: error.message,
      categories: [] // Return empty array on error
    });
  }
});

// ==================== REST OF YOUR EXISTING CODE ====================
// (Keep all your existing routes and middleware here)

// JWT Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Initialize database tables (same as before)
async function initializeDatabase() {
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        aadhar VARCHAR(12) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address TEXT,
        role VARCHAR(50) DEFAULT 'citizen',
        department VARCHAR(255),
        avatar_url TEXT,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Problems table
    await client.query(`
      CREATE TABLE IF NOT EXISTS problems (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        problem_categories TEXT[] NOT NULL,
        others_text TEXT,
        user_image_base64 TEXT NOT NULL,
        user_image_mimetype VARCHAR(100) NOT NULL,
        admin_image_base64 TEXT,
        admin_image_mimetype VARCHAR(100),
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        status VARCHAR(50) DEFAULT 'not completed',
        priority VARCHAR(20) DEFAULT 'medium',
        assigned_worker_id INTEGER REFERENCES users(id),
        assigned_department VARCHAR(255),
        estimated_completion DATE,
        completion_notes TEXT,
        citizen_rating INTEGER CHECK (citizen_rating >= 1 AND citizen_rating <= 5),
        citizen_feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Workers table (extended user information for field workers)
    await client.query(`
      CREATE TABLE IF NOT EXISTS workers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) UNIQUE,
        specializations TEXT[],
        efficiency_rating DECIMAL(3, 2) DEFAULT 0.0,
        total_assigned INTEGER DEFAULT 0,
        total_completed INTEGER DEFAULT 0,
        avg_completion_time DECIMAL(5, 2), -- in hours
        current_status VARCHAR(50) DEFAULT 'available',
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Departments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        head_id INTEGER REFERENCES users(id),
        description TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        location TEXT,
        budget DECIMAL(15, 2),
        established_year INTEGER,
        status VARCHAR(50) DEFAULT 'active',
        total_workers INTEGER DEFAULT 0,
        total_complaints INTEGER DEFAULT 0,
        resolved_complaints INTEGER DEFAULT 0,
        avg_resolution_time DECIMAL(5, 2), -- in days
        rating DECIMAL(3, 2) DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL, -- urgent, info, success, warning
        priority VARCHAR(20) DEFAULT 'medium', -- high, medium, low
        sender_id INTEGER REFERENCES users(id),
        recipient_ids INTEGER[],
        department VARCHAR(255),
        category VARCHAR(50) NOT NULL, -- system, complaint, worker, citizen, department, emergency
        related_problem_id INTEGER REFERENCES problems(id),
        action_required BOOLEAN DEFAULT false,
        expires_at TIMESTAMP,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Problem status history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS problem_status_history (
        id SERIAL PRIMARY KEY,
        problem_id INTEGER REFERENCES problems(id),
        status VARCHAR(50) NOT NULL,
        updated_by_id INTEGER REFERENCES users(id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Analytics table for storing computed metrics
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DECIMAL(15, 2),
        metric_data JSONB,
        department VARCHAR(255),
        date_range_start DATE,
        date_range_end DATE,
        computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('All database tables initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Utility function to convert image buffer to base64
function convertImageToBase64(fileBuffer, mimeType) {
  try {
    const base64String = fileBuffer.toString('base64');
    return {
      base64: base64String,
      mimeType: mimeType
    };
  } catch (error) {
    console.error('Base64 conversion error:', error);
    throw new Error('Failed to convert image to base64');
  }
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '7d' }
  );
}

// ==================== USER AUTHENTICATION ROUTES ====================

// User Registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, phone_number, aadhar, password, address, role = 'citizen', department } = req.body;

    // Validate required fields
    if (!name || !email || !phone_number || !aadhar || !password) {
      return res.status(400).json({ 
        error: 'All fields are required: name, email, phone_number, aadhar, password' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }

    // Validate Aadhar (12 digits)
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(aadhar)) {
      return res.status(400).json({ error: 'Aadhar must be exactly 12 digits' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if user already exists
    const existingUser = await client.query(`
      SELECT id FROM users 
      WHERE email = $1 OR phone_number = $2 OR aadhar = $3
    `, [email, phone_number, aadhar]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email, phone, or aadhar' });
    }

    // Create new user
    const result = await client.query(`
      INSERT INTO users (name, email, phone_number, aadhar, password, address, role, department)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, email, phone_number, aadhar, role, department, created_at
    `, [name, email, phone_number, aadhar, hashedPassword, address, role, department]);

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        aadhar: user.aadhar,
        role: user.role,
        department: user.department,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// User Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await client.query(`
      SELECT id, name, email, phone_number, aadhar, password, role, department, avatar_url 
      FROM users 
      WHERE email = $1 AND is_active = true
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await client.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const token = generateToken(user);

    res.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        aadhar: user.aadhar,
        role: user.role,
        department: user.department,
        avatar_url: user.avatar_url
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Submit Problem
app.post('/api/problems', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { problem_categories, others_text, latitude, longitude, priority = 'medium' } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    if (!problem_categories || !latitude || !longitude) {
      return res.status(400).json({ error: 'problem_categories, latitude, and longitude are required' });
    }

    // Validate location data
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude format' });
    }
    
    if (lat < -90 || lat > 90) {
      return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
    }
    
    if (lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
    }

    // Parse problem_categories if it's a string
    let categoriesArray;
    try {
      categoriesArray = typeof problem_categories === 'string' 
        ? JSON.parse(problem_categories) 
        : problem_categories;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid problem_categories format' });
    }

    // Convert image to base64
    const imageData = convertImageToBase64(req.file.buffer, req.file.mimetype);

    // Insert into database
    const result = await client.query(`
      INSERT INTO problems (user_id, problem_categories, others_text, user_image_base64, user_image_mimetype, latitude, longitude, priority, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [req.user.id, categoriesArray, others_text || null, imageData.base64, imageData.mimeType, lat, lng, priority, 'not completed']);

    const problem = result.rows[0];

    // Add initial status history
    await client.query(`
      INSERT INTO problem_status_history (problem_id, status, updated_by_id, notes)
      VALUES ($1, $2, $3, $4)
    `, [problem.id, 'not completed', req.user.id, 'Problem submitted']);

    res.json({ 
      message: 'Problem created successfully', 
      problem: problem
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({ error: 'Failed to create problem entry', details: error.message });
  }
});

// ==================== HEALTH CHECK ROUTE ====================

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==================== ERROR HANDLING MIDDLEWARE ====================

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== SERVER INITIALIZATION ====================

async function startServer() {
  try {
    await connectDatabase();
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('📋 Available routes:');
      console.log('  🔐 Authentication:');
      console.log('    POST /api/users/register - User registration');
      console.log('    POST /api/users/login - User login');
      console.log('  🚨 Problem Management:');
      console.log('    POST /api/analyze-image - AI image analysis (IMPROVED)');
      console.log('    POST /api/problems - Submit problem');
      console.log('  🏥 Health:');
      console.log('    GET /health - Health check');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await client.end();
  process.exit(0);
});

startServer();
