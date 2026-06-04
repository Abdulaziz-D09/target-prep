import { PracticeTest } from './questions';

export const baselineTest: PracticeTest = {
    id: 999,
    title: "SAT Baseline Diagnostic",
    description: "A 30-question diagnostic test to calibrate your initial roadmap.",
    type: "Diagnostic Test",
    duration: "35m",
    totalQuestions: 30,
    moduleCount: 2,
    color: "indigo",
    sections: [
        {
            name: "Reading and Writing",
            modules: [
                {
                    timeMinutes: 17,
                    questions: [
    {
        "id": "base-r-1",
        "type": "Reading",
        "passage": "The curator described the retrospective exhibition as _______ rather than chronological; instead of tracing the artist's biography in sequence, the show grouped works by recurring visual themes.",
        "question": "As used in the text, which word most logically completes the statement?",
        "options": [
            "linear",
            "thematic",
            "exhaustive",
            "commemorative"
        ],
        "answer": 1,
        "explanation": "The semicolon functions as a definition signal — 'grouped works by recurring visual themes' directly defines the missing word. Linear and chronological mean the same thing, so linear can't contrast with chronological. Exhaustive refers to completeness, not organizational structure. Commemorative describes intent to honor, not curatorial method.",
        "difficulty": "Easy",
        "calc": false
    },
    {
        "id": "base-r-2",
        "type": "Reading",
        "passage": "Her filmmaking style was unmistakably _______: she avoided narration and background music entirely, letting scenes unfold at their natural pace and trusting audiences to extract meaning without guidance.",
        "question": "As used in the text, which word most logically completes the statement?",
        "options": [
            "intrusive",
            "didactic",
            "minimalist",
            "frenetic"
        ],
        "answer": 2,
        "explanation": "The colon introduces a direct definition — 'avoided narration and music entirely' and 'trusting audiences' define a stripped-down, minimalist approach. Intrusive is the opposite (avoiding narration is explicitly non-intrusive). Didactic means heavily instructional, which contradicts 'trusting the audience to extract meaning without guidance.' Frenetic means frantic/energetic, the opposite of 'natural pace.'",
        "difficulty": "Easy",
        "calc": false
    },
    {
        "id": "base-r-3",
        "type": "Reading",
        "passage": "Cities tend to be significantly warmer than surrounding rural areas, a phenomenon scientists call the urban heat island effect. Researchers attribute this primarily to the prevalence of dark asphalt and concrete, which absorb and slowly re-radiate solar heat. Green infrastructure — including rooftop gardens and tree-lined streets — has been shown to measurably reduce local surface temperatures by providing shade and releasing water vapor.",
        "question": "Which choice best states the main idea of the text?",
        "options": [
            "Urban areas lack sufficient green space compared to surrounding rural communities.",
            "The replacement of natural surfaces with heat-absorbing materials elevates city temperatures, though green infrastructure can help reduce this effect.",
            "Concrete and asphalt are the most thermally efficient building materials ever developed.",
            "Rooftop gardens are the most cost-effective tool available for reducing urban temperatures."
        ],
        "answer": 1,
        "explanation": "The correct answer captures both the cause (heat-absorbing materials) and the solution (green infrastructure), reflecting all three sentences. Choice A is wrong because the text never frames urban/rural differences as a 'lack.' Choice C is wrong because the text says concrete absorbs heat but never calls it the 'most efficient' material 'ever developed' — this adds a superlative not in the text. Choice D is wrong because the passage mentions rooftop gardens as one example, never ranking it as most cost-effective.",
        "difficulty": "Easy",
        "calc": false
    },
    {
        "id": "base-r-4",
        "type": "Reading",
        "passage": "Although the senator's opening remarks were deliberately _______, her subsequent testimony became increasingly candid as the hearing progressed, ultimately revealing details her staff had urged her to withhold.",
        "question": "As used in the text, which word most logically completes the statement?",
        "options": [
            "forthright",
            "guarded",
            "verbose",
            "persuasive"
        ],
        "answer": 1,
        "explanation": "'Although' signals a contrast — 'candid' later in the sentence is the opposite of the missing word. The remarks were not candid initially; 'guarded' (cautious, withholding) is the antonym. Forthright means candid — students who miss the contrast signal 'although' will pick this. Verbose refers to wordiness, not openness of disclosure. Persuasive relates to convincing others, not the disclosure/candor contrast.",
        "difficulty": "Easy",
        "calc": false
    },
    {
        "id": "base-r-5",
        "type": "Reading",
        "passage": "Early naturalists who documented the platypus sent specimens back to Europe, where scientists initially assumed the animals were frauds — elaborate taxidermied fabrications designed to deceive. The platypus's combination of a duck-like bill, beaver-like tail, and otter-like fur seemed too contradictory to be real. Only after sustained observation of living animals in the field did the scientific community accept the platypus as a genuine species.",
        "question": "Which choice best describes the function of the third sentence in the text?",
        "options": [
            "It introduces a new classification theory that contradicts the claims made in the first sentence.",
            "It explains how the scientific skepticism described earlier was eventually overcome.",
            "It presents a hypothesis that remains controversial among modern zoologists.",
            "It summarizes the deceptive methods used by naturalists to mislead European scientists."
        ],
        "answer": 1,
        "explanation": "The third sentence resolves the narrative — scientists were skeptical (sentences 1–2), then accepted the platypus (sentence 3). This is a resolution function. No new theory is introduced — it describes the end of skepticism, not a new framework. The acceptance was complete, not controversial — choice C inverts the passage's conclusion. Choice D reverses who suspected whom: naturalists sent real specimens; European scientists suspected fraud.",
        "difficulty": "Easy",
        "calc": false
    },
    {
        "id": "base-r-6",
        "type": "Reading",
        "passage": "The ancient Roman aqueducts carried fresh water from mountain springs into city centers across the empire, [BLANK] some of these structures stretched over 90 kilometers in total length.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard Written English?",
        "options": [
            "and",
            "; some of",
            ", and yet some of",
            "— and some of"
        ],
        "answer": 1,
        "explanation": "Both clauses are independent. A semicolon correctly joins two closely related independent clauses without implying contrast or cause. Choice A (just 'and') without a comma creates a comma splice issue. Choice C ('and yet') implies contrast — the length is surprising despite something — but there is no contrast. Choice D (em-dash + 'and') is redundant; em-dashes introduce or emphasize material but don't need 'and' after them.",
        "difficulty": "Medium",
        "calc": false
    },
    {
        "id": "base-r-7",
        "type": "Reading",
        "passage": "A new study found that participants who exercised for 30 minutes before a cognitive task performed significantly better than those who did not. _______, the researchers noted that exercise type mattered: aerobic activity produced stronger results than resistance training.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "In contrast",
            "Furthermore",
            "As a result",
            "For example"
        ],
        "answer": 1,
        "explanation": "The second sentence adds an additional related finding from the same study. 'Furthermore' signals additive elaboration. 'In contrast' is wrong because the two findings don't oppose each other — both are about how exercise helps cognition. 'As a result' implies the second finding was caused by the first — they are parallel findings, not cause-and-effect. 'For example' would make the second sentence an illustration of the first, but aerobic vs. resistance is a new dimension, not an example of exercise-performance benefit.",
        "difficulty": "Medium",
        "calc": false
    },
    {
        "id": "base-r-8",
        "type": "Reading",
        "passage": "The expedition's findings challenged three long-held assumptions about deep-sea ecosystems [BLANK] sunlight is not required for photosynthesis-like energy production, chemosynthetic bacteria can support complex food webs, and certain invertebrates tolerate pressures that would crush surface dwellers.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard Written English?",
        "options": [
            ", and",
            ":",
            ";",
            "— and"
        ],
        "answer": 1,
        "explanation": "The first clause is a complete independent clause; what follows is a list that directly elaborates and defines 'three long-held assumptions.' A colon correctly introduces an elaborating list. Choice A (', and') creates a grammatical run-on. Choice C (semicolons) join two independent clauses — the second element here is a list, not a single clause. Choice D (em-dash + 'and') is redundant and stylistically informal for this context.",
        "difficulty": "Medium",
        "calc": false
    },
    {
        "id": "base-r-9",
        "type": "Reading",
        "passage": "Early clinical trials of the compound demonstrated highly promising results in isolated cell cultures. _______, experiments involving living organisms produced far less consistent outcomes, prompting the research team to redesign the molecule entirely.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "Similarly",
            "Therefore",
            "However",
            "Consequently"
        ],
        "answer": 2,
        "explanation": "The two sentences present a contrast: cell cultures showed positive results; living organisms showed inconsistent results. 'However' correctly signals reversal. 'Similarly' would imply organism trials also showed promising results — the opposite. 'Therefore' implies the inconsistent results logically followed from the promising ones; no causal link exists. 'Consequently' has the same causal error — the organism failures were not a consequence of the early success.",
        "difficulty": "Medium",
        "calc": false
    },
    {
        "id": "base-r-10",
        "type": "Reading",
        "passage": "The renovation project was completed three months ahead of schedule [BLANK] the project manager credited the team's early adoption of prefabricated building components for the accelerated timeline.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard Written English?",
        "options": [
            ", (comma only)",
            ";",
            ":",
            ", and yet"
        ],
        "answer": 1,
        "explanation": "Both clauses are fully independent. The second elaborates the first (explains why it finished early), making them closely related candidates for a semicolon join. Choice A (comma only) creates a comma splice — two independent clauses cannot be joined by comma alone. Choice C (colon) would work only if the second clause directly defines or lists items from the first; here, the second clause is a separate narrated event. Choice D ('and yet') signals contrast, but there is no contrast — the explanation is consistent with finishing early.",
        "difficulty": "Medium",
        "calc": false
    },
    {
        "id": "base-r-11",
        "type": "Reading",
        "passage": "Text 1\nThe population collapse of indigenous communities in the Americas following European contact was primarily driven by epidemic disease, for which native populations lacked prior immunity. Military conquest, while brutal, accounted for a relatively small fraction of documented deaths.\n\nText 2\nTo attribute the collapse of indigenous populations primarily to 'natural' disease transmission obscures the role of deliberate colonial violence in creating the conditions — forced displacement, coerced labor, systematic food deprivation — that rendered these populations catastrophically vulnerable to disease in the first place.",
        "question": "Based on the texts, how would the author of Text 2 most likely respond to the argument made in Text 1?",
        "options": [
            "By arguing that disease transmission rates among indigenous populations were lower than Text 1 estimates.",
            "By contending that colonial violence indirectly amplified disease mortality, making a clean separation of 'disease' and 'conquest' deaths misleading.",
            "By agreeing that disease was the primary cause of death but disputing the methodology used to count military casualties.",
            "By suggesting that indigenous populations could have developed immunity through earlier controlled exposure."
        ],
        "answer": 1,
        "explanation": "Text 2 doesn't dispute that disease killed more people — it argues that colonial conditions (violence, displacement) made disease so deadly. The distinction is: conquest created the vulnerability, so calling disease 'primary' and conquest 'small' is a false dichotomy. Text 2 never disputes transmission rates (choice A). Choice C is a 'sneaky agreement trap' — agreeing that disease was primary is exactly what Text 2 refuses to do. Choice D is complete fabrication — Text 2 doesn't discuss immunity development at all.",
        "difficulty": "Hard",
        "calc": false
    },
    {
        "id": "base-r-12",
        "type": "Reading",
        "passage": "A student researcher examining this data concludes: 'Increasing weekly SAT study hours consistently and proportionally raises a student's likelihood of scoring above 1400.'\n\n| Weekly Study Hours | Students Scoring Above 1400 |\n|---|---|\n| 0–2 hours | 4% |\n| 3–5 hours | 11% |\n| 6–8 hours | 18% |\n| 9–11 hours | 24% |\n| 12+ hours | 23% |",
        "question": "Which choice best describes data from the table that weakens this conclusion?",
        "options": [
            "The percentage of students scoring above 1400 increases from 4% at 0–2 hours to 24% at 9–11 hours, showing clear growth across most groups.",
            "Students studying 12 or more hours per week (23%) are slightly less likely to score above 1400 than students studying 9–11 hours (24%), breaking the pattern of consistent increase.",
            "The largest single-interval improvement occurs between the 0–2 and 3–5 hour groups, a jump of 7 percentage points.",
            "More than 75% of students in every study group score below 1400, regardless of time studied."
        ],
        "answer": 1,
        "explanation": "The conclusion requires consistent and proportional increase. The 12+ hour group (23%) scores lower than the 9–11 hour group (24%), directly breaking 'consistently.' This is the diminishing-returns signal the conclusion misses. Choice A supports the conclusion using most of the data — students who don't check the final row will pick this. Choice C also supports the conclusion (largest jump early = rapid gains). Choice D discusses absolute counts, not the trend across groups — irrelevant to whether study hours consistently raise scores.",
        "difficulty": "Hard",
        "calc": false
    },
    {
        "id": "base-r-13",
        "type": "Reading",
        "passage": "Psychologist Dr. Reyes has spent a decade studying urban noise exposure in elementary school children. She argues that chronic low-level noise — the kind produced by traffic, construction, and HVAC systems — impairs children's reading development not by damaging hearing, but by degrading their ability to distinguish phonemes, the individual sound units that underpin literacy.",
        "question": "Dr. Reyes's Claim: Chronic urban noise impairs reading development by specifically disrupting phonemic awareness, not by causing hearing loss.\n\nWhich quotation from a research study would most directly support Dr. Reyes's claim?",
        "options": [
            "'Children living near busy highways scored significantly lower on audiometric tests than those in quieter neighborhoods, suggesting measurable hearing impairment.'",
            "'Students in high-noise school environments demonstrated intact audiometric scores but significantly weaker performance on phoneme discrimination tasks compared to peers in quieter schools.'",
            "'Noise-exposed children showed reduced attention spans, which researchers hypothesize could affect reading performance through multiple pathways, including general cognitive fatigue.'",
            "'Parental education level and socioeconomic status were found to be stronger predictors of reading achievement than any environmental noise variable.'"
        ],
        "answer": 1,
        "explanation": "Choice B directly confirms both parts of the claim: (1) hearing is intact (no hearing loss) and (2) phoneme discrimination is weaker (phonemic awareness disrupted). Choice A actively undermines the claim — it shows hearing loss, which Dr. Reyes says is not the mechanism. Many students will pick A because it connects noise to reading impairment, missing the 'not by damaging hearing' qualifier. Choice C mentions 'multiple pathways' — too vague, doesn't specifically confirm phonemic awareness as the mechanism. Choice D introduces a confound that weakens rather than supports the claim.",
        "difficulty": "Hard",
        "calc": false
    },
    {
        "id": "base-r-14",
        "type": "Reading",
        "passage": "A student writing a research paper argues: 'Although Frida Kahlo is celebrated primarily for the autobiographical pain in her self-portraits, her political commitments were equally central to her artistic identity and visual language.'",
        "question": "Which quotation from a biography of Frida Kahlo would most effectively support the student's argument?",
        "options": [
            "'Kahlo completed approximately 55 self-portraits over her career, representing over a third of her total artistic output.'",
            "'Kahlo consistently embedded communist iconography, Mexican indigenous symbols, and anti-colonialist imagery into her work — including her most intimate self-portraits — making her political vision inseparable from her personal expression.'",
            "'Kahlo's near-fatal bus accident at age eighteen, and the physical pain she endured for the rest of her life, served as the emotional and visual foundation for nearly all of her mature work.'",
            "'Critics of the 1930s frequently dismissed Kahlo as a curiosity, overshadowed by her husband Diego Rivera, rather than recognizing her as an independent artistic force.'"
        ],
        "answer": 1,
        "explanation": "Choice B directly supports the 'political commitments were equally central' claim by showing political imagery embedded 'into her most intimate self-portraits' — exactly linking politics to the autobiographical work. Choice A confirms she's known for self-portraits but says nothing about political identity. Choice C actually works against the student's argument — it confirms the autobiographical pain narrative. Choice D discusses critical reception and gender bias — irrelevant to whether Kahlo's political beliefs were central to her artistic identity.",
        "difficulty": "Hard",
        "calc": false
    },
    {
        "id": "base-r-15",
        "type": "Reading",
        "passage": "A researcher claims: 'Daily independent reading of up to 60 minutes is associated with progressively higher mean reading scores; however, reading beyond that threshold is associated with a plateau or slight decline in scores.'\n\n| Daily Reading Time | Mean Reading Score |\n|---|---|\n| 0 minutes | 480 |\n| 15 minutes | 502 |\n| 30 minutes | 519 |\n| 45 minutes | 532 |\n| 60 minutes | 541 |\n| 75+ minutes | 538 |",
        "question": "Which choice most accurately uses data from the table to support the researcher's claim?",
        "options": [
            "Students who read for 75 or more minutes daily scored a mean of 538 points — higher than the mean of 480 for students who did not read at all — demonstrating an overall positive effect of reading.",
            "Mean scores rise steadily from 480 at 0 minutes to 541 at 60 minutes, then fall to 538 at 75+ minutes, consistent with the pattern of increase followed by plateau or slight decline the researcher describes.",
            "The largest score gain per additional 15 minutes occurs between 0 and 15 minutes of daily reading, a jump of 22 points, suggesting early reading time is the most impactful.",
            "Students reading 45 minutes daily scored higher than those reading 30 minutes, confirming a consistent linear relationship across all reading intervals."
        ],
        "answer": 1,
        "explanation": "Choice B accurately traces the full pattern: rise from 480 to 541 (0 to 60 min) and the slight drop to 538 at 75+, matching both halves of the researcher's two-part claim. Choice A uses only two data points (0 and 75+) and frames it as 'overall positive,' ignoring the plateau/decline the researcher specifically claims. Choice C is true but incomplete — only addresses the early gains; ignores the plateau/decline. Choice D contains a factual error — 'consistent linear relationship across all intervals' is false; the data shows diminishing returns and a reversal at 75+.",
        "difficulty": "Hard",
        "calc": false
    }
]
                }
            ]
        },
        {
            name: "Math",
            modules: [
                {
                    timeMinutes: 18,
                    questions: [
    {
        "id": "base-m-1",
        "type": "Math",
        "question": "If $3x + 7 = 22$, what is the value of $x$?",
        "options": [
            "3",
            "5",
            "7",
            "9"
        ],
        "answer": 1,
        "explanation": "$3x = 22 - 7 = 15$, so $x = 5$. Common errors: dividing 22 by 3 to get approximately 7 (choice C), or adding 7 instead of subtracting and making arithmetic errors (choice D).",
        "difficulty": "Easy",
        "calc": true
    },
    {
        "id": "base-m-2",
        "type": "Math",
        "question": "A plumber charges a flat fee of $45 plus $30 per hour of work. If a customer's total bill was $165, how many hours did the plumber work?",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "answer": 1,
        "explanation": "Set up the equation: $45 + 30h = 165$, so $30h = 120$, giving $h = 4$ hours. A common error is ignoring the flat fee and dividing $165 ÷ 30 = 5.5$, then rounding to 5 (choice C). Another error is dividing the total by the flat fee: $165 ÷ 45 ≈ 3.67$, rounding to 3 (choice A).",
        "difficulty": "Easy",
        "calc": true
    },
    {
        "id": "base-m-3",
        "type": "Math",
        "question": "If $\\frac{2x - 4}{3} = 8$, what is the value of $x$?",
        "options": [
            "10",
            "14",
            "16",
            "18"
        ],
        "answer": 1,
        "explanation": "Multiply both sides by 3: $2x - 4 = 24$, then $2x = 28$, so $x = 14$. A common error is forgetting to add 4 after getting $2x = 24$, giving $x = 12$, then incorrectly adding 4 to get 16 (choice C). Another error is multiplying 8 by 3 to get 24, then dividing by 2 to get 12, then adding 4 to get 16.",
        "difficulty": "Easy",
        "calc": true
    },
    {
        "id": "base-m-4",
        "type": "Math",
        "question": "A school is ordering supplies. Notebooks cost $3 each and pens cost $1.50 each. The school orders twice as many pens as notebooks. If the total cost is $48, how many notebooks were ordered?",
        "options": [
            "6",
            "8",
            "10",
            "12"
        ],
        "answer": 1,
        "explanation": "Let $n$ = notebooks, so pens = $2n$. Total: $3n + 1.5(2n) = 48$, which gives $3n + 3n = 48$, so $6n = 48$ and $n = 8$. A common error is using $n$ for pens instead of $2n$: $3n + 1.5n = 4.5n = 48$, giving $n ≈ 10.7$, rounded to 10 (choice C). Another error is dividing $48 ÷ (3 + 1) = 12$, ignoring the 'twice as many' relationship (choice D).",
        "difficulty": "Easy",
        "calc": true
    },
    {
        "id": "base-m-5",
        "type": "Math",
        "question": "The equation $y = 4x - 9$ is graphed in the $xy$-plane. What is the $x$-intercept of this line?",
        "options": [
            "$x = -9$",
            "$x = \\frac{9}{4}$",
            "$x = 4$",
            "$x = 9$"
        ],
        "answer": 1,
        "explanation": "Set $y = 0$: $0 = 4x - 9$, so $4x = 9$ and $x = 9/4 = 2.25$. A common error is confusing x-intercept with y-intercept and reporting $-9$ (choice A). Reading the slope coefficient 4 as the x-intercept gives choice C. Correctly reaching $4x = 9$ but forgetting to divide by 4 gives $x = 9$ (choice D).",
        "difficulty": "Easy",
        "calc": true
    },
    {
        "id": "base-m-6",
        "type": "Math",
        "question": "A scatterplot shows the relationship between hours of weekly practice and competition scores for a group of student athletes. The data points trend upward from left to right in a roughly consistent pattern with no sharp curves. Based on this trend, which of the following best describes the association?",
        "options": [
            "A negative linear association, because scores decrease as practice time increases.",
            "A positive linear association, because scores generally increase as practice time increases.",
            "No association, because the data points are scattered randomly with no pattern.",
            "A positive nonlinear association, because the rate of score increase accelerates over time."
        ],
        "answer": 1,
        "explanation": "The data points trend upward consistently and the pattern is approximately linear (roughly equal gaps in score per additional hour), so the association is positive and linear. Choice A inverts the direction. Choice C ignores the clear upward trend. Choice D is tempting if the data curves slightly, but the SAT tests approximate linearity recognition — the points are roughly linear, not exponential.",
        "difficulty": "Medium",
        "calc": true
    },
    {
        "id": "base-m-7",
        "type": "Math",
        "question": "The table shows data from 150 students surveyed about their study schedule preferences and SAT scores.\n\n| | Scored Above 1300 | Scored 1300 or Below | Total |\n|---|---|---|---|\n| Prefers Morning Study | 42 | 18 | 60 |\n| Prefers Evening Study | 28 | 62 | 90 |\n| Total | 70 | 80 | 150 |\n\nWhat percentage of students who prefer morning study scored above 1300?",
        "options": [
            "28%",
            "42%",
            "60%",
            "70%"
        ],
        "answer": 3,
        "explanation": "Of the 60 morning-study students, 42 scored above 1300: $42 ÷ 60 = 0.70 = 70\\%$. Choice A uses the wrong base: $42/150 = 28\\%$ — total population instead of morning-study subgroup. Choice B reports the raw count (42) as a percentage, forgetting to divide. Choice C uses the row total (60) as the percentage, confusing count with percent.",
        "difficulty": "Medium",
        "calc": true
    },
    {
        "id": "base-m-8",
        "type": "Math",
        "question": "A car travels at an average speed of 65 miles per hour for the first 2 hours of a trip, then at an average speed of 45 miles per hour for the next 3 hours. What is the car's average speed, in miles per hour, for the entire trip?",
        "options": [
            "52",
            "53",
            "55",
            "57"
        ],
        "answer": 1,
        "explanation": "Total distance: $(65 \\times 2) + (45 \\times 3) = 130 + 135 = 265$ miles. Total time: $2 + 3 = 5$ hours. Average speed: $265 ÷ 5 = 53$ mph. The most dangerous trap is taking the simple average of the two speeds: $(65 + 45)/2 = 55$ (choice C) — average speed does NOT equal average of speeds when time segments differ. Choice D reverses which speed applies to which duration.",
        "difficulty": "Medium",
        "calc": true
    },
    {
        "id": "base-m-9",
        "type": "Math",
        "question": "A company's annual software sales (in thousands) for five consecutive years were: Year 1: 160, Year 2: 240, Year 3: 300, Year 4: 270, Year 5: 360. Between which two consecutive years did the company experience the greatest percent increase in sales?",
        "options": [
            "Year 1 to Year 2",
            "Year 2 to Year 3",
            "Year 3 to Year 4",
            "Year 4 to Year 5"
        ],
        "answer": 0,
        "explanation": "Calculate each percent change: Year 1→2: $(240-160)/160 = 80/160 = 50\\%$. Year 2→3: $(300-240)/240 = 60/240 = 25\\%$. Year 3→4: $(270-300)/300 = -10\\%$ (a decline). Year 4→5: $(360-270)/270 = 90/270 ≈ 33\\%$. Year 1→2 has the highest percent increase at 50%. The trap is comparing absolute increases: Year 4→5 has the largest absolute increase (90k) but a smaller percent than Year 1→2. Year 3→4 is actually a decline, so choice C is clearly wrong.",
        "difficulty": "Medium",
        "calc": true
    },
    {
        "id": "base-m-10",
        "type": "Math",
        "question": "A research study found that the number of bacteria in a sample doubles every 3 hours. If the sample initially contained 500 bacteria, which expression gives the number of bacteria after $t$ hours?",
        "options": [
            "$500 + 2t$",
            "$500 \\times 2^t$",
            "$500 \\times 2^{t/3}$",
            "$500 \\times 3^{t/2}$"
        ],
        "answer": 2,
        "explanation": "The bacteria double every 3 hours, so after $t$ hours there have been $t/3$ doubling periods. Growth = $500 \\times 2^{t/3}$. Verify: at $t=3$, $500 \\times 2^1 = 1000$ ✓; at $t=6$, $500 \\times 2^2 = 2000$ ✓. Choice A is linear — students who recognize 'doubling' but write linear addition. Choice B sets up exponential growth correctly but forgets the 3-hour period — it would double every hour. Choice D swaps the 2 (doubling factor) and 3 (period length).",
        "difficulty": "Medium",
        "calc": true
    },
    {
        "id": "base-m-11",
        "type": "Math",
        "question": "In the system of equations below, $k$ is a constant. For what value of $k$ does the system have no solution?\n\n$$y = 3x + 5$$\n$$y = kx - 2$$",
        "options": [
            "$k = -3$",
            "$k = 0$",
            "$k = 3$",
            "$k = 5$"
        ],
        "answer": 2,
        "explanation": "Two linear equations have no solution when they are parallel — same slope, different y-intercepts. The first line has slope 3 and y-intercept 5. The second has slope $k$ and y-intercept $-2$. Since $5 \\neq -2$, any $k = 3$ produces parallel lines with no intersection. Choice A uses the negative of the slope, confusing 'perpendicular' with 'no solution.' Choice B conflates 'no slope' with 'no solution.' Choice D reads the y-intercept of the first equation as $k$.",
        "difficulty": "Hard",
        "calc": true
    },
    {
        "id": "base-m-12",
        "type": "Math",
        "question": "The function $f(x) = x^2 - 6x + k$ has exactly one real solution. What is the value of $k$?",
        "options": [
            "$k = -9$",
            "$k = 6$",
            "$k = 9$",
            "$k = 36$"
        ],
        "answer": 2,
        "explanation": "A quadratic has exactly one real solution when the discriminant equals zero: $b^2 - 4ac = 0$, so $(-6)^2 - 4(1)(k) = 0$, giving $36 - 4k = 0$ and $k = 9$. Alternatively, complete the square: $f(x) = (x-3)^2 + k - 9$; for exactly one root, $k - 9 = 0$, so $k = 9$. Choice A results from a sign error. Choice B uses the $b$ coefficient directly ($b = -6$, so $k = 6$ feels intuitive) without applying the discriminant. Choice D computes $b^2 = 36$ but doesn't complete the discriminant calculation.",
        "difficulty": "Hard",
        "calc": true
    },
    {
        "id": "base-m-13",
        "type": "Math",
        "question": "The equation $(x - 3)^2 + (y + 5)^2 = 49$ defines a circle in the $xy$-plane. What are the coordinates of the center and the radius of this circle?",
        "options": [
            "Center $(3, -5)$, radius $7$",
            "Center $(-3, 5)$, radius $7$",
            "Center $(3, -5)$, radius $49$",
            "Center $(-3, 5)$, radius $49$"
        ],
        "answer": 0,
        "explanation": "Standard form: $(x - h)^2 + (y - k)^2 = r^2$ gives center $(h, k)$ and radius $r$. Here: $h = 3$, $k = -5$, $r^2 = 49$, so $r = 7$. Choice B negates both center coordinates — students forget that $(y+5)$ means $y - (-5)$, so the y-coordinate of the center is $-5$, not $+5$. Choice C correctly identifies the center as $(3, -5)$ but reports $r^2 = 49$ as the radius instead of $r = 7$. Choice D combines both errors.",
        "difficulty": "Hard",
        "calc": true
    },
    {
        "id": "base-m-14",
        "type": "Math",
        "question": "If $\\frac{x^2 - 9}{x - 3} = x + b$ for all values of $x \\neq 3$, what is the value of $b$?",
        "options": [
            "$b = -9$",
            "$b = -3$",
            "$b = 3$",
            "$b = 9$"
        ],
        "answer": 2,
        "explanation": "Factor the numerator: $x^2 - 9 = (x-3)(x+3)$. So $\\frac{(x-3)(x+3)}{x-3} = x + 3$ (for $x \\neq 3$). Therefore $b = 3$. Choice A uses $-9$ from $x^2 - 9$ without factoring. Choice B factors correctly to $(x-3)(x+3)$ but incorrectly assigns the sign from the $(x-3)$ factor, confusing it with the remaining $(x+3)$ term. Choice D results from mishandling the fraction by dividing term-by-term.",
        "difficulty": "Hard",
        "calc": true
    },
    {
        "id": "base-m-15",
        "type": "Math",
        "question": "In a right triangle, the length of the hypotenuse is $13$ and the length of one leg is $12$. What is $\\sin(\\theta)$, where $\\theta$ is the angle opposite the unknown leg?",
        "options": [
            "$\\dfrac{5}{13}$",
            "$\\dfrac{5}{12}$",
            "$\\dfrac{12}{13}$",
            "$\\dfrac{13}{12}$"
        ],
        "answer": 0,
        "explanation": "First find the unknown leg: $\\sqrt{13^2 - 12^2} = \\sqrt{169 - 144} = \\sqrt{25} = 5$. Since $\\theta$ is opposite the leg of length 5: $\\sin(\\theta) = \\frac{\\text{opposite}}{\\text{hypotenuse}} = \\frac{5}{13}$. Choice B is $\\tan(\\theta) = \\frac{5}{12}$ — using adjacent in the denominator instead of hypotenuse. Choice C is $\\cos(\\theta) = \\frac{12}{13}$ — the most dangerous trap, using the adjacent leg (12) instead of the opposite leg (5). Choice D inverts the ratio, giving secant instead of sine.",
        "difficulty": "Hard",
        "calc": true
    }
]
                }
            ]
        }
    ]
};
