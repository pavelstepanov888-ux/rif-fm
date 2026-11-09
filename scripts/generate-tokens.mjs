import { readFile, writeFile } from 'node:fs/promises';

const source = JSON.parse(await readFile(new URL('../design/figma-tokens.json', import.meta.url), 'utf8'));
const byId = new Map(source.variables.map(v => [v.id, v]));
const name = v => `--${v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;
const format = (v, value) => {
  if (value?.type === 'VARIABLE_ALIAS') return `var(${name(byId.get(value.id))})`;
  if (v.type === 'COLOR') {
    const rgb = ['r', 'g', 'b'].map(k => Math.round(value[k] * 255));
    return value.a < 1 ? `rgb(${rgb.join(' ')} / ${value.a})` : `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`;
  }
  return v.type === 'FLOAT' ? `${value}px` : String(value);
};
const defaults = source.variables.map(v => {
  const c = source.collections.find(c => c.id === v.collection);
  return `  ${name(v)}: ${format(v, v.values[c.defaultModeId])};`;
});
const dimensions = source.collections.find(c => c.name === 'Dimensions');
const mobile = dimensions.modes.find(m => m.name === 'Mobile').modeId;
const overrides = source.variables.filter(v => v.collection === dimensions.id && JSON.stringify(v.values[mobile]) !== JSON.stringify(v.values[dimensions.defaultModeId]))
  .map(v => `    ${name(v)}: ${format(v, v.values[mobile])};`);
await writeFile(new URL('../src/tokens.css', import.meta.url), `/* Generated from Figma variables. Run npm run tokens. */\n:root {\n${defaults.join('\n')}\n}\n\n@media (max-width: 767px) {\n  :root {\n${overrides.join('\n')}\n  }\n}\n`);
console.log(`Generated ${defaults.length} tokens and ${overrides.length} mobile overrides.`);
