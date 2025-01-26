// Wiki content data
const wikiContent = {
    characters: [
        {
            id: "john-smith",
            chapter: 1,
            title: "John Smith",
            summary: "A mysterious traveler who arrives in the new world.",
            tags: ["protagonist", "traveler", "magic user"],
            sections: [
                {
                    title: "Background",
                    chapter: 1,
                    content: "John Smith appeared mysteriously one stormy night at the gates of the city."
                },
                {
                    title: "Abilities",
                    chapter: 3,
                    content: "Demonstrates unusual control over elemental magic and enhanced perception."
                },
                {
                    title: "True Identity",
                    chapter: 7,
                    content: "Revealed to be a guardian from an ancient line of protectors."
                }
            ],
            relatedEntries: [
                { id: "basic-magic", category: "talents", title: "Basic Magic" },
                { id: "order-of-light", category: "factions", title: "The Order of Light" }
            ]
        }
        // Add more characters here
    ],
    factions: [
        // Add factions here
    ],
    talents: [
        // Add talents here
    ],
    mysteries: [
        // Add mysteries here
    ]
};

// Main Wiki Component
function WikiSpoilerSystem() {
    const [currentChapter, setCurrentChapter] = React.useState(0);
    const [activeTab, setActiveTab] = React.useState('characters');
    const [selectedEntry, setSelectedEntry] = React.useState(null);
    const [inputChapter, setInputChapter] = React.useState('');

    const handleChapterSubmit = (e) => {
        e.preventDefault();
        const chapter = parseInt(inputChapter);
        if (!isNaN(chapter) && chapter >= 0) {
            setCurrentChapter(chapter);
        }
    };

    const renderDetailedEntry = (entry) => (
        <div className="space-y-6">
            <button 
                className="back-button"
                onClick={() => setSelectedEntry(null)}
            >
                ← Back to List
            </button>

            <div className="entry-card">
                <h2 className="text-2xl font-bold mb-4">{entry.title}</h2>
                <p className="text-gray-600 mb-4">{entry.summary}</p>
                
                <div className="mb-6">
                    {entry.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>

                <div className="space-y-6">
                    {entry.sections.map((section, index) => (
                        <div 
                            key={index}
                            className={section.chapter <= currentChapter ? 'entry-card' : 'section-hidden'}
                        >
                            <h3 className="text-lg font-semibold mb-2">
                                {section.title} 
                                <span className="text-sm text-gray-500 ml-2">
                                    (Chapter {section.chapter})
                                </span>
                            </h3>
                            {section.chapter <= currentChapter ? (
                                <p>{section.content}</p>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Section hidden (requires reading up to Chapter {section.chapter})
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Related Entries</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {entry.relatedEntries.map((related, index) => (
                            <button
                                key={index}
                                className="back-button"
                                onClick={() => {
                                    const newEntry = wikiContent[related.category]?.find(e => e.id === related.id);
                                    if (newEntry) {
                                        setSelectedEntry({ ...newEntry, category: related.category });
                                        setActiveTab(related.category);
                                    }
                                }}
                            >
                                🔗 {related.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCategoryContent = (entries) => (
        <div className="space-y-6">
            {entries.map((entry, index) => (
                <div 
                    key={index}
                    className="entry-card"
                    onClick={() => setSelectedEntry({ ...entry, category: activeTab })}
                >
                    <h3 className="text-lg font-semibold mb-2">
                        {entry.title} 
                        <span className="text-sm text-gray-500">
                            (First appears: Chapter {entry.chapter})
                        </span>
                    </h3>
                    <p className="mb-2">{entry.summary}</p>
                    <div>
                        {entry.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="tag">{tag}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Story Wiki</h1>

                <form onSubmit={handleChapterSubmit} className="mb-6">
                    <div className="flex gap-4">
                        <input
                            type="number"
                            value={inputChapter}
                            onChange={(e) => setInputChapter(e.target.value)}
                            placeholder="Enter the last chapter you've read"
                            className="flex-1 p-2 border rounded"
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
                
                <div className="bg-blue-50 p-4 rounded mb-6">
                    Showing content up to Chapter {currentChapter}
                </div>

                <div className="mb-6">
                    <div className="flex border-b">
                        {['characters', 'factions', 'talents', 'mysteries'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="mt-6">
                        {selectedEntry ? 
                            renderDetailedEntry(selectedEntry) :
                            renderCategoryContent(wikiContent[activeTab] || [])}
                    </div>
                </div>
            </div>
        </div>
    );
}