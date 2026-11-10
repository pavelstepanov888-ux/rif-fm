import { readFile, writeFile } from 'node:fs/promises';

const source = JSON.parse(await readFile(new URL('../design/figma-tokens.json', import.meta.url), 'utf8'));
const prototype = JSON.parse(await readFile(new URL('../design/prototype-tokens.json', import.meta.url), 'utf8'));
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
const prototypeRoles = prototype.tokens.map(token => `  ${token.cssVariable}: ${token.value};`).join('\n');
const versionOverrides = Object.entries(prototype.versions).filter(([, values]) => Object.keys(values).length)
  .map(([version, values]) => `:root[data-prototype-version="${version}"] {\n${Object.entries(values).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}`).join('\n\n');
await writeFile(new URL('../src/tokens.css', import.meta.url), `/* Generated from Figma variables. Run npm run tokens. */\n:root {\n${defaults.join('\n')}\n}\n\n@media (max-width: 767px) {\n  :root {\n${overrides.join('\n')}\n  }\n}\n\n/* User-requested roles and versions from design/prototype-tokens.json. */\n:root {\n${prototypeRoles}\n}\n\n${versionOverrides}\n`);
console.log(`Generated ${defaults.length} Figma tokens, ${overrides.length} mobile overrides and ${prototype.tokens.length} prototype color roles.`);
