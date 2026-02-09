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
    const lines = ocrResultText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Common OCR cleanup: replace 'l' with '1' and 'O' with '0' in numeric contexts
    // This is a very basic cleanup and might need more sophistication.
    const cleanedLines = lines.map(line => {
        return line
            .replace(/l/g, '1') // e.g., '10l' -> '101'
            .replace(/O/g, '0') // e.g., '10O' -> '100'
            .replace(/,/g, ''); // Remove all commas for easier float parsing
    });

    // Define multiple regex patterns to capture different potential formats
    // Pattern 1: Asset Name (Text) Quantity (Number) Price (Number)
    // e.g., "삼성전자 10 70000" or "Apple 5 170.50"
    const pattern1 = /(?<name>[가-힣a-zA-Z\s.-]+)\s+(?<quantity>\d+\.?\d*)\s+(?<price>\d+\.?\d*)/;

    // Pattern 2: Asset Name (Text) Price (Number) Quantity (Number)
    // e.g., "삼성전자 70000 10"
    const pattern2 = /(?<name>[가-힣a-zA-Z\s.-]+)\s+(?<price>\d+\.?\d*)\s+(?<quantity>\d+\.?\d*)/;

    // Pattern 3: More complex, with keywords (e.g., "종목: 삼성전자 주식수: 10 가격: 70000")
    // This is a simplified example; real keyword patterns can be much more complex.
    const pattern3 = /(?:종목|자산명|Asset Name):\s*(?<name>[가-힣a-zA-Z\s.-]+)\s*(?:수량|주식수|Quantity):\s*(?<quantity>\d+\.?\d*)\s*(?:가격|단가|Price):\s*(?<price>\d+\.?\d*)/;


    cleanedLines.forEach(line => {
        let match;

        // Try pattern 1
        if ((match = line.match(pattern1)) && match.groups.name && match.groups.quantity && match.groups.price) {
            assets.push({
                name: match.groups.name.trim(),
                quantity: parseFloat(match.groups.quantity),
                price: parseFloat(match.groups.price)
            });
        }
        // Try pattern 2
        else if ((match = line.match(pattern2)) && match.groups.name && match.groups.quantity && match.groups.price) {
            assets.push({
                name: match.groups.name.trim(),
                quantity: parseFloat(match.groups.quantity),
                price: parseFloat(match.groups.price)
            });
        }
        // Try pattern 3
        else if ((match = line.match(pattern3)) && match.groups.name && match.groups.quantity && match.groups.price) {
            assets.push({
                name: match.groups.name.trim(),
                quantity: parseFloat(match.groups.quantity),
                price: parseFloat(match.groups.price)
            });
        }
        // Add more patterns here as needed based on common user input formats
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
