```markdown
# Note-Taking Application

A full-stack note-taking application with authentication and CRUD functionality for notes.

## Features

- **User Authentication**:
  - Email/Password with OTP verification
  - Google OAuth login
- **Note Management**:
  - Create, view, and delete notes
  - Real-time updates
- **Responsive Design**:
  - Works on mobile, and desktop
- **Secure**:
  - JWT authentication
  - Input validation
  - Protected routes

## Technology Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- React Icons

### Backend
- Node.js with Express
- TypeScript
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT) for authentication
- Nodemailer for OTP emails
- google-auth-library for Google OAuth

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation
- Google OAuth credentials

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abhishekmishra0409/HD_NoteTaking_Assignment
   cd HD_NoteTaking_Assignment
   ```

2. **Install dependencies**:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**:

   Create `.env` files in both `server` and `client` directories:

   **Server (.env)**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password_or_app_password
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLIENT_URL=http://localhost:3000
   ```

   **Client (.env)**
   ```
   REACT_APP_API_BASE=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

### Running the Application

1. **Start the server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client**:
   ```bash
   cd ../client
   npm run dev
   ```

## API Endpoints

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | /api/auth/register     | Register new user               |
| POST   | /api/auth/verify-otp   | Verify OTP                      |
| POST   | /api/auth/login        | Login user                      |
| POST   | /api/auth/google       | Google OAuth authentication     |
| GET    | /api/notes             | Get all notes for user          |
| POST   | /api/notes             | Create new note                 |
| DELETE | /api/notes/:id         | Delete a note                   |

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the React app:
   ```bash
   cd client
   npm run build
   ```

2. Upload the `build` folder to your hosting provider

### Backend Deployment (Render/Heroku)

1. Set up a Node.js service
2. Add environment variables
3. Connect to your MongoDB database


