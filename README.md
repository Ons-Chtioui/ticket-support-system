
Ticket Management SystemThis is a full-stack web application designed for managing customer support tickets, built with a Django REST API and a dynamic React user interface.
Key Technologies Used
Backend (API)FrameworkPython, Django, Django Rest Framework (DRF)
Frontend (UI)LibraryReact (SPA)
File StorageCloudCloudinary (for ticket attachments)
Real-Time ChatSupportTawk.to

1. Environment Setup Instructions
Follow these steps to install, configure, and run both the Backend and the Frontend components.

A. Prerequisites
Ensure you have the following installed:

Python 3.x and pip
Node.js and npm

B. How to Run the Backend (Django API)
The Backend provides all the necessary API endpoints and runs on http://127.0.0.1:8000.

Activate Virtual Environment:
python -m venv venv
# Linux/Mac:
source venv/bin/activate
# Windows:
.\venv\Scripts\activate

Apply Migrations:
python manage.py migrate

Run the Server:
python manage.py runserver

How to Run the Frontend (React App)
The Frontend runs on http://localhost:3000.

Navigate to Frontend Directory:
cd frontend

Install Dependencies:
npm install

Run the Application:
npm start


How to Create a Superuser
This account is essential for accessing the Django Admin Panel and testing administrative features:
# Execute this in the backend terminal
python manage.py createsuperuser
or
python manage.py shell

from django.contrib.auth import get_user_model

User = get_user_model()

admin_user = User.objects.create_superuser(
    username='admin_api',
    email='admin@test.com',
    password='password123'
)

admin_user.role = 'Admin'
admin_user.save()

exit()

2. Backend API Endpoints (DRF)
This section details the REST endpoints managed by the Django backend. All URLs are prefixed with http://127.0.0.1:8000/api/.

How to Test APIs
APIs require a valid JWT Access Token in the request header.
Use the POST (http://127.0.0.1:8000/api/auth/login/).
Use the GET 
(http://127.0.0.1:8000/api/tickets/).
For any protected endpoint, include the header: Authorization: Bearer [YOUR_ACCESS_TOKEN]

3. Validation and Evaluation
How to Test Chat Integration (Tawk.to)
Access the React application at http://localhost:3000.
Verify that the Tawk.to chat widget icon is visible in the corner on all pages.
Send a test message through the widget.
Validate success by logging into your Tawk.to dashboard and confirming the message was received in real-time.

4. The design template came from 
The User Interface (UI) design is primarily built upon the industry-standard Bootstrap 5 framework. We ensured high-quality frontend integration by utilizing the React-Bootstrap library, which seamlessly translates Bootstrap's styling and functionality into native React components. The core structure was then adapted and customized with project-specific CSS rules to optimize the user experience and visual clarity for the ticket management workflow.














