export interface Question {
    id?: any;
    num?: number;
    type?: 'Reading' | 'Grammar' | 'Math' | 'Reading and Writing' | 'Math (SPR)';
    passage?: string;
    passage_q?: string;
    image?: string; // Path to graph/figure image (math questions)
    question?: string;
    options: string[];
    answer: any;
    explanation?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Assessment';
    calc?: boolean;
}

export interface TestModule {
    questions: Question[];
    timeMinutes: number;
}

export interface TestSection {
    name: string;
    modules: TestModule[];
}

export interface PracticeTest {
    id: number;
    title: string;
    description: string;
    type: string;
    duration: string;
    totalQuestions: number;
    moduleCount: number;
    color: string;
    sections: TestSection[];
}

const pt1_englishModule1: Question[] = [
    {
        "num": 1,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "identify",
            "disturb",
            "replace",
            "exceed"
        ],
        "answer": 3,
        "difficulty": "Medium",
        "id": "pt1-m1-q1",
        "passage": "A study by Augusta D. Gaspar and Joana Carneiro Pinto found that a bank's corporate social\nresponsibility (CSR) efforts, including environmental and social campaigns, improve its\ncorporate image. When CSR was mentioned in bank marketing strategies, favorability scores\nassigned by study participants tended to ______ the scores assigned by participants when\nCSR wasn't mentioned."
    },
    {
        "num": 2,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "esoteric",
            "authoritative",
            "solitary",
            "speculative"
        ],
        "answer": 3,
        "difficulty": "Medium",
        "id": "pt1-m1-q2",
        "passage": "Researchers have long debated the origins of silver used in European coins from the 600s\nthrough the early 800s CE. Geochemical analysis by Kershaw et al. of 49 coins dating to\n660-820 CE provides concrete evidence that reconciles two competing theories: early coins\nwere made from Byzantine silver, and later coins used Frankish silver, findings that provide\n\nfirm details in a previously ______ area of study."
    },
    {
        "num": 3,
        "type": "Reading",
        "question": "As used in the text, what does the word \u201cmastery\u201d most nearly mean?",
        "options": [
            "Familiarity",
            "Domination",
            "Comprehension",
            "Skillfulness"
        ],
        "answer": 1,
        "difficulty": "Medium",
        "id": "pt1-m1-q3",
        "passage": "The following text is adapted from Alice Dunbar Nelson's 1899 short story \u201cThe Fisherman of\nPass Christian.\u201d Pass Christian is a city in the US state of Mississippi.\n\nThe swift breezes on the beach at Pass Christian meet and conflict as though\neach strove for the mastery of the air. The land-breeze blows down through the\n\npines, resinous, fragrant, cold, bringing breath-like memories of dim, dark woods\nshaded by myriad pine-needles. The breeze from the Gulf is warm and soft and\nlanguorous, blowing up from the south with its suggestion of tropical warmth."
    },
    {
        "num": 4,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "diversion from",
            "catalyst of",
            "constraint to",
            "sponsor of"
        ],
        "answer": 1,
        "difficulty": "Medium",
        "id": "pt1-m1-q4",
        "passage": "Science fiction has long served as a ______ of real-world technological advancements. Indeed,\nfrom Jules Verne's 1865 novel From the Earth to the Moon inspiring developments in\naerospace engineering to the television show Star Trek sparking the design of the ancestor\nof today's smartphones, these narratives have spurred many actual innovations."
    },
    {
        "num": 5,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "exorbitant",
            "contentious",
            "equivocal",
            "warranted"
        ],
        "answer": 0,
        "difficulty": "Medium",
        "id": "pt1-m1-q5",
        "passage": "Any effort to raise the toll that drivers must pay to use the Lewis and Clark Bridge, which\nspans the Ohio River to connect Indiana and Kentucky, should explain why a higher toll is\nnecessary; no amount of justification, however, is likely to persuade some drivers who\nbelieve the current toll is ______."
    },
    {
        "num": 6,
        "type": "Reading",
        "question": "Which choice best describes the function of the underlined sentence in the text as a whole?",
        "options": [
            "It emphasizes the thoroughness of the research conducted.",
            "It explains how the new classification system was derived from the previous binary\nsystem.",
            "It justifies the need for a new classification system for marine species.",
            "It explains the basis for the new system's scoring criteria."
        ],
        "answer": 3,
        "difficulty": "Medium",
        "id": "pt1-m1-q6",
        "passage": "Moving beyond a simple \u201cpresent or absent\u201d designation, researchers created a new\nclassification system that allows for a nuanced understanding of bioluminescence in marine\norganisms that was unavailable under binary classification systems. The new six-point scale\nconsiders varying levels of supporting evidence used to identify bioluminescent species. For\nexample, the firefly squid scores 1 because of inconsistent reports, the emperor squid\nscores 4 because of its anatomical similarity to known luminous relatives, and the shaggy\nanglerfish scores 6 because of substantiated direct observations."
    },
    {
        "num": 7,
        "type": "Reading",
        "question": "Which choice best describes the function of the underlined portion in the text as a whole?",
        "options": [
            "It presents information about the fossilization of pneumatic diverticula that has led\npaleontologists to question the applicability of studies of certain living species.",
            "It accounts for disagreements among paleontologists about how the respiratory systems\nof certain extinct genera functioned.",
            "It highlights an issue with fossils that previously led paleontologists to misidentify certain\ncharacteristics of pneumatic diverticula.",
            "It indicates why paleontologists have used another approach in addition to fossil analysis\nto learn about certain aspects of pneumatic diverticula."
        ],
        "answer": 3,
        "difficulty": "Medium",
        "id": "pt1-m1-q7",
        "passage": "Postcranial skeletal pneumaticity (PSP) refers to the presence of extensions of an animal's\nlungs and air sacs inside its bones. These extensions are known as pneumatic diverticula.\nPneumatic diverticula rarely fossilize, so paleontologists have relied on studies of living bird species to document these\nqualities, augmenting their findings from fossil analysis to glean additional insights into the\nrespiratory systems of extinct genera such as Tyrannosaurus, Euhelopus, and other\nCretaceous theropods and sauropods that may have also exhibited PSP."
    },
    {
        "num": 8,
        "type": "Reading",
        "question": "Which choice best describes the function of the underlined portion in the text as a whole?",
        "options": [
            "It suggests that scientists are more concerned about other species than about glass eels\u2019\nhabitat.",
            "It indicates that the benefit of understanding glass eels\u2019 spawning behavior extends\nbeyond the eels.",
            "It discusses a role that glass eels and other species serve in supporting the ecosystem of\nthe Sargasso Sea.",
            "It presents a finding from a study that identifies the circumstances required to ensure the\nsurvival of glass eels."
        ],
        "answer": 1,
        "difficulty": "Medium",
        "id": "pt1-m1-q8",
        "passage": "Adult glass eels can be found off the coast of Maine, but the eels begin their lives in the\nSargasso Sea, a biodiverse area in the North Atlantic Ocean where they are born and later\nreturn to breed. Though biologists believe they have identified the general area in the\nSargasso Sea that is crucial to the endangered eels\u2019 survival, little is yet known about how\nthe animals spawn there. Scientists believe that solving the mystery will lead to better\nconservation of glass eels and their habitat, helping, in turn, to sustain several other species\n\nthat rely on them as a food source."
    },
    {
        "num": 9,
        "type": "Reading",
        "question": "According to the text, what is someone who professionally evaluates books called?",
        "options": [
            "A book publisher",
            "A literary critic",
            "A bookseller",
            "An author"
        ],
        "answer": 1,
        "difficulty": "Medium",
        "id": "pt1-m1-q9",
        "passage": "Seesaw Girl was Linda Sue Park's debut novel. It was published in 1999. A debut novel is the\nfirst book that an author has published. Debut novels are especially interesting to literary\ncritics (people whose job it is to evaluate books) and readers because these books offer a\nlook at new voices in the literary world."
    },
    {
        "num": 10,
        "type": "Reading",
        "question": "Which choice most effectively uses data from the table to complete the statement?",
        "options": [
            "0.38 million metric tons of copper.",
            "0.33 million metric tons of copper.",
            "1.85 million metric tons of copper.",
            "0.44 million metric tons of copper."
        ],
        "answer": 1,
        "difficulty": "Medium",
        "id": "pt1-m1-q10",
        "passage": "__TABLE__\nMillions of Metric Tons of Copper Mined in 1995 and 2020\n\nCountry | 1995 | 2020\n--- | --- | ---\nIndonesia | 0.44 | 0.51\nMexico | 0.33 | 0.73\nPeru | 0.38 | 2.15\nUnited States | 1.85 | 1.20\n__ENDTABLE__\n\nWhile doing research for a paper about metal exports, a student finds a table indicating how much copper was mined in each of four countries in 1995 and 2020. The student notes that in 1995, Mexico mined"
    },
    {
        "num": 11,
        "type": "Reading",
        "question": "Which quotation from Peter Pan best supports the claim?",
        "options": [
            "\"The rock was very small now.\"",
            "\u201cWendy and John and Michael stood on tip-toe in the air to get their first sight of the\nisland.\u201d",
            "\"Peter was alone on the lagoon.\u201d",
            "\u201cFeeling that Peter was on his way back, the Neverland had again woke into life.\u201d"
        ],
        "answer": 3,
        "difficulty": "Medium",
        "id": "pt1-m1-q11",
        "passage": "Peter Pan is a 1911 novel by J.M. Barrie. In the fantasy novel, Peter is a young boy who can\nfly. He brings Wendy, John, and Michael to Neverland, the mythical island where he lives.\nThe narrator suggests that activity on the island stops when Peter is away and starts again\nwhen he is about to return:"
    },
    {
        "num": 12,
        "type": "Reading",
        "question": "Which quotation from a translation of The Underdogs most effectively illustrates the claim?",
        "options": [
            "\u201cCamilla stared up at the blue sky so [Luis] should not read the expression in her eyes.\u201d",
            "\u201cCamilla, standing on the beach of washed, round stones, caught a reflection of herself in\nthe waters.\u201d",
            "\u201cAll nature was as she had found it before, evening upon evening; but in the stones and\nthe dry weeds, amid the fragrance of the air and the light whir of falling leaves, Camilla\nsensed a new strangeness, a vast desolation in everything about her.\u201d",
            "\"[Camilla] closed her eyes fast to hold back the tears that welled up in them. Then, with\nthe back of her hand, she wiped her wet cheeks, and just as she had done three days ago,\nfled with all the swiftness of a young deer.\u201d"
        ],
        "answer": 2,
        "difficulty": "Medium",
        "id": "pt1-m1-q12",
        "passage": "The Underdogs is a 1915 novel by Mariano Azuela, originally written in Spanish. In the novel,\nAzuela depicts the character Camilla as experiencing a change in how she perceives her\nimmediate surroundings:"
    },
    {
        "num": 13,
        "type": "Reading",
        "question": "Which finding, if true, would most directly weaken the researcher's claim?",
        "options": [
            "A wider range of sounds is found across the languages of Africa as a whole than across\nthe languages of South America as a whole.",
            "Languages that emerged in Europe and Western Asia tend to have more sounds than\nlanguages that emerged in Africa do.",
            "Languages that emerged in Central America tend to have fewer sounds than languages\nthat emerged in Western Europe do, and Central America is farther away from Africa than\nWestern Europe is.",
            "The number of sounds is fairly consistent across the various languages that emerged in\nthe last parts of Africa to be settled by humans."
        ],
        "answer": 1,
        "difficulty": "Medium",
        "id": "pt1-m1-q13",
        "passage": "The Raramuri language of northern Mexico has 20 vowel and consonant sounds. In contrast,\nthe Taa language of southern Africa has over 100. Why would languages differ in this way?\nOne researcher has claimed that when modern humans arose in Africa, they spoke a single\nlanguage, but as humans gradually spread throughout Africa and then around the globe, that\nlanguage developed into new languages. Those developed into still more languages as small\nbands of humans spread even farther, with each new language retaining fewer sounds from\nhumanity's original language."
    },
    {
        "num": 14,
        "type": "Reading",
        "question": "Which choice most logically completes the text?",
        "options": [
            "find listening to \u201cHeartbeats\u201d at 82.2 decibels less enjoyable than listening to it at a lower\nvolume.",
            "prefer listening to other music at 82.2 decibels over listening to \u201cHeartbeats\u201d at that\nvolume.",
            "enjoy listening to the nature sounds at 82.2 decibels more than listening to \u201cHeartbeats\u201d\nat 82.2 decibels.",
            "not find it enjoyable to listen to any recordings at a volume as low as 82.2 decibels."
        ],
        "answer": 0,
        "difficulty": "Medium",
        "id": "pt1-m1-q14",
        "passage": "Antonia Olivia Dolan and colleagues had musicians and nonmusicians with clinically average\nhearing listen to recordings of nature sounds and music in popular genres like acoustic folk\nand funk and adjust the volume to optimize their listening enjoyment. The researchers found\nthat for a given recording that a musician and nonmusician identified as their favorite among\nthose included in the study, optimal volume tended to be higher for the musician than for the\nnonmusician. Thus, if a musician and nonmusician both identified Jose Gonzalez's\n\u201cHeartbeats\u201d as their favorite recording and the musician preferred to listen to it at a volume\nof 82.2 decibels, the nonmusician would be expected to ______."
    },
    {
        "num": 15,
        "type": "Reading",
        "question": "Which choice most logically completes the text?",
        "options": [
            "narwhals forage at shallower depths in the presence of ship sounds alone than in the\npresence of ship sounds coupled with sonic pulses.",
            "sonic pulses can be heard at significantly greater ocean depths than ship sounds can.",
            "the narwhals weren't as sensitive to human-caused sounds as the researchers had\npredicted.",
            "ship sounds contribute so much to the overall sound level that the addition of sonic\npulses has little effect on the narwhals\u2019 auditory environment."
        ],
        "answer": 3,
        "difficulty": "Medium",
        "id": "pt1-m1-q15",
        "passage": "Outi Tervo and team studied the effect of human-caused noise on narwhals (Vonodon\nmonoceros), arctic marine mammals that are sensitive to acoustic changes in their\nenvironment. Hypothesizing that elevated sound levels affect foraging among narwhals,\nTervo's team compared narwhal diving behaviors in natural sound conditions with those\nbehaviors in two human-caused sound exposure conditions\u2014ship sounds and ship sounds\ncoupled with sonic pulses. Both exposure conditions resulted in significant decreases in the\nnumber and target depth of deep dives (associated with foraging) relative to natural\nconditions. However, differences between diving behaviors in the two exposure types were\nnegligible, a finding that could be attributed to the fact that ______."
    },
    {
        "num": 16,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "lost and conversely,",
            "lost, conversely,",
            "lost. Conversely,",
            "lost, and conversely"
        ],
        "answer": 2,
        "difficulty": "Medium",
        "id": "pt1-m1-q16",
        "passage": "Many works of the Greek mathematician Euclid (3rd century BCE) are _______, but his Elements, a comprehensive treatise of mathematical knowledge, is an extant work: it can still be read."
    },
    {
        "num": 17,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "recommended",
            "recommending",
            "to recommend",
            "having recommended"
        ],
        "answer": 0,
        "difficulty": "Medium",
        "id": "pt1-m1-q17",
        "passage": "A 2024 study cataloged all the trees in Amsterdam to evaluate the biodiversity of the city's urban forest. The researchers, finding that administrative unit GK13 had a 0.62 ratio of native to non-native trees, _______ efforts to improve the biodiversity of the trees in that unit and other areas with a similarly moderate ratio."
    },
    {
        "num": 18,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "support. Decreasing",
            "support decreasing",
            "support, while decreasing",
            "support, decreasing"
        ],
        "answer": 0,
        "difficulty": "Medium",
        "id": "pt1-m1-q18",
        "passage": "Growing as large as three meters in diameter, the leaves of the giant Amazonian waterlily feature a complex network of radiating veins that provide structural _______ in thickness from the center to the edges, these veins allow the leaves to maintain their large size and buoyancy with minimal material, optimizing light capture and photosynthesis."
    },
    {
        "num": 19,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "Pennsylvania would officially become",
            "Pennsylvania had officially become",
            "Pennsylvania officially became",
            "Pennsylvania, having officially become"
        ],
        "answer": 3,
        "difficulty": "Medium",
        "id": "pt1-m1-q19",
        "passage": "_______ a US state when it ratified the US Constitution on December 12, 1787, was thereby empowered, via its representatives to the US Congress, to vote on whether to admit Louisiana as a state on April 30, 1812."
    },
    {
        "num": 20,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "has been revisited",
            "have been revisited",
            "revisited",
            "having been revisited"
        ],
        "answer": 1,
        "difficulty": "Medium",
        "id": "pt1-m1-q20",
        "passage": "Though largely eclipsed by her success as a novelist, Jessie Redmon Fauset\u2019s contributions as literary editor of The Crisis, a New York City-based periodical whose influence was arguably at its peak during her Harlem Renaissance-era tenure, _______ in recent scholarship that explores Fauset\u2019s instrumental role in shaping the magazine's aesthetic and debuting the work of Langston Hughes and other emerging Black writers."
    },
    {
        "num": 21,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "For example,",
            "However,",
            "Regardless,",
            "Next,"
        ],
        "answer": 0,
        "difficulty": "Medium",
        "id": "pt1-m1-q21",
        "passage": "Resins play several important roles in maintaining the health of conifers and many other kinds of trees. _______ resins quickly seal wounds, which helps prevent harmful insects and fungi from entering trees. These sticky substances also help trees retain water that is needed for them to survive."
    },
    {
        "num": 22,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "On the other hand,",
            "Previously,",
            "For example,",
            "In other words,"
        ],
        "answer": 0,
        "difficulty": "Medium",
        "id": "pt1-m1-q22",
        "passage": "Giant dust plumes from the Sahara Desert that blow across the Atlantic Ocean can have complex and opposing effects on tropical cyclones. On one hand, the dust can enhance the formation of ice clouds in the cyclone\u2019s core, increasing precipitation. _______ the dust can lower sea surface temperatures around the cyclone's core, weakening the storm."
    },
    {
        "num": 23,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "On the other hand,",
            "That is,",
            "For instance,",
            "There,"
        ],
        "answer": 0,
        "difficulty": "Medium",
        "id": "pt1-m1-q23",
        "passage": "Elvis Presley's iconic jumpsuit Red Pinwheel featured rhinestones arranged in pinwheel patterns. Historians note that adornments such as these added between twenty-five and fifty pounds to each of Elvis\u2019s stage outfits. _______ the fabric used to make the outfits was light and flexible, enabling freedom of motion."
    },
    {
        "num": 24,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "regardless;",
            "in other words;",
            "for instance;",
            "however;"
        ],
        "answer": 3,
        "difficulty": "Medium",
        "id": "pt1-m1-q24",
        "passage": "In a 1998 study by Smith et al., the researchers used microhistological fecal analysis to\ndetermine the ratio of three plant subtypes (graminoids, forbs, and browse) within the diets\nof North American ungulates. The researchers did not perform this analysis on all such\nungulates, ______ they focused exclusively on pronghorns and wild horses in New Mexico."
    },
    {
        "num": 25,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "Specifically,",
            "Earlier,",
            "Hence,",
            "Similarly,"
        ],
        "answer": 2,
        "difficulty": "Medium",
        "id": "pt1-m1-q25",
        "passage": "Though its onboard laboratory allowed it to analyze rock samples on-site, the 2011 Mars Curiosity rover was unable to preserve samples for future analysis. _______ when creating the 2020 Mars Perseverance rover, robotics technologist Yumi Iwashita and other members of NASA's Jet Propulsion Laboratory sought to implement a mechanism that could do exactly that."
    },
    {
        "num": 26,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "Thus,",
            "By contrast,",
            "Even so,",
            "Nevertheless,"
        ],
        "answer": 0,
        "difficulty": "Medium",
        "id": "pt1-m1-q26",
        "passage": "As Iestyn Barr and his team of researchers discovered when establishing the glacial timeline of Antarctica, the Transantarctic Mountains\u2014a 3,500-km mountain range spanning the continent\u2014are home to glaciers of at least 60 million years in age. _______ the researchers concluded, Antarctica had glaciers long before the formation of its continent-wide ice sheet 34 million years ago."
    },
    {
        "num": 27,
        "type": "Reading",
        "question": "Which choice most effectively uses information from the given sentences to emphasize Edison's reliance on Hammer?",
        "options": [
            "William Joseph Hammer, a laboratory assistant, worked at the Menlo Park laboratory.",
            "William Joseph Hammer, a laboratory assistant, was known for his valuable contribution to the field of technology.",
            "Most of Thomas Edison\u2019s employees had successful careers independent of working for him; for example, William Joseph Hammer, who worked at the Menlo Park laboratory, was an accomplished laboratory assistant.",
            "Having received little formal education, Thomas Edison depended on specialized employees, including laboratory assistant William Joseph Hammer, for many of his inventions."
        ],
        "answer": 3,
        "difficulty": "Medium",
        "id": "pt1-m1-q27",
        "passage": "While researching a topic, a student has taken the following notes:\n\n\u2022 Thomas Edison is regarded as one of the most important inventors in US history.\n\n\u2022 Having received little formal schooling, Edison relied on specialist employees at his various laboratories and offices to complete the technical work for many of his inventions.\n\n\u2022 William Joseph Hammer was a laboratory assistant who worked at the Menlo Park laboratory.\n\n\u2022 He is best known for curating the most comprehensive collection of historic light bulbs anywhere in the world.\n\n\u2022 William Symes Andrews was an electrical engineer who worked at the Edison Electric Light Company.\n\n\u2022 He is best known for establishing more than thirty power plants across New York and Pennsylvania."
    }
];

