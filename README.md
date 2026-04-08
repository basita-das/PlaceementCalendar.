# Placement & DSA Tracker

> Mastering DSA and tracking placements, one day at a time.

## Project Demo

<div align="center">
  <img src="src/assets/Screenshot 2026-04-09 at 2.45.14 AM.png" alt="Placement & DSA Tracker Screenshot 1" width="800" />
  <br />
  <img src="src/assets/Screenshot 2026-04-09 at 2.45.45 AM.png" alt="Placement & DSA Tracker Screenshot 2" width="800" />
</div>

## Core Features

- **Interactive Study Calendar**: A highly visual, motion-enhanced calendar to track daily DSA progress.
- **Placement Event Logging**: Specialized tags for Online Assessments (OA), Mock Tests, and Interviews.
- **Integrated Review System**: Add and edit detailed reviews/feedback for every placement event directly from the calendar or notes section.
- **Monthly Goal Tracking**: Set and visualize monthly milestones with a dynamic progress bar.
- **Responsive Design**: Optimized layout for all devices (Image → Calendar → Notes on mobile).
- **Dark Mode Support**: Seamlessly switches between light and dark themes for late-night coding sessions.
- **Local Persistence**: All your notes, goals, and reviews are saved locally in your browser.

## Technologies Used

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion / Motion for React
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/basita-das/PlaceementCalendar..git
   cd placement-dsa-tracker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Environment Configuration

Create a `.env` file in the root directory for any external integrations (e.g., Gemini API for future AI features):

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## Project Structure

```text
src/
├── components/
│   ├── Calendar/         # Core calendar components (Grid, Header, Hero, Notes)
│   └── ui/               # Reusable UI components (Buttons, Inputs, etc.)
├── constants/            # Configuration and static data (Month images, tags)
├── lib/                  # Utility functions
├── types/                # TypeScript interfaces and types
└── App.tsx               # Main application entry point
```

## Usage Instructions

1. **Navigate Months**: Use the arrows in the header to switch between months.
2. **Add Notes**: Click on any date to open the notes editor in the sidebar.
3. **Log Events**: Use the "Add Placement Event" button in the notes section to log OAs or Interviews.
4. **Add Reviews**: Click on a tag in the calendar or the edit icon in the notes section to add your feedback.
5. **Track Progress**: Check off goals in the notes section to see your monthly progress bar update.

## API Documentation

_Currently, this is a client-side application. Future versions may include an Express backend for cloud sync._

## Technical Challenges & Solutions

- **Responsive Reordering**: Solved the challenge of stacking components differently on mobile (Image-Calendar-Notes) vs Desktop (Image/Notes-Calendar) using Tailwind's CSS Grid and `order` utilities.
- **Complex State Management**: Managed synchronized state between the calendar grid and the sidebar notes using React hooks and local storage persistence.
- **Smooth Transitions**: Implemented 3D-like rotation effects for month switching using Framer Motion's `AnimatePresence`.

## Future Roadmap

- [ ] **AI Insights**: Use Gemini API to analyze interview reviews and suggest focus areas.
- [ ] **Cloud Sync**: Integrate Firebase for cross-device data synchronization.
- [ ] **PDF Export**: Generate a monthly summary report of DSA progress and interview performance.
- [ ] **Notification System**: Reminders for upcoming assessments.

## Contributing Guidelines

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## Contact Information

**Basita Das** - [basitadas16@gmail.com](mailto:basitadas16@gmail.com)
[Project Link](https://placeement-calendar.vercel.app/)
