const imageUpload = document.getElementById('image-upload');
const analyzeButton = document.getElementById('analyze-button');
const imagePreview = document.getElementById('image-preview');
const analysisResult = document.getElementById('analysis-result');
const progress = document.getElementById('progress');

let uploadedImage = null;

imageUpload.addEventListener('change', (event) => {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage = e.target.result;
            imagePreview.innerHTML = `<img src="${uploadedImage}" alt="Uploaded Portfolio">`;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
});

analyzeButton.addEventListener('click', async () => {
    if (!uploadedImage) {
        alert('Please upload an image first.');
        return;
    }

    progress.textContent = 'Analyzing image...';
    analysisResult.innerHTML = '';

    try {
        const { data: { text } } = await Tesseract.recognize(
            uploadedImage,
            'eng+kor',
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        progress.textContent = `Recognizing text... ${Math.round(m.progress * 100)}%`;
                    }
                }
            }
        );

        console.log('Recognized text:', text);

        // For now, just display the raw text.
        // In the next steps, we will parse this text to extract stock information.
        analysisResult.innerHTML = `
            <h3>Recognized Text:</h3>
            <pre>${text}</pre>
        `;

    } catch (error) {
        console.error(error);
        analysisResult.innerHTML = `<p style="color: red;">Error during analysis: ${error.message}</p>`;
    } finally {
        progress.textContent = '';
    }
});


const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const themeLabel = themeToggle.querySelector('.theme-toggle__label');

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
  themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
};

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', nextTheme);
  applyTheme(nextTheme);
});
