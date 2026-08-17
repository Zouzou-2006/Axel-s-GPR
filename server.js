const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');

const EstimateRequest = require('./src/models/EstimateRequest');
const Booking = require('./src/models/Booking');
const GalleryItem = require('./src/models/GalleryItem');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const GALLERY_UPLOAD_DIR = path.join(__dirname, 'public', 'uploads', 'gallery');
fs.mkdirSync(GALLERY_UPLOAD_DIR, { recursive: true });

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const galleryUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, GALLERY_UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    }
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_IMAGE_TYPES.has(file.mimetype));
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'axels-gpr-api' });
});

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const matchesKeyword = (normalizedText, keyword) => {
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) {
    return false;
  }
  return new RegExp(`\\b${escapeRegExp(normalizedKeyword)}(?:es|s)?\\b`, 'i').test(normalizedText);
};

const assistantRules = [
  {
    keywords: ['hi', 'hello', 'hey', 'hola', 'good morning', 'good afternoon', 'good evening', 'yo', 'sup', 'howdy'],
    en: 'Hey there! Welcome to AXEL\'S GPR. I can help with services, free estimates, scheduling, colors, and more. What can I answer for you?',
    es: 'Hola, bienvenido a AXEL\'S GPR. Puedo ayudarte con servicios, cotizaciones gratis, agenda y mas. En que te puedo ayudar?'
  },
  {
    keywords: ['estimate', 'quote', 'cotizacion', 'precio', 'cost', 'how much', 'price', 'charge', 'fee', 'rate'],
    en: 'We offer free estimates! Just share your project size, interior or exterior scope, and preferred timeline and we will get you a fast quote — or use the Request Estimate form on this page.',
    es: 'Ofrecemos cotizaciones gratis. Comparte el tamano del proyecto, alcance y tiempo deseado para enviarte una propuesta rapido, o usa el formulario en esta pagina.'
  },
  {
    keywords: ['services', 'service', 'what do you do', 'servicios', 'pintura', 'paint', 'painting', 'offer', 'do you do', 'handle'],
    en: 'We handle interior painting, exterior painting, drywall and surface repair, color consultation, cabinet painting, commercial repaints, and maintenance plans.',
    es: 'Trabajamos pintura interior, pintura exterior, reparacion de superficies, gabinetes, asesoria de color, repintado comercial y planes de mantenimiento.'
  },
  {
    keywords: ['start', 'timeline', 'when', 'schedule', 'agendar', 'empezar', 'tiempo', 'available', 'availability', 'how long', 'days', 'week'],
    en: 'Most projects are scheduled quickly after estimate approval. Interior jobs typically finish in 2 to 5 days. Exterior jobs vary by scope. We work Monday through Saturday, 8 AM to 6 PM.',
    es: 'Agendamos rapido tras aprobar la cotizacion. Interiores suelen tomar 2 a 5 dias. Trabajamos lunes a sabado de 8 AM a 6 PM.'
  },
  {
    keywords: ['insured', 'insurance', 'license', 'licencia', 'asegurado', 'licensed', 'certified', 'legit', 'legitimate', 'bonded'],
    en: 'Yes! AXEL\'S GPR is fully licensed and insured for both residential and commercial painting work. You are in safe hands.',
    es: 'Si, AXEL\'S GPR esta con licencia y asegurado para trabajos residenciales y comerciales. Estas en buenas manos.'
  },
  {
    keywords: ['contact', 'phone', 'email', 'telefono', 'correo', 'reach', 'call', 'text', 'message', 'number'],
    en: 'You can reach us at (513) 212-5179 or felixgervacio@gmail.com. You can also submit the Request Estimate form and we reply within 24 hours.',
    es: 'Puedes contactarnos al (513) 212-5179 o felixgervacio@gmail.com. Tambien puedes enviar el formulario y respondemos en 24 horas.'
  },
  {
    keywords: ['color', 'colours', 'palette', 'shade', 'sheen', 'finish', 'eggshell', 'satin', 'semi-gloss', 'matte', 'flat', 'gloss', 'colores'],
    en: 'We offer free color consultation! We help you pick the right hue, undertone, and sheen (matte, eggshell, satin, semi-gloss) based on your lighting and how the space is used.',
    es: 'Ofrecemos asesoria de color gratis. Te ayudamos a elegir el tono, subtono y acabado (mate, eggshell, satin, semi-brillo) segun la iluminacion y uso del espacio.'
  },
  {
    keywords: ['area', 'location', 'where', 'serve', 'zone', 'city', 'neighborhood', 'region', 'local', 'near', 'nearby', 'zona', 'ciudad', 'ubicacion'],
    en: 'We serve residential and commercial properties in Cincinnati, OH and the surrounding Tri-County area. Reach out and we will confirm coverage for your location.',
    es: 'Trabajamos en propiedades residenciales y comerciales en Cincinnati, OH y el area de Tri-County. Contactanos para confirmar cobertura en tu area.'
  },
  {
    keywords: ['warranty', 'warranties', 'guarantee', 'garantia', 'warrantee', 'lasting', 'long last', 'durable', 'peel', 'chip', 'fade'],
    en: 'We use premium paint systems built for durability. Our work is backed by our satisfaction commitment — if something is not right after completion, we make it right.',
    es: 'Usamos sistemas de pintura premium para durabilidad. Nuestro trabajo esta respaldado por nuestro compromiso de satisfaccion.'
  },
  {
    keywords: ['prep', 'preparation', 'drywall', 'crack', 'patch', 'repair', 'sand', 'prime', 'primer', 'hole', 'wall damage', 'reparacion'],
    en: 'Surface prep is a key part of every job. We patch holes and cracks, sand surfaces, and apply primer before any paint goes on — ensuring a smooth, lasting finish.',
    es: 'La preparacion es clave en cada trabajo. Rellenamos hoyos y grietas, lijamos y aplicamos primer antes de pintar para un acabado duradero.'
  },
  {
    keywords: ['cabinet', 'cabinets', 'trim', 'door', 'molding', 'ceiling', 'baseboard', 'gabinete', 'puerta', 'moldura'],
    en: 'Yes, we paint cabinets, trim, doors, ceilings, and baseboards as part of interior projects. Just mention these in your estimate request.',
    es: 'Si, pintamos gabinetes, molduras, puertas, techos y rodapies como parte de proyectos interiores. Solo mencionalos en tu solicitud.'
  }
];

