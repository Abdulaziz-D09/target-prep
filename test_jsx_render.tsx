import React from 'react';
import { renderToString } from 'react-dom/server';
import { LatexRenderer } from './src/components/LatexRenderer';

console.log(renderToString(<LatexRenderer text="The following text is from Chinua Achebe's 1964 novel <i>Arrow of God</i>. The novel is set in" />));
