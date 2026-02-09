const imageUpload = document.getElementById('image-upload');
const analyzeButton = document.getElementById('analyze-button');
const imagePreview = document.getElementById('image-preview');
const analysisResult = document.getElementById('analysis-result');
const progress = document.getElementById('progress');

let uploadedImage = null;
let worker; // Declare worker globally

(async () => {
    progress.textContent = 'Loading Tesseract.js worker...';
    worker = await Tesseract.createWorker();
    await worker.loadLanguage('eng+kor');
    await worker.initialize('eng+kor');
    progress.textContent = 'Tesseract.js worker loaded.';
})();

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
    if (!worker) {
        alert('Tesseract.js worker is still loading. Please wait a moment.');
        return;
    }

    progress.textContent = 'Analyzing image...';
    analysisResult.innerHTML = '';

    try {
        const { data: { text } } = await worker.recognize(uploadedImage);

        console.log('Recognized text:', text);

        const newAssets = parsePortfolioText(text);
        if (newAssets.length > 0) {
            addAssetsToPortfolio(newAssets);
            const updatedPortfolio = loadPortfolio();
            // Call renderPortfolio to display the updated portfolio (will be implemented next)
            renderPortfolio(updatedPortfolio);
        } else {
            analysisResult.innerHTML = `<p>No recognizable assets found in the image.</p>`;
        }


    } catch (error) {
        console.error(error);
        analysisResult.innerHTML = `<p style="color: red;">Error during analysis: ${error.message}</p>`;
    } finally {
        progress.textContent = '';
    }
});

// Function to parse the OCR text and extract portfolio data
function parsePortfolioText(ocrResultText) {
    const assets = [];
    // This regex attempts to find lines with a word (asset name), followed by numbers (quantity/price)
    // This is a basic example and might need refinement based on actual portfolio statement formats.
    const lines = ocrResultText.split('\n');
    const assetRegex = /([a-zA-Z\s.-]+)\s+([\d,.]+)\s+([\d,.]+)/; // Matches Name, Value1, Value2

    lines.forEach(line => {
        const match = line.match(assetRegex);
        if (match) {
            // Assuming the first captured group is the name, second is quantity, third is price.
            // This order might need to be swapped or further processed based on actual data.
            const name = match[1].trim();
            const value1 = parseFloat(match[2].replace(/,/g, '')); // Remove commas for parsing
            const value2 = parseFloat(match[3].replace(/,/g, '')); // Remove commas for parsing

            // Simple heuristic: assume the smaller number is quantity, larger is price
            let quantity, price;
            if (value1 < value2) {
                quantity = value1;
                price = value2;
            } else {
                quantity = value2;
                price = value1;
            }

            assets.push({
                name: name,
                quantity: quantity,
                price: price
            });
        }
    });
    return assets;
}

// Local Storage Helper Functions
function loadPortfolio() {
    const portfolioJSON = localStorage.getItem('portfolio');
    return portfolioJSON ? JSON.parse(portfolioJSON) : [];
}

function savePortfolio(portfolio) {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

function addAssetsToPortfolio(newAssets) {
    const currentPortfolio = loadPortfolio();
    const updatedPortfolio = [...currentPortfolio, ...newAssets];
    savePortfolio(updatedPortfolio);
    return updatedPortfolio;
}

// Function to render the portfolio in the UI
function renderPortfolio(portfolio) {
    if (portfolio.length === 0) {
        analysisResult.innerHTML = '<p>Your portfolio is empty. Upload an image to add assets.</p>';
        return;
    }

    let tableHTML = `
        <h3>Your Portfolio</h3>
        <table class="portfolio-table">
            <thead>
                <tr>
                    <th>Asset Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total Value</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalPortfolioValue = 0;

    portfolio.forEach(asset => {
        const totalValue = asset.quantity * asset.price;
        totalPortfolioValue += totalValue;
        tableHTML += `
            <tr>
                <td>${asset.name}</td>
                <td>${asset.quantity}</td>
                <td>${asset.price.toFixed(2)}</td>
                <td>${totalValue.toFixed(2)}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3"><strong>Total Portfolio Value:</strong></td>
                    <td><strong>${totalPortfolioValue.toFixed(2)}</strong></td>
                </tr>
            </tfoot>
        </table>
    `;

    analysisResult.innerHTML = tableHTML;
}

// Initialize portfolio display on load
document.addEventListener('DOMContentLoaded', () => {
    const initialPortfolio = loadPortfolio();
    renderPortfolio(initialPortfolio);
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
