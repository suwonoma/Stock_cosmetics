# Global Cosmetics Industry Dashboard

A comprehensive web dashboard for tracking news, stock prices, and AI research related to major cosmetics companies from Korea, Japan, China, and Europe.

![Dashboard Preview](https://via.placeholder.com/1200x600/E91E63/FFFFFF?text=Global+Cosmetics+Dashboard)

## Features

### 1. Latest News Section
- Real-time industry news from multiple sources
- Filter by region (Korea, Japan, China, Europe)
- Filter by company and category
- Automatic caching (1-hour TTL)
- Categories: New Products, Financial Results, M&A, R&D, ESG

### 2. Stock Price Charts
- Interactive stock price visualizations using Chart.js
- Support for multiple time periods (1W, 1M, 3M, 6M, 1Y, YTD)
- Compare up to 4 companies simultaneously
- Real-time price indicators and 52-week high/low
- Automatic caching (15-minute TTL)

### 3. AI Research Papers
- Academic papers on AI applications in cosmetics
- Search and filter capabilities
- Year-based filtering
- Integration with arXiv and academic databases
- 24-hour cache for improved performance

### 4. Additional Features
- Dark/Light theme toggle
- Fully responsive design (mobile, tablet, desktop)
- Local storage caching for reduced API calls
- Smooth animations and transitions
- Clean, modern UI with cosmetics-inspired color palette

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Charts**: Chart.js 4.4.1
- **Icons**: Font Awesome 6.5.1
- **Hosting**: GitHub Pages (static hosting)
- **APIs**: NewsAPI, Alpha Vantage, arXiv

## Project Structure

```
Stock_cosmetics/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styling and themes
├── js/
│   ├── main.js            # Core app logic and utilities
│   ├── news.js            # News module
│   ├── stocks.js          # Stock charts module
│   └── papers.js          # Research papers module
├── data/
│   └── companies.json     # Company data and metadata
├── assets/
│   ├── images/            # Image assets
│   └── logos/             # Company logos
└── README.md              # This file
```

## Companies Tracked

### Korea
- **Amorepacific** (090430.KS) - Sulwhasoo, Laneige, Innisfree
- **LG H&H** (051900.KS) - The Face Shop, OHUI
- **Cosmax** (192820.KS) - Leading ODM manufacturer

### Japan
- **Shiseido** (4911.T) - Global cosmetics leader
- **Kosé** (4922.T) - Innovation-focused beauty company
- **Pola Orbis** (4927.T) - Premium beauty brands

### China
- **Shanghai Jahwa** (600315.SS) - Historic Chinese beauty company
- **Proya Cosmetics** (603605.SS) - Leading skincare brand

### Europe/Global
- **L'Oréal** (OR.PA) - World's largest cosmetics company
- **Estée Lauder** (EL) - Luxury beauty leader
- **Unilever** (UL) - Global consumer goods giant

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Stock_cosmetics.git
cd Stock_cosmetics
```

### 2. Configure API Keys (Optional)

For production use with real data, you'll need to configure API keys:

#### NewsAPI
1. Sign up at [NewsAPI.org](https://newsapi.org/)
2. Get your free API key
3. Edit `js/news.js` and add your API key:

```javascript
const apiKey = 'YOUR_NEWSAPI_KEY';
```

#### Stock Data - Alpha Vantage
1. Sign up at [Alpha Vantage](https://www.alphavantage.co/)
2. Get your free API key
3. Edit `js/stocks.js` and add your API key:

```javascript
const apiKey = 'YOUR_ALPHA_VANTAGE_KEY';
```

#### arXiv API
No API key required! The arXiv API is free and open.

### 3. Local Development

Simply open `index.html` in your web browser:

```bash
# Using Python's built-in server
python -m http.server 8000

# Or using Node.js
npx http-server

# Then visit http://localhost:8000
```

### 4. Deploy to GitHub Pages

1. Push your code to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages section
   - Select "main" branch and root folder
   - Save

3. Your site will be available at:
   ```
   https://yourusername.github.io/Stock_cosmetics/
   ```

## Configuration

### Cache Settings

Modify cache durations in respective modules:

```javascript
// In news.js
const CACHE_TTL = 60; // 60 minutes

// In stocks.js
const CACHE_TTL = 15; // 15 minutes

// In papers.js
const CACHE_TTL = 1440; // 24 hours
```

### Theme Customization

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary: #E91E63;      /* Pink */
    --secondary: #673AB7;    /* Purple */
    --accent: #FF9800;       /* Orange */
    --background: #FAFAFA;   /* Light background */
}
```

### Adding New Companies

Edit `data/companies.json`:

```json
{
  "id": "newcompany",
  "name": "New Company",
  "region": "korea",
  "ticker": "TICKER.EX",
  "exchange": "Exchange",
  "currency": "KRW",
  "website": "https://example.com",
  "description": "Company description",
  "keywords": ["keyword1", "keyword2"]
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- **Lazy Loading**: Images load only when needed
- **Caching**: Aggressive local storage caching reduces API calls
- **Debouncing**: Search inputs are debounced to minimize processing
- **CDN**: External libraries loaded from CDN
- **Minification**: Consider minifying CSS/JS for production

## Development Roadmap

### Phase 1: Core Features ✅
- [x] Basic UI and navigation
- [x] News section with filtering
- [x] Stock charts with multiple periods
- [x] Research papers integration

### Phase 2: Enhanced Features
- [ ] User authentication (optional)
- [ ] Bookmarking functionality
- [ ] Email alerts for price changes
- [ ] Export data to CSV/PDF
- [ ] Market share visualizations

### Phase 3: Advanced Analytics
- [ ] Trend analysis dashboard
- [ ] Sentiment analysis on news
- [ ] Predictive price modeling
- [ ] Company comparison tables

### Phase 4: Mobile App
- [ ] Progressive Web App (PWA)
- [ ] Native mobile apps
- [ ] Push notifications

## API Rate Limits

Be aware of API rate limits:

- **NewsAPI Free**: 100 requests/day
- **Alpha Vantage Free**: 5 requests/minute, 500/day
- **arXiv**: No official limit, but be respectful

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Chart.js for beautiful chart visualizations
- Font Awesome for icons
- NewsAPI for news data
- Alpha Vantage for stock market data
- arXiv for academic research papers

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: your-email@example.com

## Disclaimer

This dashboard is for informational and educational purposes only. It is not intended as financial advice. Always verify data independently and consult with financial professionals before making investment decisions.

---

**Built with ❤️ for the global cosmetics industry**

Last Updated: January 2026
