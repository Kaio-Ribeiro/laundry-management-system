# Laundry Management System

A comprehensive laundry management system built with Next.js, TypeScript, and Prisma.

## Features

- **User Roles**: Admin, Seller, and Customer management
- **Authentication**: Secure login for Admin and Seller users
- **Customer Management**: Customer registration and management by sellers
- **Service Management**: CRUD operations for laundry services
- **Order Management**: Complete order processing system
- **Sales Reports**: Analytics and reporting for admins

## Tech Stack

- **Frontend**: Next.js 16 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI, Lucide Icons
- **Form Management**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd laundry-management-system
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npm run db:push
npm run db:seed
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

### Default Admin Credentials

- **Email**: admin@laundry.com
- **Password**: admin123

## Development Plan

### Phase 1: Authentication & Core Setup ✅
- [x] Project setup with Next.js and TypeScript
- [x] Database schema design with Prisma
- [x] Admin user seeding
- [x] Basic project structure

### Phase 2: Authentication System
- [ ] NextAuth.js setup and configuration
- [ ] Login/logout functionality
- [ ] Role-based access control
- [ ] Protected routes middleware
- **Commit**: "feat: implement authentication system"

### Phase 3: Admin Dashboard
- [ ] Admin dashboard layout
- [ ] User management (CRUD for sellers)
- [ ] Service/Product management (CRUD)
- [ ] Customer management (view/edit)
- **Commit**: "feat: admin dashboard with user and service management"

### Phase 4: Seller Interface
- [ ] Seller dashboard layout
- [ ] Customer registration and management
- [ ] Order creation interface
- [ ] Order status management
- **Commit**: "feat: seller interface for customer and order management"

### Phase 5: Order Management System
- [ ] Order workflow implementation
- [ ] Order status tracking
- [ ] Order history and details
- [ ] Receipt generation
- **Commit**: "feat: complete order management system"

### Phase 6: Reports & Analytics
- [ ] Sales reports for admins
- [ ] Revenue analytics
- [ ] Order statistics
- [ ] Export functionality
- **Commit**: "feat: reports and analytics dashboard"

### Phase 7: UI/UX Enhancement
- [ ] Responsive design improvements
- [ ] Form validation and error handling
- [ ] Loading states and optimistic updates
- [ ] Data tables with pagination and sorting
- **Commit**: "feat: enhanced UI/UX and data management"

### Phase 8: Docker & Production
- [ ] Dockerfile creation
- [ ] Docker Compose setup
- [ ] Environment configuration
- [ ] Production optimization
- **Commit**: "feat: docker configuration and production setup"

### Phase 9: Testing & Final Polish
- [ ] Unit tests for core functions
- [ ] Integration tests for API routes
- [ ] End-to-end testing setup
- [ ] Performance optimization
- **Commit**: "feat: testing suite and final optimizations"

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── auth/           # Authentication pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── seller/         # Seller interface
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable components
│   ├── lib/               # Utilities and configurations
│   └── types/             # TypeScript type definitions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding
└── public/               # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

## Contributing

1. Follow the development plan phases
2. Create feature branches for each phase
3. Write meaningful commit messages
4. Test thoroughly before committing

## License

This project is licensed under the MIT License.
