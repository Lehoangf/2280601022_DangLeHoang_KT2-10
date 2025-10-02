# User Role Management System

A Node.js application with MongoDB for managing Users and Roles with comprehensive CRUD operations.

**Author:** Đặng Lê Hoàng - 2280601022

## Features

- **Role Management**: Complete CRUD operations for roles
- **User Management**: Complete CRUD operations for users with advanced search
- **User Verification**: Endpoint to verify and activate users
- **Soft Delete**: Non-destructive deletion for both users and roles
- **Search Functionality**: Search users by username and fullname
- **Password Hashing**: Secure password storage using bcrypt
- **Data Validation**: Comprehensive input validation
- **Pagination**: Paginated results for user listings

## Database Schema

### User Object
```javascript
{
  username: String, // unique, required
  password: String, // required, hashed
  email: String, // required, unique
  fullName: String, // default: ""
  avatarUrl: String, // default: ""
  status: Boolean, // default: false
  role: ObjectId, // reference to Role
  loginCount: Number, // default: 0, min: 0
  isDelete: Boolean, // default: false
  timestamps: true // createdAt, updatedAt
}
```

### Role Object
```javascript
{
  name: String, // unique, required
  description: String, // default: ""
  isDelete: Boolean, // default: false
  timestamps: true // createdAt, updatedAt
}
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Lehoangf/2280601022_DangLeHoang_KT2-10.git
cd 2280601022_DangLeHoang_KT2-10
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/user_role_management
NODE_ENV=development
```

4. Start MongoDB service on your machine

5. Run the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. Open your browser and navigate to `http://localhost:3000` to access the web interface

## Web Interface

The application includes a complete web interface accessible at `http://localhost:3000` with the following features:

### 🏠 Dashboard
- System statistics overview
- Quick navigation to all features
- Real-time data display

### 👥 Role Management
- ➕ **Create Role**: Form to add new roles
- 📋 **List Roles**: View all roles in a table
- ✏️ **Edit Role**: Modal popup for editing role details
- 🗑️ **Delete Role**: Soft delete with confirmation

### 👤 User Management
- 🔍 **Search Users**: Search by username and full name
- ➕ **Create User**: Form to add new users with role selection
- 📋 **List Users**: Paginated table with all user details
- ✏️ **Edit User**: Modal popup for editing user information
- 🗑️ **Delete User**: Soft delete with confirmation
- 📊 **Pagination**: Navigate through user pages

### ✅ User Verification
- Simple form to verify users by email and username
- Activates user account (sets status to true)

### Features of the Web Interface:
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Modern UI**: Clean, professional interface
- ⚡ **Real-time Updates**: Instant feedback on all actions
- 🔄 **AJAX Operations**: No page refresh needed
- ✅ **Form Validation**: Client and server-side validation
- 🚨 **Error Handling**: Clear error messages and alerts
- 🔍 **Advanced Search**: Filter users with multiple criteria
- 📄 **Pagination**: Handle large datasets efficiently

## API Endpoints

### Base URL: `http://localhost:3000/api`

### Role Endpoints

#### 1. Create Role
- **POST** `/roles`
- **Body:**
```json
{
  "name": "Admin",
  "description": "Administrator role with full access"
}
```

#### 2. Get All Roles
- **GET** `/roles`
- **Response:** List of all active roles

#### 3. Get Role by ID
- **GET** `/roles/:id`
- **Response:** Single role object

#### 4. Update Role
- **PUT** `/roles/:id`
- **Body:**
```json
{
  "name": "Super Admin",
  "description": "Updated description"
}
```

#### 5. Delete Role (Soft Delete)
- **DELETE** `/roles/:id`

### User Endpoints

#### 1. Create User
- **POST** `/users`
- **Body:**
```json
{
  "username": "johndoe",
  "password": "password123",
  "email": "john@example.com",
  "fullName": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "role": "role_id_here"
}
```

#### 2. Get All Users (with Search)
- **GET** `/users`
- **Query Parameters:**
  - `username`: Search by username (contains)
  - `fullName`: Search by full name (contains)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

**Examples:**
```
GET /users?username=john
GET /users?fullName=doe
GET /users?username=john&fullName=doe&page=1&limit=5
```

#### 3. Get User by ID
- **GET** `/users/id/:id`

#### 4. Get User by Username
- **GET** `/users/username/:username`

#### 5. Update User
- **PUT** `/users/:id`
- **Body:**
```json
{
  "fullName": "John Updated",
  "status": true,
  "loginCount": 5
}
```

#### 6. Delete User (Soft Delete)
- **DELETE** `/users/:id`

#### 7. Verify User
- **POST** `/users/verify`
- **Body:**
```json
{
  "email": "john@example.com",
  "username": "johndoe"
}
```
- **Function:** If email and username match an existing user, sets `status` to `true`

## Usage Examples

### 1. Create a Role
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "description": "Administrator role"
  }'
```

### 2. Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "email": "admin@example.com",
    "fullName": "System Administrator",
    "role": "ROLE_ID_FROM_STEP_1"
  }'
```

### 3. Search Users
```bash
# Search by username
curl "http://localhost:3000/api/users?username=admin"

# Search by full name
curl "http://localhost:3000/api/users?fullName=administrator"
```

### 4. Verify User
```bash
curl -X POST http://localhost:3000/api/users/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin"
  }'
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}, // Response data
  "pagination": {} // For paginated responses
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors (if any)
}
```

## Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Project Structure

```
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── roleController.js    # Role business logic
│   └── userController.js    # User business logic
├── models/
│   ├── Role.js             # Role schema
│   └── User.js             # User schema
├── routes/
│   ├── roleRoutes.js       # Role API routes
│   └── userRoutes.js       # User API routes
├── .env                    # Environment variables
├── package.json           # Dependencies and scripts
├── server.js             # Main application file
└── README.md            # This file
```

## Development Notes

- Passwords are automatically hashed before saving to database
- All delete operations are soft deletes (sets `isDelete: true`)
- User searches are case-insensitive and use regex matching
- Role references are populated in user responses
- Input validation is implemented for all endpoints
- Timestamps are automatically managed by Mongoose

## License

This project is for educational purposes as part of coursework for student ID: 2280601022.