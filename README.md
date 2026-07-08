# Gitmap

Beautiful GitHub-style contribution heatmaps for React applications.

**Live Demo & Documentation:** [https://gitmap-devo.vercel.app/](https://gitmap-devo.vercel.app/)

## Features
- **10+ Built-in Themes** (GitHub, Cyberpunk, Lavender, etc.)
- **Customization** (Cell size, gap, shape, gradient styles, custom CSS)
- **Tooltips & Animations** (Framer Motion powered)
- **Live GitHub Data** (via public API)

## Installation

```bash
npm install gitmap
```

## Usage

```tsx
import { Gitmap } from 'gitmap';

export default function App() {
  return (
    <Gitmap
      username="torvalds"
      theme="default-dark"
      cellSize={12}
      gap={3}
      shape="rounded"
    />
  );
}
```

Visit the [Documentation](https://gitmap-devo.vercel.app/) to learn more.