const detectAssistantLang = (text, fallbackLang) => {
  if (fallbackLang === 'es') {
    return 'es';
  }

  const normalized = normalizeText(text);
  const spanishHints = ['hola', 'gracias', 'cotizacion', 'servicio', 'precio', 'horario', 'pintura'];
  return spanishHints.some((word) => normalized.includes(word)) ? 'es' : 'en';
};

app.post('/api/assistant', (req, res) => {
  const message = String(req.body?.message || '').trim();
  const requestedLang = String(req.body?.lang || '').trim().toLowerCase();

  if (!message) {
    return res.status(400).json({ ok: false, error: 'Message is required' });
  }

  if (message.length > 300) {
    return res.status(400).json({ ok: false, error: 'Message is too long' });
  }

  const normalizedMessage = normalizeText(message);
  const lang = detectAssistantLang(normalizedMessage, requestedLang);

  let bestMatch = null;
  let bestScore = 0;

  assistantRules.forEach((rule) => {
    const score = rule.keywords.reduce((sum, keyword) => {
      return sum + (matchesKeyword(normalizedMessage, keyword) ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule;
    }
  });

  const fallbackReply = {
    en: 'I can help with services, free estimates, scheduling, and contact details. For a full custom quote, please use the Request Estimate form.',
    es: 'Puedo ayudar con servicios, cotizaciones gratis, agenda y datos de contacto. Para una propuesta completa, usa el formulario de cotizacion.'
  };

  const reply = bestMatch ? (lang === 'es' ? bestMatch.es : bestMatch.en) : fallbackReply[lang];
  return res.json({
    ok: true,
    assistant: "Axel's AI Assistant",
    lang,
    reply
  });
});

app.post('/api/estimates', async (req, res) => {
  if (!mongoConnected) {
    return res.status(503).json({ ok: false, error: 'Database not available. Please configure MONGODB_URI.' });
  }
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name || !phone || !email || !service || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields'
      });
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    if (!emailIsValid) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email format'
      });
    }

    const request = await EstimateRequest.create({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      service: String(service).trim(),
      message: String(message).trim()
    });

    return res.status(201).json({
      ok: true,
      id: request._id
    });
  } catch (error) {
    console.error('Failed to save estimate request:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/bookings', async (req, res) => {
  if (!mongoConnected) {
    return res.status(503).json({ ok: false, error: 'Database not available. Please configure MONGODB_URI.' });
  }
  try {
    const { name, phone, email, service, preferredDate, timeSlot, notes } = req.body;

    if (!name || !phone || !email || !service || !preferredDate || !timeSlot) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields'
      });
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    if (!emailIsValid) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email format'
      });
    }

    const parsedDate = new Date(preferredDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid preferred date'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      return res.status(400).json({
        ok: false,
        error: 'Preferred date cannot be in the past'
      });
    }

    const booking = await Booking.create({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      service: String(service).trim(),
      preferredDate: parsedDate,
      timeSlot: String(timeSlot).trim(),
      notes: String(notes || '').trim()
    });

    return res.status(201).json({
      ok: true,
      id: booking._id
    });
  } catch (error) {
    console.error('Failed to save booking:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/gallery', async (_req, res) => {
  if (!mongoConnected) {
    return res.json({ ok: true, count: 0, data: [] });
  }
  try {
    const items = await GalleryItem.find({}, '-__v').sort({ createdAt: -1 }).lean();
    return res.json({ ok: true, count: items.length, data: items });
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
    return res.json({ ok: true, count: 0, data: [] });
  }
});

const requireAdminAuth = (req, res, next) => {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return res.status(500).json({
      ok: false,
      error: 'Admin credentials are not configured on the server'
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({
      ok: false,
      error: 'Authentication required'
    });
  }

  const encoded = authHeader.split(' ')[1];
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const separatorIndex = decoded.indexOf(':');
  const username = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : '';
  const password = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : '';

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      ok: false,
      error: 'Invalid admin credentials'
    });
  }

  return next();
};

