function WikiSpoilerSystem() {
    // Previous wikiContent data stays the same
    const wikiContent = {
        characters: [
            {
                id: "john",
                chapter: 1,
                title: "John Smith",
                summary: "A mysterious traveler who arrives in the new world.",
                tags: ["protagonist", "traveler"],
                sections: [
                    {
                        title: "Background",
                        chapter: 1,
                        content: "John Smith appeared mysteriously one stormy night at the city gates."
                    },
                    {
                        title: "Abilities",
                        chapter: 3,
                        content: "Demonstrates unusual control over elemental magic."
                    }
                ]
            }
        ],
        factions: [
            {
                id: "mages",
                chapter: 2,
                title: "Mage Guild",
                summary: "The primary magical institution.",
                tags: ["magic", "organization"],
                sections: [
                    {
                        title: "Structure",
                        chapter: 2,
                        content: "Organized into different schools of magic."
                    }
                ]
            }
        ],
        abilities: [
            {
                id: "elemental-magic",
                chapter: 2,
                title: "Elemental Magic",
                summary: "The art of controlling natural elements.",
                tags: ["magic", "combat"],
                sections: [
                    {
                        title: "Basic Principles",
                        chapter: 2,
                        content: "Elemental magic requires understanding the fundamental nature of elements."
                    },
                    {
                        title: "Advanced Techniques",
                        chapter: 4,
                        content: "Masters can combine multiple elements for devastating effects."
                    }
                ]
            }
        ],
        mysteries: [
            {
                id: "ancient-prophecy",
                chapter: 1,
                title: "The Ancient Prophecy",
                summary: "A mysterious prediction about the world's fate.",
                tags: ["plot", "prophecy"],
                sections: [
                    {
                        title: "Initial Discovery",
                        chapter: 1,
                        content: "Found in the ruins of the old temple."
                    },
                    {
                        title: "Hidden Meaning",
                        chapter: 5,
                        content: "The prophecy speaks of a chosen one who will bridge two worlds."
                    }
                ]
            }
        ],
        locations: [
            {
                id: "mystical-city",
                chapter: 1,
                title: "The Mystical City",
                summary: "A ancient city where magic flows freely.",
                tags: ["city", "magic"],
                sections: [
                    {
                        title: "Geography",
                        chapter: 1,
                        content: "Built atop a convergence of ley lines."
                    },
                    {
                        title: "Secret Places",
                        chapter: 3,
                        content: "Hidden passages run beneath the city streets."
                    }
                ]
            }
        ],
        items: [
            {
                id: "crystal-key",
                chapter: 2,
                title: "The Crystal Key",
                summary: "An artifact of unknown origin and purpose.",
                tags: ["artifact", "mystery"],
                sections: [
                    {
                        title: "Description",
                        chapter: 2,
                        content: "A transparent crystal in the shape of an ornate key."
                    },
                    {
                        title: "Powers",
                        chapter: 4,
                        content: "Glows in the presence of ancient magic."
                    }
                ]
            }
        ]
    };

    const [currentChapter, setCurrentChapter] = React.useState(0);
    const [inputChapter, setInputChapter] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('characters');
    const [selectedEntry, setSelectedEntry] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showGlobalSearch, setShowGlobalSearch] = React.useState(false);
    const [selectedTags, setSelectedTags] = React.useState([]);
    const [darkMode, setDarkMode] = React.useState(false);

    // Event Handlers
    const handleChapterSubmit = React.useCallback((e) => {
        e.preventDefault();
        const chapter = parseInt(inputChapter);
        if (!isNaN(chapter) && chapter >= 0) {
            setCurrentChapter(chapter);
            setInputChapter('');
        }
    }, [inputChapter]);

    const handleChapterInput = React.useCallback((e) => {
        setInputChapter(e.target.value);
    }, []);

    const handleSearchInput = React.useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleTagToggle = React.useCallback((tag) => {
        setSelectedTags(prev => 
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    }, []);

    const handleTabChange = React.useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    const handleGlobalSearchToggle = React.useCallback(() => {
        setShowGlobalSearch(prev => !prev);
    }, []);

    const handleDarkModeToggle = React.useCallback(() => {
        setDarkMode(prev => !prev);
    }, []);

    const handleEntrySelect = React.useCallback((entry) => {
        setSelectedEntry(entry);
    }, []);

    const handleBackToList = React.useCallback(() => {
        setSelectedEntry(null);
    }, []);

    // Use system color scheme preference
    React.useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
    }, []);

    // Get all unique tags
    const allTags = React.useMemo(() => {
        const tags = new Set();
        Object.values(wikiContent).forEach(category => {
            category.forEach(entry => {
                entry.tags.forEach(tag => tags.add(tag));
            });
        });
        return Array.from(tags).sort();
    }, []);

    // Enhanced search function
    const searchResults = React.useMemo(() => {
        if (!searchTerm && selectedTags.length === 0) {
            return showGlobalSearch ? [] : wikiContent[activeTab];
        }

        const searchTermLower = searchTerm.toLowerCase();
        let results = [];

        const categoriesToSearch = showGlobalSearch 
            ? Object.entries(wikiContent)
            : [[activeTab, wikiContent[activeTab]]];

        categoriesToSearch.forEach(([category, entries]) => {
            const matchingEntries = entries.filter(entry => {
                const matchesSearch = !searchTerm || 
                    entry.title.toLowerCase().includes(searchTermLower) ||
                    entry.summary.toLowerCase().includes(searchTermLower) ||
                    entry.sections.some(section => 
                        section.title.toLowerCase().includes(searchTermLower) ||
                        section.content.toLowerCase().includes(searchTermLower)
                    );

                const matchesTags = selectedTags.length === 0 ||
                    selectedTags.every(tag => entry.tags.includes(tag));

                return matchesSearch && matchesTags;
            });

            results.push(...matchingEntries.map(entry => ({
                ...entry,
                category
            })));
        });

        return results;
    }, [searchTerm, selectedTags, activeTab, showGlobalSearch]);

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'characters': return '👤';
            case 'factions': return '👥';
            case 'abilities': return '✨';
            case 'mysteries': return '🔍';
            case 'locations': return '🗺️';
            case 'items': return '📦';
            default: return '📄';
        }
    };

    const renderSearchBar = () => (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-blue-50'} p-4 rounded mb-6 space-y-4`}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search entries..."
                        value={searchTerm}
                        onChange={handleSearchInput}
                        className={`w-full p-2 border rounded ${
                            darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300'
                        }`}
                    />
                </div>
                <button
                    onClick={handleGlobalSearchToggle}
                    className={`px-4 py-2 rounded transition-colors ${
                        showGlobalSearch 
                            ? 'bg-blue-500 text-white' 
                            : darkMode
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {showGlobalSearch ? 'Global Search' : 'Category Search'}
                </button>
            </div>
            
            <div className="space-y-2">
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Filter by tags:
                </div>
                <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                selectedTags.includes(tag)
                                    ? 'bg-blue-500 text-white'
                                    : darkMode
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {(searchTerm || selectedTags.length > 0) && (
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Found {searchResults.length} matching entries
                    {showGlobalSearch ? ' across all categories' : ''}
                </div>
            )}
        </div>
    );

    const renderDetailedEntry = (entry) => (
        <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <button 
                onClick={handleBackToList}
                className={`m-4 px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                    darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
            >
                ← Back to List
            </button>

            <div className="p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <span>{getCategoryIcon(entry.category || activeTab)}</span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        {(entry.category || activeTab).charAt(0).toUpperCase() + (entry.category || activeTab).slice(1)}
                    </span>
                </div>
                
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {entry.title}
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {entry.summary}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {entry.tags.map((tag, index) => (
                        <span 
                            key={index} 
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedTags.includes(tag)
                                    ? 'bg-blue-500 text-white'
                                    : darkMode
                                        ? 'bg-gray-700 text-blue-300'
                                        : 'bg-blue-50 text-blue-600'
                            }`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="space-y-6">
                    {entry.sections.map((section, index) => (
                        <div 
                            key={index} 
                            className={`p-4 rounded-lg ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                        >
                            <h3 className="font-semibold flex items-center justify-between">
                                <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                                    {section.title}
                                </span>
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Chapter {section.chapter}
                                </span>
                            </h3>
                            {section.chapter <= currentChapter ? (
                                <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {section.content}
                                </p>
                            ) : (
                                <div className={`mt-2 p-4 rounded text-gray-500 italic ${
                                    darkMode ? 'bg-gray-800' : 'bg-gray-100'
                                }`}>
                                    Content locked (requires Chapter {section.chapter})
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderEntryList = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((entry) => (
                <div 
                    key={entry.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        darkMode 
                            ? 'border-gray-700 hover:border-blue-500 bg-gray-800' 
                            : 'border-gray-200 hover:border-blue-500 bg-white'
                    }`}
                    onClick={() => handleEntrySelect(entry)}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {entry.title}
                        </h3>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Ch. {entry.chapter}
                        </span>
                    </div>
                    
                    {showGlobalSearch && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>{getCategoryIcon(entry.category)}</span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                            </span>
                        </div>
                    )}
                    
                    {entry.chapter <= currentChapter ? (
                        <div>
                            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {entry.summary}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {entry.tags.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className={`px-2 py-1 rounded-full text-sm ${
                                            selectedTags.includes(tag)
                                                ? 'bg-blue-500 text-white'
                                                : darkMode
                                                    ? 'bg-gray-700 text-gray-300'
                                                    : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className={`mt-2 italic ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Content locked (requires Chapter {entry.chapter})
                        </p>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="max-w-4xl mx-auto p-4">
                <div className={`rounded-lg shadow-lg p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className={`text-2xl sm:text-3xl font-bold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            Story Wiki
                        </h1>
                        <button
                            onClick={handleDarkModeToggle}
                            className={`p-2 rounded-full ${
                                darkMode 
                                    ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div>

                    <form onSubmit={handleChapterSubmit} className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="number"
                                value={inputChapter}
                                onChange={handleChapterInput}
                                placeholder="Enter the last chapter you've read"
                                className={`flex-1 p-2 border rounded ${
                                    darkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                        : 'bg-white border-gray-300'
                                }`}
                                min="0"
                            />
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Update Progress
                            </button>
                        </div>
                    </form>

                    <div className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Showing content up to Chapter {currentChapter}
                    </div>

                    {renderSearchBar()}

                    {!showGlobalSearch && (
                        <div className="mb-6 overflow-x-auto">
                            <div className={`flex border-b ${
                                darkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                {Object.keys(wikiContent).map((tab) => (
                                    <button
                                        key={tab}
                                        className={`px-4 py-2 flex items-center gap-2 whitespace-nowrap ${
                                            activeTab === tab 
                                                ? darkMode
                                                    ? 'border-b-2 border-blue-500 text-blue-400'
                                                    : 'border-b-2 border-blue-500 text-blue-600'
                                                : darkMode
                                                    ? 'text-gray-400 hover:text-blue-400'
                                                    : 'text-gray-600 hover:text-blue-500'
                                        }`}
                                        onClick={() => handleTabChange(tab)}
                                    >
                                        <span>{getCategoryIcon(tab)}</span>
                                        <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        {selectedEntry ? renderDetailedEntry(selectedEntry) : renderEntryList()}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Make the component available globally
window.WikiSpoilerSystem = WikiSpoilerSystem;