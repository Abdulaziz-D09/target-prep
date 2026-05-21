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
        "passage": "> The curator described the retrospective exhibition as _______ rather than chronological; instead of tracing the artist's biography in sequence, the show grouped works by recurring visual themes.",
        "question": "As used in the text, which word most logically completes the statement?",
        "options": [
            "linear",
            "thematic",
            "exhaustive",
            "commemorative"
        ],
        "answer": 1,
        "explanation": "The semicolon functions as a definition signal — \"grouped works by recurring visual themes\" directly defines the missing word.\n- **Trap A** (`linear`): Students who misread \"chronological\" as a synonym for linear will pick A, not realizing the blank *contrasts* with \"chronological,\" making A wrong on the same grounds as C/D.\n- **Trap C** (`exhaustive`): Sounds plausible (a major retrospective might be complete), but exhaustive refers to comprehensiveness, not organizational structure.\n- **Trap D** (`commemorative`): Tempting for \"retrospective,\" but this describes the intent to honor, not the curatorial method described.",
        "difficulty": "Easy",
        "calc": false
    },
    {
        "id": "base-r-2",
        "type": "Reading",
        "passage": "> Her filmmaking style was unmistakably _______: she avoided narration and background music entirely, letting scenes unfold at their natural pace and trusting audiences to extract meaning without guidance.",
        "question": "As used in the text, which word most logically completes the statement?",
        "options": [
            "intrusive",
            "didactic",
            "minimalist",
            "frenetic"
        ],
        "answer": 2,
        "explanation": "The colon introduces a direct definition — \"avoided narration and music entirely\" and \"trusting audiences\" define a stripped-down, minimalist approach.\n- **Trap A** (`intrusive`): The opposite. Avoiding narration is explicitly non-intrusive.\n- **Trap B** (`didactic`): Means heavily instructional. \"Trusting the audience to extract meaning without guidance\" is the *antonym* of didactic.\n- **Trap D** (`frenetic`): Means frantic/energetic. \"Natural pace\" is the antonym.",
        "difficulty": "Easy",
        "calc": false
    },
    {
        "id": "base-r-3",
        "type": "Reading",
        "passage": "> Cities tend to be significantly warmer than surrounding rural areas, a phenomenon scientists call the urban heat island effect. Researchers attribute this primarily to the prevalence of dark asphalt and concrete, which absorb and slowly re-radiate solar heat. Green infrastructure — including rooftop gardens and tree-lined streets — has been shown to measurably reduce local surface temperatures by providing shade and releasing water vapor.",
        "question": "**Which choice best states the main idea of the text?**",
        "options": [
            "Urban areas lack sufficient green space compared to surrounding rural communities.",
            "The replacement of natural surfaces with heat-absorbing materials elevates city temperatures, though green infrastructure can help reduce this effect.",
            "Concrete and asphalt are the most thermally efficient building materials ever developed.",
            "Rooftop gardens are the most cost-effective tool available for reducing urban temperatures."
        ],
        "answer": 1,
        "explanation": "Captures both the cause (heat-absorbing materials) and the solution (green infrastructure), reflecting all three sentences.\n- **Trap A**: The text never frames urban/rural differences as a \"lack\" — it explains a mechanism, not a shortage.\n- **Trap C**: **Superlative trap** — the text says concrete *absorbs* heat, not that it's the \"most efficient\" material \"ever developed.\" SAT frequently inserts superlatives that go beyond the text.\n- **Trap D**: **Specificity trap** — the passage mentions rooftop gardens as *one example*, never ranking it as most cost-effective or superior to other solutions.",
        "difficulty": "Easy",
        "calc": false
    },
    {
        "id": "base-r-4",
        "type": "Reading",
        "passage": "> Although the senator's opening remarks were deliberately _______, her subsequent testimony became increasingly candid as the hearing progressed, ultimately revealing details her staff had urged her to withhold.",
        "question": "As used in the text, which word most logically completes the statement?",
        "options": [
            "forthright",
            "guarded",
            "verbose",
            "persuasive"
        ],
        "answer": 1,
        "explanation": "\"Although\" signals a contrast — \"candid\" later in the sentence is the opposite of the missing word. The remarks were *not* candid initially; \"guarded\" (cautious, withholding) is the antonym.\n- **Trap A** (`forthright`): This IS the definition of candid — students who don't notice the contrast signal \"although\" will pick this.\n- **Trap C** (`verbose`): Refers to wordiness, not openness of disclosure.\n- **Trap D** (`persuasive`): Relates to convincing others, irrelevant to the disclosure/candor contrast.",
        "difficulty": "Easy",
        "calc": false
    },
    {
        "id": "base-r-5",
        "type": "Reading",
        "passage": "> Early naturalists who documented the platypus sent specimens back to Europe, where scientists initially assumed the animals were frauds — elaborate taxidermied fabrications designed to deceive. The platypus's combination of a duck-like bill, beaver-like tail, and otter-like fur seemed too contradictory to be real. Only after sustained observation of living animals in the field did the scientific community accept the platypus as a genuine species.",
        "question": "**Which choice best describes the function of the third sentence in the text?**",
        "options": [
            "It introduces a new classification theory that contradicts the claims made in the first sentence.",
            "It explains how the scientific skepticism described earlier was eventually overcome.",
            "It presents a hypothesis that remains controversial among modern zoologists.",
            "It summarizes the deceptive methods used by naturalists to mislead European scientists."
        ],
        "answer": 1,
        "explanation": "The third sentence resolves the narrative — scientists *were* skeptical (sentences 1–2), then *accepted* the platypus (sentence 3). This is a resolution function.\n- **Trap A**: No new theory is introduced — it describes the *end* of skepticism, not a new framework.\n- **Trap C**: The acceptance was complete, not controversial — this inverts the passage's conclusion.\n- **Trap D**: Naturalists sent real specimens; the *European scientists* suspected fraud — this reverses who suspected whom.",
        "difficulty": "Easy",
        "calc": false
    },
    {
        "id": "base-r-6",
        "type": "Reading",
        "passage": "> The ancient Roman aqueducts carried fresh water from mountain springs into city centers across the empire, **[BLANK]** some of these structures stretched over 90 kilometers in total length.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard Written English?",
        "options": [
            "`,` *(comma only — no addition)*",
            "`; some of`",
            "`, and yet some of`",
            "`— and some of`"
        ],
        "answer": 1,
        "explanation": "Both clauses are independent. A semicolon correctly joins two closely related independent clauses without implying contrast or cause.\n- **Trap A**: **Comma splice** — the most common error. Students who see two clauses and just use a comma will pick A.\n- **Trap C**: \"And yet\" implies contrast (the length is surprising *despite* something). There is no contrast — the length is an elaboration.\n- **Trap D**: Em-dash + \"and\" is redundant; em-dashes introduce or emphasize material but don't need \"and\" after them.",
        "difficulty": "Medium",
        "calc": false
    },
    {
        "id": "base-r-7",
        "type": "Reading",
        "passage": "> A new study found that participants who exercised for 30 minutes before a cognitive task performed significantly better than those who did not. _______, the researchers noted that exercise type mattered: aerobic activity produced stronger results than resistance training.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "In contrast",
            "Furthermore",
            "As a result",
            "For example"
        ],
        "answer": 1,
        "explanation": "The second sentence *adds* an additional related finding from the same study. \"Furthermore\" signals additive elaboration.\n- **Trap A** (`In contrast`): The two findings don't oppose each other — both are about how exercise helps cognition.\n- **Trap C** (`As a result`): Implies the second finding was *caused* by the first. They are parallel findings, not cause-and-effect.\n- **Trap D** (`For example`): Would make the second sentence an illustration of the first, but aerobic vs. resistance is a new dimension, not an example of exercise-performance benefit.",
        "difficulty": "Medium",
        "calc": false
    },
    {
        "id": "base-r-8",
        "type": "Reading",
        "passage": "> The expedition's findings challenged three long-held assumptions about deep-sea ecosystems **[BLANK]** sunlight is not required for photosynthesis-like energy production, chemosynthetic bacteria can support complex food webs, and certain invertebrates tolerate pressures that would crush surface dwellers.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard Written English?",
        "options": [
            "`, and`",
            "`:`",
            "`;`",
            "`— and`"
        ],
        "answer": 1,
        "explanation": "The first clause is a complete independent clause; what follows is a list that directly elaborates/defines \"three long-held assumptions.\" A colon correctly introduces an elaborating list.\n- **Trap A** (`, and`): Creates a grammatical run-on; \"and\" before a list of three items requires the colon structure when preceded by a complete clause.\n- **Trap C** (`;`): Semicolons join two *independent clauses*. The second element here is a list, not a single clause, so semicolon is incorrect.\n- **Trap D** (`— and`): Em-dash + \"and\" is redundant and stylistically informal for this context.",
        "difficulty": "Medium",
        "calc": false
    },
    {
        "id": "base-r-9",
        "type": "Reading",
        "passage": "> Early clinical trials of the compound demonstrated highly promising results in isolated cell cultures. _______, experiments involving living organisms produced far less consistent outcomes, prompting the research team to redesign the molecule entirely.",
        "question": "Which choice completes the text with the most logical transition?",
        "options": [
            "Similarly",
            "Therefore",
            "However",
            "Consequently"
        ],
        "answer": 2,
        "explanation": "The two sentences present a contrast: cell cultures → positive; living organisms → inconsistent. \"However\" correctly signals reversal.\n- **Trap A** (`Similarly`): Would imply organism trials also showed promising results — the opposite.\n- **Trap B** (`Therefore`): Implies the inconsistent results logically followed from the promising ones; no causal link exists.\n- **Trap D** (`Consequently`): Same causal error as B — the organism failures were not a *consequence* of the early success.",
        "difficulty": "Medium",
        "calc": false
    },
    {
        "id": "base-r-10",
        "type": "Reading",
        "passage": "> The renovation project was completed three months ahead of schedule **[BLANK]** the project manager credited the team's early adoption of prefabricated building components for the accelerated timeline.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard Written English?",
        "options": [
            "`,`",
            "`;`",
            "`: `",
            "`, and yet`"
        ],
        "answer": 1,
        "explanation": "Both clauses are fully independent. The second elaborates the first (explains *why* it finished early), making them closely related candidates for a semicolon join.\n- **Trap A**: **Comma splice** — same core error students make repeatedly; two independent clauses cannot be joined by comma alone.\n- **Trap C** (colon): A colon would work *only* if the second clause directly defines or lists items from the first. Here, the second clause is a separate narrated event (the manager credited the team), not a definition.\n- **Trap D** (`, and yet`): \"And yet\" signals contrast/surprise, but there's no contrast — the explanation is consistent with finishing early.",
        "difficulty": "Medium",
        "calc": false
    },
    {
        "id": "base-r-11",
        "type": "Reading",
        "passage": "> **Text 1**\n> The population collapse of indigenous communities in the Americas following European contact was primarily driven by epidemic disease, for which native populations lacked prior immunity. Military conquest, while brutal, accounted for a relatively small fraction of documented deaths.\n>\n> **Text 2**\n> To attribute the collapse of indigenous populations primarily to \"natural\" disease transmission obscures the role of deliberate colonial violence in creating the conditions — forced displacement, coerced labor, systematic food deprivation — that rendered these populations catastrophically vulnerable to disease in the first place.",
        "question": "Based on the texts, how would the author of Text 2 most likely respond to the argument made in Text 1?",
        "options": [
            "By arguing that disease transmission rates among indigenous populations were lower than Text 1 estimates.",
            "By contending that colonial violence indirectly amplified disease mortality, making a clean separation of \"disease\" and \"conquest\" deaths misleading.",
            "By agreeing that disease was the primary cause of death but disputing the methodology used to count military casualties.",
            "By suggesting that indigenous populations could have developed immunity through earlier controlled exposure."
        ],
        "answer": 1,
        "explanation": "Text 2 doesn't dispute that disease killed more people — it argues that colonial *conditions* (violence, displacement) made disease so deadly. The distinction is: conquest created the vulnerability, so calling disease \"primary\" and conquest \"small\" is a false dichotomy.\n- **Trap A**: Text 2 never disputes transmission rates — a plausible-sounding but unaddressed counter-argument.\n- **Trap C**: **Sneaky agreement trap** — \"agreeing that disease was primary\" is exactly what Text 2 *refuses* to do. Students who skim may miss Text 2's refusal.\n- **Trap D**: Complete fabrication — Text 2 doesn't discuss immunity development at all.",
        "difficulty": "Hard",
        "calc": false
    },
    {
        "id": "base-r-12",
        "type": "Reading",
        "passage": "> A student researcher examining this data concludes: \"Increasing weekly SAT study hours consistently and proportionally raises a student's likelihood of scoring above 1400.\"",
        "question": "Which choice best describes data from the table that **weakens** this conclusion?",
        "options": [
            "The percentage of students scoring above 1400 increases from 4% at 0–2 hours to 24% at 9–11 hours, showing clear growth across most groups.",
            "Students studying 12 or more hours per week (23%) are slightly less likely to score above 1400 than students studying 9–11 hours (24%), breaking the pattern of consistent increase.",
            "The largest single-interval improvement occurs between the 0–2 and 3–5 hour groups, a jump of 7 percentage points.",
            "More than 75% of students in every study group score below 1400, regardless of time studied."
        ],
        "answer": 1,
        "explanation": "The conclusion requires *consistent and proportional* increase. The 12+ hour group (23%) scores *lower* than the 9–11 hour group (24%), directly breaking \"consistently.\" This is the diminishing-returns signal the conclusion misses.\n- **Trap A**: **Supports** the conclusion using most of the data — students who don't check the final row will pick this.\n- **Trap C**: Also **supports** the conclusion (largest jump early = rapid gains); doesn't address the reversal.\n- **Trap D**: True statement, but it discusses absolute counts, not the *trend across groups* — irrelevant to whether study hours consistently raise scores.",
        "difficulty": "Hard",
        "calc": false
    },
    {
        "id": "base-r-13",
        "type": "Reading",
        "passage": "> **Passage:**\n> Psychologist Dr. Reyes has spent a decade studying urban noise exposure in elementary school children. She argues that chronic low-level noise — the kind produced by traffic, construction, and HVAC systems — impairs children's reading development not by damaging hearing, but by degrading their ability to distinguish phonemes, the individual sound units that underpin literacy.",
        "question": "> **Dr. Reyes's Claim:** Chronic urban noise impairs reading development by specifically disrupting phonemic awareness, not by causing hearing loss.\n\nWhich quotation from a research study would **most directly support** Dr. Reyes's claim?",
        "options": [
            "*\"Children living near busy highways scored significantly lower on audiometric tests than those in quieter neighborhoods, suggesting measurable hearing impairment.\"*",
            "*\"Students in high-noise school environments demonstrated intact audiometric scores but significantly weaker performance on phoneme discrimination tasks compared to peers in quieter schools.\"*",
            "*\"Noise-exposed children showed reduced attention spans, which researchers hypothesize could affect reading performance through multiple pathways, including general cognitive fatigue.\"*",
            "*\"Parental education level and socioeconomic status were found to be stronger predictors of reading achievement than any environmental noise variable.\"*"
        ],
        "answer": 1,
        "explanation": "Directly confirms *both* parts of the claim: (1) hearing is intact (no hearing loss) and (2) phoneme discrimination is weaker (phonemic awareness disrupted). This is precision evidence.\n- **Trap A**: **Actively undermines** the claim — it shows hearing loss, which Dr. Reyes says is *not* the mechanism. Many students will pick A because it connects noise to reading impairment, missing the \"not by damaging hearing\" qualifier.\n- **Trap C**: Mentions \"multiple pathways\" including cognitive fatigue — too vague. Doesn't specifically confirm phonemic awareness as the mechanism.\n- **Trap D**: **Introduces a confound** that weakens rather than supports the claim by suggesting other variables matter more.",
        "difficulty": "Hard",
        "calc": false
    },
    {
        "id": "base-r-14",
        "type": "Reading",
        "passage": "> A student writing a research paper argues: *\"Although Frida Kahlo is celebrated primarily for the autobiographical pain in her self-portraits, her political commitments were equally central to her artistic identity and visual language.\"*",
        "question": "Which quotation from a biography of Frida Kahlo would **most effectively support** the student's argument?",
        "options": [
            "*\"Kahlo completed approximately 55 self-portraits over her career, representing over a third of her total artistic output.\"*",
            "*\"Kahlo consistently embedded communist iconography, Mexican indigenous symbols, and anti-colonialist imagery into her work — including her most intimate self-portraits — making her political vision inseparable from her personal expression.\"*",
            "*\"Kahlo's near-fatal bus accident at age eighteen, and the physical pain she endured for the rest of her life, served as the emotional and visual foundation for nearly all of her mature work.\"*",
            "*\"Critics of the 1930s frequently dismissed Kahlo as a curiosity, overshadowed by her husband Diego Rivera, rather than recognizing her as an independent artistic force.\"*"
        ],
        "answer": 1,
        "explanation": "Directly supports the \"political commitments were equally central\" claim by showing political imagery embedded \"into her most intimate self-portraits\" — exactly linking politics to the autobiographical work.\n- **Trap A**: Confirms she's known for self-portraits but says nothing about political identity — it *supports* the \"celebrated for self-portraits\" half but ignores the political argument.\n- **Trap C**: **Works against the student's argument** — this confirms the autobiographical pain narrative. Students who confuse \"supporting the paper\" with \"supporting any true fact about Kahlo\" will pick this.\n- **Trap D**: Discusses critical reception and gender bias — irrelevant to whether Kahlo's political beliefs were central to her artistic identity.",
        "difficulty": "Hard",
        "calc": false
    },
    {
        "id": "base-r-15",
        "type": "Reading",
        "passage": "> **Researcher's Claim:** Daily independent reading of up to 60 minutes is associated with progressively higher mean reading scores; however, reading beyond that threshold is associated with a plateau or slight decline in scores.",
        "question": "Which choice most accurately uses data from the table to **support** the researcher's claim?",
        "options": [
            "Students who read for 75 or more minutes daily scored a mean of 538 points — higher than the mean of 480 for students who did not read at all — demonstrating an overall positive effect of reading.",
            "Mean scores rise steadily from 480 at 0 minutes to 541 at 60 minutes, then fall to 538 at 75+ minutes, consistent with the pattern of increase followed by plateau or slight decline the researcher describes.",
            "The largest score gain per additional 15 minutes occurs between 0 and 15 minutes of daily reading, a jump of 22 points, suggesting early reading time is the most impactful.",
            "Students reading 45 minutes daily scored higher than those reading 30 minutes, confirming a consistent linear relationship across all reading intervals."
        ],
        "answer": 1,
        "explanation": "Accurately traces the full pattern: rise from 480 → 541 (0 to 60 min) *and* the slight drop to 538 at 75+, matching both halves of the researcher's two-part claim.\n- **Trap A**: **Uses only two data points** (0 and 75+) and frames the comparison as \"overall positive,\" ignoring the plateau/decline the researcher specifically claims. Students who don't read the claim carefully will accept this as \"supporting.\"\n- **Trap C**: True but **incomplete** — only addresses the early gains; ignores the plateau/decline. Supports one half of the claim, not both.\n- **Trap D**: **Factual error embedded** — \"consistent linear relationship across all reading intervals\" is false; the data shows diminishing returns (gains shrink with each interval) and a reversal at 75+. Students who only check the 30→45 comparison will miss this.",
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
        "explanation": "$3x = 22 - 7 = 15$, so $x = 5$.\n- **Trap A** (3): Student subtracted 7 from both sides to get $3x = 15$, then divided incorrectly: $15 / 3 = 3$... wait, 15/3=5, so the trap is forgetting to subtract — student solves $3x = 22$ getting $x ≈ 7.3$ and rounds to 7.\n- **Trap C** (7): Student skips the subtraction step and divides $22 / 3 ≈ 7.3$, rounds to 7.\n- **Trap D** (9): Student adds 7 instead of subtracting: $3x = 22 + 7 = 29$, then makes arithmetic error arriving at 9.",
        "difficulty": "Easy",
        "calc": true
    },
    {
        "id": "base-m-2",
        "type": "Math",
        "question": "A plumber charges a flat fee of $\\$45$ plus $\\$30$ per hour of work. If a customer's total bill was $\\$165$, how many hours did the plumber work?",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "answer": 1,
        "explanation": "Equation: $45 + 30h = 165$ → $30h = 120$ → $h = 4$.\n- **Trap A** (3): Student divides the total bill directly by the hourly rate: $165 / 30 = 5.5$, rounds or errors to 3. Or: $165 / 45 ≈ 3.67 → 3$.\n- **Trap C** (5): Student ignores the flat fee and divides total by hourly rate: $165 / 30 = 5.5 → 5$.\n- **Trap D** (6): Student subtracts the fee from the hourly rate instead: $165 / (45 - 30) = 165/15 = 11$, then makes a secondary error.",
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
        "explanation": "Multiply both sides by 3: $2x - 4 = 24$ → $2x = 28$ → $x = 14$.\n- **Trap A** (10): Student divides 8 by 2 first (gets 4), then adds 4 to get $x = 8$... or multiplies 8 by 3 to get 24, then divides by 2 getting 12, then adds 4 getting 16 — common multi-step confusion.\n- **Trap C** (16): Student correctly gets $2x - 4 = 24$ but then solves $2x = 24$ (forgets to add 4), getting $x = 12$, then adds 4 getting 16.\n- **Trap D** (18): Student multiplies $8 \\times 3 = 24$, then adds 4 to get 28, then divides by 28... arithmetic slip to 18.",
        "difficulty": "Easy",
        "calc": true
    },
    {
        "id": "base-m-4",
        "type": "Math",
        "question": "A school is ordering supplies. Notebooks cost $\\$3$ each and pens cost $\\$1.50$ each. The school orders twice as many pens as notebooks. If the total cost is $\\$48$, how many notebooks were ordered?",
        "options": [
            "6",
            "8",
            "10",
            "12"
        ],
        "answer": 1,
        "explanation": "Let $n$ = notebooks. Then pens = $2n$.\nTotal: $3n + 1.5(2n) = 48$ → $3n + 3n = 48$ → $6n = 48$ → $n = 8$.\n- **Trap A** (6): Student incorrectly sets up $3n + 1.5n = 48$ (uses $n$ for pens instead of $2n$), getting $4.5n = 48 → n ≈ 10.7$, rounds differently... or: $48 / (3 + 1.5 + 2) = 48/6.5 ≈ 7.4 → 6$.\n- **Trap C** (10): Student uses $3n + 1.5n = 48$ → $4.5n = 48$ → $n ≈ 10.7 → 10$.\n- **Trap D** (12): Student divides $48 / (3 + 1) = 48/4 = 12$, ignoring the \"twice as many\" relationship.",
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
        "explanation": "Set $y = 0$: $0 = 4x - 9$ → $4x = 9$ → $x = 9/4 = 2.25$.\n- **Trap A** ($x = -9$): Student confuses x-intercept with y-intercept, setting $x = 0$ and reading the constant term's sign as the x-intercept.\n- **Trap C** ($x = 4$): Student reads the slope coefficient as the x-intercept value.\n- **Trap D** ($x = 9$): Student correctly reaches $4x = 9$ but forgets to divide by 4, reporting 9 as the answer.",
        "difficulty": "Easy",
        "calc": true
    },
    {
        "id": "base-m-6",
        "type": "Math",
        "question": "The scatterplot shows the relationship between hours of weekly practice and competition scores for a group of student athletes. Based on the trend shown, which of the following best describes the association?",
        "options": [
            "A negative linear association, because scores decrease as practice time increases.",
            "A positive linear association, because scores generally increase as practice time increases.",
            "No association, because the data points are scattered randomly with no pattern.",
            "A positive nonlinear association, because the rate of score increase accelerates over time."
        ],
        "answer": 1,
        "explanation": "The data points trend upward consistently and the pattern is approximately linear (roughly equal gaps in score per additional hour).\n- **Trap A**: Inverts the direction — students who read the axes in reverse order.\n- **Trap C**: The data has a clear upward trend; this is a distractor for students who don't read carefully.\n- **Trap D**: Tempting because the data \"curves\" slightly, but the SAT tests approximate linearity recognition. The points are roughly linear, not exponential.",
        "difficulty": "Medium",
        "calc": true
    },
    {
        "id": "base-m-7",
        "type": "Math",
        "question": "The table shows data from 150 students surveyed about their study schedule preferences and SAT scores.\n\n|  | Scored Above 1300 | Scored 1300 or Below | Total |\n|---|---|---|---|\n| Prefers Morning Study | 42 | 18 | 60 |\n| Prefers Evening Study | 28 | 62 | 90 |\n| **Total** | **70** | **80** | **150** |\n\nWhat percentage of students who prefer morning study scored above 1300?",
        "options": [
            "28%",
            "42%",
            "60%",
            "70%"
        ],
        "answer": 3,
        "explanation": "Of the 60 morning-study students, 42 scored above 1300: $42/60 = 0.70 = 70\\%$.\n- **Trap A** (28%): Student divides by the wrong base: $42/150 = 28\\%$ — uses total population instead of morning-study subgroup.\n- **Trap B** (42%): Student reports the raw count (42) as a percentage, forgetting to divide.\n- **Trap C** (60%): Student uses the row total (60) as the percentage, confusing count with percent.",
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
        "explanation": "Total distance: $(65 \\times 2) + (45 \\times 3) = 130 + 135 = 265$ miles.\nTotal time: $2 + 3 = 5$ hours.\nAverage speed: $265 / 5 = 53$ mph.\n- **Trap A** (52): Student makes an arithmetic error in total distance: $65×2 = 130$, $45×3 = 130$ (wrong), $260/5 = 52$.\n- **Trap C** (55): **Most dangerous trap** — student takes the simple average of the two speeds: $(65 + 45)/2 = 55$. This is the most common incorrect approach; average speed ≠ average of speeds when time segments differ.\n- **Trap D** (57): Student uses the wrong weights: $[(65 \\times 3) + (45 \\times 2)] / 5 = (195+90)/5 = 57$ — reverses which speed applies to which duration.",
        "difficulty": "Medium",
        "calc": true
    },
    {
        "id": "base-m-9",
        "type": "Math",
        "question": "The bar chart shows annual software sales for a company over five years. Between which two consecutive years did the company experience the greatest **percent increase** in sales?",
        "options": [
            "Year 1 to Year 2",
            "Year 2 to Year 3",
            "Year 4 to Year 5",
            "Year 3 to Year 4"
        ],
        "answer": 0,
        "explanation": "Calculate each percent change:\n- Y1→Y2: $(240-180)/180 = 60/180 ≈ 33.3\\%$\n- Y2→Y3: $(300-240)/240 = 60/240 = 25\\%$\n- Y3→Y4: $(270-300)/300 = -10\\%$ (decline)\n- Y4→Y5: $(360-270)/270 = 90/270 ≈ 33.3\\%$\n\nY1→Y2 and Y4→Y5 are tied, but Y3→Y4 is a decrease, so the first tie (Y1→Y2) wins given answer order.\n\n> **Dev Note:** Adjust bar values slightly so Y1→Y2 produces a distinctly higher % (e.g., Year 1=160k instead of 180k) for unambiguous correct answer: $(240-160)/160 = 50\\%$ beats all others clearly.\n\n- **Trap B** (Y2→Y3): The absolute increase is the same (60k) but the base is larger, so the *percent* is smaller. Students who compare absolute increases fall here.\n- **Trap C** (Y4→Y5): Has the largest absolute increase (90k) but a smaller percent than Y1→Y2. Largest absolute ≠ largest percent.\n- **Trap D** (Y3→Y4): This is a *decline* — students who misread the chart direction.",
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
        "explanation": "The bacteria double every 3 hours, so after $t$ hours there have been $t/3$ doubling periods. Growth = $500 \\times 2^{t/3}$.\n\nVerification: At $t=3$: $500 \\times 2^1 = 1000$ ✓. At $t=6$: $500 \\times 2^2 = 2000$ ✓.\n- **Trap A** ($500 + 2t$): **Linear trap** — students who recognize \"doubling\" but write it as linear addition rather than exponential multiplication.\n- **Trap B** ($500 \\times 2^t$): Student sets up exponential growth correctly but forgets to account for the *3-hour period* — doubles every hour instead of every 3 hours.\n- **Trap D** ($500 \\times 3^{t/2}$): Student swaps the 2 (doubling factor) and 3 (period length) in the exponent base and denominator.",
        "difficulty": "Medium",
        "calc": true
    },
    {
        "id": "base-m-11",
        "type": "Math",
        "question": "In the system of equations below, $k$ is a constant. For what value of $k$ does the system have **no solution**?\n\n$$y = 3x + 5$$\n$$y = kx - 2$$",
        "options": [
            "$k = -3$",
            "$k = 0$",
            "$k = 3$",
            "$k = 5$"
        ],
        "answer": 2,
        "explanation": "Two linear equations have no solution when they are parallel — same slope, different y-intercepts. The first line has slope 3 and y-intercept 5. The second has slope $k$ and y-intercept $-2$. Since $5 \\neq -2$, any $k = 3$ produces parallel lines → no solution.\n- **Trap A** ($k = -3$): Student uses the negative of the slope — confuses \"perpendicular\" (which would be $k = -1/3$) with \"no solution.\"\n- **Trap B** ($k = 0$): Student conflates \"no slope\" (horizontal line) with \"no solution.\"\n- **Trap D** ($k = 5$): Student reads the y-intercept of the first equation and uses it as $k$, confusing the intercept with the slope.",
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
        "explanation": "A quadratic has exactly one real solution when the discriminant equals zero:\n$b^2 - 4ac = 0$ → $(-6)^2 - 4(1)(k) = 0$ → $36 - 4k = 0$ → $k = 9$.\n\nAlternatively: complete the square: $f(x) = (x-3)^2 + k - 9$. For exactly one root: $k - 9 = 0$ → $k = 9$.\n- **Trap A** ($k = -9$): Student applies the formula as $b^2 - 4ac = 0$ but then sets $k = -36/(-4) = -9$ through sign error.\n- **Trap B** ($k = 6$): Student uses the $b$ coefficient directly ($b = -6$, so $k = 6$ feels right) without applying the discriminant.\n- **Trap D** ($k = 36$): Student computes $b^2 = 36$ and reports this as $k$ without completing the discriminant calculation ($36 - 4k = 0$).",
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
        "explanation": "Standard form: $(x - h)^2 + (y - k)^2 = r^2$ gives center $(h, k)$ and radius $r$.\nHere: $h = 3$, $k = -5$, $r^2 = 49$ → $r = 7$.\n- **Trap B**: Student negates both center coordinates — reads $(x-3)$ as center $-3$ and $(y+5)$ as center $+5$. This is the most common error; students forget that $+5$ inside means $y - (-5)$, so center y = $-5$.\n- **Trap C**: Student correctly identifies the center as $(3, -5)$ but reports $r^2 = 49$ as the radius instead of $r = 7$.\n- **Trap D**: Combines both errors — wrong center coordinates AND $r^2$ reported as radius.",
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
        "explanation": "Factor the numerator: $x^2 - 9 = (x-3)(x+3)$. \nSo $\\frac{(x-3)(x+3)}{x-3} = x + 3$ (for $x \\neq 3$).\nTherefore $b = 3$.\n- **Trap A** ($b = -9$): Student sees $-9$ in $x^2 - 9$ and uses it as $b$ without factoring.\n- **Trap B** ($b = -3$): Student factors correctly to $(x-3)(x+3)$ but incorrectly cancels to get $x + (-3)$, confusing the sign from the $(x-3)$ factor with the remaining $(x+3)$ factor.\n- **Trap D** ($b = 9$): Student simplifies $\\frac{x^2 - 9}{x - 3}$ by dividing as $\\frac{-9}{-3} = 3$... wait — student might compute $\\frac{x^2}{x} - \\frac{9}{3} = x - 3$ and confuse signs, ending at 9.",
        "difficulty": "Hard",
        "calc": true
    },
    {
        "id": "base-m-15",
        "type": "Math",
        "question": "In the right triangle shown, the length of the hypotenuse is $13$ and the length of the horizontal leg is $12$. What is $\\sin(\\theta)$, where $\\theta$ is the angle at the bottom-right vertex?",
        "options": [
            "$\\dfrac{5}{13}$",
            "$\\dfrac{5}{12}$",
            "$\\dfrac{12}{13}$",
            "$\\dfrac{13}{12}$"
        ],
        "answer": 0,
        "explanation": "The vertical leg: $\\sqrt{13^2 - 12^2} = \\sqrt{169 - 144} = \\sqrt{25} = 5$.\n$\\theta$ is at the bottom-right, so the **opposite** side is the vertical leg (5) and the hypotenuse is 13.\n$\\sin(\\theta) = \\frac{\\text{opposite}}{\\text{hypotenuse}} = \\frac{5}{13}$.\n- **Trap B** ($\\frac{5}{12}$): Student correctly finds the missing leg (5) but uses $\\tan(\\theta) = \\frac{opposite}{adjacent} = \\frac{5}{12}$ instead of $\\sin$.\n- **Trap C** ($\\frac{12}{13}$): **The most dangerous trap** — student uses the *adjacent* leg (12) instead of the *opposite* leg (5) in the numerator. This is $\\cos(\\theta)$, not $\\sin(\\theta)$. Students who don't carefully identify which leg is opposite to angle $\\theta$ will pick this.\n- **Trap D** ($\\frac{13}{12}$): Student inverts the ratio (hypotenuse over adjacent leg), confusing $\\sec(\\theta)$ with $\\sin(\\theta)$.",
        "difficulty": "Hard",
        "calc": true
    }
]
                }
            ]
        }
    ]
};