const pt1_englishModule2: Question[] = [
    {
        "num": 1,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "preliminary",
            "clandestine",
            "unequivocal",
            "inexplicable"
        ],
        "answer": 1,
        "difficulty": "Hard",
        "id": "pt1-m2-q1",
        "passage": "Louisa May Alcott contributed A Modern Mephistopheles to the No Name Series, a collection\nof novels published anonymously between 1876 and 1887. The series challenged readers to\nguess authors\u2019 identities, reflecting the era\u2019s fascination for literary mystery. This ______ approach to publishing allowed Alcott to experiment beyond her established style."
    },
    {
        "num": 2,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "surreptitiously",
            "disingenuously",
            "succinctly",
            "dispassionately"
        ],
        "answer": 0,
        "difficulty": "Hard",
        "id": "pt1-m2-q2",
        "passage": "Though copies of The Adventures of Indiana Jones in Wenceslas Square in Prague on\nJanuary 16, 1989\u2014an underground computer game that was created anonymously in 1989\nas an act of political protest against the authoritarian regime of what was then\nCzechoslovakia\u2014were originally distributed ______, the game is now readily available online for anyone to play."
    },
    {
        "num": 3,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "engenders",
            "preempts",
            "subsumes",
            "attenuates"
        ],
        "answer": 0,
        "difficulty": "Hard",
        "id": "pt1-m2-q3",
        "passage": "In their study of caterpillars in fragmented forests (formerly contiguous forests that have\nbeen broken into isolated patches by roads or other interruptions), Riley M. Anderson et al.\n\nstress that although fragmentation inevitably ______ alterations to local ecological\n\nprocesses, the changes will likely have a greater impact on Nola triquetrana, a specialist\nfeeding on a limited number of plant species, than on a species like Himella intractata that\nfeeds on several."
    },
    {
        "num": 4,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "belies",
            "portends",
            "thwarts",
            "maligns"
        ],
        "answer": 0,
        "difficulty": "Hard",
        "id": "pt1-m2-q4",
        "passage": "Yuen Yuen Ang et al. argue that merely tallying the number of patents filed per year ______ the degree of innovation occurring: truly novel patents\u2014those, like a 2011 patent for an\nautomated navigation system for planes, that combine previously unaffiliated technological\ndomains\u2014are vastly outnumbered by nonnovel patents (e.g., a 2008 patent for a method of\nmaking soup)."
    },
    {
        "num": 5,
        "type": "Reading",
        "question": "Which choice best states the function of the underlined sentence?",
        "options": [
            "To identify an unrecognized point of similarity between Chronicle of a Death Foretold and\nSo Far from God",
            "To suggest that Mexican American authors who were influenced by Garcia Marquez may\nhave, in turn, influenced him",
            "To refute the possible impression that Garcia Marquez conformed to magical realism in all\nof his works",
            "To challenge the common assumption that One Hundred Years of Solitude is superior to\nrealist works by Garcia Marquez"
        ],
        "answer": 2,
        "difficulty": "Hard",
        "id": "pt1-m2-q5",
        "passage": "Magical realism, a style that weaves fantasy into realistic narratives, coalesced in Latin\nAmerica in the 1960s. It is associated with Gabriel Garcia Marquez, whose One Hundred\nYears of Solitude is a key text. The style was embraced by Mexican American writers, such\nas Ana Castillo, whose So Far from God draws on Mexican folktales as a source of fantasy.\nYet The Mixquiahuala Letters, also by Castillo, features no fantastical plot events. And\n\ndespite his popular reputation, Garcia Marquez himself wrote several works of strict realism,\nincluding_Chronicle of a Death Foretold."
    },
    {
        "num": 6,
        "type": "Reading",
        "question": "Which choice best describes the relationship between the two texts?",
        "options": [
            "Text 2 describes a methodology that helps researchers avoid a problem encountered in the studies discussed in Text 1.",
            "Text 2 explains a study that suggests an alternative explanation for the trend observed in the research discussed in Text 1.",
            "Text 2 discusses an observation that challenges the validity of the findings described in Text 1.",
            "Text 2 presents a finding that casts doubt on the generalizability of the research discussed in Text 1."
        ],
        "answer": 3,
        "difficulty": "Hard",
        "id": "pt1-m2-q6",
        "passage": "Text 1\n\nSidebells wintergreen (Orthilia secunda) plants are native to Alaska, where harsh conditions have historically impeded potential invasive species. As the boreal climate has warmed in recent decades, however, Siberian peashrub (Caragana arborescens) plants have established themselves in Alaska. Previous research conducted in non-boreal ecosystems has documented warming-induced increases in summer temperatures benefiting invasive species more than native species.\n\nText 2\n\nAt a site near Fairbanks, Alaska, Christa Mulder and Katie Spellman tracked O. secunda and C. arborescens, along with other native and invasive species, over several years. They observed that although average summer temperatures were substantially higher in some years of the study than in others, neither O. secunda nor C. arborescens showed any significant variation in summer growth patterns from year to year."
    },
    {
        "num": 7,
        "type": "Reading",
        "question": "What does the text most directly suggest about translation apps?",
        "options": [
            "They have improved remarkably over time but remain insufficient to support the\ncomplexity called for in certain interactions.",
            "They are coming to be embraced by international tourists but are viewed with skepticism\nby many business professionals.",
            "They are becoming simpler to use but are inconsistent in how comprehensively they\ncover different languages.",
            "They have gained impressive capabilities but continue to be widely viewed as inadequate\nfor most practical purposes."
        ],
        "answer": 0,
        "difficulty": "Hard",
        "id": "pt1-m2-q7",
        "passage": "Linguist John McWhorter asserts that translation apps for smartphones and computers are\u2014\ndespite generally failing to convey many nuances\u2014increasingly obviating the need to learn\nnew languages. Advances in language processing technology have greatly boosted the\nutility of these apps for perfunctory tasks, like inquiring about an item on a menu, and\npassing interactions; be that as it may, richer communication (e.g., in business dealings or\nmeaningful personal exchanges) often hinges on conversational patterns and gradations of\nmeaning."
    },
    {
        "num": 8,
        "type": "Reading",
        "question": "Information in the text best supports which statement about Mohol bushbabies?",
        "options": [
            "lf increased lunar intensity imposed the same costs on the bushbabies that it imposes on\nwhite-throated woodrats, there would be no association between lunar intensity and the\nbushbabies\u2019 foraging.",
            "If the advantages that the bushbabies gain from increased lunar intensity explain the\nchange in their foraging behavior, those advantages are likely shared by some other species\nthat are not heavily reliant on vision.",
            "If increased lunar intensity creates any disadvantages for the bushbabies, those\ndisadvantages are more than compensated for by the advantages that the bushbabies gain.",
            "If the bushbabies\u2019 foraging behavior under increased lunar intensity actually reflects a\ncost-benefit trade-off, their behavior should be more similar to that of white-throated\nwoodrats than it is."
        ],
        "answer": 2,
        "difficulty": "Hard",
        "id": "pt1-m2-q8",
        "passage": "Optimal foraging theory (OFT) holds that animals\u2019 foraging behaviors reflect cost-benefit\ntrade-offs that vary by species and with dynamic ecological circumstances. One such\ncircumstance is lunar intensity, which Mary V. Price and colleagues found to be negatively\nassociated with foraging by white-throated woodrats but Simon Kenneth Bearder and\ncolleagues found to be positively associated with foraging by Mohol bushbabies. This\ndiscrepancy is explicable in terms of OFT: the bushbabies\u2019 greater reliance on vision means\nthat higher lunar intensity benefits them more than it benefits the woodrats."
    },
    {
        "num": 9,
        "type": "Reading",
        "question": "Which choice most effectively uses data from the table to complete the text?",
        "options": [
            "biochar and NPK fertilizer.",
            "biochar and compost.",
            "biochar alone.",
            "compost alone."
        ],
        "answer": 1,
        "difficulty": "Hard",
        "id": "pt1-m2-q9",
        "passage": "__TABLE__\nEffect of Various Soil Treatments on Mean Pineapple Fruit Weight and Size\n\nSoil treatment | Weight (grams) | Length (centimeters) | Diameter (centimeters)\n--- | --- | --- | ---\nControl | 825.9 | 6.14 | 13.63\nBiochar | 915.7 | 6.56 | 13.63\nCompost | 864.8 | 6.15 | 13.22\nBiochar and compost | 979.3 | 6.76 | 13.68\nBiochar and NPK fertilizer | 1032.1 | 6.78 | 13.96\n__ENDTABLE__\n\nWorking in Ghana, Emmanuel Hanyabui and colleagues compared the impact on pineapple growth of different combinations of soil additives, including NPK fertilizer (an inorganic fertilizer containing nitrogen, phosphorus, and potassium), organic compost, and biochar (a carbon-rich material produced from organic waste matter). Based on data in the table, pineapple farmers with no access to inorganic soil additives would likely increase the weight and size of their fruits by the greatest amount by using"
    },
    {
        "num": 10,
        "type": "Reading",
        "question": "Which choice best presents a conclusion about the habits of New Year's resolution makers that is best supported by information in the text and the table?",
        "options": [
            "The majority of US adults who make resolutions related to health and exercise also make resolutions in multiple additional categories.",
            "Resolution makers between the ages of 50 and 64 are more likely to make resolutions related to personal relationships and less likely to make resolutions related to finances than resolution makers between the ages of 30 and 49 are.",
            "Among all US adults, people become less likely to make New Year's resolutions as they age, regardless of the type of resolution.",
            "Resolution makers between the ages of 18 and 29 are more likely to make resolutions about health and exercise than resolution makers between the ages of 30 and 49 are."
        ],
        "answer": 1,
        "difficulty": "Hard",
        "id": "pt1-m2-q10",
        "passage": "__TABLE__\nPercentages of New Year's Resolution Makers Who Make Certain Kinds of Resolutions\n\nType of resolution | Age 18-29 | Age 30-49 | Age 50-64 | Age 65+\n--- | --- | --- | --- | ---\nHealth and exercise | 79 | 80 | 79 | 76\nFinances | 68 | 63 | 56 | 47\nPersonal relationships | 63 | 53 | 58 | 52\nHobbies | 65 | 53 | 51 | 45\n__ENDTABLE__\n\nA Pew Research Center survey conducted in January 2024 found that three out of ten US adults make at least one New Year's resolution (a promise for the year ahead), while half of those who make a resolution make more than one. The survey asked participants what kinds of resolutions they made and separated them into several categories. The table presents percentages of people who make particular kinds of New Year's resolutions among those who choose to make them, indexed by age bracket."
    },
    {
        "num": 11,
        "type": "Reading",
        "question": "Which quotation from a literary scholar would most directly support the claim in the underlined portion of the text?",
        "options": [
            "\u201cMuch of the interest of Beloved derives from the productive tension between its\ncompeting influences\u2014namely, Black American cultural traditions and the magical realism of\nLatin America.\u201d",
            "\u201cThe cultural traditions of the Black American community, which figure so prominently in\nthe magical realist tradition of Latin America, permit realistic as well as antirealistic scenarios\n\u2014much as Beloved does.\"",
            "\u201cEven though Beloved alternates between realistic and antirealistic modes of\nrepresentation, the influence of Black American cultural traditions remains constant\nthroughout the novel.\u201d",
            "\u201cAlthough much of Beloved conforms to the conventions of realistic fiction, Toni Morrison\nalso incorporates elements drawn from Black American cultural traditions that transcend and\nexpose the limitations of realism.\u201d"
        ],
        "answer": 3,
        "difficulty": "Hard",
        "id": "pt1-m2-q11",
        "passage": "Scholars cite One Hundred Years of Solitude, the 1967 novel by Colombian author Gabriel\nGarcia Marquez, as a foundational text of magical realism, the Latin American style of fiction\nin which antirealistic plot devices\u2014often borrowed from the spiritual and narrative traditions\nof Indigenous and colonial societies in the Americas\u2014are deployed in an otherwise realistic\nmode of representation typical of the modern novel. This style has exerted a decisive\ninfluence on authors in the United States, including Toni Morrison, whose 1987 novel\nBeloved resembles classic magical realist novels in its juxtaposition of literary realism with\nlong-established cultural traditions\u2014namely, those of the Black American community."
    },
    {
        "num": 12,
        "type": "Reading",
        "question": "Which choice most logically completes the text?",
        "options": [
            "if each ecotype is indeed locally adapted as the researchers hypothesized, those\nadaptations are to other environmental conditions than the water each ecotype inhabits.",
            "while the ecotypes are genetically and geographically distinct, those differences do not\nrepresent adaptations to local environmental conditions.",
            "there may not be significant differences in the water that each ecotype inhabits, but there\nare significant differences in each ecotype\u2019s resistance to zinc pollution.",
            "although the researchers\u2019 hypothesis does not appear to be supported, this may be\nbecause the levels of zinc exposure the plants in the experiment received did not match their\nexposure in their natural environments."
        ],
        "answer": 0,
        "difficulty": "Hard",
        "id": "pt1-m2-q12",
        "passage": "Duckweed is a small freshwater plant that is often exposed to zinc pollution. Sofia Vamos\nand colleagues collected samples of four duckweed ecotypes (genetically and\ngeographically distinct populations within a species), along with water from each ecotype\u2019s\nhabitat. Hypothesizing that each ecotype is adapted to its local conditions in ways that\nbolster its growth and resistance to pollutants, the researchers grew each ecotype in all four\nwater samples and with three levels of zinc (none, low, high). (The researchers did not\nreplicate local differences in light or temperature.) They found that the ecotypes grew\nequally well in all four water samples and that adding zinc consistently enhanced growth,\nregardless of concentration, suggesting that ______."
    },
    {
        "num": 13,
        "type": "Reading",
        "question": "Which choice most logically completes the text?",
        "options": [
            "the percentage of blue-feathered females will increase until fewer than half of adult\nfemale jacobins are green-feathered.",
            "the occurrence of blue head plumage in adult female jacobins is driven by one or more\nfactors not associated with mate attraction.",
            "coloration prevents green-feathered adult female jacobins from distinguishing between\nadult males and blue-feathered adult females.",
            "adult male jacobins do not act antagonistically toward juvenile jacobins with blue head\nplumage when competing for resources."
        ],
        "answer": 1,
        "difficulty": "Hard",
        "id": "pt1-m2-q13",
        "passage": "As juveniles, all white-necked jacobin hummingbirds display vibrantly blue head plumage;\nwhen they enter adulthood, males retain these blue feathers and most females molt to a\ndrab green hue. However, 28% of adult female jacobins remain identical in coloration to\njuveniles and adult males. Based on field observations in Panama, a team of researchers\nreports that while adult males show a clear preference in mate selection for adult females\nwith drab green feathers, they also engage in more antagonistic behavior toward those adult\nfemales than toward blue-feathered adult females when competing for resources. Therefore,\nthe team hypothesizes that ______."
    },
    {
        "num": 14,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "century and",
            "century",
            "century,",
            "century;"
        ],
        "answer": 3,
        "difficulty": "Hard",
        "id": "pt1-m2-q14",
        "passage": "In Puerto Rico, it\u2019s not unusual for a city or town to be known by a nickname that corresponds to one of its notable features, like landscape, climate, famous residents, or chief export. For example, the Puerto Rican municipality of Manati is well known for its history as a cultural center in the early 20th _______ this distinction has earned it the fitting nickname of \u201cthe Athens of Puerto Rico.\u201d"
    },
    {
        "num": 15,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "nanoparticles properties",
            "nanoparticle\u2019s properties",
            "nanoparticles\u2019 properties\u2019",
            "nanoparticles\u2019 properties"
        ],
        "answer": 3,
        "difficulty": "Hard",
        "id": "pt1-m2-q15",
        "passage": "Working on an unimaginably small scale of billionths of a meter, nanoengineers have found ways to leverage ______ to facilitate energy generation in fuel cells."
    },
    {
        "num": 16,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "drum,",
            "drum:",
            "drum",
            "drum;"
        ],
        "answer": 1,
        "difficulty": "Hard",
        "id": "pt1-m2-q16",
        "passage": "Bertie Marshall, a key figure in the history of steel band music in Trinidad and Tobago, made\nseveral innovations to the steel ______ so the instrument could be easily transported during Carnival, a cover to protect the pans from the sun, and amplification so the sound of\nthe pans could be better heard over large crowds and other instrumentation."
    },
    {
        "num": 17,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "compounds, hexafluorobenzene (CgFg) and benzene (CgHe),",
            "compounds hexafluorobenzene (CgFg) and benzene (CgHe),",
            "compounds, hexafluorobenzene (CgFg) and benzene (CgHe)",
            "compounds hexafluorobenzene (CgFg) and benzene (CgHe)"
        ],
        "answer": 3,
        "difficulty": "Hard",
        "id": "pt1-m2-q17",
        "passage": "In a chemical equation, the value known as molar mass is useful for converting between the\nmass of the reactants and the mass of the product. The liquid ______ have molar masses of 186.06 and 78.12 g/mol, respectively."
    },
    {
        "num": 18,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "was dictating",
            "dictated",
            "dictating",
            "dictates"
        ],
        "answer": 3,
        "difficulty": "Hard",
        "id": "pt1-m2-q18",
        "passage": "The statement \u201call tarantulas are venomous\" is scientific because it could be proved false by\na single observation to the contrary, according to Karl Popper. Popper's theory ______ that scientific hypotheses must be refutable, termed the criterion of falsifiability, rejects the\nconfirmationist position that uses verifiability as the standard for scientific hypotheses."
    },
    {
        "num": 19,
        "type": "Reading",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "authors asserted",
            "authors were asserting",
            "authors, had asserted",
            "authors, asserting"
        ],
        "answer": 3,
        "difficulty": "Hard",
        "id": "pt1-m2-q19",
        "passage": "Geologist and scholar John Bostock joined with 55 other prominent British writers in 1837 to\npetition the US Congress for greater copyright protections. This cadre of renowned ______ that American publishers\u2019 appropriation of their work caused, in the words of the petition,\n\u201cdeep and extensive injuries...on their reputation and property,\u201d helped sow the seeds for the\nInternational Copyright Act of 1891."
    },
    {
        "num": 20,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "To date,",
            "For example,",
            "In other words,",
            "Rather,"
        ],
        "answer": 0,
        "difficulty": "Hard",
        "id": "pt1-m2-q20",
        "passage": "In 2003, some 393 years after Galileo Galilei and Simon Marius independently discovered\nJupiter's four largest moons (lo, Europa, Ganymede, and Callisto), scientists discovered the moon Helike in orbit around Jupiter. ______ researchers have discovered eighty moons\n\norbiting Jupiter."
    },
    {
        "num": 21,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "Instead,",
            "Furthermore,",
            "Thus,",
            "Similarly,"
        ],
        "answer": 2,
        "difficulty": "Hard",
        "id": "pt1-m2-q21",
        "passage": "The Hornbostel-Sachs system classifies musical instruments by how they produce sound.\nFor example, an instrument that is popular in Norway called the hardingfele produces sound\nprimarily through the vibration of its strings. ______ under the Hornbostel-Sachs system, the hardingfele is a chordophone."
    },
    {
        "num": 22,
        "type": "Reading",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "conversely,",
            "specifically,",
            "likewise,",
            "thus,"
        ],
        "answer": 0,
        "difficulty": "Hard",
        "id": "pt1-m2-q22",
        "passage": "Brain imaging research led by neuroscientist Dwaynica Greaves found that actors showed\nsuppressed responses in the left anterior prefrontal cortex (the portion of the brain\nassociated with self-awareness) when their names were called during performances; ______ the actors’ responses were normal in nonacting contexts. These findings suggest that when embodying characters, performers may temporarily set aside their personal identities."
    },
    {
        "num": 23,
        "type": "Reading",
        "question": "Which choice most effectively uses information from the given sentences to explain the 50 Completers hiking challenge to a new audience?",
        "options": [
            "Hikers aiming to count themselves among the 50 Completers must reach not only West Virginia's Spruce Knob but also the even higher peak of Mount Elbert in Colorado.",
            "Not until after you have reached the highest points in all fifty US states\u2014including Spruce Knob in West Virginia and Mount Elbert in Colorado\u2014can you include yourself among the 50 Completers of the Highpointers Club.",
            "If you are looking for a new hiking challenge, consider joining the Highpointers Club, as did In Suk Han, a hiker who successfully reached the highest point in every US state.",
            "On November 15, 2013, In Suk Han finally completed the feat of reaching the highest point in all fifty US states, including Spruce Knob in West Virginia and Mount Elbert in Colorado."
        ],
        "answer": 1,
        "difficulty": "Hard",
        "id": "pt1-m2-q23",
        "passage": "While researching a topic, a student has taken the following notes:\n\n\u2022 The Highpointers Club is a hiking club.\n\n\u2022 One of the main goals among club members is to reach the highest points in all fifty US states.\n\n\u2022 Those who achieve this are called 50 Completers.\n\n\u2022 In Suk Han became a 50 Completer on November 15, 2013.\n\n\u2022 The highest point in West Virginia is Spruce Knob, at 4,863 ft.\n\n\u2022 The highest point in Colorado is Mount Elbert, at 14,440 ft."
    },
    {
        "num": 24,
        "type": "Reading",
        "question": "Which choice most effectively uses information from the given sentences to introduce Marie Hall to a new audience?",
        "options": [
            "Of the 1,000 or so violins Antonio Stradivari made, only about 500 exist today.",
            "Marie Hall was a British violinist who once owned a Stradivarius violin.",
            "The Marie Hall Stradivarius is named after Marie Hall.",
            "Born in 1644, Antonio Stradivari was an Italian instrument maker whose violins are famous for their quality."
        ],
        "answer": 1,
        "difficulty": "Hard",
        "id": "pt1-m2-q24",
        "passage": "While researching a topic, a student has taken the following notes:\n\n\u2022 Antonio Stradivari (1644\u20131737) was an Italian instrument maker.\n\n\u2022 He made about 1,000 violins in his lifetime.\n\n\u2022 Musicians prize his Stradivarius violins for their famed sound quality.\n\n\u2022 The Marie Hall Stradivarius is named for former owner Marie Hall, a British violinist."
    },
    {
        "num": 25,
        "type": "Reading",
        "question": "The student wants to support Browner\u2019s claim about Louis Ballard's compositions. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
        "options": [
            "According to Browner, composer Louis Ballard, who wrote Desert Trilogy, relies on elements with origins in Native musical traditions.",
            "Browner posits that Louis Ballard's compositions rely on elements originating within Native musical traditions; Washington Festival Suite affirms this assertion, incorporating a Pueblo log drum.",
            "Classical composer Louis Ballard, who wrote Washington Festival Suite, was nominated for the Pulitzer Prize in music in 1971.",
            "Browner claims that Louis Ballard's compositions, one of which was nominated for the Pulitzer Prize, rely on elements originating within Native musical traditions."
        ],
        "answer": 1,
        "difficulty": "Hard",
        "id": "pt1-m2-q25",
        "passage": "While researching a topic, a student has taken the following notes:\n\n\u2022 Louis Ballard was a classical composer and citizen of the Quapaw Tribe.\n\n\u2022 Ballard's composition Desert Trilogy was nominated for the Pulitzer Prize in music in 1971.\n\n\u2022 His composition Washington Festival Suite incorporates a Pueblo log drum, a traditional Native instrument.\n\n\u2022 Ethnomusicologist Tara Browner claims that Ballard\u2019s compositions rely on elements originating within Native musical traditions."
    },
    {
        "num": 26,
        "type": "Reading",
        "question": "The student wants to present the study's research methods. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
        "options": [
            "To further analyze the origins of Earth\u2019s unique conditions, researchers focused on rocks\nfrom the Archean eon, when Earth's temperatures were extremely high.",
            "Birner\u2019s team analyzed the age and oxidation levels of rock samples collected from two\nseafloor ridges.",
            "Birner led a study to better understand the history of Earth's mantle and explain the\nconditions that allowed life to develop.",
            "By studying these ancient rocks, the team aimed to challenge previous theories about\nchanges in Earth's mantle over time."
        ],
        "answer": 1,
        "difficulty": "Hard",
        "id": "pt1-m2-q26",
        "passage": "While researching a topic, a student has taken the following notes:\n\ne Suzanne K. Birner led a study analyzing rocks on the seafloor to better understand the\nhistory of Earth's mantle.\n\ne Rock samples were collected from two seafloor ridges.\n\ne The researchers determined the samples\u2019 period of formation (the Archean eon) and\noxidation level (extremely low).\n\ne\u00a2 High temperatures in the Archean likely caused the rocks\u2019 low oxidation.\n\ne Birner\u2019s team suggests the oxidation of Earth's mantle has remained stable over time,\ncontrary to previous theories.\n\ne The findings help explain the unique conditions that allowed life to develop on Earth."
    },
    {
        "num": 27,
        "type": "Reading",
        "question": "The student wants to place the 1821 Declaration of Independence in the context of Valle’s changing political beliefs. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
        "options": [
            "A change in Valle’s political beliefs that occurred when the Spanish king repealed the 1812 constitution led to Valle writing Central America’s Declaration of Independence.",
            "Long an opponent of Central American independence, Valle changed his mind after an 1820 revolt and wrote the 1821 declaration.",
            "The writing of Central America’s Declaration of Independence may not have happened were it not for Colonel Riego's 1820 revolt.",
            "Colonel Riego’s revolt was the inspiration that Valle, a long-standing opponent of Central American independence, needed to change his political beliefs."
        ],
        "answer": 1,
        "difficulty": "Hard",
        "id": "pt1-m2-q27",
        "passage": "While researching a topic, a student has taken the following notes:\n\n\u2022 Leaders of the Province of Guatemala proclaimed independence for Central America from the Spanish Empire on September 15, 1821.\n\n\u2022 The accompanying Declaration of Independence was written by Honduran scholar and politician José Cecilio del Valle.\n\n\u2022 The 1812 Spanish Constitution had provided some degree of independence for Central America, but it was repealed by the Spanish king in 1814.\n\n\u2022 Valle, a loyal advisor to the Spanish Empire's administrators in Central America, had long opposed independence.\n\n\u2022 He changed his mind after Colonel Rafael del Riego’s 1820 revolt, which demanded the return of rights lost in 1814."
    }
];

