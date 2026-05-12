Permission Classes

The system uses Django REST Framework permission classes together with role-based access control to secure API endpoints.

Residents can create requests and only view their own requests.
Maintenance Staff can only view tasks assigned to them and update task statuses.
Property Managers can view all requests and assign tasks to staff users.

Permissions are enforced at the API level and queryset filtering is used to prevent unauthorized access to other users’ data.

Cookie-Based Authentication

The project uses Django Session Authentication with cookies instead of JWT.

Authentication is secured using:

Session cookies
CSRF protection
Django authentication middleware
Protected API endpoints with authenticated access only

The React frontend sends requests with credentials included, allowing Django to manage user sessions securely between the frontend and backend.

CORS and CSRF settings were configured to allow secure communication between the React frontend and Django backend during development.