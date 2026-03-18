# Medical Information Interface Project Structure

/medical-info-interface
│
├── /backend
│   ├── /services
│   │   ├── /authentication
│   │   │   └── authService.js
│   │   ├── /user
│   │   │   └── userService.js
│   │   ├── /medicalRecords
│   │   │   └── medicalRecordsService.js
│   │   └── /notifications
│   │       └── notificationService.js
│   ├── index.js
│   └── package.json
│
├── /api-gateway
│   ├── index.js
│   └── package.json
│
├── /frontend
│   ├── /microfrontends
│   │   ├── /dashboard
│   │   │   ├── index.js
│   │   │   └─�� package.json
│   │   ├── /patientProfile
│   │   │   ├── index.js
│   │   │   └── package.json
│   │   └── /appointments
│   │       ├── index.js
│   │       └── package.json
│   ├── /shared
│   │   ├── /components
│   │   │   └── Header.js
│   │   ├── /hooks
│   │   │   └── useAuth.js
│   │   └── /utils
│   │       └── api.js
│   └── package.json
│
└── README.md
