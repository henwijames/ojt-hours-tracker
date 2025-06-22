# OJT-HOURS-TRACKER
**Empowering Growth Through Seamless Time Tracking**

Built with:  
![Laravel](https://img.shields.io/badge/Laravel-red?logo=laravel)
![React](https://img.shields.io/badge/React-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-teal?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-purple?logo=vite)
![Inertia.js](https://img.shields.io/badge/Inertia.js-lightgrey?logo=inertia)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Testing](#testing)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

---

## 🧩 Overview

**OJT-Hours-Tracker** is a modern, full-stack web application for tracking On-the-Job Training (OJT) hours. Built with Laravel, React, Inertia.js, and TailwindCSS, it provides an intuitive and role-based system for managing OJT workflows among admins, coordinators, and students.

---

## 🚀 Features

- 🛠️ Vite-powered asset compilation and hot module replacement  
- 🚀 Server-side rendering with Laravel + React  
- 🎨 Role-specific layouts and dashboards  
- 🔒 Middleware-based secure routing  
- ⚙️ Reusable UI components and utilities  
- 📊 Real-time data handling and notification system  

---

## 🛠️ Getting Started

### Prerequisites

Ensure the following are installed on your system:

- PHP >= 8.1  
- Composer  
- Node.js >= 18  
- NPM  
- MySQL or compatible DB  
- Git

### Installation & Setup

Follow these steps to set up the project:

```bash
# 1. Clone the repository
git clone https://github.com/henwijames/ojt-hours-tracker
cd ojt-hours-tracker

# 2. Install backend and frontend dependencies
composer install
npm install

# 3. Set up your environment variables
cp .env.example .env
php artisan key:generate

# 4. Configure your .env file
#    - Set DB credentials
#    - Optional: Mail & broadcasting configs

# 5. Run migrations
php artisan migrate

# 6. Build frontend assets
npm run build

# 7. Start the development servers
php artisan serve
