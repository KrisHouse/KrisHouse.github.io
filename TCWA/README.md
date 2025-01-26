# Chapter-Based Story Wiki

A web-based wiki system that reveals content based on the reader's progress through chapters, preventing spoilers. Features both light and dark modes, with full search capabilities and mobile responsiveness.

## Project Structure
```
story-wiki/
├── index.html
├── wiki.js
└── styles.css
```

## Features Implemented
- Chapter-based content revelation
  - Users input their last read chapter
  - Content automatically filters based on progress
  - Visual indicators for locked content

- Category System
  - Characters
  - Factions
  - Abilities/Talents
  - Mysteries/Plot Points
  - Locations
  - Items/Artifacts

- Advanced Search Functionality
  - Global search across all categories
  - Category-specific search
  - Tag-based filtering
  - Real-time search results
  - Search through titles, summaries, and content

- User Interface
  - Dark/Light mode toggle
  - System theme preference detection
  - Mobile-responsive design
  - Clean, modern UI with smooth transitions
  - Tag-based navigation
  - Detailed entry views with sections

- Content Organization
  - Hierarchical content structure
  - Tag system for cross-referencing
  - Chapter-gated sections within entries
  - Category icons for better visual recognition

## How It Works
1. Users input their current chapter progress
2. Content is filtered based on chapter progress
3. Users can search and filter content using:
   - Text search
   - Tag filters
   - Category navigation
4. Content is presented in both list and detailed views
5. Dark/Light mode adjusts based on user preference

## Data Structure
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
                    content: "Section content"
                }
            ]
        }
    ]
}
```

## Technical Details
- Built with React (loaded via CDN)
- Styled with Tailwind CSS
- No build tools required
- Uses Babel for JSX transformation

## Future Enhancements
1. Data Management
   - JSON/markdown data file support
   - Import/export capabilities
   - Content versioning

2. Enhanced Features
   - Timeline view
   - Character relationship diagrams
   - Image support
   - Auto-save reading progress

3. User Accounts
   - Progress tracking
   - Bookmarks
   - Notes and annotations
   - Multiple reading paths

4. Cross-References
   - Automatic link generation
   - Related entries suggestions
   - Context-aware references

5. Advanced Visualization
   - Family trees
   - Location maps
   - Event timelines
   - Power scales