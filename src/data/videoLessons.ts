export type VideoLesson = {
  id: string;
  title: string;
  topic: string;
  subject: 'Math' | 'English';
  duration: string;
  source: string;
  color: string;
  description: string;
  practices: { q: string; options: string[]; answer: number; explanation: string }[];
};

export const VIDEO_LESSONS: VideoLesson[] = [
  // --- EXISTING VIDEOS ---
  {
    id: 'XRH0w7gCpV8',
    title: 'SAT Algebra: Linear Equations & Word Problems',
    topic: 'Linear equations in one variable',
    subject: 'Math',
    duration: '14 min',
    source: 'Khan Academy',
    color: 'amber',
    description: 'Master solving linear equations and translating word problems into algebra — the most tested skill on the Digital SAT Math section.',
    practices: [
      { q: 'If 5x − 3 = 2x + 9, what is the value of x?', options: ['2', '3', '4', '6'], answer: 2, explanation: 'Subtract 2x from both sides: 3x − 3 = 9. Add 3: 3x = 12. Divide: x = 4.' },
      { q: 'A taxi charges a base fare of $2.50 plus $1.75 per mile. If a customer pays $16.75 total, how many miles did the trip cover?', options: ['6', '7', '8', '9'], answer: 2, explanation: 'Set up: 2.50 + 1.75m = 16.75. Subtract 2.50: 1.75m = 14.25. Divide: m = 14.25 ÷ 1.75 = 8.14 ≈ 8 miles.' },
      { q: 'Which value of x satisfies both 3x + 1 > 10 and x − 2 < 5?', options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'], answer: 1, explanation: 'First inequality: x > 3. Second inequality: x < 7. So x must be between 3 and 7. Among the choices, x = 4 satisfies both.' },
      { q: 'The sum of three consecutive integers is 72. What is the largest of the three integers?', options: ['23', '24', '25', '26'], answer: 2, explanation: 'Let the integers be n, n+1, n+2. Then 3n + 3 = 72, so 3n = 69 and n = 23. The largest is 23 + 2 = 25.' },
      { q: 'If 2(x + 4) = 3(x − 1), what is x?', options: ['7', '9', '11', '13'], answer: 2, explanation: 'Expand: 2x + 8 = 3x − 3. Subtract 2x: 8 = x − 3. Add 3: x = 11.' }
    ]
  },
  {
    id: 'zexX6t0dMjs',
    title: 'SAT Reading: Main Ideas & Central Purpose',
    topic: 'Central Ideas and Details',
    subject: 'English',
    duration: '11 min',
    source: 'Khan Academy',
    color: 'indigo',
    description: 'Learn how to identify the central idea of a passage and avoid the common trap of picking answers that are too narrow or too broad.',
    practices: [
      { q: 'A passage describes how a scientist\'s early failures with a new material led to the accidental discovery of a durable polymer used in modern body armor. Which choice best states the main idea of this passage?', options: ['Body armor is an important safety tool for law enforcement.', 'Scientific breakthroughs sometimes emerge from unexpected failures rather than deliberate research.', 'The scientist spent many years working with materials that did not meet expectations.', 'Polymers are the strongest materials available for protective equipment.'], answer: 1, explanation: 'The passage centers on how failure led to a breakthrough — a theme about the nature of discovery.' },
      { q: 'When a question asks for the "main purpose" of a passage, you should look for:', options: ['The first sentence of the passage', 'The reason the author wrote the text and what overall message it conveys', 'The most interesting fact mentioned in the passage', 'The definition of the most difficult word in the passage'], answer: 1, explanation: 'Main purpose questions ask why the author wrote the passage.' },
      { q: 'A passage discusses how urban trees reduce temperatures, improve air quality, and increase property values. Which title best captures the main idea?', options: ['The Cost of Urban Tree Planting Programs', 'How Urban Trees Benefit Cities in Multiple Ways', 'Air Quality Improvements in Dense Urban Centers', 'Why Property Values Rise Near Green Spaces'], answer: 1, explanation: 'The passage covers multiple benefits of urban trees. A title should capture the full scope.' },
      { q: 'A detail question asks about a specific fact mentioned in a passage. The best strategy is to:', options: ['Rely on your memory of the passage to save time', 'Return to the relevant part of the passage to verify the answer using evidence from the text', 'Choose the answer that sounds most sophisticated', 'Eliminate all answers that use numbers or statistics'], answer: 1, explanation: 'SAT reading requires textual evidence. Always return to the passage.' },
      { q: 'Which of the following is typically NOT considered a central idea?', options: ['A broad thematic summary of the passage', 'The primary argument the author makes', 'A specific statistic mentioned in paragraph 3', 'The underlying message of the text'], answer: 2, explanation: 'A specific statistic is a supporting detail, not a central idea.' }
    ]
  },
  {
    id: 'UFBzXhLIIA8',
    title: 'SAT Math: Quadratics & Parabolas',
    topic: 'Nonlinear functions',
    subject: 'Math',
    duration: '15 min',
    source: 'Khan Academy',
    color: 'orange',
    description: 'Master the four key forms of quadratic equations, how to find roots, vertex, and direction of opening.',
    practices: [
      { q: 'Which of the following is a factor of x² − 5x + 6?', options: ['(x + 2)', '(x − 2)', '(x − 3)', '(x + 6)'], answer: 2, explanation: 'Factor: x² − 5x + 6 = (x − 2)(x − 3). Both (x − 2) and (x − 3) are factors. Of the choices given, (x − 3) appears.' },
      { q: 'The parabola y = (x − 3)² + 5 has its vertex at which point?', options: ['(−3, 5)', '(3, −5)', '(3, 5)', '(−3, −5)'], answer: 2, explanation: 'In vertex form y = a(x − h)² + k, the vertex is (h, k). Here h = 3 and k = 5, so the vertex is (3, 5).' },
      { q: 'The equation x² − 4 = 0 has how many real solutions?', options: ['0', '1', '2', '4'], answer: 2, explanation: 'Factor: (x − 2)(x + 2) = 0, giving x = 2 or x = −2. There are 2 real solutions.' },
      { q: 'Which quadratic function opens downward?', options: ['y = x²', 'y = 2x² - 4', 'y = -3(x - 1)² + 2', 'y = 0.5x² + x + 1'], answer: 2, explanation: 'A parabola opens downward if the leading coefficient (a) is negative. Only y = -3(x - 1)² + 2 has a negative a.' },
      { q: 'What is the y-intercept of y = x² - 4x + 7?', options: ['(0, 4)', '(0, -4)', '(0, 7)', '(7, 0)'], answer: 2, explanation: 'The y-intercept occurs where x = 0. Plugging in x = 0 gives y = 7.' }
    ]
  },
  {
    id: 'mJrPKNZbwpQ',
    title: 'SAT Reading: Command of Evidence',
    topic: 'Command of Evidence',
    subject: 'English',
    duration: '12 min',
    source: 'Khan Academy',
    color: 'emerald',
    description: 'Learn how to identify the quotation that provides the strongest textual or quantitative support for a claim.',
    practices: [
      { q: 'On the Digital SAT, a "quantitative evidence" question typically shows a graph or table and asks you to choose a quotation that best uses the data to support a claim. The best approach is to:', options: ['Choose the answer that mentions the most data points from the graph', 'Choose the answer whose claim precisely matches what the data shows, without overstating or understating', 'Choose the answer that uses the highest or lowest value shown in the data', 'Choose the most general answer to avoid picking the wrong specific statistic'], answer: 1, explanation: 'The correct answer for a quantitative evidence question must accurately represent the data — not add claims the graph doesn\'t support, and not ignore key data.' },
      { q: 'A passage states that a researcher found no significant relationship between sleep duration and test performance among college students. A student argues that sleeping more always improves academic outcomes. Which quotation would most directly weaken the student\'s argument?', options: ['"Sleep quality, rather than sleep quantity, emerged as the more important predictor of student performance in our study."', '"Students who slept fewer than six hours reported higher levels of stress compared to those who slept eight hours."', '"The relationship between sleep and academic performance varies significantly across age groups."', '"Most health experts recommend between seven and nine hours of sleep for adults."'], answer: 0, explanation: 'The student\'s argument is that more sleep always improves outcomes. Choice A weakens this by showing that quantity alone is not the key factor — quality matters more.' },
      { q: 'When both a claim and a data table are given, and you must find the statement that "best supports the claim using data from the table," the correct answer will:', options: ['Summarize every data point in the table', 'Reference specific data from the table that logically connects to the claim', 'Acknowledge limitations of the data', 'Contradict the claim to show the student\'s reasoning is flawed'], answer: 1, explanation: 'The answer that best supports a claim with data will cite specific numbers or trends from the table that logically prove or strongly suggest the claim is true.' },
      { q: 'Textual evidence questions often require you to find a sentence that supports a previous conclusion. The strongest textual evidence:', options: ['Restates the conclusion using different words', 'Provides a concrete example or data point that logically leads to the conclusion', 'Introduces a new, unrelated idea', 'Questions the validity of the conclusion'], answer: 1, explanation: 'Strong evidence provides the factual basis (like an example or data) that proves the conclusion is true.' },
      { q: 'If a claim states that "Species X populations declined rapidly between 2010 and 2015," which piece of evidence best supports it?', options: ['"Species X was first discovered in 2010."', '"Between 2010 and 2015, the population of Species X dropped from 10,000 to 2,500."', '"Conservation efforts for Species X began in 2015."', '"Species Y also saw a population decline during this period."'], answer: 1, explanation: 'This directly provides the quantitative data showing the rapid decline mentioned in the claim.' }
    ]
  },
  {
    id: 'QqIAE7MgJwU',
    title: 'SAT Math: Circles, Arcs & Sector Area',
    topic: 'Circles',
    subject: 'Math',
    duration: '13 min',
    source: 'Khan Academy',
    color: 'cyan',
    description: 'Cover all the circle properties that appear on the Digital SAT: circumference, area, arc length, sector area, and equations.',
    practices: [
      { q: 'A circle has a radius of 6. What is the area of a sector with a central angle of 60°?', options: ['3π', '6π', '9π', '36π'], answer: 1, explanation: 'Sector area = (θ/360°) × πr². Here: (60/360) × π(6²) = (1/6) × 36π = 6π.' },
      { q: 'The equation (x + 2)² + (y − 5)² = 25 represents a circle. What is the radius of this circle?', options: ['5', '10', '25', '√25'], answer: 0, explanation: 'Standard form: (x − h)² + (y − k)² = r². Here r² = 25, so r = 5.' },
      { q: 'A circle has a diameter of 10. What is its circumference?', options: ['5π', '10π', '25π', '100π'], answer: 1, explanation: 'Circumference = πd = π × 10 = 10π.' },
      { q: 'An arc of a circle has a length of 4π. If the radius of the circle is 6, what is the central angle of the arc in degrees?', options: ['60°', '90°', '120°', '180°'], answer: 2, explanation: 'Arc length = (θ/360°) × 2πr. So 4π = (θ/360) × 12π. Then θ/360 = 4/12 = 1/3, so θ = 120°.' },
      { q: 'A circle has a center at the origin and passes through the point (0, 7). Which equation represents this circle?', options: ['x² + y² = 7', 'x² + y² = 14', 'x² + y² = 49', 'x + y = 7'], answer: 2, explanation: 'The radius is the distance from the center (0,0) to (0,7), which is 7. The equation is x² + y² = 7² = 49.' }
    ]
  },
  {
    id: 'kn-2_Q4GtUU',
    title: 'SAT Writing: Transitions & Sentence Flow',
    topic: 'Transitions',
    subject: 'English',
    duration: '10 min',
    source: 'Khan Academy',
    color: 'purple',
    description: 'Master the most common transition question on the SAT — identifying contrast, addition, cause-effect, and example signals.',
    practices: [
      { q: 'Sentence 1: Early studies showed the treatment was effective in laboratory settings. Sentence 2: _______, clinical trials with human patients produced far less promising results. Which transition best connects these sentences?', options: ['Furthermore', 'Therefore', 'However', 'For instance'], answer: 2, explanation: 'The two sentences contrast each other: lab results were positive, human trial results were negative. "However" signals this contrast.' },
      { q: 'Which transition signals that the second idea is a result or consequence of the first?', options: ['In contrast', 'Similarly', 'Consequently', 'Nevertheless'], answer: 2, explanation: '"Consequently" (and related words: therefore, as a result, thus) signals that the second idea is caused by or follows from the first.' },
      { q: 'Sentence 1: The company expanded into three new markets last year. Sentence 2: _______, it hired 200 additional employees to support its growth. The most logical transition is:', options: ['However', 'In addition', 'On the other hand', 'Although'], answer: 1, explanation: 'Hiring more employees is an additional action that supports the expansion — it adds information, not contrast. "In addition" signals additive elaboration.' },
      { q: 'The word "nonetheless" signals which type of logical relationship?', options: ['The second idea is an example of the first', 'The second idea adds information to the first', 'The second idea contrasts with or is unexpected given the first', 'The second idea is a direct cause of the first'], answer: 2, explanation: '"Nonetheless" (like "nevertheless," "however," "yet") signals contrast or concession — meaning the second statement is surprising or opposite to what the first statement might lead you to expect.' },
      { q: 'Sentence: The architect\'s design was praised for its creativity. _______, it was criticized for exceeding the budget by over 30%. The best transition is:', options: ['As a result', 'Similarly', 'For example', 'At the same time'], answer: 3, explanation: '"At the same time" works well here because it acknowledges two simultaneous but contrasting realities — praise and criticism — without implying one caused the other.' }
    ]
  },
  {
    id: 'vxCMiPGoqI0',
    title: 'SAT Math: Data Analysis, Probability & Statistics',
    topic: 'Probability and conditional probability',
    subject: 'Math',
    duration: '16 min',
    source: 'Khan Academy',
    color: 'emerald',
    description: 'Cover mean, median, standard deviation, basic probability, and how to read two-way tables — high-frequency topics.',
    practices: [
      { q: 'A data set has values: 3, 5, 7, 7, 8, 10, 12. What is the median?', options: ['5', '7', '8', '10'], answer: 1, explanation: 'With 7 values, the median is the 4th value when arranged in order: 3, 5, 7, 7, 8, 10, 12. The 4th value is 7.' },
      { q: 'A bag contains 4 red marbles, 3 blue marbles, and 5 green marbles. If one marble is drawn at random, what is the probability it is NOT blue?', options: ['1/4', '1/3', '3/4', '9/12'], answer: 2, explanation: 'Total marbles = 4 + 3 + 5 = 12. Not blue = 4 + 5 = 9. Probability = 9/12 = 3/4.' },
      { q: 'A two-way table shows that 30 of 120 students who study in the morning scored above 1400, and 50 of 80 students who study in the evening scored above 1400. Which group has a higher proportion scoring above 1400?', options: ['Morning students, because 30 > the number expected', 'Evening students, because 50/80 = 62.5% compared to 30/120 = 25%', 'Morning students, because 120 > 80 so they have more total students', 'Both groups have the same proportion'], answer: 1, explanation: 'Calculate proportions: Morning: 30/120 = 25%. Evening: 50/80 = 62.5%. Evening students have a far higher proportion scoring above 1400.' },
      { q: 'If a data set\'s mean increases but the median stays the same, which is most likely true?', options: ['The data is symmetric', 'One or more very high values were added to the data', 'One or more very low values were added to the data', 'All values were multiplied by the same constant'], answer: 1, explanation: 'When one or more very high (extreme) values are added, the mean is pulled upward while the median (middle value) changes minimally.' },
      { q: 'A study surveys a random sample of 400 people and finds that 60% prefer Brand A. If the margin of error is ±4%, which conclusion is valid?', options: ['Exactly 60% of all people prefer Brand A', 'At least 70% of all people prefer Brand A', 'Between 56% and 64% of the population likely prefers Brand A', 'The study proves Brand A is superior to its competitors'], answer: 2, explanation: 'The margin of error means the true population percentage is estimated to be within 60% ± 4%, or between 56% and 64%.' }
    ]
  },
  {
    id: 'nOnd3SiYZqM',
    title: 'SAT Writing: Punctuation & Sentence Boundaries',
    topic: 'Boundaries',
    subject: 'English',
    duration: '13 min',
    source: 'Khan Academy',
    color: 'rose',
    description: 'Learn when to use commas, semicolons, colons, and dashes — the four punctuation rules that appear most frequently.',
    practices: [
      { q: 'Which of the following is a comma splice?', options: ['The team won the championship; they celebrated all night.', 'The team won the championship, they celebrated all night.', 'The team won the championship, and they celebrated all night.', 'Having won the championship, the team celebrated all night.'], answer: 1, explanation: 'A comma splice joins two independent clauses with only a comma. Use a semicolon, a period, or a comma + coordinating conjunction.' },
      { q: 'A colon is correctly used when:', options: ['Joining two unrelated independent clauses', 'Introducing a list, explanation, or elaboration that follows a complete independent clause', 'Connecting a dependent clause to an independent clause', 'Replacing a comma before a coordinating conjunction'], answer: 1, explanation: 'A colon must be preceded by a complete independent clause. It then introduces what comes next.' },
      { q: 'Which sentence correctly uses a semicolon?', options: ['The experiment was successful; however many variables still need testing.', 'The experiment was successful; however, many variables still need testing.', 'The experiment; was successful, however many variables still need testing.', 'The experiment was successful, however; many variables still need testing.'], answer: 1, explanation: 'A semicolon correctly joins two independent clauses. When using a transitional word like "however," it must be followed by a comma.' },
      { q: 'In which situation is an em dash (—) most appropriately used?', options: ['Before a list that follows a complete sentence', 'Instead of a period between two independent clauses', 'To add an interrupting phrase or to emphasize a parenthetical addition', 'Before every prepositional phrase'], answer: 2, explanation: 'Em dashes are used in pairs (or singly at the end) to set off an interruption or emphasizing addition.' },
      { q: 'The phrase "in other words" is used in the middle of a sentence between two independent clauses. Which punctuation correctly frames it?', options: ['Comma before and after: , in other words,', 'Semicolon before, comma after: ; in other words,', 'Colon before: : in other words', 'No punctuation needed'], answer: 1, explanation: 'When a transitional phrase connects two independent clauses, the pattern is: [clause]; transitional phrase, [clause].' }
    ]
  },

  // --- NEW ENGLISH TOPICS ---
  {
    id: 'mJrPKNZbwpQ', 
    title: 'SAT Reading: Cross-Text Connections',
    topic: 'Cross-Text Connections',
    subject: 'English',
    duration: '11 min',
    source: 'Khan Academy',
    color: 'blue',
    description: 'Learn how to compare and contrast two passages, identifying where authors agree, disagree, or intersect on key ideas.',
    practices: [
      { q: 'When a question asks how the author of Text 2 would respond to a specific claim in Text 1, your first step should be to:', options: ['Find the claim in Text 1 and fully understand it.', 'Read Text 2 and look for synonyms of the claim.', 'Skim both texts for the author\'s name.', 'Choose the option that sounds most critical of Text 1.'], answer: 0, explanation: 'You cannot predict the response until you perfectly understand the specific claim made in Text 1.' },
      { q: 'If Text 1 argues that electric cars will soon dominate the market, and Text 2 argues that battery supply chain issues will severely limit electric car production, how would Text 2\'s author respond to Text 1?', options: ['With total agreement', 'By pointing out a practical limitation to Text 1\'s prediction', 'By arguing that gas cars are better for the environment', 'By stating that electric cars are too expensive'], answer: 1, explanation: 'Text 2 focuses on supply chain limitations, which acts as a practical barrier to Text 1\'s optimistic prediction.' },
      { q: 'Which phrase often signals that an author is conceding a point to an opposing argument?', options: ['"Furthermore,"', '"In contrast,"', '"While it is true that..."', '"Therefore,"'], answer: 2, explanation: '"While it is true that..." acknowledges a valid point from the other side before presenting a counterargument.' },
      { q: 'Cross-text questions often test your ability to synthesize information. Synthesizing means:', options: ['Summarizing the first text', 'Combining ideas from both texts to form a new understanding or conclusion', 'Finding the longest paragraph', 'Identifying the vocabulary words the texts share'], answer: 1, explanation: 'Synthesis requires taking distinct ideas from multiple sources and putting them together.' },
      { q: 'If both texts discuss the same historical event but draw different conclusions, they differ in their:', options: ['Topic', 'Setting', 'Interpretation', 'Timeline'], answer: 2, explanation: 'Since the topic and event are the same, the difference lies in how each author interprets the meaning or significance of the event.' }
    ]
  },
  {
    id: 'mJrPKNZbwpQ',
    title: 'SAT Reading: Text Structure and Purpose',
    topic: 'Text Structure and Purpose',
    subject: 'English',
    duration: '10 min',
    source: 'Khan Academy',
    color: 'teal',
    description: 'Analyze how a passage is built. Understand the flow of ideas, paragraph roles, and the author\'s overall goal.',
    practices: [
      { q: 'If a passage begins with a common misconception and ends with scientific data disproving it, what is its primary structure?', options: ['Chronological narrative', 'Problem and solution', 'Presenting a flawed premise followed by corrective evidence', 'Comparing two equal theories'], answer: 2, explanation: 'The structure moves from the misconception (flawed premise) to the data that corrects it.' },
      { q: 'When asked about the "overall purpose" of a text, you should focus on:', options: ['The primary reason the author wrote the text', 'The specific details in the second paragraph', 'The author\'s tone in the final sentence', 'The definitions of key terms'], answer: 0, explanation: 'The overall purpose is the author\'s main goal or intent for the entire passage.' },
      { q: 'A transition word like "However" at the start of a paragraph usually indicates a structural shift towards:', options: ['An expansion of the previous point', 'A counterargument or contrast', 'A summarizing conclusion', 'An unrelated new topic'], answer: 1, explanation: '"However" signals a pivot or contrast to the ideas presented just before it.' },
      { q: 'If an author uses a personal anecdote to open an essay about climate change, the structural purpose of the anecdote is likely to:', options: ['Provide rigorous scientific proof', 'Confuse the reader', 'Engage the reader and introduce the human impact of the topic', 'Conclude the essay\'s main argument'], answer: 2, explanation: 'Anecdotes at the beginning of texts are typically used to hook the reader and frame the topic in relatable terms.' },
      { q: 'Which option best describes a "compare and contrast" structure?', options: ['Listing events in the order they occurred', 'Detailing the similarities and differences between two or more subjects', 'Explaining how to perform a specific task step-by-step', 'Describing a problem and offering a single solution'], answer: 1, explanation: 'Compare and contrast focuses on identifying how subjects are alike (compare) and different (contrast).' }
    ]
  },
  {
    id: 'mJrPKNZbwpQ',
    title: 'SAT Reading: Words in Context',
    topic: 'Words in Context',
    subject: 'English',
    duration: '9 min',
    source: 'Khan Academy',
    color: 'blue',
    description: 'Use surrounding text clues to determine the precise meaning of vocabulary words in different contexts.',
    practices: [
      { q: 'In the sentence "The general\'s plan was so convoluted that even his top advisors could not understand it," what does "convoluted" mean?', options: ['Simple', 'Brilliant', 'Overly complex and difficult to follow', 'Quick to execute'], answer: 2, explanation: 'The context clue "even his top advisors could not understand it" points to a meaning of complex or confusing.' },
      { q: 'The best strategy for a "Words in Context" question is to:', options: ['Pick the most common definition of the word.', 'Look up the word in a dictionary.', 'Cross out the word, read the sentence, and predict what word should fill the blank based on context.', 'Choose the longest option.'], answer: 2, explanation: 'Predicting the word based on context before looking at the choices prevents you from being distracted by secondary meanings.' },
      { q: 'In the phrase "The artist\'s style was highly derivative, borrowing heavily from Picasso," "derivative" most nearly means:', options: ['Original', 'Uninspired or copied from others', 'Valuable', 'Colorful'], answer: 1, explanation: 'The phrase "borrowing heavily from Picasso" indicates the art is unoriginal or copied (derivative).' },
      { q: 'Which type of context clue provides the meaning of a word by showing what it is NOT?', options: ['Synonym clue', 'Antonym/Contrast clue', 'Example clue', 'Definition clue'], answer: 1, explanation: 'An antonym or contrast clue (often using words like "unlike" or "but") defines a word by showing its opposite.' },
      { q: 'If a word has multiple meanings, how do you determine the correct one for the SAT?', options: ['Always pick the most obscure meaning.', 'Pick the meaning that fits the specific sentence and paragraph context.', 'Pick the first definition in the dictionary.', 'Guess randomly.'], answer: 1, explanation: 'The SAT tests your ability to use context to determine which specific meaning of a multi-meaning word applies.' }
    ]
  },
  {
    id: 'nOnd3SiYZqM',
    title: 'SAT Writing: Rhetorical Synthesis',
    topic: 'Rhetorical Synthesis',
    subject: 'English',
    duration: '11 min',
    source: 'Khan Academy',
    color: 'pink',
    description: 'Learn how to combine notes and bullet points to achieve a specific writing goal or emphasize a key point.',
    practices: [
      { q: 'In Rhetorical Synthesis questions, your primary focus should always be on:', options: ['Including every single bullet point from the notes', 'Matching the specific goal requested in the prompt', 'Using the most sophisticated vocabulary', 'Making the sentence as short as possible'], answer: 1, explanation: 'The correct answer is the one that achieves the exact goal stated in the prompt, even if it ignores some bullet points.' },
      { q: 'If the prompt asks you to "emphasize the duration" of an event, the correct choice must include:', options: ['The location of the event', 'The names of the people involved', 'Specific timeframes, dates, or lengths of time', 'The cost of the event'], answer: 2, explanation: 'To emphasize duration, the answer must explicitly mention how long the event lasted.' },
      { q: 'Which choice correctly synthesizes two notes about a book\'s author and its publication year?', options: ['The book is very long.', 'Written by Jane Smith, the book was published in 2020.', 'Jane Smith is a great writer.', 'The book was published recently and won an award.'], answer: 1, explanation: 'Only choice B combines both the author (Jane Smith) and the publication year (2020).' },
      { q: 'When a prompt asks you to "introduce a concept to an audience unfamiliar with it," you should look for an answer that:', options: ['Uses highly technical jargon', 'Provides a clear, basic definition or explanation of the concept', 'Only gives the history of the concept', 'Assumes the audience already knows the basics'], answer: 1, explanation: 'An unfamiliar audience needs a foundational definition or simple explanation.' },
      { q: 'True or False: The correct answer to a Rhetorical Synthesis question will always be the longest option.', options: ['True', 'False'], answer: 1, explanation: 'False. The correct answer is the one that meets the prompt\'s goal, regardless of length.' }
    ]
  },
  {
    id: 'nOnd3SiYZqM',
    title: 'SAT Writing: Form, Structure, and Sense',
    topic: 'Form, Structure, and Sense',
    subject: 'English',
    duration: '12 min',
    source: 'Khan Academy',
    color: 'amber',
    description: 'Master subject-verb agreement, pronoun-antecedent agreement, and verb tense consistency.',
    practices: [
      { q: 'Choose the correct verb: "The collection of rare books (was/were) donated to the library."', options: ['was', 'were', 'are', 'have been'], answer: 0, explanation: 'The subject is "collection" (singular), so the singular verb "was" is required. "Of rare books" is a prepositional phrase.' },
      { q: 'Identify the pronoun error: "Every student must bring their own lunch."', options: ['No error', '"student" should be plural', '"their" should be "his or her" (formally) or "Every student" should be changed to "All students"', '"lunch" should be plural'], answer: 2, explanation: 'Formally, "Every student" is singular and requires a singular pronoun, though "their" is increasingly accepted; changing to "All students" avoids the issue.' },
      { q: 'Which sentence maintains consistent verb tense?', options: ['She walked to the store and buys an apple.', 'She walks to the store and bought an apple.', 'She walked to the store and bought an apple.', 'She will walk to the store and bought an apple.'], answer: 2, explanation: 'Both verbs ("walked" and "bought") are in the past tense, maintaining consistency.' },
      { q: 'Choose the correct form: "Neither the manager nor the employees (is/are) happy with the decision."', options: ['is', 'are', 'was', 'has been'], answer: 1, explanation: 'In "neither/nor" constructions, the verb agrees with the noun closest to it ("employees," which is plural, so "are").' },
      { q: 'What is a dangling modifier?', options: ['A verb that is missing a subject', 'A descriptive phrase that doesn\'t logically or grammatically attach to the noun it\'s supposed to modify', 'A sentence with too many commas', 'A pronoun with no clear antecedent'], answer: 1, explanation: 'A dangling modifier describes something that isn\'t clearly or correctly stated in the sentence.' }
    ]
  },
  {
    id: 'nOnd3SiYZqM',
    title: 'SAT Reading: Inferences',
    topic: 'Inferences',
    subject: 'English',
    duration: '14 min',
    source: 'Khan Academy',
    color: 'indigo',
    description: 'Learn to draw logical conclusions based only on the evidence explicitly provided in the text.',
    practices: [
      { q: 'An inference on the SAT must be:', options: ['A wild guess', 'A logical conclusion strongly supported by specific evidence in the text', 'Outside knowledge you bring to the test', 'An opinion about the author\'s style'], answer: 1, explanation: 'SAT inferences are not guesses; they must be strictly proven by the facts in the passage.' },
      { q: 'If a passage states that "Only mammals have hair, and organism X has hair," what is a valid inference?', options: ['Organism X is a dog.', 'Organism X is a mammal.', 'Organism X is warm-blooded.', 'Organism X lives on land.'], answer: 1, explanation: 'Since only mammals have hair and X has hair, X must be a mammal.' },
      { q: 'Which phrase is a common trap in Inference questions?', options: ['Extreme words like "always," "never," or "only" that aren\'t supported by the text', 'Direct quotes from the text', 'Synonyms for words in the passage', 'Moderate words like "sometimes" or "may"'], answer: 0, explanation: 'Extreme language in answer choices is often a trap unless the passage explicitly uses extreme language.' },
      { q: 'If an author argues that a new policy "fails to address the root causes of the issue," you can infer that the author:', options: ['Supports the policy wholeheartedly', 'Believes the policy is somewhat flawed or incomplete', 'Wrote the policy', 'Thinks the issue has no root causes'], answer: 1, explanation: 'Criticizing a policy for failing to address root causes implies the author sees it as flawed or incomplete.' },
      { q: 'When asked what an author "implies," you should:', options: ['Look for the exact sentence that states the answer verbatim', 'Connect two or more facts stated in the text to find the unstated, logical result', 'Choose the answer that sounds the most academic', 'Ignore the text entirely'], answer: 1, explanation: 'Implications are unstated conclusions drawn directly from connecting stated facts.' }
    ]
  },

  // --- NEW MATH TOPICS ---
  {
    id: 'XRH0w7gCpV8',
    title: 'SAT Math: Systems of Linear Equations',
    topic: 'Systems of two linear equations in two variables',
    subject: 'Math',
    duration: '15 min',
    source: 'Khan Academy',
    color: 'cyan',
    description: 'Master solving systems of equations using substitution, elimination, and understanding solutions by graphing.',
    practices: [
      { q: 'If 2x + y = 7 and x - y = 2, what is the value of x?', options: ['1', '2', '3', '4'], answer: 2, explanation: 'Add the two equations: (2x+y) + (x-y) = 7+2. So 3x = 9, which means x = 3.' },
      { q: 'A system of two linear equations has no solution. What does this mean about their graphs?', options: ['They are the same line', 'They are perpendicular', 'They are parallel', 'They intersect at one point'], answer: 2, explanation: 'Parallel lines never intersect, so the system has no solution.' },
      { q: 'If 3x + 4y = 12 and 6x + 8y = 24, how many solutions does the system have?', options: ['0', '1', '2', 'Infinitely many'], answer: 3, explanation: 'The second equation is exactly twice the first. They represent the same line, so there are infinitely many solutions.' },
      { q: 'Using substitution to solve: x = 2y, and x + y = 12. What is y?', options: ['3', '4', '6', '8'], answer: 1, explanation: 'Substitute 2y for x in the second equation: 2y + y = 12, so 3y = 12, giving y = 4.' },
      { q: 'If a system has exactly one solution, the lines must:', options: ['Have the same slope', 'Have different slopes', 'Be identical', 'Both pass through the origin'], answer: 1, explanation: 'Lines with different slopes will always intersect at exactly one point.' }
    ]
  },
  {
    id: 'XRH0w7gCpV8',
    title: 'SAT Math: Linear Inequalities',
    topic: 'Linear inequalities in one or two variables',
    subject: 'Math',
    duration: '12 min',
    source: 'Khan Academy',
    color: 'purple',
    description: 'Learn how to solve inequalities, flip the sign, and graph inequalities on a coordinate plane.',
    practices: [
      { q: 'Solve for x: -2x + 5 > 11', options: ['x > -3', 'x < -3', 'x > 3', 'x < 3'], answer: 1, explanation: 'Subtract 5: -2x > 6. Divide by -2 and flip the inequality sign: x < -3.' },
      { q: 'Which point is in the solution set of y > 2x - 1?', options: ['(0, -2)', '(1, 1)', '(0, 0)', '(2, 2)'], answer: 2, explanation: 'Test (0,0): 0 > 2(0) - 1 => 0 > -1, which is true.' },
      { q: 'When graphing y ≤ -x + 4, the boundary line is ______ and the shading is ______.', options: ['solid, above', 'dashed, above', 'solid, below', 'dashed, below'], answer: 2, explanation: 'The "≤" means a solid boundary line, and "less than" means shading below the line.' },
      { q: 'If 3x - 4 ≤ 5, what is the greatest possible integer value of x?', options: ['2', '3', '4', '5'], answer: 1, explanation: '3x ≤ 9, so x ≤ 3. The greatest integer is 3.' },
      { q: 'To solve an inequality, you must flip the inequality symbol when you:', options: ['Add a negative number', 'Subtract a positive number', 'Multiply or divide by a negative number', 'Multiply or divide by a positive number'], answer: 2, explanation: 'Flipping the inequality is only required when multiplying or dividing both sides by a negative value.' }
    ]
  },
  {
    id: 'XRH0w7gCpV8',
    title: 'SAT Math: Equivalent Expressions',
    topic: 'Equivalent expressions',
    subject: 'Math',
    duration: '11 min',
    source: 'Khan Academy',
    color: 'emerald',
    description: 'Learn how to manipulate algebraic expressions using factoring, distributing, and combining like terms.',
    practices: [
      { q: 'Which expression is equivalent to 2(x + 3) + 4x?', options: ['6x + 3', '6x + 6', '8x + 6', '2x + 6'], answer: 1, explanation: 'Distribute the 2: 2x + 6 + 4x. Combine like terms: 6x + 6.' },
      { q: 'Factor the expression: x² - 9', options: ['(x-3)(x-3)', '(x+3)(x+3)', '(x-9)(x+1)', '(x-3)(x+3)'], answer: 3, explanation: 'This is a difference of squares: a² - b² = (a-b)(a+b), so x² - 9 = (x-3)(x+3).' },
      { q: 'Which expression is equivalent to (x²y³)(x⁴y)?', options: ['x⁶y⁴', 'x⁸y³', 'x²y²', 'x⁶y³'], answer: 0, explanation: 'When multiplying terms with the same base, add the exponents: x^(2+4) * y^(3+1) = x⁶y⁴.' },
      { q: 'Expand (x + 5)²', options: ['x² + 25', 'x² + 5x + 25', 'x² + 10x + 25', 'x² + 10'], answer: 2, explanation: '(x+5)(x+5) = x² + 5x + 5x + 25 = x² + 10x + 25.' },
      { q: 'Which is equivalent to 3x(2x - 1)?', options: ['6x² - 1', '6x² - 3x', '5x - 3x', '5x² - 3x'], answer: 1, explanation: 'Distribute 3x to both terms: (3x * 2x) - (3x * 1) = 6x² - 3x.' }
    ]
  },
  {
    id: 'UFBzXhLIIA8',
    title: 'SAT Math: Ratios, Rates & Proportions',
    topic: 'Ratios, rates, proportional relationships, and units',
    subject: 'Math',
    duration: '14 min',
    source: 'Khan Academy',
    color: 'rose',
    description: 'Master unit conversions, proportional reasoning, and solving word problems involving rates.',
    practices: [
      { q: 'A car travels 120 miles in 2 hours. At this rate, how far will it travel in 5 hours?', options: ['240 miles', '300 miles', '360 miles', '400 miles'], answer: 1, explanation: 'Rate = 120/2 = 60 miles per hour. Distance in 5 hours = 60 * 5 = 300 miles.' },
      { q: 'If the ratio of apples to oranges in a basket is 3:2 and there are 15 apples, how many oranges are there?', options: ['5', '10', '15', '20'], answer: 1, explanation: 'Apples = 3x, Oranges = 2x. If 3x = 15, then x = 5. Oranges = 2 * 5 = 10.' },
      { q: 'Convert 60 miles per hour to miles per minute.', options: ['1 mile/min', '2 miles/min', '10 miles/min', '60 miles/min'], answer: 0, explanation: '60 miles / 60 minutes = 1 mile per minute.' },
      { q: 'If y is directly proportional to x, and y = 10 when x = 2, what is y when x = 5?', options: ['15', '20', '25', '50'], answer: 2, explanation: 'Direct proportion: y = kx. So 10 = k(2), giving k=5. When x=5, y = 5*5 = 25.' },
      { q: 'A recipe requires 2 cups of sugar for every 3 cups of flour. If you use 9 cups of flour, how many cups of sugar are needed?', options: ['4', '5', '6', '8'], answer: 2, explanation: 'Proportion: 2/3 = x/9. Cross-multiply: 3x = 18. x = 6.' }
    ]
  },
  {
    id: 'UFBzXhLIIA8',
    title: 'SAT Math: Percentages',
    topic: 'Percentages',
    subject: 'Math',
    duration: '10 min',
    source: 'Khan Academy',
    color: 'amber',
    description: 'Learn quick methods for calculating percent increase/decrease and translating percent word problems.',
    practices: [
      { q: 'What is 20% of 150?', options: ['15', '20', '30', '40'], answer: 2, explanation: '0.20 * 150 = 30.' },
      { q: 'A $40 shirt is discounted by 25%. What is the new price?', options: ['$10', '$25', '$30', '$35'], answer: 2, explanation: 'Discount is 0.25 * 40 = 10. New price = 40 - 10 = $30. Alternatively: 40 * 0.75 = 30.' },
      { q: 'If a population grows from 200 to 250, what is the percent increase?', options: ['20%', '25%', '40%', '50%'], answer: 1, explanation: 'Increase = 250 - 200 = 50. Percent increase = (Increase / Original) * 100 = (50 / 200) * 100 = 25%.' },
      { q: 'A $50 item includes a 10% tax in its final price. Wait, if the pre-tax price is x and tax is 10%, the final price is 55. What is x?', options: ['$45', '$50', '$55', '$60'], answer: 1, explanation: 'Pre-tax * 1.10 = 55. x = 55 / 1.10 = 50.' },
      { q: 'To calculate a 15% decrease of a number, multiply the number by:', options: ['0.15', '0.85', '1.15', '1.85'], answer: 1, explanation: 'A 15% decrease means keeping 85% of the original amount. So multiply by 0.85.' }
    ]
  },
  {
    id: 'UFBzXhLIIA8',
    title: 'SAT Math: Models and Scatterplots',
    topic: 'Two-variable data: Models and scatterplots',
    subject: 'Math',
    duration: '11 min',
    source: 'Khan Academy',
    color: 'indigo',
    description: 'Learn to read scatterplots, understand lines of best fit, and interpret slope and y-intercept in context.',
    practices: [
      { q: 'In a scatterplot showing hours studied (x) and test score (y), the line of best fit has a slope of 5. What does this mean?', options: ['For every hour studied, the score increases by an average of 5 points.', 'Every student scored at least a 5.', 'The maximum score is 5 times the hours studied.', 'For every 5 hours studied, the score increases by 1.'], answer: 0, explanation: 'Slope is the change in y (score) for each 1 unit change in x (hours).' },
      { q: 'A scatterplot shows a downward trend from left to right. What kind of correlation is this?', options: ['Positive', 'Negative', 'Zero', 'Undefined'], answer: 1, explanation: 'A downward trend means as x increases, y decreases, which is a negative correlation.' },
      { q: 'The y-intercept of a line of best fit for a plant\'s growth model represents:', options: ['The maximum height of the plant', 'The growth rate per day', 'The plant\'s initial height when time = 0', 'The total number of days'], answer: 2, explanation: 'The y-intercept is the value of y when x=0, which usually represents the starting or initial value in real-world models.' },
      { q: 'If a data point lies significantly above the line of best fit, the model\'s predicted value for that x was:', options: ['Too high', 'Too low', 'Exactly correct', 'Negative'], answer: 1, explanation: 'The actual data point is higher than the line, meaning the model predicted a lower value than reality.' },
      { q: 'Which equation best models a strong positive linear relationship passing through the origin?', options: ['y = -3x', 'y = 3', 'y = 3x', 'y = x²'], answer: 2, explanation: 'Passing through origin means y-intercept is 0. Positive linear relationship means positive slope.' }
    ]
  },
  {
    id: 'vxCMiPGoqI0',
    title: 'SAT Math: Sample Statistics and Margin of Error',
    topic: 'Inference from sample statistics and margin of error',
    subject: 'Math',
    duration: '13 min',
    source: 'Khan Academy',
    color: 'teal',
    description: 'Understand how sample size affects margin of error and how to draw valid population inferences.',
    practices: [
      { q: 'A poll of 500 voters shows Candidate A with 52% of the vote, with a margin of error of ±3%. What can be concluded?', options: ['Candidate A will definitely win.', 'Candidate A\'s true support is likely between 49% and 55%.', 'Exactly 52% of all voters support Candidate A.', 'The poll is invalid because it didn\'t survey everyone.'], answer: 1, explanation: 'The margin of error gives a confidence interval around the sample statistic: 52% - 3% to 52% + 3%.' },
      { q: 'If a researcher wants to decrease the margin of error in her next survey, she should:', options: ['Increase the sample size', 'Decrease the sample size', 'Only survey people she knows', 'Ask fewer questions'], answer: 0, explanation: 'A larger, truly random sample size reduces the margin of error because the sample better represents the population.' },
      { q: 'Can a sample statistic be generalized to the entire population?', options: ['Yes, always', 'No, never', 'Only if the sample was randomly selected from that population', 'Only if the margin of error is 0%'], answer: 2, explanation: 'Generalization is only valid if the sample is a random, representative subset of the specific population.' },
      { q: 'Two random samples are taken from a school: Sample 1 has 50 students, Sample 2 has 200 students. Which sample likely has a smaller margin of error?', options: ['Sample 1', 'Sample 2', 'They are the same', 'It depends on the questions asked'], answer: 1, explanation: 'Larger sample sizes generally result in smaller margins of error.' },
      { q: 'A survey found that 30% of a city\'s randomly sampled residents own dogs. If the city has 10,000 residents, approximately how many own dogs?', options: ['300', '1,000', '3,000', '30,000'], answer: 2, explanation: '10,000 * 0.30 = 3,000 residents.' }
    ]
  },
  {
    id: 'vxCMiPGoqI0',
    title: 'SAT Math: Observational Studies and Experiments',
    topic: 'Evaluating statistical claims: Observational studies and experiments',
    subject: 'Math',
    duration: '12 min',
    source: 'Khan Academy',
    color: 'blue',
    description: 'Learn the difference between correlation and causation, and when an experiment can prove cause-and-effect.',
    practices: [
      { q: 'In order to prove a cause-and-effect relationship, a study MUST:', options: ['Survey at least 1,000 people', 'Be an observational study', 'Randomly assign participants to treatment and control groups', 'Have a margin of error of zero'], answer: 2, explanation: 'Only a properly controlled experiment with random assignment to groups can prove causation.' },
      { q: 'A researcher observes that people who drink more coffee tend to have lower blood pressure. She can conclude:', options: ['Coffee causes lower blood pressure.', 'Lower blood pressure makes people crave coffee.', 'There is an association (correlation) between coffee drinking and blood pressure.', 'Coffee is a cure for high blood pressure.'], answer: 2, explanation: 'Observational studies can only show correlation, not causation.' },
      { q: 'What is a "control group" in an experiment?', options: ['The group that receives the experimental treatment', 'The group that does not receive the experimental treatment', 'The researchers conducting the study', 'The group with the highest scores'], answer: 1, explanation: 'The control group serves as a baseline by not receiving the new treatment.' },
      { q: 'Why is random assignment important in an experiment?', options: ['It guarantees the experiment will succeed.', 'It helps ensure the treatment and control groups are as similar as possible before the treatment.', 'It reduces the margin of error.', 'It makes the math easier.'], answer: 1, explanation: 'Random assignment minimizes pre-existing differences (confounding variables) between the groups.' },
      { q: 'If a study only asks volunteers to report their daily habits, it is a:', options: ['Controlled experiment', 'Random assignment', 'Observational study', 'Double-blind study'], answer: 2, explanation: 'Since the researchers are merely observing/recording data without assigning treatments, it is an observational study.' }
    ]
  },
  {
    id: 'vxCMiPGoqI0',
    title: 'SAT Math: Area and Volume',
    topic: 'Area and volume',
    subject: 'Math',
    duration: '13 min',
    source: 'Khan Academy',
    color: 'pink',
    description: 'Review formulas for 2D areas and 3D volumes including cylinders, prisms, spheres, and cones.',
    practices: [
      { q: 'What is the volume of a rectangular prism with length 4, width 5, and height 6?', options: ['15', '30', '60', '120'], answer: 3, explanation: 'Volume = length * width * height = 4 * 5 * 6 = 120.' },
      { q: 'The area of a triangle with base 10 and height 8 is:', options: ['18', '40', '80', '100'], answer: 1, explanation: 'Area = 1/2 * base * height = 1/2 * 10 * 8 = 40.' },
      { q: 'What is the volume of a cylinder with radius 3 and height 10?', options: ['30π', '60π', '90π', '100π'], answer: 2, explanation: 'Volume = πr²h = π(3²)(10) = 90π.' },
      { q: 'If the sides of a square are doubled, its area is multiplied by:', options: ['2', '4', '8', '16'], answer: 1, explanation: 'Area of square is s². If side is 2s, area is (2s)² = 4s², which is 4 times larger.' },
      { q: 'The volume of a sphere is given by V = (4/3)πr³. What is the volume if r = 3?', options: ['9π', '12π', '27π', '36π'], answer: 3, explanation: 'V = (4/3)π(3³) = (4/3)π(27) = 36π.' }
    ]
  },
  {
    id: 'QqIAE7MgJwU',
    title: 'SAT Math: Lines, Angles, and Triangles',
    topic: 'Lines, angles, and triangles',
    subject: 'Math',
    duration: '14 min',
    source: 'Khan Academy',
    color: 'amber',
    description: 'Master parallel lines, transversals, vertical angles, and the properties of similar and congruent triangles.',
    practices: [
      { q: 'If two parallel lines are intersected by a transversal, the alternate interior angles are:', options: ['Complementary', 'Supplementary', 'Equal', 'Perpendicular'], answer: 2, explanation: 'Alternate interior angles are equal when lines are parallel.' },
      { q: 'The angles of a triangle always add up to:', options: ['90°', '180°', '270°', '360°'], answer: 1, explanation: 'The sum of interior angles of a triangle is always 180°.' },
      { q: 'In a triangle, if two sides are equal, then:', options: ['It is a right triangle', 'The angles opposite those sides are equal', 'All three angles are 60°', 'It is a scalene triangle'], answer: 1, explanation: 'This is an isosceles triangle; angles opposite equal sides are also equal.' },
      { q: 'If two triangles are similar, their corresponding angles are ______ and their corresponding sides are ______.', options: ['equal, equal', 'proportional, equal', 'equal, proportional', 'proportional, proportional'], answer: 2, explanation: 'Similar triangles have identical angles, but their side lengths are scaled by a proportion.' },
      { q: 'What is an exterior angle of a triangle equal to?', options: ['The sum of the two opposite interior angles', '180° minus the adjacent interior angle', 'Both A and B are correct', 'Neither is correct'], answer: 2, explanation: 'An exterior angle equals the sum of the two remote interior angles, and forms a linear pair (180°) with its adjacent interior angle.' }
    ]
  },
  {
    id: 'QqIAE7MgJwU',
    title: 'SAT Math: Right Triangles & Trigonometry',
    topic: 'Right triangles and trigonometry',
    subject: 'Math',
    duration: '15 min',
    source: 'Khan Academy',
    color: 'cyan',
    description: 'Learn SOH CAH TOA, the Pythagorean theorem, and special right triangle ratios (30-60-90 and 45-45-90).',
    practices: [
      { q: 'In a right triangle, the side lengths are 3, 4, and x (the hypotenuse). What is x?', options: ['5', '6', '7', '25'], answer: 0, explanation: 'Using the Pythagorean theorem: 3² + 4² = x², so 9 + 16 = 25, which means x = 5.' },
      { q: 'In a right triangle, sin(A) = 3/5. What is cos(B) if A and B are the acute angles?', options: ['3/5', '4/5', '5/3', 'Cannot be determined'], answer: 0, explanation: 'In a right triangle, the sine of an acute angle is equal to the cosine of its complement. So sin(A) = cos(B) = 3/5.' },
      { q: 'In a 45-45-90 triangle, if the legs are each length 5, what is the hypotenuse?', options: ['5', '5√2', '5√3', '10'], answer: 1, explanation: 'The sides of a 45-45-90 triangle are in the ratio x : x : x√2. So the hypotenuse is 5√2.' },
      { q: 'Which trigonometric ratio is defined as Opposite/Adjacent?', options: ['Sine', 'Cosine', 'Tangent', 'Secant'], answer: 2, explanation: 'SOH CAH TOA: Tangent = Opposite / Adjacent.' },
      { q: 'In a 30-60-90 triangle, the side opposite the 30° angle is 4. What is the length of the hypotenuse?', options: ['4√3', '8', '8√3', '16'], answer: 1, explanation: 'The sides are in the ratio x : x√3 : 2x. If the shortest side (x) is 4, the hypotenuse (2x) is 8.' }
    ]
  }
];

export const TOPIC_VIDEO_MAP: Record<string, string> = {
  // English
  'Cross-Text Connections': 'mJrPKNZbwpQ',
  'Text Structure and Purpose': 'mJrPKNZbwpQ',
  'Words in Context': 'mJrPKNZbwpQ',
  'Rhetorical Synthesis': 'nOnd3SiYZqM',
  'Transitions': 'kn-2_Q4GtUU',
  'Central Ideas and Details': 'zexX6t0dMjs',
  'Command of Evidence': 'mJrPKNZbwpQ',
  'Inferences': 'nOnd3SiYZqM',
  'Boundaries': 'nOnd3SiYZqM',
  'Form, Structure, and Sense': 'nOnd3SiYZqM',

  // Math
  'Linear equations in one variable': 'XRH0w7gCpV8',
  'Linear functions': 'XRH0w7gCpV8',
  'Linear equations in two variables': 'XRH0w7gCpV8',
  'Systems of two linear equations in two variables': 'XRH0w7gCpV8',
  'Linear inequalities in one or two variables': 'XRH0w7gCpV8',
  'Equivalent expressions': 'XRH0w7gCpV8',
  'Nonlinear equations in one variable and systems of equations in two variables': 'UFBzXhLIIA8',
  'Nonlinear functions': 'UFBzXhLIIA8',
  'Ratios, rates, proportional relationships, and units': 'UFBzXhLIIA8',
  'Percentages': 'UFBzXhLIIA8',
  'One-variable data: Distributions and measures of center and spread': 'vxCMiPGoqI0',
  'Two-variable data: Models and scatterplots': 'UFBzXhLIIA8',
  'Probability and conditional probability': 'vxCMiPGoqI0',
  'Inference from sample statistics and margin of error': 'vxCMiPGoqI0',
  'Evaluating statistical claims: Observational studies and experiments': 'vxCMiPGoqI0',
  'Area and volume': 'vxCMiPGoqI0',
  'Lines, angles, and triangles': 'QqIAE7MgJwU',
  'Right triangles and trigonometry': 'QqIAE7MgJwU',
  'Circles': 'QqIAE7MgJwU',
};
