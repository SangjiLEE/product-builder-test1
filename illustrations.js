import { animalProfiles } from './animals.js';

const grid = document.getElementById('illustration-grid');
const downloadAllButton = document.getElementById('download-all');

const downloadSvgAsPng = async (svgMarkup, filename, size = 512) => {
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const image = new Image();
  image.src = url;

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(image, 0, 0, size, size);

  URL.revokeObjectURL(url);

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = filename;
  link.click();
};

const renderCard = (animal) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'candidate-card illustration-card';
  wrapper.innerHTML = `
    ${animal.illustration}
    <strong>${animal.name}</strong>
    <button type="button" class="button-subtle download-button">PNG 저장</button>
  `;

  const button = wrapper.querySelector('.download-button');
  button.addEventListener('click', () => {
    downloadSvgAsPng(animal.illustration, `animal-${animal.key}.png`);
  });

  return wrapper;
};

animalProfiles.forEach((animal) => {
  grid.appendChild(renderCard(animal));
});

downloadAllButton.addEventListener('click', async () => {
  for (const animal of animalProfiles) {
    await downloadSvgAsPng(animal.illustration, `animal-${animal.key}.png`);
  }
});
