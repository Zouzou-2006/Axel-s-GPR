const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const EstimateRequest = require('./src/models/EstimateRequest');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

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
    en: 'You can reach us at (555) 123-4567 or hello@axelsgpr.com. You can also submit the Request Estimate form and we reply within 24 hours.',
    es: 'Puedes contactarnos al (555) 123-4567 o hello@axelsgpr.com. Tambien puedes enviar el formulario y respondemos en 24 horas.'
  },
  {
    keywords: ['color', 'colours', 'palette', 'shade', 'sheen', 'finish', 'eggshell', 'satin', 'semi-gloss', 'matte', 'flat', 'gloss', 'colores'],
    en: 'We offer free color consultation! We help you pick the right hue, undertone, and sheen (matte, eggshell, satin, semi-gloss) based on your lighting and how the space is used.',
    es: 'Ofrecemos asesoria de color gratis. Te ayudamos a elegir el tono, subtono y acabado (mate, eggshell, satin, semi-brillo) segun la iluminacion y uso del espacio.'
  },
  {
    keywords: ['area', 'location', 'where', 'serve', 'zone', 'city', 'neighborhood', 'region', 'local', 'near', 'nearby', 'zona', 'ciudad', 'ubicacion'],
    en: 'We serve residential and commercial properties across your city and surrounding areas. Reach out and we will confirm coverage for your location.',
    es: 'Trabajamos en propiedades residenciales y comerciales en su ciudad y zonas cercanas. Contactanos para confirmar cobertura en tu area.'
  },
  {
    keywords: ['warranty', 'guarantee', 'garantia', 'warrantee', 'lasting', 'long last', 'durable', 'peel', 'chip', 'fade'],
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
      return sum + (normalizedMessage.includes(normalizeText(keyword)) ? 1 : 0);
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

app.get('/admin', requireAdminAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.use(express.static(path.join(__dirname, '.vscode')));
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '.vscode', 'index.html'));
});

const startServer = async () => {
  if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI in environment variables');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});
