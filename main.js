
const portfolioData = {
  "1": [
    { name: "Apple Inc.", ticker: "AAPL", quantity: 100, price: 150 },
    { name: "Google LLC", ticker: "GOOGL", quantity: 50, price: 2800 },
  ],
  "2": [
    { name: "Microsoft Corp.", ticker: "MSFT", quantity: 75, price: 300 },
    { name: "Amazon.com, Inc.", ticker: "AMZN", quantity: 25, price: 3400 },
  ],
  "3": [
    { name: "Tesla, Inc.", ticker: "TSLA", quantity: 50, price: 700 },
  ],
};

class AccountList extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <style>
        :host {
          display: block;
          color: var(--text-color);
        }
        h2 {
          margin: 0 0 12px;
          font-size: 1.1rem;
        }
        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        a {
          display: block;
          padding: 10px;
          text-decoration: none;
          color: inherit;
          border-radius: 6px;
          transition: background-color 0.3s, box-shadow 0.3s;
        }
        a:hover {
          background-color: var(--hover-color);
          box-shadow: 0 1px 6px var(--shadow-color);
        }
      </style>
      <h2>Accounts</h2>
      <ul>
        <li><a href="#" data-account-id="1">Account 1</a></li>
        <li><a href="#" data-account-id="2">Account 2</a></li>
        <li><a href="#" data-account-id="3">Account 3</a></li>
      </ul>
    `;

    shadow.appendChild(wrapper);

    shadow.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const accountId = e.target.dataset.accountId;
        document.querySelector("portfolio-details").setAttribute("account-id", accountId);
      });
    });
  }
}

class PortfolioDetails extends HTMLElement {
  static get observedAttributes() {
    return ['account-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'account-id') {
      this.render(newValue);
    }
  }

  render(accountId) {
    const portfolio = portfolioData[accountId];
    let content = '<p>Select an account to see the portfolio details.</p>';

    if (portfolio) {
      content = `
        <h3>Portfolio for Account ${accountId}</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Ticker</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${portfolio.map(asset => `
              <tr>
                <td>${asset.name}</td>
                <td>${asset.ticker}</td>
                <td>${asset.quantity}</td>
                <td>$${asset.price}</td>
                <td>$${asset.quantity * asset.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
    this.shadowRoot.querySelector("#portfolio-content").innerHTML = content;
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <style>
        :host {
          display: block;
          color: var(--text-color);
        }
        h2, h3 {
          margin: 0 0 12px;
          font-size: 1.1rem;
        }
        h3 {
          margin-top: 16px;
          font-size: 1rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        th {
          background-color: var(--table-header-color);
        }
        tr:hover {
          background-color: var(--row-hover-color);
        }
        p {
          color: var(--muted-text-color);
        }
      </style>
      <h2>Portfolio Details</h2>
      <div id="portfolio-content">
        <p>Select an account to see the portfolio details.</p>
      </div>
    `;
    shadow.appendChild(wrapper);
  }
}

customElements.define('account-list', AccountList);
customElements.define('portfolio-details', PortfolioDetails);

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
