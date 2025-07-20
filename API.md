# Kolam API Documentation

## SVG Generation Endpoint

### GET `/api/kolam`

Generates a kolam pattern as a static SVG image with customizable colors. This endpoint uses a pure SVG rendering approach for optimal performance and compatibility.

#### Parameters

| Parameter    | Type   | Default   | Description                                                        |
| ------------ | ------ | --------- | ------------------------------------------------------------------ |
| `size`       | number | 7         | Grid size for the kolam pattern (creates an n×n grid, range: 3-15) |
| `background` | string | `#7b3306` | Background color of the SVG (hex color code)                       |
| `brush`      | string | `#ffffff` | Color of the kolam lines and dots (hex color code)                 |

**Note**: When using hex colors in URLs, the `#` character must be URL-encoded as `%23`. For example, `#ffffff` becomes `%23ffffff`.

#### Examples

**Basic kolam (7×7 grid, default colors):**
```
GET /api/kolam
```

**Large kolam with custom colors:**
```
GET /api/kolam?size=12&background=%23ffffff&brush=%23000000
```

**Small kolam with blue theme:**
```
GET /api/kolam?size=5&background=%23e0f2fe&brush=%231565c0
```

#### Response

Returns an SVG image with:
- Content-Type: `image/svg+xml`
- Cache-Control: `public, max-age=3600`

The SVG includes:
- Geometric kolam pattern with dots and curves
- Customizable background and brush colors
- Responsive viewBox for scaling
- Clean, static design optimized for embedding

#### Usage in HTML

```html
<!-- Static kolam with default colors -->
<img src="/api/kolam?size=8" alt="Kolam Pattern" />

<!-- Large kolam with custom colors -->
<img src="/api/kolam?size=10&background=%23f0f9ff&brush=%231e40af" alt="Blue Kolam" />

<!-- Dark theme kolam -->
<img src="/api/kolam?size=6&background=%23111827&brush=%23f9fafb" alt="Dark Kolam" />

<!-- Embed in iframe for full control -->
<iframe src="/api/kolam?size=6&background=%23fef3c7&brush=%23d97706" width="400" height="400" frameborder="0"></iframe>
```

#### URL Parameter System

The main editor and API support different parameter sets:

- **Main editor**: `/?size=8&duration=12000` (includes animation controls)
- **API endpoint**: `/api/kolam?size=8&background=%23fef3c7&brush=%23d97706` (static SVG with colors)

The editor automatically updates the URL as you change parameters, making it easy to share specific configurations. Use the "Copy Embed Code" button to get the API URL with current settings.

## Component Architecture

The kolam rendering is split into separate components for better maintainability:

- **`KolamSVG`**: Pure SVG component used by the API - no animations, optimized for static rendering
- **`KolamAnimated`**: Component with full animation capabilities for the web interface
- **`KolamDisplay`**: Wrapper component that chooses between static and animated rendering based on props

This separation ensures the API endpoint is fast and lightweight while maintaining rich animation capabilities in the web interface.
