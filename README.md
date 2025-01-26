# Chapter-Based Story Wiki

A web-based wiki system that reveals content based on the reader's progress through chapters, preventing spoilers.

## Current Implementation

### Project Structure
```
story-wiki/
├── index.html
├── wiki.js
└── styles.css
```

### Features Implemented
- Chapter-based content revelation
- Category tabs (Characters, Factions)
- Detailed entry views with sections
- Tag system
- Basic styling with Tailwind CSS

### How It Works
1. Readers input the latest chapter they've read
2. Content is filtered based on chapter progress
3. Entries show basic info in list view
4. Detailed view shows chapter-gated sections

### Current Data Structure
```javascript
const wikiContent = {
    characters: [
        {
            id: "character-id",
            chapter: 1,
            title: "Character Name",
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

## Setup Instructions
1. Create the three files in a directory
2. Open with VS Code
3. Install Live Server extension
4. Right-click index.html and select "Open with Live Server"

## Planned Features
1. Search Functionality
   - Global search across all categories
   - Filter by tags
   - Chapter-aware search results

2. Additional Categories
   - Talents/Abilities
   - Mysteries/Plot Points
   - Locations
   - Items/Artifacts

3. Enhanced Entry Relationships
   - Cross-references between entries
   - Related entries section
   - Timeline view

4. UI Improvements
   - Dark mode
   - Responsive design for mobile
   - Better navigation

5. Content Management
   - Data file separation
   - Better content organization
   - Import/export capabilities

## Technical Notes
- Uses plain JavaScript with React loaded via CDN
- Tailwind CSS for styling
- No build tools required
- Babel for JSX transformation