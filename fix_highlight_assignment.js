const fs = require('fs');
const file = 'src/app/classroom/assignment/[id]/page.tsx';

let content = fs.readFileSync(file, 'utf8');

// 1. Add HighlightableText to the question stem
const oldStem = "<LatexRenderer text={currentQuestion.stem} />";
const newStem = `<HighlightableText
                                        text={currentQuestion.stem}
                                        className=""
                                        highlights={[]}
                                        onAddHighlight={() => {}}
                                        onRemoveHighlight={() => {}}
                                        onUpdateHighlight={() => {}}
                                        isHighlightModeActive={isHighlightActive}
                                    />`;

content = content.replace(oldStem, newStem);

// 2. Add HighlightableText to options
const oldOpt = "<LatexRenderer text={optText} />";
const newOpt = `<HighlightableText
                                                        text={optText}
                                                        className=""
                                                        highlights={[]}
                                                        onAddHighlight={() => {}}
                                                        onRemoveHighlight={() => {}}
                                                        onUpdateHighlight={() => {}}
                                                        isHighlightModeActive={isHighlightActive}
                                                    />`;

content = content.replace(oldOpt, newOpt);

fs.writeFileSync(file, content);
