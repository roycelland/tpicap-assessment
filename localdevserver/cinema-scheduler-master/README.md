# Cinema Scheduler Application

A React application for managing cinema show schedules. This app allows users to create, view, and manage movie showings with comprehensive form validation and data management.

## Features

### Login System
- **Test Credentials:**
  - Admin: `Admin` / `password` (1s delay)
  
### Dashboard Components

#### 1. Cinema List Tab
- View all scheduled cinema shows
- Sortable table columns (Schedule ID, Movie Title, Theater, Show Date)
- Pagination for large datasets
- Export functionality (CSV format)
- Clear all shows functionality
- Show details including subtitles, IMAX, and notes

#### 2. Details Tab (Form Section)
- Movie title selection with typeahead dropdown
- Theater selection dropdown
- Show date input with calendar picker (weekdays only)
- Show time input (24-hour format)
- Ticket pricing with automatic discount calculations
- Subtitles and IMAX checkboxes
- Notes field with character limit
- Form validation and error handling
- Duplicate show prevention


## Getting Started

1. **Navigate to the Project:**
   ```bash
   cd cinema-scheduler-master
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Access the Application:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Use the test credentials to log in

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Create production build (output in `build/`) |
| `npm run preview` | Preview production build locally |


## Technologies Used
- React 18
- Vite 6
- CSS3 (Flexbox, Grid)
- HTML5 form validation
- Local state management

## Browser Support
- Chrome (recommended for automation)
- Firefox
- Safari
- Edge
