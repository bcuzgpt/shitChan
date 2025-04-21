# shitChan

A modern clone of 4chan built with React, TypeScript, Node.js, and PostgreSQL.

## Features

- Image board functionality similar to 4chan
- Anonymous posting
- Thread creation and replies
- Image upload support
- Modern, responsive UI
- Board categories (Random, Technology, Anime, Video Games)

## Tech Stack

- Frontend:
  - React with TypeScript
  - React Router for navigation
  - Styled Components for styling
  - Axios for API calls

- Backend:
  - Node.js with Express
  - PostgreSQL for data storage
  - AWS S3 for image storage
  - TypeScript for type safety

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- AWS account (for S3 image storage)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shitchan.git
cd shitchan
```

2. Install dependencies:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. Create a PostgreSQL database:
```bash
createdb shitchan
```

4. Set up environment variables:
- Copy `.env.example` to `.env`
- Fill in your database and AWS credentials

5. Run database migrations:
```bash
node server/db/migrate.js
```

6. Start the development servers:
```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 