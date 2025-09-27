# Patient Registration System

A full-stack patient registration application built with Express.js, React, TypeScript, and PostgreSQL.

## Features

### Backend

- **Patient Registration API** with comprehensive validation
- **PostgreSQL Database** with direct connection
- **Asynchronous Email Service** using Bull queues and Redis
- **File Upload** with image processing using Sharp
- **Input Validation** with express-validator
- **Rate Limiting** and security middleware

### Frontend

- **Modern React UI** with TypeScript
- **Patient Cards** with expandable details
- **Drag & Drop** file upload for document photos
- **Form Validation** with real-time error messages
- **Animated Modals** for success/error states
- **Responsive Design** with Tailwind CSS
- **Loading States** and empty state handling

## Tech Stack

### Backend

- Node.js with Express.js
- TypeScript
- PostgreSQL with direct connection
- Redis for job queues
- Bull for background job processing
- Nodemailer for email sending
- Sharp for image processing
- Multer for file uploads

### Frontend

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- React Hook Form for form handling
- React Dropzone for file uploads
- Axios for API calls

### Development

- Docker & Docker Compose
- Hot reloading for both frontend and backend
- ESLint and TypeScript for code quality

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Quick Start (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lightit
   ```

2. **Start the application**

   ```bash
   ./start.sh
   ```

   That's it! The script will:

   - Create environment file with default values
   - Start all services (PostgreSQL, Backend, Frontend)
   - Set up the database automatically
   - Build and run everything

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Manual Setup (Alternative)

If you prefer to set up manually:

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd patient-registration-app
   npm run setup
   ```

2. **Start with Docker Compose**

   ```bash
   docker compose up --build
   ```

3. **Or start locally**

   ```bash
   # Start database
   docker compose up -d postgres

   # Start backend and frontend
   npm run dev
   ```

### Development Commands

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build for production
npm run build

# Docker commands
docker-compose up -d          # Start all services
docker-compose down           # Stop all services
docker-compose logs -f        # View logs
docker-compose build          # Rebuild containers
```

## API Endpoints

### Patients

- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient (with file upload)

### Health Check

- `GET /api/health` - API health status

## Database Schema

### Patient Table

```sql
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  fullname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  countrycode TEXT NOT NULL,
  documentphoto TEXT NOT NULL,
  createdat TIMESTAMP DEFAULT NOW(),
  updatedat TIMESTAMP DEFAULT NOW()
);
```

## Validation Rules

### Frontend Validation

- **Full Name**: Letters and spaces only, 2-100 characters
- **Email**: Must be a Gmail address (@gmail.com)
- **Phone**: Digits only, 7-15 characters
- **Country Code**: Must start with + and contain 1-4 digits
- **Document Photo**: JPG images only, drag & drop support

### Backend Validation

- Server-side validation using express-validator
- Email uniqueness check
- File type and size validation
- Input sanitization and security

## Email Service

The application uses an asynchronous email service with the following features:

- **Background Processing**: Emails are sent in the background using Bull queues
- **Retry Logic**: Failed emails are retried with exponential backoff
- **Mailtrap Integration**: Development email testing
- **Confirmation Emails**: Sent automatically after patient registration

## File Upload

- **Image Processing**: Automatic resizing and optimization using Sharp
- **File Validation**: JPG format only, 5MB size limit
- **Secure Storage**: Files stored in uploads directory
- **Static Serving**: Images served via Express static middleware

## Future Enhancements

The application is designed with future SMS notifications in mind:

- **Queue System**: Already implemented with Bull and Redis
- **Modular Architecture**: Easy to add new notification types
- **Background Processing**: Ready for SMS integration

## Project Structure

```
patient-registration-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   └── uploads/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
├── docker-compose.yml
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
