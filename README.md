# PROFILE AUTHENTICATION SYSTEM USING DJANGO REST FRAMEWORK AND REACT.JS

🚀 Welcome to the Profile Authentication System! This powerful tool combines Django REST framework for the backend API with React.js and Chakra UI for a beautiful frontend user interface.

## Screenshots

📷 Here are some screenshots of the Profile Authentication System:

### Login Screen
![Login Screen](https://res.cloudinary.com/sakshamtolani/image/upload/v1732821524/iwsekjtly2thrxraza5n.png)

The Login Screen provides a secure entry point where users can authenticate themselves. It features a clean interface with options for both login and registration. Users can also request password resets if they've forgotten their credentials.

### Profile Dashboard
![Profile](https://res.cloudinary.com/sakshamtolani/image/upload/v1732821663/rpgluvyis8z4ih2czeoz.png)

The Profile Dashboard displays user information and provides options to manage their profile. Users can view their details, change their password, and access other account-related features through an intuitive interface.

## Requirements

✅ To run this application, ensure you have the following prerequisites:

- Python 3.x 🐍
- Django 🌐
- Django REST Framework 📦
- React.JS ^18.2.0 ⚛️
- Chakra UI ^2.8.0 💅
- SendGrid (for email services) 📧

## Usage

1. Clone the repository:

```shell
git clone https://github.com/SakshamTolani/pro-auth/
```

2. Create a new branch:

```shell
git checkout -b <branch_name>
```

3. Set up the virtual environment and install dependencies:

```shell
python -m venv env
source env/bin/activate
pip install -r requirements.txt
```

If you have both Python 2 and Python 3 installed, make sure to specify Python 3 during the installation:

```shell
python3 -m venv env
source env/bin/activate
python3 -m pip install -r requirements.txt
```

4. Navigate to the backend directory:

```shell
cd backend
```

5. Perform migrations:

```shell
python manage.py makemigrations
python manage.py migrate
```

6. Create a superuser:

```shell
python manage.py createsuperuser
```

7. Run the server:

```shell
python manage.py runserver
```

8. Setup Frontend:

```shell
cd frontend
```
9. Install Libraries

```shell
npm i
```
10. Run frontend server

```shell
npm start
```

## API Endpoints

🌐 Explore the following RESTful API endpoints:


## API Endpoints

🌐 Explore the following RESTful API endpoints:

- POST `/api/register/`: Register a new user
- POST `/api/token/`: Obtain JWT tokens
- GET `/api/profile/`: Get user profile
- PUT `/api/change-password/`: Change user password
- POST `/api/reset-password/`: Request password reset
- PUT `/api/reset-password-confirm/`: Confirm password reset
- POST `/api/validate-reset-token/`: Validate reset token
- POST `/api/token/refresh/`: Refresh JWT token

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
- SENDGRID_API_KEY=your_sendgrid_api_key
- FROM_EMAIL=your_sender_email
- SECRET_KEY=your_django_secret_key


## Features

✨ Key features of this authentication system:

- JWT-based authentication
- Secure password reset via email
- Profile management
- Password change functionality
- Token validation and refresh
- Responsive UI with Chakra UI
- Protected routes
- User session management

## Frontend Routes

🛣️ Available frontend routes:

- `/login`: Login and registration page
- `/`: Dashboard (protected)
- `/profile`: User profile (protected)
- `/change-password`: Password change (protected)
- `/reset/:token`: Password reset confirmation

## Security Features

🔒 Built-in security measures:

- JWT token authentication
- Secure password hashing
- Timed password reset tokens
- Protected API endpoints
- CSRF protection
- Email verification

> Made with ❤️ by Saksham Tolani
