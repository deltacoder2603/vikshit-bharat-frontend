import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  credentials: true
}));
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize storage bucket for complaint images
const initializeStorage = async () => {
  const bucketName = 'make-43b0a141-complaint-images';
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      console.log(`Created bucket: ${bucketName}`);
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Initialize on startup
initializeStorage();

// AI Category Detection API
app.post('/make-server-43b0a141/ai/detect-category', async (c) => {
  try {
    const { description, imageData } = await c.req.json();
    
    // Mock AI analysis - in production, integrate with OpenAI Vision API or similar
    const categories = [
      'Garbage & Waste',
      'Traffic & Roads', 
      'Pollution',
      'Drainage & Sewage',
      'Public Spaces',
      'Housing & Slums',
      'Other Issues'
    ];
    
    // Simple keyword-based detection for demo
    const keywords = {
      'Garbage & Waste': ['garbage', 'waste', 'trash', 'litter', 'dump', 'dirty'],
      'Traffic & Roads': ['road', 'traffic', 'pothole', 'signal', 'vehicle', 'accident'],
      'Pollution': ['pollution', 'smoke', 'smell', 'noise', 'air', 'water'],
      'Drainage & Sewage': ['drainage', 'sewage', 'water', 'flood', 'overflow', 'pipe'],
      'Public Spaces': ['park', 'public', 'space', 'playground', 'garden', 'bench'],
      'Housing & Slums': ['housing', 'slum', 'building', 'construction', 'illegal']
    };
    
    let detectedCategory = 'Other Issues';
    let confidence = 0;
    
    const lowerDescription = description.toLowerCase();
    
    for (const [category, words] of Object.entries(keywords)) {
      const matchCount = words.filter(word => lowerDescription.includes(word)).length;
      const categoryConfidence = (matchCount / words.length) * 100;
      
      if (categoryConfidence > confidence) {
        confidence = categoryConfidence;
        detectedCategory = category;
      }
    }
    
    // Mock image analysis result
    const imageAnalysis = imageData ? 
      `AI detected visual elements related to ${detectedCategory.toLowerCase()}` : 
      null;
    
    return c.json({
      suggestedCategory: detectedCategory,
      confidence: Math.min(confidence + Math.random() * 30, 95),
      imageAnalysis,
      alternativeCategories: categories.filter(cat => cat !== detectedCategory).slice(0, 2)
    });
    
  } catch (error) {
    console.error('AI category detection error:', error);
    return c.json({ error: 'Failed to detect category' }, 500);
  }
});

// AI Department Search API
app.post('/make-server-43b0a141/ai/search-departments', async (c) => {
  try {
    const { query } = await c.req.json();
    
    const departments = [
      { id: 'kmc', name: 'Kanpur Municipal Corporation', description: 'Waste management, sanitation, public amenities' },
      { id: 'kda', name: 'Kanpur Development Authority', description: 'Urban planning, housing, infrastructure development' },
      { id: 'traffic', name: 'Traffic Police Department', description: 'Traffic management, road safety, vehicle regulation' },
      { id: 'pollution', name: 'Pollution Control Board', description: 'Air quality, water pollution, noise control' },
      { id: 'pwd', name: 'Public Works Department', description: 'Roads, bridges, public buildings maintenance' },
      { id: 'water', name: 'Water Supply Department', description: 'Water distribution, quality control, pipeline maintenance' },
      { id: 'electricity', name: 'Electricity Board', description: 'Power supply, electrical infrastructure, street lighting' },
      { id: 'health', name: 'Public Health Department', description: 'Healthcare services, sanitation, disease control' }
    ];
    
    const lowerQuery = query.toLowerCase();
    
    // AI-powered fuzzy search with relevance scoring
    const searchResults = departments.map(dept => {
      let score = 0;
      
      // Name matching
      if (dept.name.toLowerCase().includes(lowerQuery)) score += 50;
      
      // Description matching
      const descWords = dept.description.toLowerCase().split(' ');
      const queryWords = lowerQuery.split(' ');
      
      queryWords.forEach(qWord => {
        if (descWords.some(dWord => dWord.includes(qWord))) {
          score += 20;
        }
      });
      
      // Keyword relevance
      const keywords = {
        waste: ['kmc'],
        garbage: ['kmc'],
        traffic: ['traffic'],
        road: ['pwd', 'traffic'],
        pollution: ['pollution'],
        water: ['water'],
        electricity: ['electricity'],
        health: ['health'],
        development: ['kda']
      };
      
      queryWords.forEach(word => {
        if (keywords[word] && keywords[word].includes(dept.id)) {
          score += 30;
        }
      });
      
      return { ...dept, relevanceScore: score };
    })
    .filter(dept => dept.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5);
    
    return c.json({
      departments: searchResults,
      searchQuery: query,
      totalFound: searchResults.length
    });
    
  } catch (error) {
    console.error('AI department search error:', error);
    return c.json({ error: 'Failed to search departments' }, 500);
  }
});

// Submit complaint with image upload
app.post('/make-server-43b0a141/complaints/submit', async (c) => {
  try {
    const formData = await c.req.formData();
    const complaintData = JSON.parse(formData.get('data') as string);
    const imageFile = formData.get('image') as File;
    
    let imageUrl = null;
    
    // Upload image to Supabase Storage if provided
    if (imageFile) {
      const fileName = `complaint-${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('make-43b0a141-complaint-images')
        .upload(fileName, imageFile);
      
      if (uploadError) {
        console.error('Image upload error:', uploadError);
      } else {
        // Get signed URL for the uploaded image
        const { data: signedUrlData } = await supabase.storage
          .from('make-43b0a141-complaint-images')
          .createSignedUrl(fileName, 3600 * 24 * 7); // 7 days
        
        imageUrl = signedUrlData?.signedUrl;
      }
    }
    
    // Store complaint in KV store
    const complaintId = `complaint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const complaint = {
      id: complaintId,
      ...complaintData,
      imageUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(complaintId, complaint);
    
    // Add to complaints list
    const existingComplaints = await kv.get('all_complaints') || [];
    await kv.set('all_complaints', [...existingComplaints, complaintId]);
    
    return c.json({ 
      success: true, 
      complaintId,
      message: 'Complaint submitted successfully'
    });
    
  } catch (error) {
    console.error('Complaint submission error:', error);
    return c.json({ error: 'Failed to submit complaint' }, 500);
  }
});

// Get all complaints for admin
app.get('/make-server-43b0a141/complaints/all', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Verify admin access (simplified for demo)
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const complaintIds = await kv.get('all_complaints') || [];
    const complaints = await kv.mget(complaintIds);
    
    return c.json({ 
      complaints: complaints.filter(Boolean),
      total: complaints.length
    });
    
  } catch (error) {
    console.error('Get complaints error:', error);
    return c.json({ error: 'Failed to fetch complaints' }, 500);
  }
});

// Update complaint status
app.put('/make-server-43b0a141/complaints/:id/status', async (c) => {
  try {
    const complaintId = c.req.param('id');
    const { status, assignedWorker, notes } = await c.req.json();
    
    const complaint = await kv.get(complaintId);
    if (!complaint) {
      return c.json({ error: 'Complaint not found' }, 404);
    }
    
    const updatedComplaint = {
      ...complaint,
      status,
      assignedWorker,
      notes,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(complaintId, updatedComplaint);
    
    return c.json({ 
      success: true,
      complaint: updatedComplaint
    });
    
  } catch (error) {
    console.error('Update complaint error:', error);
    return c.json({ error: 'Failed to update complaint' }, 500);
  }
});

// Upload proof by field worker
app.post('/make-server-43b0a141/complaints/:id/proof', async (c) => {
  try {
    const complaintId = c.req.param('id');
    const formData = await c.req.formData();
    const proofData = JSON.parse(formData.get('data') as string);
    const proofImage = formData.get('image') as File;
    
    let proofImageUrl = null;
    
    if (proofImage) {
      const fileName = `proof-${complaintId}-${Date.now()}-${proofImage.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('make-43b0a141-complaint-images')
        .upload(fileName, proofImage);
      
      if (!uploadError) {
        const { data: signedUrlData } = await supabase.storage
          .from('make-43b0a141-complaint-images')
          .createSignedUrl(fileName, 3600 * 24 * 7);
        
        proofImageUrl = signedUrlData?.signedUrl;
      }
    }
    
    const complaint = await kv.get(complaintId);
    if (!complaint) {
      return c.json({ error: 'Complaint not found' }, 404);
    }
    
    const updatedComplaint = {
      ...complaint,
      proof: {
        ...proofData,
        imageUrl: proofImageUrl,
        submittedAt: new Date().toISOString()
      },
      status: 'completed',
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(complaintId, updatedComplaint);
    
    return c.json({ 
      success: true,
      complaint: updatedComplaint
    });
    
  } catch (error) {
    console.error('Upload proof error:', error);
    return c.json({ error: 'Failed to upload proof' }, 500);
  }
});

// Get dashboard analytics
app.get('/make-server-43b0a141/analytics/dashboard', async (c) => {
  try {
    const complaintIds = await kv.get('all_complaints') || [];
    const complaints = await kv.mget(complaintIds);
    
    const validComplaints = complaints.filter(Boolean);
    
    const analytics = {
      totalComplaints: validComplaints.length,
      pendingComplaints: validComplaints.filter(c => c.status === 'pending').length,
      inProgressComplaints: validComplaints.filter(c => c.status === 'in_progress').length,
      completedComplaints: validComplaints.filter(c => c.status === 'completed').length,
      categoryBreakdown: {},
      recentComplaints: validComplaints
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
    };
    
    // Calculate category breakdown
    validComplaints.forEach(complaint => {
      const category = complaint.category || 'Other Issues';
      analytics.categoryBreakdown[category] = (analytics.categoryBreakdown[category] || 0) + 1;
    });
    
    return c.json(analytics);
    
  } catch (error) {
    console.error('Analytics error:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

app.get('/make-server-43b0a141/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);