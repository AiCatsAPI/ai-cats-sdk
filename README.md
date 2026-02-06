# 🐱 ai-cats-sdk

Official JavaScript/TypeScript SDK for the [ai-cats.net](https://ai-cats.net) API - Get AI-generated cat images!

## Installation

```bash
npm install @aicats/sdk
```

## Quick Start

```typescript
import { AiCats, Theme, Size } from '@aicats/sdk';

// Get a random cat image
const imageBlob = await AiCats.random();

// Get a Halloween-themed cat
const spookyCat = await AiCats.random({ theme: Theme.Halloween });

// Search for cats
const results = await AiCats.search({ query: 'orange fluffy cat', limit: 10 });
```

## API Reference

### `AiCats.random(options?)`
Get a random AI-generated cat image.

```typescript
const blob = await AiCats.random({
  size: Size.Medium,     // Image size (default: Large)
  theme: Theme.Xmas      // Optional theme
});
```

### `AiCats.getById(id, size?)`
Get a specific cat image by ID.

```typescript
const blob = await AiCats.getById('abc-123-def', Size.Small);
```

### `AiCats.getInfo(id)`
Get detailed information about a cat image.

```typescript
const info = await AiCats.getInfo('abc-123-def');
console.log(info.prompt);      // "A fluffy orange cat..."
console.log(info.theme);       // "Halloween"
console.log(info.dateCreated); // 1699012345678
```

### `AiCats.search(options?)`
Search for cat images.

```typescript
const results = await AiCats.search({
  query: 'black cat',    // Search text
  limit: 20,             // Max results (1-100)
  theme: Theme.Halloween,// Filter by theme
  descending: true       // Newest first
});

for (const cat of results) {
  console.log(cat.id, cat.url);
}
```

### `AiCats.getSimilar(id, options?)`
Find cats similar to a given cat.

```typescript
const similar = await AiCats.getSimilar('abc-123-def', { limit: 5 });
```

### `AiCats.getThemes()`
Get all available themes.

```typescript
const themes = await AiCats.getThemes();
// ['Default', 'Spring', 'Summer', 'Halloween', 'Xmas', ...]
```

### `AiCats.getCount(theme?)`
Get the total number of cat images.

```typescript
const total = await AiCats.getCount();
const halloweenCount = await AiCats.getCount(Theme.Halloween);
```

## Types

### Size
```typescript
Size.Large     // 1024x1024 (default)
Size.Medium    // 512x512
Size.Small     // 256x256
Size.Thumbnail // 128x128
Size.Icon      // 64x64
Size.Tiny      // 32x32
Size.Micro     // 16x16
```

### Theme
```typescript
Theme.Default
Theme.Spring
Theme.Summer
Theme.Autumn
Theme.Winter
Theme.Halloween
Theme.Xmas
Theme.NewYear
Theme.Easter
```

## Browser Usage

```html
<script type="module">
  import { AiCats } from 'https://unpkg.com/@aicats/sdk/dist/index.mjs';
  
  const blob = await AiCats.random();
  const img = document.createElement('img');
  img.src = URL.createObjectURL(blob);
  document.body.appendChild(img);
</script>
```

## Requirements

- **Node.js 18+** (uses native `fetch`)
- **Modern browsers** (Chrome, Firefox, Safari, Edge)

## License

MIT © [Mario Bertsch](https://mariobertsch.com)