const pt1_mathModule1: Question[] = [
    {
        "id": "pt1-math-m1-q1",
        "num": 1,
        "type": "Math",
        "question": "If 9x + 4 = 67, what is the value of 90x + 40?",
        "options": [
            "7",
            "70",
            "130",
            "670"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q2",
        "num": 2,
        "type": "Math",
        "image": "/math-bank/pt1-math-m1-q2.png",
        "question": "Note: Figure not drawn to scale. In the figure, line p is parallel to line r, and line t intersects both lines. What is the value of x?",
        "options": [
            "36",
            "72",
            "180",
            "252"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q3",
        "num": 3,
        "type": "Math (SPR)",
        "question": "A length of 450 meters is equal to how many decimeters? (1 meter = 10 decimeters)",
        "options": [],
        "answer": "4500",
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q4",
        "num": 4,
        "type": "Math (SPR)",
        "question": "The equation 58=2x+2y gives the perimeter of a rectangular garden that has length x, in feet, and width y, in feet. The width of the garden is 14 feet. What is the length, in feet, of the garden?",
        "options": [],
        "answer": "15",
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q5",
        "num": 5,
        "type": "Math",
        "question": "The relationship between the variables x and y is defined by an exponential equation. When x = 0, the value of y is 40, and for every increase in the value of x by 1, the corresponding value of y increases by 50% of its previous value. Which equation represents this relationship?",
        "options": [
            "y = 40(1.50)ˣ",
            "y = 40(1.05)ˣ",
            "y = 50(1.40)ˣ",
            "y = 50(1.04)ˣ"
        ],
        "answer": 0,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q6",
        "num": 6,
        "type": "Math (SPR)",
        "question": "The function f is defined by f(x) = 1 / (8x). What is the value of f(x) when x = 9?",
        "options": [],
        "answer": "0138",
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q7",
        "num": 7,
        "type": "Math",
        "question": "The function f is defined by f(x) = 3x − 1/4. What is the y-intercept of the graph of y = f(x) in the xy-plane?",
        "options": [
            "(0, −1/4)",
            "(0, −3)",
            "(0, 3)",
            "(0, 4)"
        ],
        "answer": 0,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q8",
        "num": 8,
        "type": "Math (SPR)",
        "question": "x + 6y = 28\n6y = 14\n\nThe solution to the given system of equations is (x, y). What is the value of x?",
        "options": [],
        "answer": "14",
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q9",
        "num": 9,
        "type": "Math",
        "question": "The length of a side of square X is 9 centimeters. The area of rectangle Y is 32 square centimeters. What is the total area, in square centimeters, of square X and rectangle Y?",
        "options": [
            "145",
            "113",
            "82",
            "81"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q10",
        "num": 10,
        "type": "Math",
        "question": "During hibernation, American black bears do not eat or replenish calories. A certain black bear weighed 293 pounds when entering hibernation and lost weight at a mean rate of 0.9 pounds per day. At this rate, how many days after entering hibernation would the black bear weigh 230 pounds?",
        "options": [
            "57",
            "63",
            "70",
            "207"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q11",
        "num": 11,
        "type": "Math",
        "image": "/math-bank/pt1-math-m1-q11.png",
        "question": "The complete graph of y=f(x) is shown. For how many values of x does f(x)=0?",
        "options": [
            "One",
            "Two",
            "Three",
            "Four"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q12",
        "num": 12,
        "type": "Math",
        "question": "b² + 4c = 7d. The given equation relates the real numbers b, c, and d, where d > 4c/7. Which equation correctly expresses b in terms of c and d?",
        "options": [
            "b = (7d + 4c) / 2",
            "b = (7d − 4c) / 2",
            "b = ±√(7d + 4c)",
            "b = ±√(7d − 4c)"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q13",
        "num": 13,
        "type": "Math",
        "question": "x² − 81/16 = 0. How many distinct real solutions does the given equation have?",
        "options": [
            "Zero",
            "Exactly one",
            "Exactly two",
            "Infinitely many"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q14",
        "num": 14,
        "type": "Math",
        "image": "/math-bank/pt1-math-m1-q14.png",
        "question": "Triangles ABC and A'B'C' are shown. Triangle ABC is dilated by a scale factor of 6 to form triangle A'B'C'. If the length of side AB is 18, what is the length of side A'B'?",
        "options": [
            "3",
            "6",
            "24",
            "108"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q15",
        "num": 15,
        "type": "Math (SPR)",
        "question": "What is the radius of the circle in the xy-plane defined by (x + 3)² + (y + 9)² = 361?",
        "options": [],
        "answer": "19",
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q16",
        "num": 16,
        "type": "Math",
        "question": "In the xy-plane, which of the following does NOT contain any points that are part of the solution set to 5x − 7y > 35?",
        "options": [
            "The x-axis",
            "The region where x>0 and y>0",
            "The region where x<0 and y<0",
            "The region where x<0 and y>0"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q17",
        "num": 17,
        "type": "Math",
        "image": "/math-bank/pt1-math-m1-q17.png",
        "question": "The table shows the distribution of people in a certain city by age group. If a person in this city is selected at random, which of the following is closest to the probability of selecting a person who is greater than 65 years old, given that the person is at least 18 years old?",
        "options": [
            "0.24",
            "0.32",
            "0.50",
            "0.92"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q18",
        "num": 18,
        "type": "Math",
        "question": "Line h is defined by (1/2)x + (1/9)y − 54 = 0. Line j is perpendicular to line h in the xy-plane. What is the slope of line j?",
        "options": [
            "−9/2",
            "−2/9",
            "9/2",
            "2/9"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q19",
        "num": 19,
        "type": "Math",
        "question": "Data set: a, 26, 29, b, 31, 47, c. The data values are listed in ascending order, where a, b, and c are constants. For this data set, the mean is 36, the median is 29, and the range is 72. What is the value of c?",
        "options": [
            "54",
            "72",
            "81",
            "98"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q20",
        "num": 20,
        "type": "Math (SPR)",
        "image": "/math-bank/pt1-math-m1-q20.png",
        "question": "Note: Figure not drawn to scale. In right triangle QRS shown, QR < RS and RS = 37. Which expression represents the length of QS?",
        "options": [
            "37 sin(Q)",
            "37 / sin(Q)",
            "37 cos(Q)",
            "37 / cos(Q)"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q21",
        "num": 21,
        "type": "Math",
        "question": "A certain town has an area of 4.29 square miles. What is the area, in square yards, of this town? (1 mile = 1,760 yards)",
        "options": [
            "410",
            "7,550",
            "722,051",
            "13,288,704"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt1-math-m1-q22",
        "num": 22,
        "type": "Math",
        "question": "x² − 2x = 28. What is one of the solutions to the given equation?",
        "options": [
            "√28",
            "1 + √29",
            "29",
            "28 + √2"
        ],
        "answer": 1,
        "difficulty": "Medium"
    }
];

const pt1_mathModule2: Question[] = [
    {
        "id": "pt1-math-m2-q1",
        "num": 1,
        "type": "Math",
        "question": "Zuri has a goal to run at least 16 miles per week while training for a race. This week, she has run 4 miles. If x represents the additional number of miles Zuri needs to run this week to meet her goal, which inequality represents this situation?",
        "options": [
            "4 − x ≤ 16",
            "4 + x ≤ 16",
            "4 − x ≥ 16",
            "4 + x ≥ 16"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q2",
        "num": 2,
        "type": "Math",
        "image": "/math-bank/pt1-math-m2-q2.png",
        "question": "Note: Figure not drawn to scale. In the figure shown, line k intersects lines r and s. If w = 147, which additional piece of information is sufficient to prove that lines r and s are parallel?",
        "options": [
            "x = 33",
            "y = 147",
            "w + y = 180",
            "y + z = 180"
        ],
        "answer": 1,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q3",
        "num": 3,
        "type": "Math",
        "image": "/math-bank/pt1-math-m2-q3.png",
        "question": "At a fundraiser, a family pays a fixed entrance fee. They then purchase food tickets, which each have the same cost. The table shows the relationship between the number of food tickets, x, that are purchased and the total amount paid y, in dollars, for both the entrance fee and the food tickets. Which equation represents the relationship between x and y?",
        "options": [
            "y = (3/2)x + 29",
            "y = (3/2)x − 56",
            "y = (2/3)x + 112/3",
            "y = (2/3)x + 58/3"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q4",
        "num": 4,
        "type": "Math",
        "image": "/math-bank/pt1-math-m2-q4.png",
        "question": "A group of 10 gardeners recorded data on the germination rates of their tomato crop for one growing season. The scatterplot shows the relationship between the number of tomato seeds planted, x, and the number of tomato seeds that germinated, y, for each of the gardeners. A line of best fit is also shown. Which of the following is the best interpretation of the slope of the line of best fit in this context?",
        "options": [
            "The number of tomato seeds planted is predicted to increase by 60 seeds every 100 days.",
            "The number of tomato seeds planted is predicted to increase by 300 seeds every 100 days.",
            "The number of tomato seeds that germinate is predicted to increase by 60 seeds for every additional 100 tomato seeds that are planted.",
            "The number of tomato seeds that germinate is predicted to increase by 300 seeds for every additional 100 tomato seeds that are planted."
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q5",
        "num": 5,
        "type": "Math (SPR)",
        "question": "The graph of 2x+y=11 in the xy-plane is a line. What is the slope of the line?",
        "options": [],
        "answer": "-2",
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q6",
        "num": 6,
        "type": "Math",
        "question": "f(x) = 2x + 3\ng(x) = 7x − 2\nh(x) = 5x + 6\n\nThe functions f, g, and h are defined as shown. If f(x) · g(x) − h(x) = ax² + bx + c, where a, b, and c are constants, what is the value of b?",
        "options": [
            "-5",
            "12",
            "20",
            "22"
        ],
        "answer": 1,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q7",
        "num": 7,
        "type": "Math",
        "question": "The function f is defined by f(x) = (x + 11) / 5, and f(a) = −18, where a is a constant. What is the value of a?",
        "options": [
            "−101",
            "−79",
            "−79/5",
            "−7/5"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q8",
        "num": 8,
        "type": "Math",
        "image": "/math-bank/pt1-math-m2-q8.png",
        "question": "The table shows values of x and their corresponding values of y for three points on line j in the xy-plane. Line k also lies in the xy-plane and is defined by the equation y=4x. At what point (x,y) do lines j and k intersect?",
        "options": [
            "(5,20)",
            "(5, -44)",
            "(6, 24)",
            "(6, 26)"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q9",
        "num": 9,
        "type": "Math (SPR)",
        "question": "h(t) = −16t² + b. The function h estimates an object's height, in feet, above the ground t seconds after the object is dropped, where b is a constant. The function estimates that the object is 19.36 feet above the ground when it is dropped at t = 0. How many seconds after being dropped does the function estimate the object will hit the ground?",
        "options": [],
        "answer": "1.1",
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q10",
        "num": 10,
        "type": "Math",
        "question": "|4x − 3| = −9. How many solutions does the given equation have?",
        "options": [
            "Zero",
            "One",
            "Two",
            "Infinitely many"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q11",
        "num": 11,
        "type": "Math",
        "question": "The function h is defined by h(x) = aˣ + b, where a and b are positive constants. The graph of y = h(x) in the xy-plane passes through the points (0, 10) and (2, 13). What is the value of ab?",
        "options": [
            "13",
            "18",
            "20",
            "26"
        ],
        "answer": 1,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q12",
        "num": 12,
        "type": "Math (SPR)",
        "question": "A circle has center P, and points A and B lie on the circle. The measure of arc AB is 45° and the length of arc AB is 4π units. What is the length, in units, of the radius of the circle?",
        "options": [],
        "answer": "16",
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q13",
        "num": 13,
        "type": "Math",
        "question": "The function f is defined by f(x) = 56(0.19)ˣ. For any positive integer n, the value of f(n) is p% less than the value of f(n − 1). What is the value of p?",
        "options": [
            "19",
            "44",
            "56",
            "81"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q14",
        "num": 14,
        "type": "Math",
        "question": "x² + √(k − 3) · x + 42 = 0. In the given equation, k is a constant. The equation has exactly one real solution. What is the value of k?",
        "options": [
            "171",
            "168",
            "165",
            "45"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q15",
        "num": 15,
        "type": "Math",
        "question": "x² + y² = 36\ny = mx + b/4\n\nIn the given system of equations, m and b are negative constants. In the xy-plane, the graphs of the equations in the given system intersect at the point (−5, y), where y < 0. Which expression represents the value of b?",
        "options": [
            "−5m/4 + √11/4",
            "5m/4 − √11/4",
            "−20m + 4√11",
            "20m − 4√11"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q16",
        "num": 16,
        "type": "Math",
        "question": "A biologist mixed a solution that is 0.3% sodium chloride by mass with a solution that is 0.15% sodium chloride by mass to obtain a new solution, which has a mass of 80 grams and contains 0.21 grams of sodium chloride. How many grams of 0.3% sodium chloride solution did the biologist use?",
        "options": [
            "0.14",
            "20",
            "60",
            "79.86"
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q17",
        "num": 17,
        "type": "Math",
        "image": "/math-bank/pt1-math-m2-q17.png",
        "passage": "For data set A, the table summarizes the distribution of the number of pieces of mail received by a business each day during a period of 11 days.",
        "question": "The data value 13 is removed from data set A to create data set B, which consists of the remaining 10 data values. Which statement best compares the median of data set A and the median of data set B?",
        "options": [
            "The median of data set B is less than the median of data set A.",
            "The median of data set B is greater than the median of data set A.",
            "The median of data set B is equal to the median of data set A.",
            "There is not enough information to compare the medians of the two data sets."
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q18",
        "num": 18,
        "type": "Math",
        "question": "x/5 + y/9 = 47/45. An engineer connects resistors in series, where the resistors in the series have a total resistance of 47/45 ohms. In this series, there are resistors of type A, which each have a resistance of a ohms, and y resistors of type B, which each have a resistance of b ohms. The given equation represents this situation. According to this equation, what is the positive difference between the value of a and the value of b?",
        "options": [
            "47",
            "4",
            "47/45",
            "4/45"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q19",
        "num": 19,
        "type": "Math (SPR)",
        "question": "9x² + 8 = nx. In the given equation, n is a constant. The equation has exactly one solution. What is the value of n²/8?",
        "options": [],
        "answer": "36",
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q20",
        "num": 20,
        "type": "Math",
        "passage": "__TABLE__\nRectangle | Area | Perimeter\n--- | --- | ---\nA | 630 square inches | 210 inches\nB | 2,520 square inches | n inches\n__ENDTABLE__",
        "question": "The table gives the areas and perimeters of two similar rectangles, where n is a constant. What is the value of n?",
        "options": [
            "2,100",
            "1,680",
            "840",
            "420"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q21",
        "num": 21,
        "type": "Math (SPR)",
        "question": "The mass of object A is 444% of the mass of object B, and the mass of object A is 0.740% of the mass of object C. If the mass of object C is p% of the mass of object B, what is the value of p?",
        "options": [],
        "answer": "60000",
        "difficulty": "Hard"
    },
    {
        "id": "pt1-math-m2-q22",
        "num": 22,
        "type": "Math",
        "question": "Which expression is a factor of y²(x − 3) − 25(x − 3)³?",
        "options": [
            "y(x-3)",
            "(x-5)(x-3)",
            "y+x-3",
            "y+5x-15"
        ],
        "answer": 3,
        "difficulty": "Hard"
    }
];

const pt2_englishModule1: Question[] = [
    {
        "id": "pt2-reading-m1-q1",
        "num": 1,
        "type": "Reading and Writing",
        "passage": "Scientists have used machine learning tools to study elephant sounds, uncovering a\n\nsophisticated communication system. The tools ______ unique patterns in the rumbling sounds elephants make. The scientists claim that these patterns are specific calls the\nelephants use for individuals, similar to names.",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "created",
            "corrected",
            "detected",
            "scattered"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q2",
        "num": 2,
        "type": "Reading and Writing",
        "passage": "The following text is from Chinua Achebe\u2019s 1964 novel Arrow of God. The novel is set in\nNigeria in the 1920s. Ezeulu, who is the religious leader for several villages, announces when\nthe annual yam harvest can begin.\nWhenever Ezeulu considered the immensity of his power over the year and the\ncrops and, therefore, over the people he wondered if it was real. It was true he\nnamed the day for the feast of the Pumpkin Leaves and for the New Yam feast;\nbut he did not choose it. He was merely a watchman. His power was no more than\nthe power of a child over a goat that was said to be his.\n\n\u00a91964 by Chinua Achebe",
        "question": "As used in the text, what does the word \u201cconsidered\u201d most nearly mean?",
        "options": [
            "Pondered",
            "Anticipated",
            "Allowed",
            "Respected"
        ],
        "answer": 0,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q3",
        "num": 3,
        "type": "Reading and Writing",
        "passage": "The following text is adapted from John Matheus\u2019s 1925 short story \u201cFog.\u201d\n\nThe fog extended its tentacles over city and river, gradually obliterating traces of familiar landscapes. At five-thirty the old Panhandle bridge, supported by massive sandstone pillars, stalwart, as when erected fifty years before to serve a generation now passed behind the portals of life, had become a spectral outline against the sky.",
        "question": "As used in the text, what does the word \u201ctraces\u201d most nearly mean?",
        "options": [
            "Debris",
            "Copies",
            "Indications",
            "Remembrances"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q4",
        "num": 4,
        "type": "Reading and Writing",
        "passage": "Microplastics are a common pollutant in large masses of water like glaciers. High concentrations and _______ among particles\u2014variations in size, shape, and material\u2014make it onerous to comprehensively classify the microplastics in a water sample, so Ojeda-Benitez et al. are exploring a device to help quickly and accurately identify certain characteristics.",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "restraints",
            "inconsistencies",
            "incompatibilities",
            "disruptions"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q5",
        "num": 5,
        "type": "Reading and Writing",
        "passage": "The following text is adapted from Henry James's 1881 novel The Portrait of a Lady.\n\nEverything Osmond did was pose\u2014pose so subtly considered that if one were not on the lookout one mistook it for impulse. Ralph had never met a man who lived so much in the land of consideration. His tastes, his studies, his accomplishments, his collections, were all for a purpose.",
        "question": "As used in the text, what does the word \u201cconsideration\u201d most nearly mean?",
        "options": [
            "Deference",
            "Calculation",
            "Indecision",
            "Courtesy"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q6",
        "num": 6,
        "type": "Reading and Writing",
        "passage": "Adult glass eels can be found off the coast of Maine, but the eels begin their lives in the\nSargasso Sea, a biodiverse area in the North Atlantic Ocean where they are born and later\nreturn to breed. Though biologists believe they have identified the general area in the\nSargasso Sea that is crucial to the endangered eels\u2019 survival, little is yet known about how\nthe animals spawn there. Scientists believe that solving the mystery will lead to better\nconservation of glass eels and their habitat, helping, in turn, to sustain several other species\n\nthat rely on them as a food source.",
        "question": "Which choice best describes the function of the underlined portion in the text as a whole?",
        "options": [
            "It presents a finding from a study that identifies the circumstances required to ensure the\nsurvival of glass eels.",
            "It suggests that scientists are more concerned about other species than about glass eels\u2019\nhabitat.",
            "It indicates that the benefit of understanding glass eels\u2019 spawning behavior extends\nbeyond the eels.",
            "It discusses a role that glass eels and other species serve in supporting the ecosystem of\nthe Sargasso Sea."
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q7",
        "num": 7,
        "type": "Reading and Writing",
        "passage": "Tomi Adeyemi's first published work, the inventive West African-inspired fantasy novel\nChildren of Blood and Bone, has intriguing things to say about the relationship between\nidentity and power. Adeyemi works in a decades-long tradition going back to writers such as\nSamuel Delany and Octavia Butler, who wove cultural elements of the Black diaspora into\ntheir science fiction and fantasy in a movement known as Afrofuturism. At its core, the\nmovement is characterized by speculation, not just about distant futures or other planets but\nalso about alternate versions of our shared past. Afrofuturism\u2019s meditations on authority\nreinvigorate the creative potential of fiction.",
        "question": "Which choice best describes the overall structure of the text?",
        "options": [
            "It notes the political stance of an author, compares that author's book to other earlier\nworks, and then analyzes the influence of political events on the book.",
            "It praises a newly published author, compares that author with others who might appear\nsuperficially similar, and then points out the features of that author's work that make it\nunique.",
            "It introduces an intriguing debut work, contextualizes that work as part of an ongoing\nliterary tradition, and then describes important themes of that tradition.",
            "It summarizes a book, describes characteristics of the artistic movement of which the\nbook is a part, and then points out the features the book shares with more widely read\nworks."
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q8",
        "num": 8,
        "type": "Reading and Writing",
        "passage": "Founded in 1904, the Hispanic Society of America showcases the arts and cultures of\nSpanish-speaking and Portuguese-speaking regions around the world, including Latin\nAmerica. It is located in New York City and has more than 18,000 objects in its museum\ncollection. Since 2000, a number of other institutions devoted to Latino cultures have\nopened in the United States. A notable example is LA Plaza de Cultura y Artes in Los\nAngeles. It focuses on Mexican American art and culture.",
        "question": "Which statement about the Hispanic Society of America is best supported by the text?",
        "options": [
            "Its collection includes over 18,000 objects.",
            "It is no longer located in New York City.",
            "It was founded after 2000.",
            "It is visited by more people than any other Latino cultural institution in the US."
        ],
        "answer": 0,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q9",
        "num": 9,
        "type": "Reading and Writing",
        "passage": "In a 2024 study, Corrine Walsh and colleagues examined whether the composition of soil\nmicrobial communities could affect plants\u2019 flavor chemistry. Whereas Baslam et al. (2011)\nshowed that adding specific bacterial or fungal strains to soil can yield increased flavonoid\ncontent in spinach crops, Walsh and team applied intact microbial communities gathered\nfrom ecologically distinct settings across Colorado, including areas of ponderosa pine forest\nand irrigated pasture, to mustard plants and evaluated the flavor compounds in the plants\u2019\nseeds. This ensured that the microbial conditions in their experiment would better reflect the\nvariation and complexity of naturally occurring communities.",
        "question": "Based on the text, what is the most likely reason Walsh and colleagues chose to avoid the\nmethod used in the spinach study?",
        "options": [
            "The composition of microorganisms in the soil in the spinach study may not have been\nrepresentative of a naturally existing composition.",
            "The microbial community in the soil from the spinach study affected plants\u2019 nutrition, not\ntheir flavor chemistry.",
            "The microbial community in the soil from the spinach study likely included similar species\nto those in wild soils.",
            "The diversity of species of microorganisms in the soil from the spinach study was already\nabnormally high before the researchers added further microorganisms."
        ],
        "answer": 0,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q10",
        "num": 10,
        "type": "Reading and Writing",
        "passage": "Home Console and Computer Games of the 1980s\n\nApproximate number of\n\nTitle units sold worldwide Genre Developer\n; Nintendo\nSuper Mario Brothers 2 7,460,000 platformer EAD\nNintendo\nIce Hockey 2,420,000 sports\nR&D2\nWhere in the World Is .\n. 4,000,000 education Broderbund\nCarmen Sandiego?\n; Nintendo\nTetris 43,000,000 puzzle\nR&D1",
        "question": "Which choice most effectively uses data from the table to complete the statement?",
        "options": [
            "student is writing a paper on the global rise of the home video game industry during the\n1980s. The student is researching the relative popularity of various genres of console and\ncomputer games. Looking at the information in the table, the student finds that the games in\nthe genres of\n\nA. puzzle and sports sold nearly the same number of units.",
            "platformer and education sold nearly the same number of units.",
            "puzzle and platformer outsold the games in the other genres.",
            "platformer and sports outsold the games in the other genres."
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q11",
        "num": 11,
        "type": "Reading and Writing",
        "passage": "Mean Adhesion Strength of\nGraphite and Acrylamide Gel,\nat Varying Voltages\n\nwe 45\n& 40\n35\n\u00ae 30\n\u00ae 25\n% 20\nc 15\n$ 10\n\u00a3 5\n<0 5 1 2 3\nVoltage (V)\n\n\u2014A\u2014 graphite\u2014AAm pair\n\nWenhao Xu and colleagues demonstrated that applying a low direct current electrical field to\ngraphite (a conductor) and an acrylamide (AAm) gel can increase how strongly materials\nadhere to each other. At some voltages, adhesion strength\u2014as measured in kilopascals\n(kPa) of stress needed to pull the materials apart\u2014was high (more than 30 kPa). But the\nmere application of a direct current electrical field with positive voltage is not sufficient to\ncause increased adhesion, as evidenced by the fact that",
        "question": "Which choice most effectively uses data from the graph to complete the statement?",
        "options": [
            "at 0 V, mean adhesion strength was equal to O kPa.",
            "at 3 V, mean adhesion strength reached its highest observed level at approximately 30\nkPa.",
            "at 2 V, mean adhesion strength was lower than it was at both 1 V and 3 V.",
            "at 1 V, mean adhesion strength was approximately equal to adhesion strength at O V."
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q12",
        "num": 12,
        "type": "Reading and Writing",
        "passage": "__TABLE__\nEffect of Various Soil Treatments on Mean Pineapple Fruit Weight and Size\n\nSoil treatment | Weight (grams) | Length (centimeters) | Diameter (centimeters)\n--- | --- | --- | ---\nControl | 825.9 | 6.14 | 13.63\nBiochar | 915.7 | 6.56 | 13.63\nCompost | 864.8 | 6.15 | 13.22\nBiochar and compost | 979.3 | 6.76 | 13.68\nBiochar and NPK fertilizer | 1032.1 | 6.78 | 13.96\n__ENDTABLE__\n\nWorking in Ghana, Emmanuel Hanyabui and colleagues compared the impact on pineapple growth of different combinations of soil additives, including NPK fertilizer (an inorganic fertilizer containing nitrogen, phosphorus, and potassium), organic compost, and biochar (a carbon-rich material produced from organic waste matter). Based on data in the table, pineapple farmers with no access to inorganic soil additives would likely increase the weight and size of their fruits by the greatest amount by using",
        "question": "Which choice most effectively uses data from the table to complete the text?",
        "options": [
            "compost alone.",
            "biochar alone.",
            "biochar and compost.",
            "biochar and NPK fertilizer."
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q14",
        "num": 14,
        "type": "Reading and Writing",
        "passage": "Neuroscientist Artin Arshamian and his team sought to determine what affects a person's\nperception of an odor as pleasant: is it culture, personal taste, or aspects of human\nanatomy? The team assessed odor preferences in ten groups of people with different modes\nof living (urban, agricultural, and hunter-gatherer) including urban dwellers from a large city\nin Thailand and the Seri people from a small community in Mexico. The team observed that\nacross cultures, people generally rated odors about the same: vanillin, which smells like\nvanilla, was typically rated more pleasant than galbazine, which smells like peanuts. The team therefore concluded that ______.",
        "question": "Which choice most logically completes the text?",
        "options": [
            "culture likely plays more of a role in a person's perception of how pleasant an odor is than\ndoes human anatomy.",
            "a person's mode of living likely doesn\u2019t have a large influence on that person's perception\nof whether an odor is pleasant or unpleasant.",
            "a person who lives in an urban area is more likely to encounter the odor of vanillin than is\na person who lives in a small community.",
            "a person who perceives certain odors as pleasant will likely perceive the odors as roughly\nequal in pleasantness."
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q15",
        "num": 15,
        "type": "Reading and Writing",
        "passage": "Outi Tervo and team studied the effect of human-caused noise on narwhals (Vonodon\nmonoceros), arctic marine mammals that are sensitive to acoustic changes in their\nenvironment. Hypothesizing that elevated sound levels affect foraging among narwhals,\nTervo's team compared narwhal diving behaviors in natural sound conditions with those\nbehaviors in two human-caused sound exposure conditions\u2014ship sounds and ship sounds\ncoupled with sonic pulses. Both exposure conditions resulted in significant decreases in the\nnumber and target depth of deep dives (associated with foraging) relative to natural\nconditions. However, differences between diving behaviors in the two exposure types were\nnegligible, a finding that could be attributed to the fact that ______.",
        "question": "Which choice most logically completes the text?",
        "options": [
            "sonic pulses can be heard at significantly greater ocean depths than ship sounds can.",
            "ship sounds contribute so much to the overall sound level that the addition of sonic\npulses has little effect on the narwhals\u2019 auditory environment.",
            "narwhals forage at shallower depths in the presence of ship sounds alone than in the\npresence of ship sounds coupled with sonic pulses.",
            "the narwhals weren't as sensitive to human-caused sounds as the researchers had\npredicted."
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q16",
        "num": 16,
        "type": "Reading and Writing",
        "passage": "Jesse Trevifio's 1976 painting Mis Hermanos was featured in the Smithsonian\u2018s 2013\nexhibition Our America: The Latino Presence in American Art. The piece ______ for the exhibition by curator E. Carmen Ramos.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "is",
            "had been",
            "will be",
            "is being"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q17",
        "num": 17,
        "type": "Reading and Writing",
        "passage": "Mia Heavener's 2019 novel Under Nushagak Bluff, which takes place in a mid-twentieth-\ncentury rural Alaskan fishing ______ the story of three Yup\u2019ik women who grapple with the\nrise of commercial fisheries and other changes affecting their community.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "village: tells",
            "village. Tells",
            "village, tells",
            "village tells"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q18",
        "num": 18,
        "type": "Reading and Writing",
        "passage": "Many works of the Greek historian Strabo (1st century BCE) are _______, but his Geographica, a descriptive history of the ancient world, is an extant work: it can still be read.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "lost. Conversely,",
            "lost and conversely,",
            "lost, conversely,",
            "lost, and conversely"
        ],
        "answer": 0,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q19",
        "num": 19,
        "type": "Reading and Writing",
        "passage": "Enacted in 1944, Iceland\u2019s 4,089-word constitution, in contrast to Spain's, which was\nenacted in 1978 and contains a far greater number (17,608) of words, ______ as the 2nd shortest in the world. Such data are studied by constitutional scholars like George Tsebelis,\nwho can use them to draw broader conclusions.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "have ranked",
            "rank",
            "are ranking",
            "ranks"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q20",
        "num": 20,
        "type": "Reading and Writing",
        "passage": "Working on an unimaginably small scale of billionths of a meter, nanoengineers have found ways to leverage ______ to improve treatments for certain conditions related to\n\noxidative stress.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "nanoparticles\u2019 properties\u2019",
            "nanoparticles properties",
            "nanoparticles\u2019 properties",
            "nanoparticle\u2019s properties"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q21",
        "num": 21,
        "type": "Reading and Writing",
        "passage": "Recordings of electrical activity in the brain ______ increased activity in brain areas associated with suppressing motor functions.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "electrograms show that while responding to hypothetical match scenarios, the most\nhighly skilled soccer players have",
            "hypothetical match scenario responses show that the most highly skilled soccer players\ncaptured in electrograms have",
            "the most highly skilled soccer players responding to hypothetical match scenarios have\nelectrograms that show",
            "responses to hypothetical match scenarios show that the most highly skilled soccer\nplayers have electrograms with"
        ],
        "answer": 0,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q22",
        "num": 22,
        "type": "Reading and Writing",
        "passage": "A team led by Portuguese researcher Isabel C.F.R. Ferreira found that many species of mushrooms contain chemicals called phenolic compounds, such as cinnamic acid and catechin. Ferreira detected cinnamic acid in Agaricus blazei mushrooms and catechin in Lentinus edodes mushrooms. _______ phenolic compounds have also been detected in other types of fungi.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "For this reason,",
            "However,",
            "Nevertheless,",
            "For example,"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q23",
        "num": 23,
        "type": "Reading and Writing",
        "passage": "Resins play several important roles in maintaining the health of conifers and many other kinds of trees. _______ resins quickly seal wounds, which helps prevent harmful insects and fungi from entering trees. These sticky substances also help trees retain water that is needed for them to survive.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "Regardless,",
            "Next,",
            "However,",
            "For example,"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q24",
        "num": 24,
        "type": "Reading and Writing",
        "passage": "While some researchers have identified the planet Kepler-296e as potentially habitable, it\u2019s\nunlikely that humanity will be able to take advantage of its favorable conditions anytime soon\n\u2014it's 737 light years away. ______ humanity must first focus on making planets within our solar system more habitable.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "Likewise,",
            "Instead,",
            "For example,",
            "Next,"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q25",
        "num": 25,
        "type": "Reading and Writing",
        "passage": "The Tres Zapotes archaeological site is located in our home state of Veracruz, Mexico. ______ an 8.5-ton stone statue of a human head was left behind by the ancient Olmec\ncivilization. In the nearby state of Tabasco was another stone statue that weighs 19.8 tons.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "In other words,",
            "Here,",
            "Similarly,",
            "Therefore,"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q26",
        "num": 26,
        "type": "Reading and Writing",
        "passage": "In a 1948 article titled \u201cThe Language of Lines,\u201d Brazilian photographer Jos\u00e9 Yalenti argued that black-and-white photography's distinctive\u2014and in his view, superior\u2014use of lines is what elevates the medium to the status of fine art. _______ Yalenti insisted that conveying perspective through linear forms is photography's \u201cindisputable and exclusive domain,\u201d creating a visual language surpassing even celebrated painters\u2019 works.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "Indeed,",
            "In any case,",
            "However,",
            "Even so,"
        ],
        "answer": 0,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q27",
        "num": 27,
        "type": "Reading and Writing",
        "passage": "While researching a topic, a student has taken the following notes:\n\n\u2022 A merchant ship is any ship hired to carry cargo or passengers.\n\n\u2022 A ship\u2019s carrying capacity is also known as its deadweight tonnage (DWT).\n\n\u2022 In 2021, there were a total of 1,323 merchant ships registered in the Bahamas.\n\n\u2022 The combined DWT of these ships was 74.3 million tons.",
        "question": "The student wants to emphasize the combined deadweight tonnage of the Bahamas\u2019 merchant ships in 2021. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
        "options": [
            "The carrying capacity of a merchant ship is also known as deadweight tonnage.",
            "In 2021, the Bahamas had 1,323 merchant ships hired to carry cargo or passengers.",
            "Combined, the Bahamas\u2019 merchant ships had a deadweight tonnage of 74.3 million tons\nin 2021.",
            "There were a total of 1,323 merchant ships\u2014ships hired to carry cargo or passengers\u2014\nregistered in the Bahamas in 2021."
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-reading-m1-q28",
        "num": 28,
        "type": "Reading and Writing",
        "passage": "While researching a topic, a student has taken the following notes:\n\ne Louis Ballard was a classical composer and citizen of the Quapaw Tribe.\n\n\u00a2 Ballard's composition Desert Trilogy was nominated for the Pulitzer Prize in music in 1971.\n\ne His composition Washington Festival Suite incorporates a Pueblo log drum, a\ntraditional Native instrument.\n\ne\u00a2 Ethnomusicologist Tara Browner claims that Ballard's compositions rely on elements\noriginating within Native musical traditions.",
        "question": "The student wants to support Browner's claim about Louis Ballard\u2019s compositions. Which\nchoice most effectively uses relevant information from the notes to accomplish this goal?",
        "options": [
            "According to Browner, composer Louis Ballard, who wrote Desert Trilogy, relies on\nelements with origins in Native musical traditions.",
            "Browner posits that Louis Ballard's compositions rely on elements originating within\nNative musical traditions; Washington Festival Suite affirms this assertion, incorporating a\nPueblo log drum.",
            "Classical composer Louis Ballard, who wrote Washington Festival Suite, was nominated\nfor the Pulitzer Prize in music in 1971.",
            "Browner claims that Louis Ballard's compositions, one of which was nominated for the\nPulitzer Prize, rely on elements originating within Native musical traditions."
        ],
        "answer": 1,
        "difficulty": "Medium"
    }
];

const pt2_englishModule2: Question[] = [
    {
        "id": "pt2-reading-m2-q1",
        "num": 1,
        "type": "Reading and Writing",
        "passage": "Though copies of The Adventures of Indiana Jones in Wenceslas Square in Prague on\nJanuary 16, 1989\u2014an underground computer game that was created anonymously in 1989\nas an act of political protest against the authoritarian regime of what was then\nCzechoslovakia\u2014were originally distributed ______, the game is now readily available online for anyone to play.",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "succinctly",
            "dispassionately",
            "surreptitiously",
            "disingenuously"
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q2",
        "num": 2,
        "type": "Reading and Writing",
        "passage": "If some specific predictions in Alvin Toffler\u2019s 1970 book Future Shock seem ludicrous now\u2014\npeople do not wear paper clothing while living in underwater cities\u2014Toffler's fundamental\nclaim that rapid technological and social change will leave people feeling disoriented and\natomized seems, in our age of disequilibrium and fragmentation, remarkably ______.",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "prescient",
            "articulate",
            "iconoclastic",
            "equivocal"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q3",
        "num": 3,
        "type": "Reading and Writing",
        "passage": "Without a _______ demonstration of the logical certainty of the honeycomb conjecture, posed in the first century BCE, mathematicians\u2019 efforts until Thomas C. Hales presented the first valid proof of the conjecture in 1999.",
        "question": "Which choice completes the text with the most logical and precise word or phrase?",
        "options": [
            "defied",
            "prefigured",
            "epitomized",
            "displaced"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q4",
        "num": 4,
        "type": "Reading and Writing",
        "passage": "Establishing protected areas (PAs), such as Abrolhos Marine Park in Brazil, is a common\nconservation strategy, but because PAs restrict some kinds of economic activity, it\u2019s widely\nthought that they hinder economic development. This perception is driven in part by the fact\nthat economic assessments often don\u2019t capture the indirect effects of tourism linked to PAs.\nBut Heng Zhu et al. found that tourism associated with Abrolhos boosts local demand for\ngoods and services in other economic sectors, resulting in, for instance, increased income\nfrom fishing in nearby areas.",
        "question": "Which choice best describes the overall structure of the text?",
        "options": [
            "It states a hypothesis that accounts for why PAs generally negatively impact local\neconomies, outlines how a research team's findings support that hypothesis, and then\nsuggests how a novel methodology led a separate team of researchers to a different\nconclusion.",
            "It makes a generalization about the difficulty of using PAs to reconcile economic and\nconservation priorities, demonstrates why most PAs fall short of achieving that goal, and\nthen holds up a particular PA as an example of how that goal can be achieved.",
            "It introduces a widely held belief about the effect PAs have on the economy, proposes a\nreason for that belief's prevalence, and then details a study whose findings seemingly\nconflict with that belief.",
            "It explains how PAs typically affect economic development in the regions where they are\nestablished, summarizes the findings of several economic studies that support this\nexplanation, and then concedes that a particular PA is an exception to the general trend."
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q5",
        "num": 5,
        "type": "Reading and Writing",
        "passage": "Most Native languages belong to language families, or groups of languages whose structural\nand lexical correspondence likely derives from their descent from a single language spoken\nlong ago. A minority\u2014such as Washoe, which is spoken in California and Nevada, and\nChitimacha, which is spoken in Louisiana\u2014are isolates, having no demonstrable genealogical\nrelationship to other languages. Yet Washoe and Chitimacha, like all isolates, are potentially\nremnants of families whose other members vanished before the historical record could\nattest to them, perhaps through the geographical expansion of extant families.",
        "question": "Which choice best describes the function of the underlined sentence in the text as a whole?",
        "options": [
            "It implies that a nonisolate language may have influenced both Washoe and Chitimacha to\nsuch a degree that their relationship to their former families is no longer discernible.",
            "It suggests that the ancestral languages of both Washoe and Chitimacha were likely\nisolates that replaced nonisolate languages through geographic expansion in the distant\npast.",
            "It asserts that the historical record tends to overrepresent nonisolate languages relative to\nisolates, such that the origins of Washoe and Chitimacha are obscure to scholars in the\npresent day.",
            "It proposes that the distinction made between present-day nonisolate languages and\nisolates like Washoe and Chitimacha may not have been applicable in the distant past."
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q6",
        "num": 6,
        "type": "Reading and Writing",
        "passage": "Text 1\n\nGood art often challenges and disrupts social and aesthetic norms, but the creation of public\nart\u2014paintings, sculptures, and performance pieces displayed in nonmuseum or\nnontheatrical public settings\u2014typically requires broad agreement among artists, civic\nofficials, and community members about the works\u2019 message and artistic goals. Public art\n\nalmost inevitably provokes backlash.\n\nText 2\n\nPublic art is commonly displayed in spaces intended for purposes other than meaningful\naesthetic engagement. Some critics of public art therefore note that norm-defying pieces\nthat aren't effectively integrated within their surroundings in a manner that primes passersby\nto appreciate the pieces\u2019 merits (as is often the case) tend to be regarded more unfavorably\nthan similarly provocative art encountered in museums is.",
        "question": "Based on the texts, how would the critics mentioned in Text 2 most likely respond to the\nunderlined claim in Text 1?",
        "options": [
            "By disputing the notion that civic leaders and community members are easily placated by\nart that is intended mainly to reinforce social norms",
            "By agreeing with the idea that only works of art that are universally appealing are suitable\nfor displaying in public spaces",
            "By arguing that the reason members of the general public might disagree about a public\nartwork\u2019's merits is unrelated to the unconventionality of its appearance and ideas",
            "By contending that the kinds of reactions controversial public artworks often receive\naren't exclusively the result of attributes inherent in the works themselves"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q7",
        "num": 7,
        "type": "Reading and Writing",
        "passage": "The following text is adapted from Mark Twain's 1876 novel The Adventures of Tom Sawyer.\nAunt Polly is having dinner with Tom, her mischievous young nephew.\n\nAunt Polly asked [Tom] questions that were full of guile, and very deep\u2014for she\nwanted to trap him into damaging revealments. Like many other simple-hearted\nsouls, it was her pet vanity to believe she was endowed with a talent for dark and\nmysterious diplomacy, and she loved to contemplate her most transparent\ndevices as marvels of low cunning.",
        "question": "Which choice best describes how Aunt Polly is presented in the text?",
        "options": [
            "The narrator gently makes fun of Aunt Polly\u2019s mistaken confidence in her subtlety.",
            "The narrator humorously exaggerates Aunt Polly's view of herself as an intellectual.",
            "The narrator characterizes Aunt Polly as being excessively nosy about other people's\nprivate lives.",
            "The narrator emphasizes that Aunt Polly's intentions are good even when she behaves\nimpolitely."
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q8",
        "num": 8,
        "type": "Reading and Writing",
        "passage": "From petroleum refining to fuel for residential heating, hydrogen has many applications. Currently, producing hydrogen is carbon intensive, but Alexandra M. Oliveira is one of many scholars investigating the feasibility of large-scale production of hydrogen through electrolysis, a process that emits no carbon when renewable energy is used. Oliveira suggests that although some obstacles may prevent electrolytic hydrogen from dominating energy systems, there is utility in its ability to decarbonize the petroleum and heating industries, where reducing carbon emissions is especially challenging.",
        "question": "Which statement about the use of hydrogen in the petroleum and heating industries is most strongly supported by the text?",
        "options": [
            "The adoption of electrolytic hydrogen by these industries has been impeded by concerns about how carbon intensive its production is.",
            "Development of applications for electrolytic hydrogen is less advanced in these industries than it is in most other carbon-intensive industries.",
            "At least some of electrolytic hydrogen\u2019s potential to lessen these industries\u2019 carbon emissions is as yet unrealized.",
            "The fact that large-scale electrolytic hydrogen production is not yet available has limited these industries\u2019 interest in pursuing hydrogen-based applications."
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q9",
        "num": 9,
        "type": "Reading and Writing",
        "passage": "In subtropical Asia, Apis dorsata (giant honeybee) plays an essential role in pollinating a wide\nvariety of crops and wild plants. To study how different agricultural land covers affect the\nspecies, Rika Raffiudin and colleagues monitored the foraging activity of the bees as well as\nthe pollen content of the honey from A. dorsata colonies at two sites in Indonesia: Kampar,\ncharacterized by its surrounding monoculture farms (growing a single crop), and Kerinci, a\nforest-agriculture site where multiple crops, including hot peppers and coffee, are grown\nnearby. The researchers concluded that a lack of crop variety may reduce total pollen\ncollection by A. dorsata.",
        "question": "Which finding, if true, would most directly support the researchers\u2019 conclusion?",
        "options": [
            "Significantly fewer bees were observed engaging in foraging activities with the crops\nsurrounding Kerinci than with the crops surrounding Kampar.",
            "Honey samples from Kerinci bee colonies contained significantly higher concentrations of\npollen than honey samples from Kampar bee colonies did.",
            "Pollen in honey samples from Kampar bee colonies was predominantly sourced from a\nsingle plant species, whereas pollen in honey samples from Kerinci bee colonies was\nsourced from multiple different plant species.",
            "In one Kerinci bee colony, a greater proportion of bees returned to their nests with pollen\nthan returned without pollen, whereas the inverse was observed in a second Kerinci bee\ncolony."
        ],
        "answer": 1,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q10",
        "num": 10,
        "type": "Reading and Writing",
        "passage": "In 2009, the US state of Montana enacted rate stability regulations (RSRs), constraining\ninsurance companies\u2019 latitude to raise premiums (the recurring fees policyholders pay to\nmaintain insurance policies) once policies are in effect. Although RSRs are intended to\nbenefit consumers, Naoki Aizawa and Ami Ko note that RSRs could curtail insurers\u2019 profits to\nsuch a degree that insurers abandon the market, thereby reducing the competitive pressure\nthat typically restrains premium prices for newly issued policies. To determine whether this\noccurred in Montana, students first collect data on the number of insurers in the state for a\nfew years leading up to and following 2009 and the premium prices for new policies offered\nby those insurers.",
        "question": "Based on the text, what would be the most reasonable next step for the students to take to\naccomplish their goal?",
        "options": [
            "Compare changes over time in the premium price data the students have collected with\nchanges over time in premium prices for policies that were already in effect during the same\nperiod in an otherwise similar state that had not enacted RSRs",
            "Compare changes over time within each of the two types of data the students have\ncollected with changes over time in analogous data for the same period from an otherwise\nsimilar state that had not enacted RSRs",
            "Compare changes over time within each of the two types of data the students have\ncollected with changes over time in the same types of data from Montana for a period\nbeginning several years after 2009",
            "Compare changes over time in the insurer-number data the students have collected with\nchanges over time in insurer-number data from another state that enacted RSRs but not\nduring the same period"
        ],
        "answer": 1,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q11",
        "num": 11,
        "type": "Reading and Writing",
        "passage": "Variously, researchers have closely examined obsidian artifacts to understand ancient social\nand economic structures, as in Raymond V. Sidrys\u2019s 1976 study, or to glean aspects of\ncultural identity, as in Dennis Ogburn and colleagues\u2019 2009 study. Studies of the Malia\narchaeological site on the Mediterranean island of Crete have shown that significant\nchanges to building styles\u2014changes consistent with an influx of people from another culture\nelsewhere in the Mediterranean\u2014occurred from the Middle Bronze Age to the Late Bronze\nAge. In a 2022 study, however, Tristan Carter and Vassilis Kilikoglou found that obsidian-\nobject production methods at Malia stayed remarkably consistent during this architectural\ntransition, which they interpret as indicative of local cultural continuity in the Middle and Late\nBronze Ages.",
        "question": "Which finding, if true, would most directly weaken Carter and Kilikoglou\u2019s argument?",
        "options": [
            "The obsidian used to produce objects at Malia was transported to Crete from the same\nsource elsewhere in the Mediterranean throughout the Middle and Late Bronze Ages.",
            "The methods used to produce obsidian objects at Malia during the Middle and Late\nBronze Ages were also used by some other Mediterranean cultures in the period.",
            "The obsidian-object production method that was most common among other\nMediterranean cultures during the Middle and Late Bronze Ages was more efficient than the\nmethod used at Malia.",
            "Changes to buildings like those that occurred at Malia have not been linked to changes in\nobsidian-object production methods in other Mediterranean cultures during the Middle and\nLate Bronze Ages."
        ],
        "answer": 1,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q12",
        "num": 12,
        "type": "Reading and Writing",
        "passage": "The presence of other individuals of the same species has been observed to mitigate stress\nin highly social mammals. To investigate whether this phenomenon, known as social\nbuffering, also occurs in reptiles, researchers led by Chelsea E. Martin monitored stress\nresponses in wild southern Pacific rattlesnakes (Crotalus helleri) in three experimental\ntreatments: when alone, with a rope, and with a companion C. helleri. The researchers\ncompared the percent change between baseline and peak heart rate in response to a\n(harmless) disturbance, with higher values indicating higher stress levels.",
        "question": "Which finding, if true, would most directly support the idea that social buffering occurs\namong C. helleri?",
        "options": [
            "Average peak heart rates were highest among solitary C. helleri, but no differences were\nobserved in average peak heart rates between C. helleri with a companion and C. helleri with\na rope.",
            "C. helleri with a companion displayed a lower average baseline heart rate and lower\naverage peak heart rate than did solitary C. helleri or C. helleri with a rope.",
            "The average percent change in heart rate was lower among C. helleri with a companion\nthan among solitary C. helleri and C. helleri with a rope.",
            "Solitary C. helleri had higher average baseline heart rates than did C. helleri in the other\ntreatments, but the average percent change in heart rate was smaller among solitary C.\nhelleri than among C. helleri with a companion."
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q13",
        "num": 13,
        "type": "Reading and Writing",
        "passage": "__TABLE__\nHighest Major Summits in India\n\nSummit | Elevation (meters) | Mountain range | Prominence (meters)\n--- | --- | --- | ---\nKangto | 7,060 | Assam Himalaya | 2,195\nSaser Kangri III | 7,495 | Saser Karakoram | 850\nLangpo | 6,965 | Sikkim Himalaya | 560\nSri Kailash | 6,932 | Garhwal Himalaya | 1,092\nMount Lakshmi | 6,983 | Rimo Karakoram | 800\n__ENDTABLE__\n\nMountain summits are often described in terms of their elevation, or height above sea level. But a summit's elevation may not be as good an indication of how high the mountain appears to observers as is the summit\u2019s prominence, or its height above its surroundings, and these values can differ significantly. For example, the Indian mountain of",
        "question": "Which choice most effectively uses data from the table to complete the example?",
        "options": [
            "Saser Kangri III has an elevation of 7,495 meters but a considerably lower prominence of 850 meters.",
            "Kangto has a much higher prominence than does Langpo.",
            "Kangto has a high prominence but is from a different mountain range than Mount Lakshmi, which has a lower prominence.",
            "Sri Kailash has an elevation of 6,932 meters and is considered the highest mountain from the Garhwal Himalaya range."
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q14",
        "num": 14,
        "type": "Reading and Writing",
        "passage": "Whereas Joan Lockard's 1984 study of captive gorillas reported more right-handedness\nthan left-handedness, Jane Goodall's 1963 study of wild chimpanzees did not. According to\na meta-analysis of studies of nonhuman primates, captive populations are more likely to be\ndescribed as right-handed than wild populations are. Statistical analysis indicates a\nhandedness study would need a minimum of 176 individuals to show a representative result;\nhowever, the study by Lockard included a total population of 8, and the study by Goodall included a total population of 8. This suggests that ______.",
        "question": "Which choice most logically completes the text?",
        "options": [
            "neither the study by Lockard nor the study by Goodall provides sufficient evidence to\nmake a meaningful comparison about handedness in primates.",
            "the study by Lockard reliably represents handedness in captive primates, but the study by\nGoodall likely does not reliably represent handedness in wild primates.",
            "Goodall likely underestimated the prevalence of right-handedness among the wild\nchimpanzees in the study.",
            "the study by Lockard reliably represents handedness in captive primates but not in wild\nprimates."
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q15",
        "num": 15,
        "type": "Reading and Writing",
        "passage": "Interested in how the color of dogs\u2019 irises affects human responses to dogs, Akitsugu Konno\net al. showed images of 12 dogs\u2019 faces to human participants and asked them to rate the\ndogs\u2019 kindness and trustworthiness as well as the likelihood that they would interact with or\nkeep the dogs. The researchers had previously adjusted the images so that each dog was\npresented in two versions, one with light irises and one with dark irises. They distributed the\nimages such that no participant saw both the light and dark versions of the same dog. Konno\net al. found that participants responded more positively to the latter. The study\u2019s design\nallowed the researchers to exclude the possibility that the results ______.",
        "question": "Which choice most logically completes the text?",
        "options": [
            "may have been different if participants had been able to see the dogs\u2019 irises in person\ninstead of only seeing images that included the dogs' irises.",
            "reflected a preference on the part of participants for facial features that happened to\ncoincide with dark irises in the dogs depicted in the images.",
            "were a function of participants emphasizing the colors of the dogs' irises over the dogs\u2019\nkindness and trustworthiness when reacting to the images.",
            "could be explained by participants having preexisting positive feelings about dogs with\ndark irises or preexisting negative feelings about dogs with light irises."
        ],
        "answer": 1,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q16",
        "num": 16,
        "type": "Reading and Writing",
        "passage": "Growing as large as three meters in diameter, the leaves of the giant Amazonian waterlily feature a complex network of radiating veins that provide structural _______ in thickness from the center to the edges, these veins allow the leaves to maintain their large size and buoyancy with minimal material, optimizing light capture and photosynthesis.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "support. Decreasing",
            "support, decreasing",
            "support, while decreasing",
            "support decreasing"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q17",
        "num": 17,
        "type": "Reading and Writing",
        "passage": "Charles Dickens's classic 1850 novel about a young man named David Copperfield has a title\nthat is instantly recognizable to many readers: David Copperfield. Dickens's novel originally had a different ______; while writing and editing, Dickens had planned to call the novel Mag\u2019s\nDiversions.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "title, though;",
            "title, though,",
            "title; though",
            "title, though"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q18",
        "num": 18,
        "type": "Reading and Writing",
        "passage": "On Guard is a 1997 photograph by Iranian artist Shirin Neshat. Like many of Neshat's photos,\nthe work features a pair of hands. Clasping a microphone, one hand ______ and the other covered in Persian script, the hands imply an out-of-frame figure on the edge of speaking.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "is bare and the other is",
            "bare, the other is",
            "bare and the other",
            "is bare, the other"
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q19",
        "num": 19,
        "type": "Reading and Writing",
        "passage": "The exoplanet Pi Mensae d was discovered using an indirect approach to planetary\ndetection, the radial velocity method. Compared to that of the direct imaging method, ______ is detected by the effect these exoplanets have on nearby stars.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "the detection of distant exoplanets, too dim to be observed in the radial velocity method's\nvast zone of discovery, is based on",
            "the radial velocity method's zone of discovery is vast, as distant exoplanets too dim to be\nobserved are detected by",
            "the radial velocity method, with its vast zone of discovery, detects exoplanets that are too\ndim to be observed by",
            "distant exoplanets too dim to be observed are detected within the radial velocity method\u2019s\nvast zone of discovery through"
        ],
        "answer": 1,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q20",
        "num": 20,
        "type": "Reading and Writing",
        "passage": "In the eastern Chinese city of Suzhou, known as a hub for silk manufacturing, a unique tradition of embroidery ______ back over two thousand years—one that includes iconic\n\ndouble-sided stitching with different images on each side\u2014remains popular with modern\naudiences, preserving the city\u2019s cultural heritage.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options": [
            "dates",
            "date",
            "has dated",
            "dating"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q21",
        "num": 21,
        "type": "Reading and Writing",
        "passage": "Giant dust plumes from the Sahara Desert that blow across the Atlantic Ocean can have\ncomplex and opposing effects on tropical cyclones. On one hand, the dust can ______ enhance the formation of ice clouds in the cyclone\u2019s core, increasing precipitation. the dust can\nlower sea surface temperatures around the cyclone's core, weakening the storm.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "In other words,",
            "For example,",
            "On the other hand,",
            "Previously,"
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q22",
        "num": 22,
        "type": "Reading and Writing",
        "passage": "moon Pasiphae in orbit around Jupiter. ______ researchers have discovered eighty moons orbiting Jupiter.",
        "question": "Which choice completes the text with the most logical transition?\nIn 1908, some 298 years after Galileo Galilei and Simon Marius independently discovered\nJupiter's four largest moons (lo, Europa, Ganymede, and Callisto), scientists discovered the",
        "options": [
            "To date,",
            "In other words,",
            "For example,",
            "Rather,"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q23",
        "num": 23,
        "type": "Reading and Writing",
        "passage": "When ordering the branches of the Colville River system, cartographers tend to begin with the riverway’s lowest point, the Colville River. ______ hydrologists begin at the top of the\n\nriver system, with the Siksikpuk River and other tributaries fed by the riverway\u2019s source,\nAlaska\u2019s De Long Mountains.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "In a similar way,",
            "For example,",
            "By contrast,",
            "In other words,"
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q24",
        "num": 24,
        "type": "Reading and Writing",
        "passage": "The Sultanate of Brunei, a Malay sea power based on the northern coast of Borneo that\nreached its height around 1600 CE, is considered a thalassocracy\u2014a geopolitical entity\nwhose hegemony resulted from control of the sea rather than of land. Historians classify\nthalassocracies as distinct from tellurocracies, or land-based powers. the Ottoman Empire (1300s—1900s CE) is known for both land and sea supremacy. ______",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "For example, tellurocracies have long overpowered their rivals:",
            "Likewise, thalassocracies are sea-based powers:",
            "In other words, empires are classified according to their source of power:",
            "Of course, the distinction is not always so neat:"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q25",
        "num": 25,
        "type": "Reading and Writing",
        "passage": "While researching a topic, a student has taken the following notes:\n\ne The farm-size transition hypothesis predicts that economic pressures associated with\nmodernization result in smaller farms amalgamating into larger-scale commercial\nfarms.\n\ne Masters et al. (2013): The average farm size in Asia \u201calready has or will soon begin to\nrise.\u201d\n\n\u00a2 Promkhambut et al. (2023) argue that small rice farms in Thailand have adopted\nmodern farming methods without a significant scaling-up of farm size.\n\n\u00a2 Promkhambut et al.: \u201cThe persistence of [small] rice farms [in Thailand] does not\nrepresent a \u2018failure\u2019 to modernize...or a \u2018truncated\u2019 transition\u2014it is a response to\nmodernization.\u201d",
        "question": "The student wants to make and support a claim regarding the applicability of the farm-size\ntransition hypothesis to Thailand. Which choice most effectively uses relevant information\nfrom the notes to accomplish this goal?",
        "options": [
            "Taken together, the studies by Masters et al. and Promkhambut et al. suggest that rice\nfarms in Thailand have responded to the economic pressures associated with modernization\nby expanding in size.",
            "The predicted shift to large-scale commercial farming may not hold true for rice farms in\nThailand, where, according to Proomkhambut et al., rice farms have remained small as they\u2019ve\nmodernized.",
            "Masters et al. report that the average farm size \u201calready has or will soon begin to rise\u201d in\nAsia, a finding that is consistent with the farm-size transition hypothesis.",
            "Although the farm-size transition hypothesis may be applicable to some countries in Asia,\nit is inconsistent with the development of rice farming in Thailand."
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-reading-m2-q26",
        "num": 26,
        "type": "Reading and Writing",
        "passage": "While researching a topic, a student has taken the following notes:\n\n\u00a2 Melissa Cody is a Din\u00e9 (Navajo) textile artist known for blending traditional\nDin\u00e9 designs (stripes, zigzags, and diamond patterns) with nontraditional elements.\n\n\u00a2 Cody's work incorporates arrangements of shapes or text inspired by video game\ngraphics and pop culture references.\n\n\u00a2 Cody: \u201cI'ma child of \u201880s video game culture...| grew up with this world of pixelization.\u201d\n\n\u00a2 Cody: \u201cThe things we consider tradition now weren't considered tradition when they\nfirst came about.\u201d\n\ne Her tapestry Only Love Can Break Your Heart features pop song lyrics in a blocky\ndigital font over a jagged diamond pattern.\n\n\u00a2 Her tapestry Walking Off No Water Mesa features rectangular panes revealing a\nstylized landscape patterned by contrasting colored diamonds.",
        "question": "The student wants to connect a quotation to a particular nontraditional design element in\nCody's work. Which choice most effectively uses relevant information from the notes to\naccomplish this goal?",
        "options": [
            "Cody's tapestry Only Love Can Break Your Heart features a jagged diamond pattern, a\ntraditional design element that \u201cwe consider tradition now.\u201d",
            "The pop song lyrics in a blocky digital font in Only Love Can Break Your Heart reflect\nCody's childhood familiarity with blocky video game graphics\u2014what she calls \u201cthis world of\npixelization.\u201d",
            "According to Cody, some elements of Walking Off No Water Mesa, such as contrasting\ncolored diamonds, \u201cweren't considered tradition when they first came about.\u201d",
            "Cody's background as \u201ca child of \u201880s video game culture\u201d factored into her decision to\nblend traditional and nontraditional design elements in Walking Off No Water Mesa."
        ],
        "answer": 1,
        "difficulty": "Hard"
    }
];

const pt2_mathModule1: Question[] = [
    {
        "id": "pt2-math-m1-q1",
        "num": 1,
        "type": "Math (SPR)",
        "question": "y=9zxr+ 19\n\nOne of the two equations in a system of linear equations is given. The system has infinitely\nmany solutions. If the second equation in this system is y = ma + b, where m and b are\nconstants, what is the value of b?",
        "options": [],
        "answer": "19",
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q2",
        "num": 2,
        "type": "Math",
        "question": "lf 5a + 2 = 32, what is the value of 50x\u201d + 20?",
        "options": [
            "6",
            "60",
            "70",
            "320"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q3",
        "num": 3,
        "type": "Math",
        "question": "In each of the following data sets of 5 values, p is a constant. Which of these data sets has\nthe largest standard deviation?",
        "options": [
            "p\u20144,p,p,p,p+4",
            "p\u20141,p-\u20141,p,p+1,p+1",
            "PPP. Pi P",
            "p\u20145,p\u20144,p,pt+4,p+5\n\nA jar has 430 marbles, and 20% of these marbles are blue. How many marbles in the jar are\nblue?\n\nA. 86\nB. 172\nC. 215\n\nD. 410\n\n\nr+g< 56\n\nFor which of the following tables are all the values of 7 and their corresponding values of g\nsolutions to the given inequality?\n\nA.\n\n[ele\n=]2]4/>|\n\n~[=] [>]\nBBS\n\nlelel\nelele|>\n\n=] >[e]>]\n\n\nAnnual sales\n(in millions of dollars)\n\nSquare footage of store\n(in thousands of square feet)\n\nThe scatterplot shows the relationship between the square footage of 12 clothing stores and\ntheir annual sales, in millions of dollars. According to the trend shown by the data, which of\nthe following is the best prediction for the annual sales, in millions of dollars, of a clothing\nstore that is 4 thousand square feet?\n\nA. 4.1\nB. 5.4\nC. 7.5\n\nD. 10.2\n\nx+y= 165\netyty=185\n\nThe solution to the given system of equations is (a, y). What is the value of y?"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q4",
        "num": 4,
        "type": "Math",
        "question": "The function f is defined by f(z) = 62 \u2014 + What is the y-intercept of the graph of\ny = f(z) in the xy-plane?",
        "options": [],
        "answer": 0,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q5",
        "num": 5,
        "type": "Math (SPR)",
        "question": "A total of 50 people attended a conference and were offered a choice of 4 types of entrees.\nThe table shows the number of people who chose each type of entree.\n\nType of entree | Number of people\nchicken \u00ab(| \u2014\u00ab20\n\nith\n\n| Total | 50\n\nIf one of these people is selected at random, what is the probability of selecting a person\nwho chose a vegetarian entree? (Express your answer as a decimal or fraction, not as a\npercent.)",
        "options": [],
        "answer": "0.18",
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q6",
        "num": 6,
        "type": "Math",
        "question": "In the figure shown, lines $p$ and $k$ are parallel and line $\\ell$ intersects both lines. If $z > 116$, which of the following must be true?",
        "options": [
            "$y < 64$",
            "$y > 64$",
            "$x+y < 180$",
            "$z+y > 180$"
        ],
        "answer": 0,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q7",
        "num": 7,
        "type": "Math",
        "question": "In the xy-plane, the graph of y = 2z intersects the graph of y = x\u201d \u2014 35 at two points.\nWhat is the sum of the x-coordinates of the two points of intersection?",
        "options": [
            "\u201435",
            "\u20145",
            "2",
            "7"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q8",
        "num": 8,
        "type": "Math (SPR)",
        "question": "The function f is defined by f(x) = 3(4 \u2014 x)\u201d + 3B. What is the value of f(4)?",
        "options": [],
        "answer": "13/4",
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q9",
        "num": 9,
        "type": "Math",
        "question": "tL\n\n[}_1_+_1__1___1__}_ 1} 1} 1} 1\n32 34 36 38 40 42 44 46 48 50\nShoal bass length (cm)\n\nA marine biologist is studying a habitat that contains shoal bass, a species of freshwater fish.\nThe box plot shown summarizes the lengths, in centimeters (cm), of a sample of 70 shoal\nbass from this habitat. What is the range, in cm, of the lengths of the shoal bass in the\nsample?",
        "options": [
            "10",
            "15",
            "29",
            "41"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q10",
        "num": 10,
        "type": "Math",
        "question": "In triangle $ABC$, the base $AC = 10$ cm. The area of triangle $ABC$ is 150 square centimeters. What is the height $h$, in centimeters, of this triangle?",
        "options": [
            "10",
            "15",
            "30",
            "60"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q11",
        "num": 11,
        "type": "Math",
        "question": "x? \u2014 2a = 29\nWhat is one of the solutions to the given equation?",
        "options": [
            "/29",
            "1+ /30",
            "30",
            "29+ /2"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q12",
        "num": 12,
        "type": "Math (SPR)",
        "question": "Circle A in the xy-plane has the equation (a + 8)\u201d + (y \u2014 8)\u201d = 25. Circle B has the same\ncenter as circle A. The radius of circle B is two times the radius of circle A. The equation\ndefining circle B in the xy-plane is (a + 8)\u201d + (y \u2014 8)\u201d = k, where k is a constant. What is\nthe value of k?",
        "options": [],
        "answer": "100",
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q13",
        "num": 13,
        "type": "Math",
        "question": "The graph of y = f(a) is shown in the xy-plane. For what value of x does f(x) = 0?",
        "options": [
            "\u20144",
            "0",
            "1",
            "4"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q14",
        "num": 14,
        "type": "Math",
        "question": "32\u201430|+3\nBe 30 \u20145\n\nWhat is the sum of the solutions to the given equation?",
        "options": [
            "1",
            "19",
            "20",
            "30"
        ],
        "answer": 2,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q15",
        "num": 15,
        "type": "Math",
        "question": "Line h is defined by 5a + zy \u2014 40 = 0. Line 7 is perpendicular to line h in the xy-plane.\nWhat is the slope of line 7?",
        "options": [
            "\u2014\n\nrolor",
            "\u2014\n\nofr",
            "dolor",
            "op"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q16",
        "num": 16,
        "type": "Math",
        "question": "The width of a rectangle is 16 inches less than 2 times its length, in inches. The area of the\nrectangle is 130 square inches. What is the width, in inches, of the rectangle?",
        "options": [
            "5",
            "10",
            "13",
            "18"
        ],
        "answer": 1,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q17",
        "num": 17,
        "type": "Math",
        "question": "A machine makes 8-inch, 9-inch, and 3-inch parts. During a certain day, the number of 8-\ninch parts that the machine makes is 5 times the number n of 9-inch parts, and the number\nof 3-inch parts is 4. During this day, the machine makes 100 parts total. Which equation\nrepresents this situation?",
        "options": [
            "8(5n) +9n+ 3(4) = 100",
            "82 + 9n + 3n = 100",
            "5n+4= 100",
            "6n + 4 = 100"
        ],
        "answer": 3,
        "difficulty": "Medium"
    },
    {
        "id": "pt2-math-m1-q18",
        "num": 18,
        "type": "Math",
        "question": "An exponential model for the number of squirrels in a certain area estimates that there were\n200 squirrels in the area in the year 2003, and that at the end of each 4-year period for the\nnext 20 years, the number of squirrels in the area was 120% more than the number at the\nend of the previous 4-year period. Which of the following equations represents this model,\nwhere N is the estimated number of squirrels in this area t years after 2003, and\n\n0<t< 20?\n\nA. N = 200(2.20)*\nAt\n\nB. N = 200(1.20)\n\nC. N = 200(1.20)#\n\nb. N = 200(2.20)#",
        "options": [],
        "answer": 3,
        "difficulty": "Medium"
    }
];

const pt2_mathModule2: Question[] = [
    {
        "id": "pt2-math-m2-q1",
        "num": 1,
        "type": "Math (SPR)",
        "question": "A line passes through the points (4, 7) and (18, 28) in the xy-plane. What is the slope of the\nline?",
        "options": [],
        "answer": "3/2",
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q2",
        "num": 2,
        "type": "Math",
        "question": "The length of a rectangle's diagonal is 1/106, and the length of one of the rectangle's sides\nis 9. What is the perimeter of the rectangle?",
        "options": [
            "106",
            "45",
            "28",
            "14\n\n\n(5a + 6)(8a \u2014 5) =0\nWhich of the following is a solution to the given equation?\n\n8\nA. \u2014=\nis)\n|\noa\n\nc. \u20143\n\n5\nD. se"
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q3",
        "num": 3,
        "type": "Math",
        "question": "The graph of 92 + y = 16 in the xy-plane is a line. What is the slope of the line?\n\nAnswer: -9\n\nx? + y* = 3,185\ny\u2014 8x =0\n\nA solution to the given system of equations is (a, y), where x < 0. What is the value of y?",
        "options": [
            "\u2014392",
            "\u201456",
            "\u20148",
            "\u20147\n\nAnswer: B"
        ],
        "answer": "-9",
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q4",
        "num": 4,
        "type": "Math",
        "question": "The function f is defined by f(z) = 244, and f(a) = \u201415, where ais a constant. What is\n\nthe value of a?\n\nA. \u201486\nB. \u201464\n\n64\nc, \u2014\n\n4\nD. \u2014=",
        "options": [],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q5",
        "num": 5,
        "type": "Math",
        "question": "The equation y = \u20144.9(a \u2014 8.9) + 12,400 gives the estimated height above ground, y, in\nmeters, of a plane, where \u00abx is the number of seconds since it started a parabolic maneuver.\nIf this equation is graphed in the xy-plane, which of the following is the best interpretation of\nthe vertex of the graph?",
        "options": [
            "The plane reached an estimated maximum height of 12,400 meters 4.9 seconds after it\nstarted the parabolic maneuver.",
            "The plane reached an estimated maximum height of 12,400 meters 8.9 seconds after it\nstarted the parabolic maneuver.",
            "The plane reached an estimated maximum height of 4.9 meters 12,400 seconds after it\nstarted the parabolic maneuver.",
            "The plane reached an estimated maximum height of 8.9 meters 12,400 seconds after it\nstarted the parabolic maneuver.\n\n\na(4 \u2014 x) = 28 \u2014 7x\n\nIn the given equation, a is a constant. The equation has exactly one solution. Which of the\nfollowing CANNOT be the value of a?\n\nA.1\nB.4\nC.7\n\nD. 28"
        ],
        "answer": 1,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q6",
        "num": 6,
        "type": "Math (SPR)",
        "question": "The function g is defined by g(x) = (a + 13)(t \u2014 x), where t is a constant. In the xy-plane,\nthe graph of y = g(x) passes through the point (24, 0). What is the value of g(0)?",
        "options": [],
        "answer": "312",
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q7",
        "num": 7,
        "type": "Math",
        "question": "In right triangle $QRS$ shown, $QR < RS$ and $RS = 23$. Which expression represents the length of $\\overline{QS}$?",
        "options": [
            "$23\\cos Q$",
            "$23\\sin Q$",
            "$\\dfrac{23}{\\cos Q}$",
            "$\\dfrac{23}{\\sin Q}$"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q8",
        "num": 8,
        "type": "Math",
        "question": "10\n\nNA+ OA 0\n\nThe graph of the equation y = 5\u201d + k is shown, where k is a constant. What is the value of\n\nk?",
        "options": [
            "\u20148",
            "\u20147",
            "7",
            "8"
        ],
        "answer": 0,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q9",
        "num": 9,
        "type": "Math",
        "question": "A beekeeper's initial observation of the population of a certain bee colony was 1,800 bees.\nThe beekeeper set a goal to increase the population to 3,300 bees. The beekeeper uses a\nmodel that predicts the population of this bee colony begins at 1,800 and increases by 120\nbees per week in the first two weeks after the initial observation, and then increases by 180\nbees per week until the beekeeper's goal is reached. According to this model, at the end of\nweek w after the initial observation, where w > 2, which of the following functions gives the\npredicted number of bees still needed to reach the beekeeper\u2019s goal?",
        "options": [
            "p(w) = 3,300 \u2014 180w",
            "p(w) = 3,180 + 180w",
            "p(w) = 1,620 \u2014 180w",
            "p(w) = \u2014120 + 180w"
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q10",
        "num": 10,
        "type": "Math",
        "question": "The function f is defined by f(a) = 55(0.19)\u201d. For any positive integer n, the value of\nf() is p% less than the value of f(m \u2014 1). What is the value of p?",
        "options": [
            "19",
            "45",
            "55",
            "81"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q11",
        "num": 11,
        "type": "Math (SPR)",
        "question": "r(x) = 13(a \u2014 2)\ns(x) =7\u00b0+ nx? +2nzxr+8\n\nFor the given functions r and s, n is a constant. If r(z) . s(x) = 13(x* \u2014 16), what is the\nvalue of n?",
        "options": [],
        "answer": "2",
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q12",
        "num": 12,
        "type": "Math",
        "question": "The triangle inequality theorem states that the sum of any two sides of a triangle must be\ngreater than the length of the third side. If a triangle has side lengths of 10 and 11, which\ninequality represents the possible lengths, x, of the third side of the triangle?",
        "options": [
            "xz < 21",
            "xz > 21",
            "1l<a2< 21",
            "2<lorz> 21"
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q13",
        "num": 13,
        "type": "Math (SPR)",
        "question": "An area of 58.00 square nautical miles is equivalent to k square kilometers. To the nearest\ntenth, what is the value of k? (1 nautical mile = 1.852 kilometers)",
        "options": [],
        "answer": "198.9",
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q14",
        "num": 14,
        "type": "Math (SPR)",
        "question": "A line in the xy-plane passes through the points (9, 1), (0, 8), and (c, 0). What is the value\nof c?",
        "options": [],
        "answer": "72/7",
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q15",
        "num": 15,
        "type": "Math",
        "question": "zy y _ Al\n7 +9 = $3\n\nAn engineer connects resistors in series, where the resistors in the series have a total\nresistance of ae ohms. In this series, there are x resistors of type A, which each have a\nresistance of a ohms, and y resistors of type B, which each have a resistance of b ohms. The\ngiven equation represents this situation. According to this equation, what is the positive\ndifference between the value of a and the value of b?",
        "options": [
            "41",
            "2\n41",
            "63\n\n2",
            "%"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q16",
        "num": 16,
        "type": "Math",
        "question": "The table gives the areas and perimeters of two similar rectangles, where n is a constant.\nArea (square inches) || Perimeter (inches)\nRectangle B 2,640 n\n\nWhat is the value of n?\n\ni\ni",
        "options": [
            "2,200",
            "1,760",
            "880",
            "440"
        ],
        "answer": 3,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q17",
        "num": 17,
        "type": "Math",
        "question": "In 2005, Aster earned 12% more than in 2004, and in 2006 Aster earned 6% more than in",
        "options": [],
        "answer": -1,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q18",
        "num": 18,
        "type": "Math",
        "question": "If Aster earned y times as much in 2004 as in 2006, which of the following is closest\nto the value of y?",
        "options": [
            "0.5000",
            "0.7200",
            "0.8423",
            "1.1872"
        ],
        "answer": 2,
        "difficulty": "Hard"
    },
    {
        "id": "pt2-math-m2-q19",
        "num": 19,
        "type": "Math",
        "question": "Which expression is a factor of y?(a \u2014 9) \u2014 36(a \u2014 9)\u00b0?",
        "options": [
            "y(z \u2014 9)",
            "(x \u2014 9)(x \u2014 6)",
            "yt+ax\u20149",
            "y+ 6x \u2014 54"
        ],
        "answer": 3,
        "difficulty": "Hard"
    }
];

export const practiceTests: PracticeTest[] = [
  {
    id: 1,
    title: "Practice Test 1",
    description: "Full-length Digital SAT practice test with Reading, Writing, and Math sections.",
    type: "Full Test",
    duration: "2h 14m",
    totalQuestions: 98,
    moduleCount: 4,
    color: "blue",
    sections: [
      {
        name: "Reading and Writing",
        modules: [
          { timeMinutes: 32, questions: pt1_englishModule1 },
          { timeMinutes: 32, questions: pt1_englishModule2 }
        ]
      },
      {
        name: "Math",
        modules: [
          { timeMinutes: 35, questions: pt1_mathModule1 },
          { timeMinutes: 35, questions: pt1_mathModule2 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Practice Test 2",
    description: "Full-length Digital SAT practice test with Reading, Writing, and Math sections.",
    type: "Full Test",
    duration: "2h 14m",
    totalQuestions: 98,
    moduleCount: 4,
    color: "blue",
    sections: [
      {
        name: "Reading and Writing",
        modules: [
          { timeMinutes: 32, questions: pt2_englishModule1 },
          { timeMinutes: 32, questions: pt2_englishModule2 }
        ]
      },
      {
        name: "Math",
        modules: [
          { timeMinutes: 35, questions: pt2_mathModule1 },
          { timeMinutes: 35, questions: pt2_mathModule2 }
        ]
      }
    ]
  }
];

export const satDates = [
    { month: 'AUG', date: 'August 23, 2025', target: '2025-08-23T08:00:00', registrationDeadline: 'August 8, 2025', lateRegistrationDeadline: 'August 12, 2025', changeDeadline: 'August 12, 2025' },
    { month: 'SEP', date: 'September 13, 2025', target: '2025-09-13T08:00:00', registrationDeadline: 'August 29, 2025', lateRegistrationDeadline: 'September 2, 2025', changeDeadline: 'September 2, 2025' },
    { month: 'OCT', date: 'October 4, 2025', target: '2025-10-04T08:00:00', registrationDeadline: 'September 19, 2025', lateRegistrationDeadline: 'September 23, 2025', changeDeadline: 'September 23, 2025' },
    { month: 'NOV', date: 'November 8, 2025', target: '2025-11-08T08:00:00', registrationDeadline: 'October 24, 2025', lateRegistrationDeadline: 'October 28, 2025', changeDeadline: 'October 28, 2025' },
    { month: 'DEC', date: 'December 6, 2025', target: '2025-12-06T08:00:00', registrationDeadline: 'November 21, 2025', lateRegistrationDeadline: 'November 25, 2025', changeDeadline: 'November 25, 2025' },
    { month: 'MAR', date: 'March 14, 2026', target: '2026-03-14T08:00:00', registrationDeadline: 'February 27, 2026', lateRegistrationDeadline: 'March 3, 2026', changeDeadline: 'March 3, 2026' },
    { month: 'MAY', date: 'May 2, 2026', target: '2026-05-02T08:00:00', registrationDeadline: 'April 17, 2026', lateRegistrationDeadline: 'April 21, 2026', changeDeadline: 'April 21, 2026' },
    { month: 'JUN', date: 'June 6, 2026', target: '2026-06-06T08:00:00', registrationDeadline: 'May 22, 2026', lateRegistrationDeadline: 'May 26, 2026', changeDeadline: 'May 26, 2026' },
    { month: 'AUG', date: 'August 22, 2026', target: '2026-08-22T08:00:00', registrationDeadline: 'August 7, 2026', lateRegistrationDeadline: 'August 11, 2026', changeDeadline: 'August 11, 2026' },
    { month: 'OCT', date: 'October 3, 2026', target: '2026-10-03T08:00:00', registrationDeadline: 'September 18, 2026', lateRegistrationDeadline: 'September 22, 2026', changeDeadline: 'September 22, 2026' },
    { month: 'NOV', date: 'November 7, 2026', target: '2026-11-07T08:00:00', registrationDeadline: 'October 23, 2026', lateRegistrationDeadline: 'October 27, 2026', changeDeadline: 'October 27, 2026' },
    { month: 'DEC', date: 'December 5, 2026', target: '2026-12-05T08:00:00', registrationDeadline: 'November 20, 2026', lateRegistrationDeadline: 'November 24, 2026', changeDeadline: 'November 24, 2026' },
    { month: 'MAR', date: 'March 13, 2027', target: '2027-03-13T08:00:00', registrationDeadline: 'February 26, 2027', lateRegistrationDeadline: 'March 2, 2027', changeDeadline: 'March 2, 2027' },
    { month: 'MAY', date: 'May 1, 2027', target: '2027-05-01T08:00:00', registrationDeadline: 'April 16, 2027', lateRegistrationDeadline: 'April 20, 2027', changeDeadline: 'April 20, 2027' },
    { month: 'JUN', date: 'June 5, 2027', target: '2027-06-05T08:00:00', registrationDeadline: 'May 21, 2027', lateRegistrationDeadline: 'May 25, 2027', changeDeadline: 'May 25, 2027' },
];

export const studyResources = [
    { id: 1, title: 'Grammar Rules Guide', description: 'Comprehensive guide to SAT grammar and punctuation rules.', category: 'English', icon: 'book-open', color: 'purple' },
    { id: 2, title: 'Reading Strategies', description: 'Techniques for active reading and passage analysis.', category: 'English', icon: 'eye', color: 'emerald' },
    { id: 3, title: 'SAT Vocabulary 500', description: 'Most frequently tested vocabulary words with examples.', category: 'English', icon: 'file-text', color: 'rose' },
];

