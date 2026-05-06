import json

# Read the generated TS file
with open('src/data/questions.ts', 'r') as f:
    content = f.read()

# Fix the import and types
content = content.replace("import { PracticeTest } from './questions_types';\n\n", "")
content = content.replace("duration?: string;", "duration: string;")
content = content.replace("totalQuestions?: number;", "totalQuestions: number;")
content = content.replace("moduleCount?: number;", "moduleCount: number;")

# Add satDates and studyResources
extras = """
export const satDates = [
    { month: 'AUG', date: 'August 23, 2025', target: '2025-08-23T08:00:00', registrationDeadline: 'August 8, 2025', lateRegistrationDeadline: 'August 12, 2025', changeDeadline: 'August 12, 2025' },
    { month: 'SEP', date: 'September 13, 2025', target: '2025-09-13T08:00:00', registrationDeadline: 'August 29, 2025', lateRegistrationDeadline: 'September 2, 2025', changeDeadline: 'September 2, 2025' },
    { month: 'OCT', date: 'October 4, 2025', target: '2025-10-04T08:00:00', registrationDeadline: 'September 19, 2025', lateRegistrationDeadline: 'September 23, 2025', changeDeadline: 'September 23, 2025' },
    { month: 'NOV', date: 'November 8, 2025', target: '2025-11-08T08:00:00', registrationDeadline: 'October 24, 2025', lateRegistrationDeadline: 'October 28, 2025', changeDeadline: 'October 28, 2025' },
    { month: 'DEC', date: 'December 6, 2025', target: '2025-12-06T08:00:00', registrationDeadline: 'November 21, 2025', lateRegistrationDeadline: 'November 25, 2025', changeDeadline: 'November 25, 2025' },
    { month: 'MAR', date: 'March 14, 2026', target: '2026-03-14T08:00:00', registrationDeadline: 'February 27, 2026', lateRegistrationDeadline: 'March 3, 2026', changeDeadline: 'March 3, 2026' },
    { month: 'MAY', date: 'May 2, 2026', target: '2026-05-02T08:00:00', registrationDeadline: 'April 17, 2026', lateRegistrationDeadline: 'April 21, 2026', changeDeadline: 'April 21, 2026' },
    { month: 'JUN', date: 'June 6, 2026', target: '2026-06-06T08:00:00', registrationDeadline: 'May 22, 2026', lateRegistrationDeadline: 'May 26, 2026', changeDeadline: 'May 26, 2026' },
];

export const studyResources = [
    { id: 1, title: 'Grammar Rules Guide', description: 'Comprehensive guide to SAT grammar and punctuation rules.', category: 'English', icon: 'book-open', color: 'purple' },
    { id: 2, title: 'Reading Strategies', description: 'Techniques for active reading and passage analysis.', category: 'English', icon: 'eye', color: 'emerald' },
    { id: 3, title: 'SAT Vocabulary 500', description: 'Most frequently tested vocabulary words with examples.', category: 'English', icon: 'file-text', color: 'rose' },
];
"""

content += extras

with open('src/data/questions.ts', 'w') as f:
    f.write(content)

