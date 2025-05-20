# Derivable

<div align="center">
  <img src="https://raw.githubusercontent.com/JasonGrace2282/derivable/refs/heads/main/public/logo.jpg" alt="logo" width="200" />
  <h3>Go back in time to tackle mathematical proofs, challenge friends, and explore mathematical reasoning</h3>
</div>

## About

Derivable is an interactive platform for mathematics enthusiasts to engage with mathematical proofs and derivations. The application offers multiple ways to explore and practice mathematical reasoning:

- **Daily Challenges**: Tackle a new mathematical proof each day
- **Math Duels**: Challenge friends to head-to-head competitions
- **Famous Proofs**: Work through historical proofs from renowned mathematicians
- **Random Derivations**: Test your skills with randomly selected challenges

## Features

- **Interactive Math Editor**: Write and format mathematical proofs with LaTeX support
- **AI-Powered Evaluation**: Get instant feedback on your solutions
- **Hint System**: Receive helpful hints when you're stuck
- **Duel Mode**: Compete with friends in real-time mathematical challenges
- **Progress Tracking**: Monitor your improvement over time
- **Historical Context**: Learn about the mathematicians behind famous proofs

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Shadcn UI, Tailwind CSS
- **Math Rendering**: KaTeX
- **Backend**: Supabase (PostgreSQL)
- **AI Integration**: Google Gemini API for proof evaluation and hints
- **State Management**: React Query
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/derive-duel-arena.git
   cd derive-duel-arena
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   GEMINI_API_KEY=your_gemini_api_ke
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:8080` to access the application.

## Usage

### Daily Challenge

Visit the "Daily Derive" section to tackle today's mathematical challenge. Use the math editor to write your solution and submit it for evaluation.

### Math Duel

1. Create a duel and generate a unique code
2. Share the code with your opponent
3. Both participants will receive the same proof challenge
4. Race to complete the proof correctly before your opponent
5. Solutions are evaluated for both speed and accuracy

### Famous Proofs

Browse through a collection of historical mathematical proofs. Select a proof to work on and learn about its historical context and the mathematician behind it.

### Random Derive

Test your mathematical skills with a randomly selected proof challenge. Perfect for practice or when you're feeling adventurous.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- All the brilliant mathematicians throughout history who developed these proofs
- The open-source community for providing the tools and libraries used in this project
