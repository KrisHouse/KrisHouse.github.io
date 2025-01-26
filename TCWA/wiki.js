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
        
        const categoryContent = wikiContent[selectedEntry.category];
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

function WikiSpoilerSystem() {
    // Previous wikiContent data stays the same
    const wikiContent = {
        characters: [
            {
                id: "gy",
                chapter: 1,
                title: "Gao Yang",
                summary: "Our protagonist.",
                tags: ["protagonist"],
                sections: [
                    {
                        title: "Background",
                        chapter: 1,
                        content: "Gao Yang, originally an orphan named Liu Li, transmigrated to the world the story takes place at the age of six.",
                        subsections: [] // Simple section without subsections
                    },
                    {
                        title: "Awakening",
                        chapter: 3,
                        content: "Gao Yang's childhood friend, Li Weiwei, turned into a monster and attacked him. He awakened then with Talent: Lucky.",
                        subsections: []
                    },
                    {
                        title: "Affiliations",
                        chapter: 1,
                        content: "Gao Yang's allegiances throughout the story:",
                        subsections: [
                            {
                                title: "Dark Horse",
                                chapter: 66,
                                content: "Gao Yang officially joined the Twelve Zodiac Signs after passing the test. He later picked the codename, Dark Horse."
                            },
                            {
                                title: "Seven Shadow",
                                chapter: 136,
                                content: "When the Qilin Guild poached Gao Yang, the Zodiacs saw it as a chance to plant an insider. Gao Yang joined the Guild as a Protector with his own team, codenamed Seven Shadow."
                            },
                            {
                                title: "Gao Yang",
                                chapter: 612,
                                content: "Gao Yang started the Nine Scions with members from the Zodiacs, the Qilin Guild, and his personal connections after an unresolvable disagreement with Qilin."
                            }
                        ]
                    },
                    {
                        title: "Abilities",
                        chapter: 3,
                        content: "Overview of Gao Yang's abilities:",
                        subsections: [
                            {
                                title: "Lucky",
                                chapter: 3,
                                content: "Gao Yang awakened with the serial number 199 Talent, Lucky. It came with a system and a Luck points mechanism. The Talent accumulates Luck points passively, and the Luck points can be added to his stats. For the evolution the Talent goes through, please check the entry of the Talent."
                            },
                            {
                                title: "Replicate",
                                chapter: 27,
                                content: "Gao Yang acquired Replicate as he, Qing Ling, and Officer Huang fought Old Man Zhang."
                            }
                        ]
                    }
                ]
            }
        ],
        factions: [
            {
                id: "zodiacs",
                chapter: 32,
                title: "Twelve Zodiac Signs",
                summary: "The Twelve Zodiac Signs consists of a small number of awakeners. The members' codenames follow the theme of the Chinese Zodiac Signs: Mouse, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Lamb, Monkey, Rooster, Dog, and Pig.",
                tags: ["awakener org"],
                sections: [
                    {
                        title: "History",
                        chapter: 67,
                        content: "The organization was founded 57 years ago. Over the next three years, the Twelve Zodiac Signs came into being, and the organization only ever sought out the right recruits when there were vacancies to fill.\
                        The members name themselves by adding a descriptor to their zodiac. Only Dragon, the leader, has not been replaced and thus retained the original name."
                    },
                    {
                        title: "Members when Introduced",
                        chapter: 68,
                        content: "Electric Mouse (Wu Dahai), Yellow Ox (Officer Huang), War Tiger, White Rabbit, Dragon, Green Snake (Qing Ling), Ghost Horse, Lovely Lamb, Mischievous Monkey, Songstress Chicken, Heavenly Dog, Dead Pig, Dark Horse (Gao Yang), Fat Jun (trainee)."
                    },
                    {
                        title: "Members Joining Later",
                        chapter: 752,
                        content: "Zhong He, Lying Wood, Yellow Lotus, Muzitu, Deep Earth, Quiet Book joined after they found out how Surnamed Li was involved in the terror attack at the Starcatching Pavilion."
                    },
                ]
            }
        ],
        talents: {
            type: 'numbered',
            data: {
              1: {
                id: 1,
                chapter: 336,
                title: "Overlord",
                summary: "The top Miracle-type Talent.",
                tags: ["Talent", "Miracle"],
                sections: [
                    {
                    title: "Basic Mechanism",
                    chapter: 373,
                    content: "Create a gray sphere and bring judgments to targets inside the domain. It seems quite physically-taxing to the user."
                },]
              },
              2: {
                id: 2,
                chapter: 263,
                title: "Eidos",
                summary: "The top Psyche-type Talent.",
                tags: ["Talent", "Psyche"],
                sections: [
                    {
                        title: "Basic mechanisms",
                        chapter: 263,
                        content: "Allows one to create powerful illusion, delusion, and illusory realm through eye contact. Allows one to invade the target’s mind in order to disturb, influence, and even manipulate their rationality, emotions, and memories."
                    },
                    {
                        title: "Brain Formatting",
                        chapter: 608,
                        content: "It wipes out one's mind completely, effectively killing them. Qilin used it on Gao Yang when they had a falling out."
                    },
                    {
                        title: "Statues",
                        chapter: 677,
                        content: "Unleash powerful psychic rays to immobilize every target within the 80-meter radius. While the ability is active, the user cannot move. Qilin used it when he and Yan Liang attacked Gao Yang's group after Gao Yang grabbed Ke Yo from the Black Tortoise building."
                    },
                    {
                        title: "Brain Fibrosis",
                        chapter: 741,
                        content: "It puts the target into a waking vegetative state. Qilin used it on Vermilion Bird after finding out that she has leaked information to Gao Yang."
                    },
                    {
                        title: "Psychic Shackle",
                        chapter: 790,
                        content: "A single-target version of Statues with the same range. And the user can move regularly while using the skill. Qilin used it on Wang Zikai when the Nine Scions attacked the Union's underground base."
                    },
                ]
              },
              3: {
                id: 3,
                chapter: 263,
                title: "Time-Space Spirit",
                summary: "The top Time-Space-type Talent.",
                tags: ["Talent", "Time-Space"],
                sections: [
                    {
                        title: "Basic mechanisms",
                        chapter: 379,
                        content: "It allows one to jump through time and space. The user may manipulate time for themselves so that they are relatively much faster than others. It can also create a subspace to trap people."
                    },
                    {
                        title: "Spirit Domain",
                        chapter: 1039,
                        content: "Create a domain where time passage may be adjusted for targets and their vicinity."
                    },
                    {
                        title: "Spatial Jump",
                        chapter: 1039,
                        content: "Teleport to any location regardless of distance (Cooldown: 3 hours)."
                    },
                    {
                        title: "Spatial Migration",
                        chapter: 1039,
                        content: "Teleport multiple targets to any location (Cooldown: 72 hours)."
                    },
                    {
                        title: "Time-Space Gap",
                        chapter: 1039,
                        content: "Trap targets temporarily with risk of permanent loss in Time-Space gap.."
                    },
                ]
              },
              4: {
                id: 4,
                chapter: 380,
                title: "Elemental",
                summary: "The top Element-type Talent.",
                tags: ["Talent", "Element"],
                sections: [
                    {
                    title: "Basic Mechanism",
                    chapter: 380,
                    content: "Allows the manipulation of multiple elements and the combination of them to form new elements."
                    },
                    {
                    title: "Level 8",
                    chapter: 381,
                    content: "At level 8, Elemental grants an ultimate skill: Elemental Angel."
                    },
                ]
              },
              5: {
                id: 5,
                chapter: 255,
                title: "Prophet",
                summary: "The top Knowledge-type Talent.",
                tags: ["Talent", "Knowledge"],
                sections: [
                    {
                    title: "Basic Abilities",
                    chapter: 255,
                    content: "Prophet sees the immediate future in ten seconds, senses an incoming danger in the near future, or gives a prophetic dream glimpsing into fate."
                    },
                    {
                    title: "Fate Slides",
                    chapter: 961,
                    content: "Once a contract is formed with a target, the user may glimpse their near future from one to ten days ahead."
                    },
                ]
              },
              6: {
                id: 6,
                chapter: 304,
                title: "Limitless Evolution",
                summary: "The top Buff-type Talent.",
                tags: ["Talent", "Buff"],
                sections: [
                    {
                    title: "Basic Mechanism",
                    chapter: 304,
                    content: "Whenever a Talent fails to kill the user, they gain a 60% immunity and resistance to it after recovery and acquire a small part of the Talent's energy."
                    },
                ]
              },
              7: {
                id: 7,
                chapter: 245,
                title: "Puppeteer",
                summary: "The top Summon-type Talent.",
                tags: ["Talent", "Summon"],
                sections: [
                    {
                    title: "Basic Mechanism",
                    chapter: 249,
                    content: "Can turn a wanderer or a corpse into a puppet. The puppets' skills can also be used by the Talent user for a period of time."
                    },
                    {
                    title: "Skill Conversion",
                    chapter: 249,
                    content: "Can turn a wanderer or a corpse into a puppet."
                    },
                ]
              },
              8: {
                id: 8,
                chapter: 372,
                title: "Pestilence",
                summary: "The top Poison-type Talent.",
                tags: ["Talent", "Poison"],
                sections: []
              },
              9: {
                id: 9,
                chapter: 336,
                title: "Absolute Defense",
                summary: "The top Guard-type Talent.",
                tags: ["Talent", "Guard"],
                sections: [
                    {
                    title: "Basic Mechanism",
                    chapter: 336,
                    content: "The Talent grants energy shields of different types and Absolute Barriers. There can only be one large Absolute Barrier at a time or three small Absolute Barriers. The barriers last 10 minutes with a cooldown of 1 hour. Nothing may enter the barriers or make any in-depth investigation into something in the barriers. Whether the ones in the barriers may leave the barriers is decided by the Talent user."
                },]
              },
              10: {
                id: 10,
                chapter: 361,
                title: "Equivalent Exchange",
                summary: "The top Life-type Talent.",
                tags: ["Talent", "Miracle"],
                sections: [
                    {
                    title: "Basic Mechanism",
                    chapter: 373,
                    content: "Create a gray sphere and bring judgments to targets inside the domain. It seems quite physically-taxing to the user."
                },]
              },
              11: {
                id: 11,
                chapter: 72,
                title: "Killing Expert",
                summary: "The top Damage-type Talent.",
                tags: ["Talent", "Damage"],
                sections: [
                    {
                    title: "Basic Mechanism",
                    chapter: 72,
                    content: "Mastery over all physical techniques, martial arts, and the use of all cold weapons and firearms for the purpose of killing. Pain sensitivity is lowered to 10% in battle, and physical abilities are enhanced the more seriously one is injured. When on the verge of death, all stats are buffed."
                },]
              },
              12: {
                id: 12,
                chapter: 238,
                title: "House",
                summary: "The top Support-type Talent.",
                tags: ["Talent", "Support"],
                sections: []
              },
            }
          },
        mysteries: [
            {
                id: "circuits",
                chapter: 55,
                title: "Rune Circuits",
                summary: "Mysterious artifacts that resonates with a Talent of the same Rune Type.",
                tags: ["items, worldbuilding"],
                sections: [
                    {
                        title: "Basic Uses",
                        chapter: 55,
                        content: "Rune Circuits are used to push a Talent from level 3 to level 4. Awakeners call a place where a Rune Circuit is found a Rune Cave."
                    },
                    {
                        title: "Merging",
                        chapter: 376,
                        content: "Once a top twelve Talent has reached level 7, the awakener may merge with the corresponding Rune Circuit to reach level 8, which will come with a powerful special ability."
                    },
                ]
            },
            {
                id: "levelups",
                chapter: 55,
                title: "Ways to Level Up",
                summary: "How a Talent levels up.",
                tags: ["Talent, worldbuilding"],
                sections: [
                    {
                        title: "Lv1 -> Lv2",
                        chapter: 55,
                        content: "A Talent can go from level 1 to level 2 with a few repeated uses."
                    },
                    {
                        title: "Lv2 -> Lv3",
                        chapter: 55,
                        content: "With an offensive Talent, one has to kill an uncertain number of monsters to level it up. With other Talents, it's again through repeated uses."
                    },
                    {
                        title: "Lv3 -> Lv4",
                        chapter: 55,
                        content: "One will need the Rune Circuit corresponding to a Talent to push it to level 4. There is no telling how long it'll take."
                    },
                    {
                        title: "Lv4 -> Lv5 -> Lv6",
                        chapter: 55,
                        content: "The level-ups happen when one's experiencing powerful emotions."
                    },
                    {
                        title: "Lv6 -> Lv7",
                        chapter: 625,
                        content: "An awakener has to find their conviction for their Talents to reach level 7, and when one Talent does, all other Talents will jump to level 7, too."
                    },
                    {
                        title: "Lv7 -> Lv8",
                        chapter: 841,
                        content: "An awakener's conviction has to aligned with their Talent to merge with the corresponding Rune Circuit and reach level 8."
                    },
                ]
            },
        ],
        locations: [
            {
                id: "licity",
                chapter: 1,
                title: "Li City",
                summary: "Where the story begins.",
                tags: [],
                sections: [
                    {
                        title: "Districts",
                        chapter: 9,
                        content: "Li City is divided into nine districts: Nanji, Changyan, Shanqing, Daxu, Feiyang, Xijing, Dongyu, Anliang, and Beiyong."
                    },
                    {
                        title: "Walled City of Ten Dragons",
                        chapter: 54,
                        content: "A little hub for awakeners in the Feiyang District."
                    },
                    {
                        title: "The Millennium Tower",
                        chapter: 66,
                        content: "Built five years ago, it's known as the Li City International Financial Center, located in the most developed district of the city: Daxu Districts. It's owned by Wu Dahai with the underground sixth floor being the secret base of the Twelve Zodiac Signs."
                    },
                ]
            }
        ],
        items: [
            {
                id: "medicineC",
                chapter: 1,
                title: "Medicine C",
                summary: "A medicine that promotes quick healing.",
                tags: ["items", "medicine"],
                sections: []
            }
        ]
    };

    const isMobile = useIsMobile();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const [currentChapter, setCurrentChapter] = React.useState(1);
    const [inputChapter, setInputChapter] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('characters');
    const [selectedEntry, setSelectedEntry] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showGlobalSearch, setShowGlobalSearch] = React.useState(false);
    const [selectedTags, setSelectedTags] = React.useState([]);
    const [darkMode, setDarkMode] = React.useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
        Object.entries(wikiContent).forEach(([categoryName, category]) => {
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
    }, [wikiContent]);

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
            return showGlobalSearch ? [] : (activeTab === 'talents' ? [] : wikiContent[activeTab]);
        }
    
        const searchTermLower = searchTerm.toLowerCase();
        let results = [];
    
        const categoriesToSearch = showGlobalSearch 
            ? Object.entries(wikiContent)
            : [[activeTab, wikiContent[activeTab]]];
    
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
    }, [searchTerm, selectedTags, activeTab, showGlobalSearch, wikiContent]);

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
            <h3 className="font-semibold flex items-center justify-between">
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                    {section.title}
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Chapter {section.chapter}
                </span>
            </h3>
            {section.chapter <= currentChapter ? (
                <div>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {section.content}
                    </p>
                    {section.subsections && section.subsections.length > 0 && (
                        <div className="space-y-4">
                            {section.subsections.map(subsection => renderSection(subsection, level + 1))}
                        </div>
                    )}
                </div>
            ) : (
                <div className={`mt-2 p-4 rounded text-gray-500 italic ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                    Content locked (requires Chapter {section.chapter})
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
        const talents = wikiContent.talents.data;
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
        const validEntries = (showGlobalSearch ? searchResults : wikiContent[activeTab])
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
                Story Wiki
            </h1>
            <div className="flex items-center gap-2">
                {isMobile && !selectedEntry && (
                    <button
                        onClick={toggleMenu}
                        className={`p-2 rounded ${
                            darkMode 
                                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                )}
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
        </div>
    );
    
    const renderNavigation = () => (
        <div className={`${
            isMobile && !isMenuOpen && !selectedEntry ? 'hidden' : 'block'
        } mb-6 overflow-x-auto`}>
            <div className={`${
                isMobile ? 'flex flex-col' : 'flex'
            } border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
                {Object.keys(wikiContent).map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 flex items-center gap-2 ${
                            isMobile ? 'border-b dark:border-gray-700' : ''
                        } ${
                            activeTab === tab 
                                ? darkMode
                                    ? 'border-blue-500 text-blue-400 bg-gray-700'
                                    : 'border-blue-500 text-blue-600 bg-gray-50'
                                : darkMode
                                    ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                                    : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                            handleTabChange(tab);
                            if (isMobile) setIsMenuOpen(false);
                        }}
                    >
                        <span>{getCategoryIcon(tab)}</span>
                        <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
    
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
        const validEntries = (showGlobalSearch ? searchResults : wikiContent[activeTab])
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
    
                    <div className={`text-sm mb-4 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
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