# LEARN EASILY

### Video Demo: <https://youtu.be/yLUnnFnBjzQ>

### Description:

**Learn Easily** is a full-stack web application designed to help students and learners organize their study materials using the renowned **Cornell Note-Taking Method**. This educational technique, developed at Cornell University, has been scientifically proven to enhance comprehension, retention, and recall of information. The application provides a modern, intuitive digital interface that allows users to create, edit, manage, and search through their notes efficiently, making the study process more structured and effective.

The Cornell Method divides each note into three distinct sections: a **cue column** for questions and keywords, a **note-taking area** for detailed information captured during lectures or reading sessions, and a **summary section** at the bottom for synthesizing the main ideas. Learn Easily digitizes this proven system, enabling users to access their notes from any device with a web browser.

---

## Technologies Used

### Backend Technologies

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment for server-side execution |
| **Express.js** | Fast, minimalist web framework for building the REST API |
| **SQLite3** | Lightweight, serverless relational database for data persistence |
| **JSON Web Token (JWT)** | Secure authentication and authorization tokens |
| **bcrypt** | Password hashing for secure credential storage |
| **CORS** | Cross-Origin Resource Sharing middleware for frontend communication |
| **dotenv** | Environment variable management for secure configuration |
| **Nodemon** | Development tool for automatic server restart on file changes |

### Frontend Technologies

| Technology | Purpose |
|------------|---------|
| **React** | Modern JavaScript library for building interactive user interfaces |
| **Vite** | Next-generation frontend build tool with hot module replacement |
| **React Router DOM** | Client-side routing for single-page application navigation |
| **TailwindCSS** | Utility-first CSS framework for rapid UI development |
| **Axios** | Promise-based HTTP client for API requests |
| **Lucide React** | Beautiful and consistent icon library |
| **Sonner** | Toast notification component for user feedback |
| **date-fns** | Modern JavaScript date utility library |
| **shadcn/ui** | A collection of accessible React components |

### Programming Languages

- **JavaScript**: The primary programming language used for both frontend and backend development.
- **HTML**: Semantic markup for structuring the web application's content and layout.
- **CSS**: Styling through TailwindCSS utility classes for a responsive and modern design.
- **SQL**: Database queries for SQLite3 data operations using parameterized queries for security.

---

## Project Structure

The application follows a modern **monorepo architecture** with clearly separated frontend and backend directories, promoting maintainability and scalability. An MVC (Model-View-Controller) design pattern is implemented to separate concerns and improve code organization. The main folders are:

```
learn_easily_app/
├── backend/                    # Server-side application
│   ├── config/                 
│   │   └── database.js         # SQLite connection and table schemas
│   ├── controllers/            # Request handlers
│   │   ├── noteController.js   # CRUD operations for notes
│   │   └── userController.js   # Authentication and user management
│   ├── middleware/             
│   │   └── authMiddleware.js   # JWT verification middleware
│   ├── models/                 # Data access layer
│   │   ├── noteModel.js        
│   │   └── userModel.js        
│   ├── routes/                 # API endpoint definitions
│   │   ├── noteRoutes.js       
│   │   └── userRoutes.js       
│   ├── server.js               # Application entry point
│   ├── database.db             # SQLite database file
│   └── package.json            
│
├── frontend/                   # Client-side application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            
│   │   │   └── authContext.jsx # Authentication state management
│   │   ├── hooks/              
│   │   │   ├── useAuth.jsx     # Authentication hook
│   │   │   └── useNotes.jsx    # Notes management hook
│   │   ├── pages/              # Page components
│   │   ├── services/           
│   │   │   ├── api.js          # Axios instance with interceptors
│   │   │   ├── authService.js  # Authentication API calls
│   │   │   └── noteService.js  # Notes API calls
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx            # Application entry point
│   ├── index.html              # HTML template
│   └── package.json            
│
└── README.md                   # Project documentation
```

---

## Backend Architecture

### Database Design

The application uses **SQLite3** as its database management system, offering a lightweight, serverless solution perfect for development and small to medium-scale deployments. The database schema consists of two main tables with a one-to-many relationship:

**Users Table:**
- `id`: Primary key with auto-increment
- `email`: Unique user email for authentication
- `name`: User's first name
- `lastname`: User's last name
- `password`: Bcrypt-hashed password
- `created_at` / `updated_at`: Timestamps for record management

