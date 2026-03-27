# Portal Architecture Specification

## Design Paradigm
The portal utilizes a **Data-Driven UI Architecture** to decouple content from presentation logic, effectively enabling zero-HTML infinite scaling.

### 1. Dynamic Routing (`games.json`)
The registry controls game visibility, meta descriptions, and UI cover art.
*   **Format**: JSON Array.
*   **Injection**: `js/portal.js` parses the data asynchronously.
*   **Aesthetics**: Background covers support raw CSS injections (e.g., `radial-gradient(...)`) via CSS Custom Properties (`var(--card-bg)`). This eliminates the need to patch CSS classes when injecting a new title.

### 2. Global Component Injection (`shared/layout.js`)
To ensure header and footer consistency across independently scalable games, the `layout.js` script attaches itself during the `DOMContentLoaded` lifecycle.
*   **Execution**: Injects HTML layout fragments directly into the bounding `<body>`.
*   **Styling**: Dynamically appends `<link href="/shared/global.css">` to enforce unified branding globally.