app.get('/api/admin/estimates', requireAdminAuth, async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const estimates = await EstimateRequest.find({}, '-__v')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.json({
      ok: true,
      count: estimates.length,
      data: estimates
    });
  } catch (error) {
    console.error('Failed to fetch estimate requests:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/admin/bookings', requireAdminAuth, async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 300);
    const bookings = await Booking.find({}, '-__v')
      .sort({ preferredDate: 1 })
      .limit(limit)
      .lean();

    return res.json({
      ok: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
});

app.patch('/api/admin/bookings/:id', requireAdminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ ok: false, error: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!booking) {
      return res.status(404).json({ ok: false, error: 'Booking not found' });
    }

    return res.json({ ok: true, data: booking });
  } catch (error) {
    console.error('Failed to update booking:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
});

app.post(
  '/api/admin/gallery',
  requireAdminAuth,
  galleryUpload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]),
  async (req, res) => {
    if (!mongoConnected) {
      return res.status(503).json({ ok: false, error: 'Database not available. Please configure MONGODB_URI.' });
    }

    const beforeFile = req.files?.beforeImage?.[0];
    const afterFile = req.files?.afterImage?.[0];

    const cleanupUploaded = () => {
      [beforeFile, afterFile].forEach((file) => {
        if (file) {
          fs.unlink(file.path, () => {});
        }
      });
    };

    try {
      const { title, description } = req.body;

      if (!title || !beforeFile || !afterFile) {
        cleanupUploaded();
        return res.status(400).json({
          ok: false,
          error: 'Title, before image, and after image are all required'
        });
      }

      const item = await GalleryItem.create({
        title: String(title).trim(),
        description: String(description || '').trim(),
        beforeImage: `uploads/gallery/${beforeFile.filename}`,
        afterImage: `uploads/gallery/${afterFile.filename}`
      });

      return res.status(201).json({ ok: true, id: item._id });
    } catch (error) {
      cleanupUploaded();
      console.error('Failed to save gallery item:', error);
      return res.status(500).json({
        ok: false,
        error: 'Internal server error'
      });
    }
  }
);

app.delete('/api/admin/gallery/:id', requireAdminAuth, async (req, res) => {
  if (!mongoConnected) {
    return res.status(503).json({ ok: false, error: 'Database not available. Please configure MONGODB_URI.' });
  }
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id).lean();
    if (!item) {
      return res.status(404).json({ ok: false, error: 'Gallery item not found' });
    }

    [item.beforeImage, item.afterImage].forEach((relativePath) => {
      if (relativePath) {
        fs.unlink(path.join(__dirname, 'public', relativePath), () => {});
      }
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
});

app.get('/admin', requireAdminAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ ok: false, error: `Upload error: ${error.message}` });
  }
  return next(error);
});

let mongoConnected = false;

const startServer = async () => {
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      mongoConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.warn('MongoDB connection failed:', error.message);
      console.warn('Server will start without database — estimate submissions will be unavailable.');
    }
  } else {
    console.warn('MONGODB_URI not set — server starting without database.');
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});
