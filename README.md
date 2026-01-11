# Annotatify

A powerful image annotation tool built with Next.js. Draw, categorize, and manage annotations on images with an intuitive interface.

**🚀 [Live Demo](https://annotatify-ezz.vercel.app)**

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Material UI v7
- **State Management**: React Query v5
- **Drawing**: React Konva
- **Virtualization**: React Window
- **Language**: TypeScript

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/EzzElddin-AbdAllah/Annotatify.git
cd Annotatify
```

**2. Install dependencies**

```bash
npm install
```

**3. Build and run**

```bash
npm run build
npm start
```

**4. Open in browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Features

**Image Annotation** 🎨

- Draw rectangles on images with interactive canvas
- 8 color options for visual organization
- Save and delete annotations
- Touch support for mobile devices

**Image Management** 🖼️

- Upload images with URL and metadata
- Filter by name, category, and metadata
- Virtualized responsive gallery
- Delete with confirmation

**Category Management** 📁

- Create, read, update, and delete categories
- Organize images and annotations
- View in sortable table

## Project Structure

```
Annotatify/
├── app/                      # Next.js App Router
│   ├── categories/           # Categories page
│   ├── images/               # Images gallery
│   └── [id]/annotate/        # Annotation page (dynamic route)
│
├── components/               # React components
│   ├── Annotation/           # Annotation canvas, toolbar, list
│   ├── Category/             # Category forms and modals
│   ├── Common/               # Header component
│   └── Image/                # Image cards, gallery, filters
│
├── hooks/                    # Custom React Query hooks
│   ├── useAnnotations.ts
│   ├── useCategories.ts
│   └── useImages.ts
│
├── types/                    # TypeScript type definitions
│   ├── annotation.ts
│   ├── category.ts
│   └── image.ts
│
├── utils/                    # Utilities
│   ├── api/                  # API layer (CRUD operations)
│   └── storage.ts            # localStorage wrapper
│
├── data/
│   └── db.json               # Initial seed data
│
└── constants/
    └── api.ts                # API configuration
```

## Data Persistence

Uses localStorage for data persistence since the API is a mock server:

- Initial data loaded from `data/db.json`
- All CRUD operations stored in localStorage
- "Reset Data" button clears localStorage and reloads

## API Integration

Base URL: `https://my-json-server.typicode.com/MostafaKMilly/demo`

Endpoints: `/categories`, `/images`, `/annotations`
