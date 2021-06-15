// generate index file

const fs = require('fs');
const path = require('path');
const fsAsync = fs.promises;

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

(async function transformIcons() {
  const componentTemplate = await fsAsync.readFile(path.join(__dirname, 'component.js'), 'utf-8');
  const iconRawFiles = await fsAsync.readdir(path.join(__dirname, 'raw'));
  const iconFiles = iconRawFiles.filter((file) => file.endsWith('.svg'));
  const names = [];

  for (const iconFile of iconFiles) {
    if (!(iconFile.includes('_fill') || iconFile.includes('_light'))) {
      await fsAsync.rm(path.join(__dirname, `raw/${iconFile}`));
      continue;
    }

    const svg = await fsAsync.readFile(path.join(__dirname, `raw/${iconFile}`), 'utf-8');

    if (
      !svg.includes('width="24')
      || !svg.includes('height="24')
      || !(svg.includes('="FFFFFF') || svg.includes('="white') || svg.includes('="#CCD2E3')))
    {
      console.log(iconFile);
    }

    const transformedSvg = svg
      .replace('width="24"', 'width={width}')
      .replace('height="24"', 'height={height}')
      .replace(/"#FFFFFF"/g, '{color}')
      .replace(/"#ffffff"/g, '{color}')
      .replace(/"white"/g, '{color}')
      .replace(/"#CCD2E3"/g, '{color}').trim();

    const output = `${componentTemplate}`.replace('/** SVG **/', transformedSvg);
    const name = capitalizeFirstLetter(camelize(iconFile.replace('.svg', '').replace(/-/g, ' ').replace(/_/g, ' ')));
    names.push(name);

    await fsAsync.writeFile(path.join(__dirname, '../src/icons', `${name}.js`), output);
  }

  const indexFile = names.map(name => `export { default as ${name} } from './${name}';`).join('\n');
  await fsAsync.writeFile(path.join(__dirname, '../src/icons/index.js'), indexFile);
})();
