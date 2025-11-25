# Smart Receipts

A full-stack web application for digitizing, organizing, and managing receipts. Users can upload receipt images, extract data, and track their expenses with ease.

## 🌟 Features

- **User Authentication**: Secure registration and login with JWT authentication
- **Receipt Management**: Upload, view, and manage receipt images
- **Receipt Details**: Store and display detailed receipt information
- **Dashboard**: Overview of all uploaded receipts
- **Responsive Design**: Clean, modern UI built with React and Tailwind CSS
- **File Upload**: Secure file upload handling with Multer
- **Data Validation**: Comprehensive input validation and error handling
- **Notification Alerts**: Added a notification context to display notifications when events occur.

## 🏗️ Project Structure

```
smart-receipts/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Custom middleware (auth, etc.)
│   │   ├── models/          # MongoDB models (User, Receipt)
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context for state management
│   │   ├── api/             # Axios API client configuration
│   │   └── App.tsx          # Main App component
│   ├── public/
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** - Web framework
- **MongoDB** with Mongoose - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** with TypeScript
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **React Testing Library** - Testing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance running

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/smart-receipts
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Frontend Setup

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The backend will run on `http://localhost:5000` and the frontend on `http://localhost:3000`.

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Receipts
- `GET /api/receipts` - Get all receipts (protected)
- `GET /api/receipts/:id` - Get receipt details (protected)
- `POST /api/receipts` - Create new receipt (protected)
- `PUT /api/receipts/:id` - Update receipt (protected)
- `DELETE /api/receipts/:id` - Delete receipt (protected)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for secure authentication. Tokens are stored and sent with requests to protected endpoints. The `ProtectedRoute` component ensures only authenticated users can access certain pages.

## 📝 Scripts

### Backend
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build

### Frontend
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests

## 🎨 Pages

- **Login** - User login interface
- **Register** - New user registration
- **Dashboard** - Overview of receipts
- **Receipts List** - Browse all receipts
- **Receipt Detail** - View detailed receipt information
- **Receipt Form** - Create/upload new receipt

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Akshat

---