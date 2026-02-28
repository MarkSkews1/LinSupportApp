# LinSupport - Customer Support & Ticketing System

[![CI/CD](https://github.com/MarkSkews1/LinSupportApp/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/MarkSkews1/LinSupportApp/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

A comprehensive customer support and ticketing system built with Next.js, featuring real-time chat, knowledge base, analytics, and CRM integration.

## 🚀 Features

### Core Functionality
- ✅ **Ticketing System** - Full CRUD operations with status tracking
- ✅ **Live Chat** - Real-time messaging with Socket.io
- ✅ **Knowledge Base** - Searchable help articles with feedback
- ✅ **Analytics & Reporting** - Comprehensive metrics and dashboards
- ✅ **CRM Integration** - Connect with LinCRM for customer data
- ✅ **Customer Portal** - Self-service ticket submission and tracking

### Technical Features
- 🔐 **Kinde Authentication** - Secure SSO integration
- 📊 **MongoDB Database** - Flexible data storage
- 🎨 **Modern UI** - Tailwind CSS with dark mode support
- 📱 **Responsive Design** - Mobile-first approach
- 🔄 **Real-time Updates** - Socket.io for live features
- 🧪 **Comprehensive Testing** - Unit and integration tests

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/MarkSkews1/LinSupportApp.git
cd LinSupportApp/lin-support-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3009`

## 📦 Installation & Configuration

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## 💻 Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run type-check   # TypeScript type checking
```

## 📁 Project Structure

```
lin-support-app/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities
├── models/          # MongoDB models
├── services/        # Business logic
├── types/           # TypeScript types
└── __tests__/       # Test files
```

## 🚀 Deployment

### Docker
```bash
docker-compose up -d
```

### Vercel
```bash
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more options.

## 📝 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Build Progress](./BUILD_PROGRESS.md)
- [Phase Summaries](./PHASE_*_COMPLETE.md)

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit PRs.

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 📞 Contact

**Project**: [https://github.com/MarkSkews1/LinSupportApp](https://github.com/MarkSkews1/LinSupportApp)

---

**Version**: 1.0.0  
**Made with ❤️ by the LinTech Team**
