function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

const TalentListItem = ({ number, data, currentChapter, onSelect }) => {
    if (!data) {
        return (
            <div className="p-3 border-b last:border-b-0 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                        #{number.toString().padStart(3, '0')}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 italic">
                        Undiscovered
                    </span>
                </div>
            </div>
        );
    }

    const isLocked = data.chapter > currentChapter;

    return (
        <button
            onClick={() => !isLocked && onSelect(data)}
            className={`w-full p-3 border-b last:border-b-0 transition-colors text-left ${
                isLocked 
                    ? 'bg-gray-50 dark:bg-gray-800' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            } dark:border-gray-700`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-500 dark:text-gray-400">
                        #{number.toString().padStart(3, '0')}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                        {isLocked ? '???' : data.title}
                    </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Ch. {data.chapter}
                </span>
            </div>
            {!isLocked && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                    {data.summary}
                </p>
            )}
        </button>
    );
};

// BackButton component with fixed related entry handling
const BackButton = ({ selectedEntry, handleBackToList, darkMode }) => {
    // Get the related category content safely
    const getRelatedEntry = () => {
        if (!selectedEntry || !selectedEntry.category) return null;
        
        const categoryContent = content[selectedEntry.category];
        if (!categoryContent) return null;

        // Handle talents category differently
        if (selectedEntry.category === 'talents') {
            return categoryContent.data[selectedEntry.id] || null;
        }

        // For other categories
        return Array.isArray(categoryContent) 
            ? categoryContent.find(e => e.id === selectedEntry.id)
            : null;
    };

    return (
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
    );
};

