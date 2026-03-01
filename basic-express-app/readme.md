# Learn Node

A simple Express.js REST API for managing student records.

## Overview

This project demonstrates basic HTTP operations using Node.js and Express. It implements CRUD operations for a student management system.

## Getting Started

### Prerequisites
- Node.js installed

### Installation

```bash
npm install
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server runs on `http://localhost:2309`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hello` | Returns a greeting |
| GET | `/students/names` | Fetch all students |
| POST | `/students/names` | Create a new student |
| PATCH | `/students/names/:studentId` | Update student name |
| DELETE | `/students/names/:studentId` | Delete a student |

## Project Structure

```
learn-node/
├── src/
│   └── index.js
├── package.json
├── .gitignore
└── readme.md
```

## Technologies Used

- **Express.js** - Web framework
- **Node.js** - JavaScript runtime
