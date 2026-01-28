# AI Prompt Generator

> Transform project ideas into comprehensive, AI-ready prompts for code generation

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Anthropic Claude](https://img.shields.io/badge/Claude-API-orange?style=for-the-badge&logo=anthropic)](https://www.anthropic.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Live Demo](https://ai-prompt-generator-orx4y999y-gianluca-buonanno-s-projects.vercel.app/) • [Getting Started](#getting-started)

---

## Overview

AI Prompt Generator is a web application that helps developers create structured prompts for AI-powered code generation. Built with Next.js and powered by Anthropic's Claude API, it generates detailed prompts that specify programming languages, frameworks, complexity levels, and coding styles.

### Key Features

- Matrix-themed UI with synchronized neon glow animations
- AI-powered project idea generation based on interests and skill level
- Comprehensive configuration options for code generation requirements
- Real-time prompt generation with loading indicators
- One-click copy to clipboard functionality
- Export prompts for offline use
- Dynamic framework filtering based on selected programming language
- Multiple coding style options (functional, OOP, procedural, mixed)
- Fully responsive design for all devices

---

## Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend & AI
- **[Anthropic Claude API](https://www.anthropic.com/)** - Language model for idea generation
- **Next.js API Routes** - Serverless backend functions

### Deployment
- **[Vercel](https://vercel.com/)** - Next.js hosting platform

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Anthropic API Key ([Get yours here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-prompt-generator.git
   cd ai-prompt-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
ai-prompt-generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint for idea generation
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Main application page
│   └── globals.css                # Global styles and animations
├── components/
│   ├── BlinkingCursor.tsx         # Animated cursor component
│   ├── IdeaGenerator.tsx          # Project idea generator
│   ├── MatrixRain.tsx             # Matrix rain background effect
│   ├── ToastNotification.tsx      # Toast notification system
│   └── useToast.ts                # Custom toast hook
├── public/
│   └── screenshots/               # Application screenshots
├── .env.local                     # Environment variables (not committed)
├── .gitignore                     # Git ignore rules
├── next.config.js                 # Next.js configuration
├── package.json                   # Project dependencies
├── README.md                      # Project documentation
├── tailwind.config.ts             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

---

## Usage

### Generating a Project Idea

1. Expand the Idea Generator section at the top of the page
2. Enter your interests (optional) or leave blank for general ideas
3. Select your skill level: Beginner, Intermediate, Advanced, or Expert
4. Choose a project type: Web App, Mobile App, AI/ML, Game, etc.
5. Set time commitment: Weekend, One Week, One Month, or Long-term
6. Click "Generate Project Ideas" and wait for results
7. Review generated ideas with tech stacks, learning outcomes, and difficulty levels
8. Click "Use This Idea" to auto-fill the prompt configuration

### Configuring Your Prompt

1. Describe your project in the text area (required)
2. Select programming language: Python, JavaScript, TypeScript, Java, C#, Go, Rust, PHP, Ruby, or Swift
3. Choose framework/library: Options update dynamically based on selected language
4. Set complexity level: Beginner, Intermediate, Advanced, or Expert
5. Expand Advanced Settings for additional customization:
   - Code style (Functional, OOP, Procedural, Mixed)
   - Specific features and requirements
   - Technical constraints and limitations
   - Testing requirements
   - Documentation preferences
6. Click "Generate AI-Ready Prompt" to create your prompt
7. Copy or download the generated prompt for use with AI coding assistants

---

## Design Philosophy

### Visual Design
- Matrix-inspired aesthetic with synchronized neon green glow effects
- Smooth animations and transitions for better user experience
- Responsive layout that adapts to any screen size
- Accessibility considerations with proper ARIA labels and keyboard navigation

### Technical Design
- Component-based architecture for maintainability and reusability
- Type safety with TypeScript to reduce runtime errors
- Server-side rendering for optimal performance and SEO
- API route separation for clean backend logic
- Custom hooks for shared stateful logic

---

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic Claude API key | Yes |

### Customization

**Theme Colors**: Edit `app/globals.css` to modify the color scheme
```css
:root {
  --matrix-green: #00ff41;
  --matrix-green-bright: #39ff14;
  --matrix-green-dark: #00cc33;
}
```

**Animation Timing**: Adjust glow pulse speed in `globals.css`
```css
.selected-glow {
  animation: selected-glow-animation 2s ease-in-out infinite;
}
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel: [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy - automatic deployments on every push

### Other Platforms

This Next.js application can be deployed on:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway
- Render

---

## Performance

- Lighthouse Score: 95+ (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Total Bundle Size: < 200KB (gzipped)

---

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Luca Buonanno**

- GitHub: [@gianluca-buonanno](https://github.com/gianluca-buonanno)

---

## Acknowledgments

- Anthropic for the Claude API
- Vercel for hosting and deployment tools
- Next.js team for the framework
- Tailwind CSS for the utility-first CSS framework

---

## Roadmap

- Add user authentication for saving prompt history
- Implement prompt templates library
- Add multi-language support (i18n)
- Create browser extension for quick access
- Integrate with GitHub Copilot and other AI coding assistants
- Add collaboration features for team prompt building
- Implement prompt versioning and comparison
- Create API for programmatic prompt generation

---

## Use Cases

- **Solo Developers**: Quickly scaffold new projects with AI-generated boilerplate
- **Students**: Learn best practices by studying AI-generated project structures
- **Teams**: Standardize code generation prompts across the organization
- **Educators**: Create consistent programming assignments and examples
- **Startups**: Rapidly prototype and validate ideas with minimal setup time

---

## Security

- API keys are stored securely in environment variables
- No sensitive data is logged or stored client-side
- HTTPS enforced in production
- Regular dependency updates to patch vulnerabilities


---

<div align="center">

Made by Luca Buonanno

If you found this project helpful, please consider giving it a star.

**[Back to Top](#ai-prompt-generator)**

</div>
