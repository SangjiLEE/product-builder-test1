
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
