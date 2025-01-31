# Chapter-Based Story Wiki System

A dynamic, web-based wiki system designed to prevent spoilers by revealing content based on the reader's chapter progress. Features a modern, responsive interface with both light and dark modes, comprehensive search capabilities, and tag-based filtering.

## Project Structure
```
story-wiki/
├── index.html          # Main entry point with React and TailwindCSS setup
├── wiki.js            # Core wiki system implementation
├── styles.css         # Additional custom styles
└── content/           # Content directory
    ├── characters.js  # Character entries
    ├── factions.js    # Faction entries
    ├── talents.js     # Talent system entries
    ├── mysteries.js   # Mystery/plot point entries
    ├── locations.js   # Location entries
    └── items.js       # Item/artifact entries
```

## Core Features

### Progress-Based Content Revelation
- Chapter-based content filtering
- Real-time chapter progress updates
- Visual indicators for locked content
- Section-level content gating
- Smooth transitions between revealed and hidden content

### Advanced Search & Navigation
- Global search across all categories
- Category-specific search mode
- Tag-based filtering system
- Real-time search results
- Cross-category content discovery
- Support for complex tag combinations

### Category Management
- Characters
- Factions
- Talents (with numerical ID system)
- Mysteries/Plot Points
- Locations
- Items/Artifacts
- Category-specific display formats

### UI/UX Features
- Responsive design (mobile and desktop layouts)
- Dark/light mode with system preference detection
- Mobile-optimized navigation
- Loading states and error handling
- Clean, modern interface with Tailwind CSS
- Smooth transitions and animations
- Accessibility considerations

### Content Organization
- Hierarchical content structure
- Rich tag system for cross-referencing
- Chapter-gated sections within entries
- Category-specific icons
- Detailed entry views with progressive disclosure
- Support for nested content sections

## Technical Implementation

### Frontend Framework
- Built with React 18 (loaded via CDN)
- Styled with Tailwind CSS
- No build tools required
- Uses Babel for JSX transformation
- Client-side routing and state management

### Data Structure Example
```javascript
{
    categoryName: [
        {
            id: "unique-id",
            chapter: 1,
            title: "Entry Title",
            summary: "Brief description",
            tags: ["tag1", "tag2"],
            sections: [
                {
                    title: "Section Title",
                    chapter: 1,
                    content: "Section content",
                    subsections: [
                        {
                            title: "Subsection Title",
                            chapter: 2,
                            content: "Subsection content"
                        }
                    ]
                }
            ]
        }
    ],
    // Special structure for talents
    talents: {
        data: {
            1: { /* talent data */ },
            2: { /* talent data */ }
            // ... up to 199
        }
    }
}
```

### State Management
- React hooks for local state
- Optimized rendering with useMemo and useCallback
- Responsive layout handling with useEffect
- Dark mode persistence
- Search state management
- Tag filtering state

### Performance Optimizations
- Lazy loading of content modules
- Memoized search results
- Efficient tag processing
- Responsive image loading
- Optimized re-renders
- Mobile-specific optimizations

## Future Development Roadmap

### 1. Advanced Features
- Interactive timeline view
- Character relationship visualization
- Progress auto-save system
- Content statistics and analytics
- Advanced sorting options

### 2. Content Enhancement
- Rich text formatting
- Media embedding
- Interactive elements
- Dynamic cross-references
- Content templating
- Multi-language support

### 3. Visualization Features
- Location mapping system
- Event timeline visualization
- Relationship graphs
- Progress tracking visualization