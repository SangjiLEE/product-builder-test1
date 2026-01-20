
# Blueprint: Account Portfolio Asset Management Site

## Overview

This is a web application for managing investment portfolios for different accounts. Users can view their accounts, see the assets in each portfolio, and manage them.

## Implemented Features

### Design and Style

*   **Aesthetics:** Modern, clean, and intuitive user interface.
*   **Layout:** Responsive design that works on both mobile and web. The layout is a two-column design with the account list on the left and the portfolio details on the right.
*   **Color Palette:** A professional color scheme with a white background for the main content areas and a light gray background for the body.
*   **Typography:** Used the 'Poppins' font from Google Fonts for a modern and readable look.
*   **Iconography:** Added a pie chart icon from Font Awesome to the header.
*   **Interactivity:** Added hover effects to the account list and portfolio table rows to provide visual feedback to the user.

### Features

*   **Account List:** Displays a list of accounts. Clicking on an account shows the portfolio for that account.
*   **Portfolio Details:** Displays a table of assets for the selected account, including the asset name, ticker, quantity, price, and total value.
*   **Web Components:** Used custom elements (`<account-list>` and `<portfolio-details>`) to create reusable and encapsulated UI components.
*   **Mock Data:** Includes sample data for three accounts with different stock portfolios to demonstrate the functionality.

### Code Structure

*   **`index.html`**: The main HTML file that includes the basic structure of the page and links to the CSS and JavaScript files.
*   **`style.css`**: Contains all the styles for the application, including the layout, colors, fonts, and hover effects.
*   **`main.js`**: Contains the JavaScript code for the application, including the web component definitions and the logic for displaying the portfolio details. It uses ES Modules.
*   **`blueprint.md`**: This file, which documents the project.
