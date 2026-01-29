# צימרים בארץ - Israeli Vacation Rentals

## Project Description
A vacation rental management system that enables listing, booking, and managing vacation rentals across Israel. The system includes interfaces for both regular users and property owners.

## Project Resources
-  **[View Project Presentation](./project-presentation.pdf)** - Detailed overview of the system
https://israeli-vacation-rentals.onrender.com/
## Technologies
### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Joi (for validation)

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

## Project Structure
### Client Directory
```
client/
├── css/         # Stylesheets
├── html/        # HTML pages
├── images/      # Images
└── js/          # JavaScript files
```

### Server Directory
```
server/
├── config/      # Configuration files
├── controllers/ # Route controllers
├── middleware/  # Custom middleware
├── models/      # Database models
├── routes/      # Route definitions
├── app.js       # App configuration
└── server.js    # Server entry point
```

## Key Features
- Display rentals by region (North, Center, South)
- Booking system
- Owner interface
- Favorites system
- Booking management for owners

## Setup and Installation

### Prerequisites
- Node.js
- MongoDB

### Installation Steps
1. Install server dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm start
```

3. Open `client/html/main.html` in a browser

### Ports
- Server: 3001

## Data Structure

### Users
- User details
- User type (Regular/Owner)

### Rentals
- Property details
- Location
- Price
- Images

### Bookings
- Booking details
- Dates
- Guest information

## Security
- Middleware validation
- Server-side checks

## Developers
Yael Refalove, Ruti Paniri, Ruti Shrem.
## License
Open Source