function WikiSpoilerSystem({ content }) {
    const [currentChapter, setCurrentChapter] = React.useState(1);
    const [inputChapter, setInputChapter] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('characters');
    const [selectedEntry, setSelectedEntry] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showGlobalSearch, setShowGlobalSearch] = React.useState(false);
    const [selectedTags, setSelectedTags] = React.useState([]);
    const [darkMode, setDarkMode] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

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

    if (!content) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div>Loading Content...</div>
            </div>
        );
    }

    // Get all unique tags
    const allTags = React.useMemo(() => {
        const tags = new Set();
        Object.entries(content).forEach(([categoryName, category]) => {
            if (categoryName === 'talents') {
                // Handle talents object
                Object.values(category.data).forEach(talent => {
                    if (talent && talent.tags) {
                        // Split tags that might contain commas and process each one
                        talent.tags.forEach(tag => {
                            if (tag.includes(',')) {
                                tag.split(',').map(t => t.trim()).forEach(t => tags.add(t));
                            } else {
                                tags.add(tag.trim());
                            }
                        });
                    }
                });
            } else {
                // Handle regular arrays
                category.forEach(entry => {
                    if (entry.tags) {
                        entry.tags.forEach(tag => {
                            if (tag.includes(',')) {
                                tag.split(',').map(t => t.trim()).forEach(t => tags.add(t));
                            } else {
                                tags.add(tag.trim());
                            }
                        });
                    }
                });
            }
        });
        return Array.from(tags).sort();
    }, [content]);

    const getEntryTags = (tagArray) => {
        const processedTags = new Set();
        tagArray.forEach(tag => {
            if (tag.includes(',')) {
                tag.split(',').map(t => t.trim()).forEach(t => processedTags.add(t));
            } else {
                processedTags.add(tag.trim());
            }
        });
        return Array.from(processedTags);
    };

    // Enhanced search function
    const searchResults = React.useMemo(() => {
        if (!searchTerm && selectedTags.length === 0) {
            return showGlobalSearch ? [] : (activeTab === 'talents' ? [] : content[activeTab]);
        }
    
        const searchTermLower = searchTerm.toLowerCase();
        let results = [];
    
        const categoriesToSearch = showGlobalSearch 
            ? Object.entries(content)
            : [[activeTab, content[activeTab]]];
    
        categoriesToSearch.forEach(([categoryName, category]) => {
            if (categoryName === 'talents') {
                // Handle talents object structure
                Object.values(category.data).forEach(talent => {
                    if (!talent) return;
    
                    const processedTags = getEntryTags(talent.tags);
                    
                    const matchesSearch = !searchTerm || 
                        talent.title.toLowerCase().includes(searchTermLower) ||
                        talent.summary.toLowerCase().includes(searchTermLower) ||
                        talent.sections.some(section => 
                            section.title.toLowerCase().includes(searchTermLower) ||
                            section.content.toLowerCase().includes(searchTermLower)
                        );
    
                    const matchesTags = selectedTags.length === 0 ||
                        selectedTags.every(tag => processedTags.includes(tag));
    
                    if (matchesSearch && matchesTags) {
                        results.push({
                            ...talent,
                            tags: processedTags,
                            category: categoryName
                        });
                    }
                });
            } else {
                // Handle regular array-based categories
                category.forEach(entry => {
                    const processedTags = getEntryTags(entry.tags);
    
                    const matchesSearch = !searchTerm || 
                        entry.title.toLowerCase().includes(searchTermLower) ||
                        entry.summary.toLowerCase().includes(searchTermLower) ||
                        entry.sections.some(section => 
                            section.title.toLowerCase().includes(searchTermLower) ||
                            section.content.toLowerCase().includes(searchTermLower)
                        );
    
                    const matchesTags = selectedTags.length === 0 ||
                        selectedTags.every(tag => processedTags.includes(tag));
    
                    if (matchesSearch && matchesTags) {
                        results.push({
                            ...entry,
                            tags: processedTags,
                            category: categoryName
                        });
                    }
                });
            }
        });
    
        return results;
    }, [searchTerm, selectedTags, activeTab, showGlobalSearch, content]);

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

    const renderSection = (section, level = 0) => (
        <div 
            key={section.title}
            className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
            } ${level > 0 ? 'ml-4 mt-4' : ''}`}
        >
            {section.chapter <= currentChapter ? (
                <>
                    <h3 className="font-semibold flex items-center justify-between">
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                            {section.title}
                        </span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Chapter {section.chapter}
                        </span>
                    </h3>
                    <div>
                        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                            {section.content}
                        </p>
                        {section.subsections && section.subsections.length > 0 && (
                            <div className="space-y-4">
                                {section.subsections.map(subsection => renderSection(subsection, level + 1))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className={`p-4 rounded text-gray-500 italic ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                    Hidden Section (requires Chapter {section.chapter})
                </div>
            )}
        </div>
    );

    const renderDetailedEntry = (entry) => (
        <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <BackButton 
                selectedEntry={entry}
                handleBackToList={handleBackToList}
                darkMode={darkMode}
            />

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
                    {renderTags(entry.tags)}
                </div>

                <div className="space-y-6">
                    {entry.sections.map(section => renderSection(section))}
                </div>
            </div>
        </div>
    );

    const renderTalentsList = () => {
        const talents = content.talents.data;
        const filteredTalents = [];
        
        for (let i = 1; i <= 199; i++) {
            const talent = talents[i];
            
            // If no talent exists for this number, add it as an undiscovered entry
            if (!talent) {
                filteredTalents.push({ number: i, data: null });
                continue;
            }
            
            // Process tags for this talent
            const processedTags = getEntryTags(talent.tags);
            
            // Check if talent matches search term
            const matchesSearch = !searchTerm || 
                talent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                talent.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                processedTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            
            // Check if talent matches selected tags
            const matchesTags = selectedTags.length === 0 ||
                selectedTags.every(tag => processedTags.includes(tag));
            
            // Only add to filtered list if matches both search and tags
            if ((!searchTerm && !selectedTags.length) || (matchesSearch && matchesTags)) {
                filteredTalents.push({ number: i, data: talent });
            }
        }
    
        return (
            <div className="divide-y dark:divide-gray-700">
                {filteredTalents.map(({ number, data }) => (
                    <TalentListItem
                        key={number}
                        number={number}
                        data={data}
                        currentChapter={currentChapter}
                        onSelect={setSelectedEntry}
                    />
                ))}
            </div>
        );
    };

      const renderRegularEntry = (entry) => {
        // Guard clause to prevent rendering undefined entries
        if (!entry || !entry.id) {
            return null;
        }
    
        return (
            <div 
                key={entry.id}
                className={`p-4 border rounded-lg transition-colors ${
                    entry.chapter > currentChapter 
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                        : 'cursor-pointer border-gray-200 dark:border-gray-700 hover:border-blue-500 bg-white dark:bg-gray-800'
                }`}
                onClick={() => entry.chapter <= currentChapter && setSelectedEntry(entry)}
            >
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                        {entry.chapter <= currentChapter ? entry.title : '???'}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Ch. {entry.chapter}
                    </span>
                </div>
                
                {showGlobalSearch && entry.category && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span>{getCategoryIcon(entry.category)}</span>
                        <span className="text-gray-400 dark:text-gray-500">
                            {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                        </span>
                    </div>
                )}
                
                {entry.chapter <= currentChapter ? (
                    <div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            {entry.summary}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {renderTags(entry.tags)}
                        </div>
                    </div>
                ) : (
                    <div className="mt-2 p-4 rounded bg-gray-100 dark:bg-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 italic">
                            Entry locked (requires Chapter {entry.chapter})
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // Update entry rendering to handle processed tags
    const renderTags = (tags) => {
        const processedTags = getEntryTags(tags);
        return processedTags.map((tag, index) => (
            <span 
                key={index}
                className={`px-2 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
            >
                {tag}
            </span>
        ));
    };

    // Determine what content to show based on active tab
    const renderContent = () => {
        if (selectedEntry) {
            return renderDetailedEntry(selectedEntry);
        }
    
        if (activeTab === 'talents') {
            return renderTalentsList();
        }
    
        // Filter out any undefined or invalid entries before rendering
        const validEntries = (showGlobalSearch ? searchResults : content[activeTab])
            .filter(entry => entry && entry.id);
    
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validEntries.map(entry => renderRegularEntry(entry))}
            </div>
        );
    };

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-6">
            <h1 className={`text-xl sm:text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
            }`}>
                TCWA Glossary
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
    );
    
    const renderNavigation = () => {
        if (isMobile) {
            return (
                <div className="mb-6">
                    <select 
                        value={activeTab}
                        onChange={(e) => handleTabChange(e.target.value)}
                        className={`w-full p-2 rounded border ${
                            darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    >
                        {Object.keys(content).map((tab) => (
                            <option key={tab} value={tab}>
                                {getCategoryIcon(tab)} {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }
    
        return (
            <div className="mb-6 overflow-x-auto">
                <div className={`flex border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    {Object.keys(content).map((tab) => (
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
        );
    };
    
    const renderEntryGrid = () => {
        // If showing selected entry, render that instead
        if (selectedEntry) {
            return renderDetailedEntry(selectedEntry);
        }
    
        // For talents tab
        if (activeTab === 'talents') {
            return renderTalentsList();
        }
    
        // For regular entries
        const validEntries = (showGlobalSearch ? searchResults : content[activeTab])
            .filter(entry => entry && entry.id);
    
        return (
            <div className={`grid grid-cols-1 ${
                isMobile ? '' : 'md:grid-cols-2'
            } gap-4`}>
                {validEntries.map(entry => renderRegularEntry(entry))}
            </div>
        );
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="max-w-4xl mx-auto p-4">
                <div className={`rounded-lg shadow-lg p-4 sm:p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    {renderHeader()}
                    
                    <form onSubmit={handleChapterSubmit} className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="number"
                                value={inputChapter}
                                onChange={handleChapterInput}
                                placeholder="Enter last chapter read"
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
                    
                    {!showGlobalSearch && renderNavigation()}
                    
                    <div className="mt-6">
                        {renderEntryGrid()}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Make the component available globally
window.WikiSpoilerSystem = WikiSpoilerSystem;