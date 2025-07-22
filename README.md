# Hono Cloudflare Worker - CRUD API with Zod OpenAPI

API sederhana menggunakan Hono framework dengan Zod OpenAPI untuk Cloudflare Workers dengan operasi CRUD pada entitas User.

## Project Structure

```
src/
├── index.ts                     # Main application entry point
└── lib/
    ├── configure-open-api.ts    # OpenAPI configuration and documentation
    ├── schemas.ts               # Zod schemas and types
    ├── routes.ts                # OpenAPI route definitions
    ├── handlers.ts              # Route handlers and business logic
    └── types.ts                 # TypeScript type definitions
```

## Setup & Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Deploy to Cloudflare
pnpm deploy
```

## API Endpoints

### Base URL

- Development: `http://localhost:8787`
- Production: `https://your-worker.your-subdomain.workers.dev`

### Endpoints

#### 1. Get API Info

```
GET /
```

Menampilkan informasi API dan daftar endpoint yang tersedia.

**Response:**

```json
{
  "message": "Hono Cloudflare Worker CRUD API",
  "version": "1.0.0",
  "endpoints": {
    "GET /users": "Get all users",
    "GET /users/:id": "Get user by ID",
    "POST /users": "Create new user",
    "PUT /users/:id": "Update user by ID",
    "DELETE /users/:id": "Delete user by ID"
  }
}
```

#### 2. Get All Users

```
GET /users
```

Mengambil semua data user.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-07-21T10:00:00.000Z",
      "updatedAt": "2025-07-21T10:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### 3. Get User by ID

```
GET /users/:id
```

Mengambil data user berdasarkan ID.

**Response Success:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-07-21T10:00:00.000Z",
    "updatedAt": "2025-07-21T10:00:00.000Z"
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

#### 4. Create New User

```
POST /users
```

Membuat user baru.

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "generated-id",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2025-07-21T10:00:00.000Z",
    "updatedAt": "2025-07-21T10:00:00.000Z"
  }
}
```

**Response Error (400):**

```json
{
  "success": false,
  "message": "Name and email are required"
}
```

#### 5. Update User

```
PUT /users/:id
```

Mengupdate data user berdasarkan ID.

**Request Body:**

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

**Response Success:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "1",
    "name": "Updated Name",
    "email": "updated@example.com",
    "createdAt": "2025-07-21T10:00:00.000Z",
    "updatedAt": "2025-07-21T10:05:00.000Z"
  }
}
```

#### 6. Delete User

```
DELETE /users/:id
```

Menghapus user berdasarkan ID.

**Response Success:**

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-07-21T10:00:00.000Z",
    "updatedAt": "2025-07-21T10:00:00.000Z"
  }
}
```

## Error Responses

### 404 Not Found

```json
{
  "success": false,
  "message": "Endpoint not found"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Testing dengan cURL

### Get all users

```bash
curl https://your-worker.your-subdomain.workers.dev/users
```

### Create new user

```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'
```

### Update user

```bash
curl -X PUT https://your-worker.your-subdomain.workers.dev/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated User", "email": "updated@example.com"}'
```

### Delete user

```bash
curl -X DELETE https://your-worker.your-subdomain.workers.dev/users/1
```

## Features

- ✅ **Modular Architecture**: Organized codebase with separated concerns
- ✅ **Zod OpenAPI Integration**: Automatic API documentation generation
- ✅ **Type Safety**: Full TypeScript support with Zod schema validation
- ✅ **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- ✅ **API Documentation**: Interactive documentation with Scalar UI
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **CORS Support**: Cross-origin resource sharing enabled
- ✅ **Path Mapping**: Clean imports with `@/` path aliases

## Modular Structure Benefits

### 1. **Separation of Concerns**

- **schemas.ts**: All Zod schemas and type definitions
- **routes.ts**: OpenAPI route configurations
- **handlers.ts**: Business logic and request handling
- **configure-open-api.ts**: API documentation setup

### 2. **Easy Maintenance**

- Clear file organization makes it easy to find and modify code
- Each module has a single responsibility
- Easy to add new endpoints by following the existing pattern

### 3. **Type Safety**

- Zod schemas provide runtime validation and compile-time types
- OpenAPI integration ensures documentation stays in sync with code
- TypeScript path mapping for clean imports

## Adding New Endpoints

To add a new endpoint, follow these steps:

1. **Define Schema** in `src/lib/schemas.ts`:

```typescript
export const NewEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  // ... other fields
});
```

2. **Create Route** in `src/lib/routes.ts`:

```typescript
export const getNewEntityRoute = createRoute({
  method: 'get',
  path: '/entities',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(NewEntitySchema),
        },
      },
    },
  },
  tags: ['Entities'],
});
```

3. **Implement Handler** in `src/lib/handlers.ts`:

```typescript
export const getNewEntityHandler = (c: any) => {
  // Implementation logic
  return c.json({ data: [] });
};
```

4. **Register in Main App** in `src/index.ts`:

```typescript
import { getNewEntityRoute } from '@/lib/routes';
import { getNewEntityHandler } from '@/lib/handlers';

app.openapi(getNewEntityRoute, getNewEntityHandler);
```

## API Documentation

The API automatically generates OpenAPI 3.0 documentation accessible at:

- **Documentation UI**: `/docs` - Interactive Scalar UI
- **OpenAPI Spec**: `/doc` - Raw OpenAPI JSON specification

### Documentation Features

- 📖 **Interactive API Explorer**: Test endpoints directly in the browser
- 🎨 **Purple Theme**: Clean and professional appearance
- 📝 **Auto-generated Schemas**: Documentation stays in sync with code
- 🔄 **Live Updates**: Changes to schemas reflect immediately in docs

## Fitur

- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ JSON response format yang konsisten
- ✅ Error handling yang proper
- ✅ Validasi input
- ✅ CORS middleware
- ✅ In-memory storage (untuk demo)
- ✅ TypeScript support
- ✅ ID generation otomatis
- ✅ Timestamp tracking (createdAt, updatedAt)

## Notes

- API ini menggunakan in-memory storage, jadi data akan hilang saat worker restart
- Untuk production, gunakan database seperti Cloudflare D1, KV, atau external database
- Semua response menggunakan format JSON yang konsisten
- CORS sudah dikonfigurasi untuk semua origin

## Type Generation (Optional)

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```
