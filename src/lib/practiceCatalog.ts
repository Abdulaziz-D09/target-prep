import { practiceTests, type PracticeTest, type TestModule, type TestSection } from '@/data/questions';

export type ModuleKey =
  | 'english-m1'
  | 'english-m2-easy'
  | 'english-m2-hard'
  | 'math-m1'
  | 'math-m2-easy'
  | 'math-m2-hard';

export type ModuleButton = {
  key: string;
  label: string;
  available: boolean;
  href?: string;
};

export type PracticeCard = {
  id: number;
  title: string;
  label: string;
  summary: string;
  duration: string;
  totalQuestions: number;
  moduleCount: number;
  fullTestHref: string;
  englishButtons: ModuleButton[];
  mathButtons: ModuleButton[];
};

type CombinedPracticeTest = PracticeTest & {
  englishSourceId: number;
  mathSourceId: number;
};

function cloneModule(module: TestModule): TestModule {
  return {
    timeMinutes: module.timeMinutes,
    questions: module.questions.map((question) => ({
      ...question,
      options: [...question.options],
    })),
  };
}

function cloneSection(section: TestSection): TestSection {
  return {
    name: section.name,
    modules: section.modules.map(cloneModule),
  };
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

const englishTests = practiceTests.filter((test) =>
  test.sections.some((section) => section.name === 'Reading and Writing')
);
const mathTests = practiceTests.filter((test) => test.sections.some((section) => section.name === 'Math'));

export const combinedPracticeTests: CombinedPracticeTest[] = englishTests.map((englishTest, index) => {
  const mathTest = mathTests[index];
  const sections = [
    cloneSection(englishTest.sections[0]),
    cloneSection(mathTest.sections[0]),
  ];
  const totalMinutes = sections.reduce(
    (sum, section) => sum + section.modules.reduce((moduleSum, module) => moduleSum + module.timeMinutes, 0),
    0
  );
  const totalQuestions = sections.reduce(
    (sum, section) => sum + section.modules.reduce((moduleSum, module) => moduleSum + module.questions.length, 0),
    0
  );

  return {
    id: index + 1,
    title: `Practice Test ${index + 1}`,
    description: '',
    type: 'Full Test',
    duration: formatDuration(totalMinutes),
    totalQuestions,
    moduleCount: 4,
    color: 'blue',
    sections,
    englishSourceId: englishTest.id,
    mathSourceId: mathTest.id,
  };
});

export const practiceCards: PracticeCard[] = combinedPracticeTests.map((test) => ({
  id: test.id,
  title: test.title,
  label: 'Target Prep Digital SAT',
  summary: 'Full-length adaptive run with English and Math modules in one clean flow.',
  duration: test.duration,
  totalQuestions: test.totalQuestions,
  moduleCount: test.moduleCount,
  fullTestHref: `/practice/test/${test.id}`,
  englishButtons: [
    { key: 'english-m1', label: 'Module 1', available: true, href: `/practice/test/${test.id}?module=english-m1` },
    {
      key: 'english-m2-easy',
      label: 'Module 2 Easy',
      available: true,
      href: `/practice/test/${test.id}?module=english-m2-easy`,
    },
    {
      key: 'english-m2-hard',
      label: 'Module 2 Hard',
      available: true,
      href: `/practice/test/${test.id}?module=english-m2-hard`,
    },
  ],
  mathButtons: [
    { key: 'math-m1', label: 'Module 1', available: true, href: `/practice/test/${test.id}?module=math-m1` },
    {
      key: 'math-m2-easy',
      label: 'Module 2 Easy',
      available: true,
      href: `/practice/test/${test.id}?module=math-m2-easy`,
    },
    {
      key: 'math-m2-hard',
      label: 'Module 2 Hard',
      available: true,
      href: `/practice/test/${test.id}?module=math-m2-hard`,
    },
  ],
}));

export function resolvePracticeTest(testId: number, moduleKey?: string | null): PracticeTest | null {
  const selected = combinedPracticeTests.find((test) => test.id === testId);
  if (!selected) return null;

  if (!moduleKey) {
    return {
      ...selected,
      sections: selected.sections.map(cloneSection),
    };
  }

  const englishSection = cloneSection(selected.sections[0]);
  const mathSection = cloneSection(selected.sections[1]);

  switch (moduleKey as ModuleKey) {
    case 'english-m1':
      return {
        id: selected.id,
        title: `${selected.title} · English Module 1`,
        description: '',
        type: 'Individual Module',
        duration: formatDuration(englishSection.modules[0].timeMinutes),
        totalQuestions: englishSection.modules[0].questions.length,
        moduleCount: 1,
        color: 'blue',
        sections: [{ name: englishSection.name, modules: [englishSection.modules[0]] }],
      };
    case 'english-m2-easy':
      return {
        id: selected.id,
        title: `${selected.title} · English Module 2 Easy`,
        description: '',
        type: 'Individual Module',
        duration: formatDuration(englishSection.modules[1].timeMinutes),
        totalQuestions: englishSection.modules[1].questions.length,
        moduleCount: 1,
        color: 'blue',
        sections: [{ name: englishSection.name, modules: [englishSection.modules[1]] }],
      };
    case 'english-m2-hard':
      return {
        id: selected.id,
        title: `${selected.title} · English Module 2 Hard`,
        description: '',
        type: 'Individual Module',
        duration: formatDuration(englishSection.modules[1].timeMinutes),
        totalQuestions: englishSection.modules[1].questions.length,
        moduleCount: 1,
        color: 'blue',
        sections: [{ name: englishSection.name, modules: [englishSection.modules[1]] }],
      };
    case 'math-m1':
      return {
        id: selected.id,
        title: `${selected.title} · Math Module 1`,
        description: '',
        type: 'Individual Module',
        duration: formatDuration(mathSection.modules[0].timeMinutes),
        totalQuestions: mathSection.modules[0].questions.length,
        moduleCount: 1,
        color: 'blue',
        sections: [{ name: mathSection.name, modules: [mathSection.modules[0]] }],
      };
    case 'math-m2-easy':
      return {
        id: selected.id,
        title: `${selected.title} · Math Module 2 Easy`,
        description: '',
        type: 'Individual Module',
        duration: formatDuration(mathSection.modules[1].timeMinutes),
        totalQuestions: mathSection.modules[1].questions.length,
        moduleCount: 1,
        color: 'blue',
        sections: [{ name: mathSection.name, modules: [mathSection.modules[1]] }],
      };
    case 'math-m2-hard':
      return {
        id: selected.id,
        title: `${selected.title} · Math Module 2 Hard`,
        description: '',
        type: 'Individual Module',
        duration: formatDuration(mathSection.modules[1].timeMinutes),
        totalQuestions: mathSection.modules[1].questions.length,
        moduleCount: 1,
        color: 'blue',
        sections: [{ name: mathSection.name, modules: [mathSection.modules[1]] }],
      };
    default:
      return {
        ...selected,
        sections: selected.sections.map(cloneSection),
      };
  }
}
