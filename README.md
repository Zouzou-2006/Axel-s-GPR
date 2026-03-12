# AXEL'S GPR - MongoDB Backend Setup

This project now includes a Node.js + Express backend that stores contact form estimate requests in MongoDB.

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment variables

Create a `.env` file in the project root:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-strong-password
```

## 3) Run the project

```bash
npm run start
```

Then open http://localhost:4000

## API

- `GET /api/health` - Health check
- `POST /api/estimates` - Store a contact/estimate request
- `POST /api/assistant` - Axel's AI Assistant basic Q&A endpoint
- `GET /api/admin/estimates` - List recent estimate requests (Basic Auth required)
- `GET /admin` - Browser admin dashboard (Basic Auth required)

Example body:

```json
{
  "name": "John Doe",
  "phone": "(555) 123-4567",
  "email": "john@example.com",
  "service": "Interior Painting",
  "message": "I need a quote for living room and kitchen repaint."
}
```

Assistant endpoint example:

```bash
curl -X POST http://localhost:4000/api/assistant -H "Content-Type: application/json" -d "{\"message\":\"Do you offer free estimates?\",\"lang\":\"en\"}"
```

Admin endpoint example:

```bash
curl -u admin:change-me-strong-password "http://localhost:4000/api/admin/estimates?limit=20"
```
