<div align="center">
  <img src="frontend/src/assets/AriaLogo.png" alt="Aria Vacation Club Logo" width="200"/>
</div>


# Aria Vacation Club Questionnaire System

A comprehensive feedback management platform for Aria Vacation Club to collect, analyze, and manage member feedback after resort stays.

## 📋 Overview

This web application provides a complete feedback management solution including:
- **Member questionnaire interface** for collecting post-stay feedback
- **Admin dashboard** with analytics and reporting
- **Questionnaire management system** for creating and editing surveys
- **Multi-language email templates** for member communication
- **User role management**

## ✨ Current Features

### Admin Dashboard
- **Real-time Analytics**: Response rates, satisfaction scores, pending responses
- **Visual Reports**: Satisfaction distribution charts and trend analysis
- **Key Metrics**: Monthly response tracking and improvement indicators
- **Recent Feedback Overview**: Latest questionnaire submissions

### Questionnaire Management
- **Form Types**: Create and manage different questionnaire categories
- **Form Templates**: Build reusable questionnaire structures and link them to a Form Type
- **Email Templates**: Multi-language email communication (Arabic, Russian, French, English)
- **Member Tracking**: Complete member database with stay details

### Member & Internal User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **User Authentication**: Secure internal user login system
- **Progress Tracking**: Clear indication of questionnaire completion
- **Multi-language Support**: Available in multiple languages

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20.0 or higher)
- [npm](https://www.npmjs.com/)
- Database system -[Mongo DB Atlas](https://www.mongodb.com/)

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Aliwah1403/Aria-Vacation-Questionnaire.git
   ```

2. Navigate to the project frontend directory:
   ```bash
   cd Aria-Vacation-Questionnaire/frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open another terminal tab and navigate to the project backend directory:
   ```bash
   cd Aria-Vacation-Questionnaire/backend
   ```

7. Install dependencies:
   ```bash
   npm install
   ```

8. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

9. Start the development server:
   ```bash
   npm run dev
   ```

10. Access the application:
   - Admin Panel: `http://localhost:5173/admin/dashboard`

## 🏗️ Application Structure

### Main Sections
- **Dashboard**: Analytics and overview metrics
- **Questionnaires**: Member feedback management and survey distribution
- **Setup**: Form creation, templates, and email management
- **Users**: Internal user management

### Database Structure
The system tracks:
- Member information (ID, Name, Email, Resort, Unit, Check-in/out dates)
- Questionnaire responses and ratings
- Form templates and question structures
- Email templates in multiple languages
- User roles and permissions

## ⚙️ Configuration

### Frontend Environment Variables
```env
# URL Configuration
VITE_URL=your_frontend_url
VITE_API_URL=your_backend_url


# Posthog Analytics Configuration
VITE_PUBLIC_POSTHOG_KEY=your_posthog_public_key
VITE_PUBLIC_POSTHOG_KEY=your_posthog_host_url
```

### Backend Environment Variables
```env
# Database Configuration
DB_URI=your_MongoDB_Atlas_database_url

# Email Configuration
SMTP_HOST=your_smtp_server
SMTP_PORT=587
SMTP_USER=your_email_username
SMTP_PASS=your_email_password

# Better-Auth Authentication Configuration
BETTER_AUTH_SECRET=your_better-auth_secret_api_key
BETTER_AUTH_URL=your_backend_url

# Sentry Analytics Configuration
SENTRY_DSN=your_sentry_url

# Application Settings
NODE_ENV="development"_||_"production"
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
PORT=5000
CORS_ORIGINS=http://localhost:5173
```

### Language Configuration
Supported languages:
- English (EN)
- Arabic (AR)
- Russian (RU)
- French (FR)

## 📊 Admin Functions

### Dashboard Management
- **Monitor Response Rates**: Track completion percentages
- **View Satisfaction Scores**: Average ratings and trends
- **Pending Responses**: Follow up on incomplete surveys

### Questionnaire Setup
- **Create Form Types**: Define survey categories
- **Build Templates**: Design question structures
- **Manage Email Templates**: Customize member communications
- **Send Questionnaires**: Distribute surveys to members

### Member Management
- **View Member Database**: Access complete guest information
- **Track Stay Details**: Monitor check-in/out dates and units
- **Filter and Search**: Find specific members or stays

## 🔧 Maintenance & Updates

### Managing Form Types/Categories
1. Navigate to Setup → Form Types
2. Select existing form type or create new one

### Adding New Questions
1. Navigate to Setup → Form Templates
2. Select existing template or create new one
3. Add questions using the form builder
4. Update email templates if needed

### Managing Email Templates
1. Go to Setup → Email Content
2. Select language and template type
3. Edit subject line and email content
4. Save and activate template

### User Role Management
- Admin roles and permissions
- Limited access users
- Role-specific access controls


## 🗂️ Important Files & Locations

### Configuration Files
- **Environment File**: `.env.development.local` and `.env.production.local` file
- **Database**: `backend/database/mongoDb.js`
- **Sentry Config**: `backend/instrument.js`
- **Database Structure**: `backend/models
- **Backend Software Functions**: `backend/controllers`
- **Backend URLs**: `backend/routes`
- **Better-Auth Backend Authentication**: `backend/lib/auth.js`
- **Email Config**: `backend/services/emailService.js`
- **Better-Auth Frontend Authentication**: `frontend/lib/auth-client.js`

### Key Components
- **Dashboard Analytics**: `frontend/pages/Admin-Side/Dashboard/`
- **Questionnaire Forms**: `frontend/pages/Admin-Side/Questionnaires/`
- **Form & Email Setup**: `frontend/pages/Admin-Side/Setup/`
- **Role Management**: `frontend/pages/Admin-Side/User-Management`
- **Authentication**: `frontend/pages/Admin-Side/Auth`

## 🔄 Troubleshooting

### Common Issues
- **Database Connection**: Check environment variables for MongoDB URI and allowed IP addresses on MongoDB Atlas
- **Email Not Sending**: Verify SMTP credentials and settings
- **Charts Not Loading**: Check data queries and chart library imports
- **Member Login Issues**: Verify authentication system and member data

### System Maintenance
- Regular database backup health checks (Backup happens automatically)
- Email template testing across languages
- User access audit

---

*This comprehensive feedback system streamlines member communication and provides valuable insights for Aria Vacation Club operations. All admin functions are accessible through the web interface without requiring code modifications.*
