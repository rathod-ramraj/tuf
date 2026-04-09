🗓️ Premium Seasonal Calendar
A high-fidelity, interactive React calendar designed with a focus on fluid UX, 3D aesthetics, and seasonal context. This isn't just a date picker; it’s a productivity workspace that adapts its visual identity based on the time of year.

✨ Key Features
🎨 Dynamic Seasonal Identity
Intelligent Hero Pane: Automatically shuffles through a curated library of local high-resolution landscape images relevant to the current month.

Adaptive Theme Engine: Extracts dominant tones from seasonal imagery to unify the calendar's accent colors, rings, and highlights.

🕹️ Advanced Interaction Design
3D Page Flip: A custom Framer Motion implementation that simulates a physical desk calendar flipping (Horizontal on Desktop, Vertical on Mobile).

Hover-to-Select Range: Buttery smooth date range selection with real-time visual feedback before the final click.

Yearly Navigation: Click the main header to jump into a "Month/Year Picker" for rapid navigation across the timeline.

📝 Integrated Productivity Workspace
Smart Reminders: Set single-day or multi-day range reminders. Each reminder is deterministically color-coded (avoiding red to prevent holiday confusion).

Rich Text Notes: Markdown-supported notes area featuring custom styles for <u>underlines</u> and <mark>highlights</mark>.

Contextual Banner: A proactive top-bar that alerts you to today's holidays (e.g., Diwali, Christmas) or upcoming personal reminders at a glance.

🛠️ Tech Stack & Architecture
This project follows Principal Engineer standards for clean, modular code:

Frontend: React 18 with TypeScript for strict type safety.

Styling: Tailwind CSS using a custom design system and dynamic class injection.

Animations: Framer Motion utilizing AnimatePresence, 3D transforms, and hardware-accelerated transitions.

State Management: React Context API + useReducer pattern for a robust, predictable data flow.

Data Persistence: LocalStorage-based StorageService to keep your notes and reminders safe across sessions.

🏗️ Project Structure
Plaintext
src/
 ├── components/        # Atomic UI components (Buttons, Grid, Banner)
 ├── context/           # CalendarContext for global state & theme logic
 ├── hooks/             # Custom hooks (useSeasonalHero, useDayMetadata)
 ├── utils/             # Business logic (date math, color hashing)
 ├── types/             # Centralized TypeScript interfaces
 └── public/images/     # Local curated seasonal asset library
🚀 Getting Started
Clone the repository:

Bash
git clone https://github.com/yourusername/seasonal-calendar.git
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
💡 Design Philosophy
"Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs

The architecture focuses on Progressive Disclosure. The UI remains minimalist and clean upon load, only revealing complex tools (like the Workspace panel) once a user selects a date, reducing cognitive load and keeping the focus on the beautiful seasonal imagery.