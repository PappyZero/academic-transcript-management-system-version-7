# Academic Transcript Management System (ATMS)

A blockchain-based system for secure academic transcript management using Next.js, MongoDB, and smart contracts.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- University transcript upload and hash generation
- Blockchain-based hash storage
- Student transcript verification
- Metamask wallet integration
- Secure session management
- PDF transcript generation

## Prerequisites
- Node.js v18.x or later
- npm v9.x or later
- MongoDB Atlas account
- Metamask browser extension
- Foundry (for smart contract development)
- Alchemy API key (for blockchain access)

## Installation

1. **Clone the repository**
```
bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies**
```
bash
npm install
```

3. **Install Foundry (for smart contract development)**
```
bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Configuration

1. **Create environment file**
```
bash
cp .env.local.example .env.local
```

2. **Update .env.local with your credentials**
```
env

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
SECRET_COOKIE_PASSWORD=your-32-character-strong-secret-here
NEXT_PUBLIC_ADMIN_WALLET=0xYourAdminWalletAddress
ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
UNIVERSITY_WALLET_PRIVATE_KEY=your-private-key
TRANSCRIPT_STORAGE_ADDRESS=0xDeployedContractAddress
```

## Running the Application
**Start development server**
```
bash
npm run dev
```
The application will be available at http://localhost:3000

**Available Scripts**
```
bash
npm run dev    # Start development server
npm run build  # Create production build
npm run start  # Start production server
npm run lint   # Run code linter
```

## Deployment

Vercel (Recommended)
Deploy with Vercel

## Manual Deployment
1. **Create production build**
```
bash
npm run build
```

2. **Start server**
```
bash
npm run start
```

**Docker**
```
bash
docker build -t atms .
docker run -p 3000:3000 atms
```

## Project Structure
```
├── components/          # React components
├── contracts/           # Smart contracts
├── lib/                 # Shared utilities
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   └── university/      # University interface
├── public/              # Static assets
├── styles/              # Global CSS
├── test/                # Test files
├── .env.local           # Environment variables
├── next.config.js       # Next.js configuration
└── package.json         # Dependencies and scripts
```

## Contributing
1. Fork the repository

2. Create your feature branch (git checkout -b feature/amazing-feature)

3. Commit your changes (git commit -m 'Add some amazing feature')

4. Push to the branch (git push origin feature/amazing-feature)

5. Open a Pull Request

## License
Distributed under the MIT License. See LICENSE for more information.

Note: Ensure all environment variables are properly configured before running the application. Never commit sensitive information to version control.

```
This README includes:
1. Clear installation and configuration instructions
2. Environment setup guidance
3. Multiple deployment options
4. Project structure overview
5. Contribution guidelines
6. License information
7. Important security notes

Would you like me to add any specific sections or modify any existing content?
```
