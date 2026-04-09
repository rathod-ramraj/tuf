<div align="center">

  # 🗓️ Premium Seasonal Calendar
  
  **A high-fidelity, interactive React calendar designed for fluid UX, 3D aesthetics, and seasonal context.**
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

  ---


</div>

## 🌟 Key Features

### 🎨 Dynamic Seasonal Identity
- **Intelligent Hero Pane:** Automatically shuffles through a curated library of local high-resolution landscape images relevant to the current month.
- **Adaptive Theme Engine:** Extracts dominant tones from seasonal imagery to unify the calendar's accent colors, rings, and highlights.

### 🕹️ Advanced Interaction Design
- **3D Page Flip:** A custom Framer Motion implementation simulating a physical desk calendar flipping (**Horizontal on Desktop, Vertical on Mobile**).
- **Hover-to-Select Range:** Buttery smooth date range selection with real-time visual feedback before the final click.
- **Yearly Navigation:** Interactive header allows jumping into a "Month/Year Picker" for rapid timeline navigation.

### 📝 Integrated Productivity Workspace
- **Smart Reminders:** Set single-day or multi-day range reminders. Deterministically color-coded (avoiding red to prevent holiday confusion).
- **Rich Text Notes:** Markdown-supported workspace featuring custom styles for `<u>underlines</u>` and `<mark>highlights</mark>`.
- **Contextual Banner:** Proactive top-bar alerting you to today's holidays (e.g., Diwali, Christmas) or upcoming personal reminders.

---

## 🏗️ Project Architecture

This project follows **Principal Engineer** standards for modular, maintainable code:

| Layer | Responsibility |
| :--- | :--- |
| **Context API** | Global state management for dates, themes, and reminders. |
| **Custom Hooks** | Encapsulated logic for seasonal assets, metadata, and local storage. |
| **Motion Engine** | Orchestrated 3D transforms and concurrent exit/entry animations. |
| **Storage Service** | Robust abstraction for LocalStorage persistence. |

---

## 🚀 Getting Started

### 1. Clone the repository
* 
  ```bash
  git clone https://github.com/Krishna27Singh/Calender.git

### 2. Install dependencies
* 
  ```bash
  npm install 

### 3. Start the development server
* 
  ```bash
  npm run dev

