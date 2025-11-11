# PwedMin - Wedding Planner Template

A beautiful, modern, and minimalist wedding planner built with Next.js 15, TypeScript, and Tailwind CSS. Designed to help couples plan their dream wedding with ease and elegance.

## Features

### Smart Budget Tracker
- Automatically calculates total expenses
- Track spending across multiple categories
- Visual progress indicators
- Mark expenses as paid
- Real-time budget calculations
- Over/under budget warnings

### Wedding Checklist
- Comprehensive task management
- Categorized by venue, vendors, guests, food, decor, and planning
- Progress tracking with visual indicators
- Mark tasks as complete
- Add custom tasks
- Filter by category

### Supplier List
- Manage all wedding vendors in one place
- Store contact information (phone, email)
- Track costs per supplier
- Add notes for each vendor
- Beautiful card-based layout
- Easy supplier management

### Guest List Manager
- Complete guest management system
- RSVP tracking (Accepted, Pending, Declined)
- Plus-one support
- Table assignments
- Dietary restrictions tracking
- Guest statistics and analytics
- Filter by RSVP status

### Dashboard
- Wedding countdown timer
- Overall progress tracking
- Quick stats overview
- Recent activity feed
- Visual progress indicators
- Budget and task summaries

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PwedMin
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
PwedMin/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Navigation.tsx
│   │   └── features/        # Feature components
│   │       ├── Dashboard.tsx
│   │       ├── BudgetTracker.tsx
│   │       ├── WeddingChecklist.tsx
│   │       ├── SupplierList.tsx
│   │       └── GuestList.tsx
│   └── lib/
│       └── utils.ts         # Utility functions
├── public/                  # Static assets
└── package.json
```

## Customization

### Colors
The theme uses a romantic color palette with pink and purple gradients. You can customize colors in `tailwind.config.ts` and `src/app/globals.css`.

### Wedding Date
Update the wedding date in `src/components/features/Dashboard.tsx`:
```typescript
const weddingDate = new Date("2025-06-15"); // Change this date
```

### Default Data
Each component comes with sample data. You can modify the default data in:
- `BudgetTracker.tsx` - Default budget items
- `WeddingChecklist.tsx` - Default tasks
- `SupplierList.tsx` - Default suppliers
- `GuestList.tsx` - Default guests

## Features Highlight

### Responsive Design
- Fully responsive on all devices
- Mobile-optimized navigation
- Tablet and desktop layouts
- Touch-friendly interactions

### Modern UI
- Clean, minimalist design
- Beautiful gradients and animations
- Smooth transitions
- Accessible components

### User Experience
- Intuitive navigation
- Easy data entry with dialogs
- Real-time calculations
- Visual feedback
- Progress tracking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this template for your personal wedding planning needs.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
