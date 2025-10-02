# API Testing Examples

This file contains examples of how to test the API endpoints using curl commands or any REST client like Postman.

## Prerequisites
1. Start MongoDB service
2. Run the application: `npm run dev`
3. Server should be running on http://localhost:3000

## Testing Steps

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. Create Roles First

#### Create Admin Role
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "description": "Administrator with full access"
  }'
```

#### Create User Role
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User",
    "description": "Regular user with limited access"
  }'
```

#### Get All Roles (copy a role ID for user creation)
```bash
curl http://localhost:3000/api/roles
```

### 3. Create Users

#### Create Admin User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "email": "admin@example.com",
    "fullName": "System Administrator",
    "role": "REPLACE_WITH_ADMIN_ROLE_ID"
  }'
```

#### Create Regular User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "role": "REPLACE_WITH_USER_ROLE_ID"
  }'
```

### 4. Test User Operations

#### Get All Users
```bash
curl http://localhost:3000/api/users
```

#### Search Users by Username
```bash
curl "http://localhost:3000/api/users?username=john"
```

#### Search Users by Full Name
```bash
curl "http://localhost:3000/api/users?fullName=doe"
```

#### Get User by Username
```bash
curl http://localhost:3000/api/users/username/johndoe
```

#### Get User by ID
```bash
curl http://localhost:3000/api/users/id/USER_ID_HERE
```

### 5. Test User Verification

#### Verify User (Activate User)
```bash
curl -X POST http://localhost:3000/api/users/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe"
  }'
```

### 6. Update Operations

#### Update User
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Updated Doe",
    "status": true,
    "loginCount": 5
  }'
```

#### Update Role
```bash
curl -X PUT http://localhost:3000/api/roles/ROLE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "description": "Super administrator with all permissions"
  }'
```

### 7. Soft Delete Operations

#### Delete User (Soft Delete)
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID_HERE
```

#### Delete Role (Soft Delete)
```bash
curl -X DELETE http://localhost:3000/api/roles/ROLE_ID_HERE
```

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors if any
  ]
}
```

### Paginated Response (for user listing)
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    // Array of users
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

## Tips for Testing

1. Always create roles before creating users
2. Copy the role IDs from the role creation response
3. Use the verification endpoint to activate users
4. Test search functionality with partial matches
5. Verify that soft deletes work (deleted items should not appear in listings)
6. Test pagination with different page and limit parameters

## Postman Collection

If using Postman, you can import these requests:
1. Create a new collection named "User Role Management"
2. Add requests for each endpoint above
3. Use environment variables for base URL and IDs
4. Test the complete workflow from role creation to user management