**Notes Table:**
- `id`: Primary key with auto-increment
- `user_id`: Foreign key referencing the users table (with CASCADE delete)
- `title`: Note title (required)
- `subject`: Optional subject/category
- `cue_text`: Cornell Method cue column content
- `note_text`: Cornell Method main notes section
- `summary_text`: Cornell Method summary section
- `created_at` / `updated_at`: Timestamps for record management

### API Endpoints

The REST API follows standard conventions and is organized into two main route groups:

**User Routes (`/api/users`):**
- `POST /register` - Register a new user account
- `POST /login` - Authenticate and receive JWT token
- `POST /logout` - Logout user session
- `GET /profile/:id` - Get user profile information
- `PUT /profile/:id` - Update user profile (name, lastname)
- `PUT /profile/email/:id` - Update user email address
- `PUT /profile/password/:id` - Update user password
- `DELETE /profile/delete/:id` - Delete user account

**Note Routes (`/api/notes`):**
- `POST /new` - Create a new note
- `GET /` - Get all notes for authenticated user
- `GET /:id` - Get a specific note
- `PUT /:id` - Update an existing note
- `DELETE /:id` - Delete a note

### Authentication & Security

1. **Password Hashing**: All passwords are hashed using bcrypt with a salt rounds factor of 10, ensuring secure storage even in case of database compromise.

2. **JWT Authentication**: Upon successful login, the server generates a JSON Web Token valid for 6 hours. This token must be included in the Authorization header for all protected routes.

3. **Auth Middleware**: A custom middleware validates JWT tokens on every protected request, extracting user information and attaching it to the request object for downstream use.

4. **Input Validation**: All controller methods validate required fields before processing, returning appropriate error messages for invalid requests.

5. **Foreign Key Constraints**: Database integrity is maintained through foreign key relationships with CASCADE delete, ensuring orphaned records are automatically removed.

---

## Frontend Architecture

### State Management

The `AuthContext` provides:

- Current user information
- Login/Register/Logout functions
- Authentication status boolean
- Loading state for async operations

### Routing & Navigation

**React Router DOM** handles client-side navigation with the following route structure:

- `/` - Redirects to dashboard
- `/login` - Public authentication page
- `/dashboard` - Protected notes list view
- `/notes/new` - Protected new note creation
- `/notes/:id` - Protected note editing
- `/profile` - Protected user profile management
- `*` - 404 Not Found page

The application implements both **Protected Routes** (requiring authentication) and **Public Routes** (redirecting authenticated users away from login).

### Component Organization

Components are organized by feature and purpose:

- **UI Components**: Reusable, styled components. These include buttons, inputs, cards, dialogs, alerts, and more.

- **Layout Components**: Page structure components including the main layout wrapper and header.

- **Notes Components**: Specialized components for note management including the Cornell Note editor, note list, search bar, and note cards.

### Custom Hooks

The application utilizes custom hooks to encapsulate and reuse stateful logic:

- `useAuth`: Provides easy access to authentication context throughout the component tree.
- `useNotes`: Manages notes state including fetching, creating, updating, and deleting notes with built-in loading and error handling.

### API Communication

The `services` layer abstracts all API communication:

- **api.js**: Configured Axios instance with request/response interceptors for automatic token injection and 401 error handling with automatic logout.
- **authService.js**: Authentication-related API calls with local storage management.
- **noteService.js**: CRUD operations for notes management.

---

## Key Features

### 📝 Cornell Note-Taking System
The application's core feature is its implementation of the Cornell Method. Each note is divided into three distinct areas mirroring the traditional paper-based system, helping users organize information effectively.

### 🔐 Secure User Authentication
Complete user management with secure registration, login, password hashing, and JWT-based session management.

### 📱 Responsive Design
Built with TailwindCSS, the application adapts seamlessly to different screen sizes, from mobile devices to desktop monitors.

### 🔍 Full-Text Search
Users can quickly find notes by searching through titles, subjects, and content across all their saved notes.

### ⚡ Real-Time Feedback
Toast notifications powered by Sonner provide immediate feedback for all user actions, enhancing the user experience.

### 👤 Profile Management
Users can update their personal information, change their email address, update their password and delete their account through the profile page.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/Johnny-Fingers/learn-easily.git>
cd learn_easily_app
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Configure environment variables:
Create a `.env` file in the backend directory with:
```env
PORT=3000
JWT_SECRET=your_secret_key_here
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The backend will run on `http://localhost:3000` and the frontend on `http://localhost:5173`.

---

*Learn Easily - Making effective studying accessible to everyone through the power of the Cornell Note-Taking Method.*
