// ===========================
// News Module
// ===========================

import {
    formatDate,
    truncateText,
    getCacheWithExpiry,
    setCacheWithExpiry,
    showLoading,
    hideLoading,
    showError,
    hideError
} from './main.js';

let companiesData = null;
let allNews = [];
let currentRegion = 'all';
let currentCompany = 'all';
let currentCategory = 'all';

// Cache TTL: 1 hour
const CACHE_TTL = 60;

// ===========================
// Initialization
// ===========================
export function initNews(data) {
    companiesData = data;

    // Populate company filter
    populateCompanyFilter();

    // Add event listeners
    setupEventListeners();

    // Load news
    loadNews();
}

// ===========================
// Event Listeners
// ===========================
function setupEventListeners() {
    // Region tabs
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentRegion = e.target.getAttribute('data-region');
            filterNews();
        });
    });

    // Company filter
    document.getElementById('companyFilter').addEventListener('change', (e) => {
        currentCompany = e.target.value;
        filterNews();
    });

    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        currentCategory = e.target.value;
        filterNews();
    });

    // Refresh button
    document.getElementById('refreshNews').addEventListener('click', () => {
        localStorage.removeItem('news_cache');
        loadNews();
    });
}

// ===========================
// Populate Company Filter
// ===========================
function populateCompanyFilter() {
    const select = document.getElementById('companyFilter');
    companiesData.companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company.id;
        option.textContent = `${company.name} (${company.region.toUpperCase()})`;
        select.appendChild(option);
    });
}

// ===========================
// Load News
// ===========================
async function loadNews() {
    showLoading('newsLoading');
    hideError('newsError');

    try {
        // Check cache first
        const cachedNews = getCacheWithExpiry('news_cache');
        if (cachedNews) {
            allNews = cachedNews;
            displayNews(allNews);
            hideLoading('newsLoading');
            return;
        }

        // Fetch news from API
        const news = await fetchNewsFromAPI();
        allNews = news;

        // Cache the results
        setCacheWithExpiry('news_cache', news, CACHE_TTL);

        displayNews(news);
    } catch (error) {
        console.error('Error loading news:', error);
        showError('newsError', 'Failed to load news. Please try again later.');

        // Load sample news as fallback
        allNews = getSampleNews();
        displayNews(allNews);
    } finally {
        hideLoading('newsLoading');
    }
}

// ===========================
// Fetch News from API
// ===========================
async function fetchNewsFromAPI() {
    // Note: In production, you would use NewsAPI with a real API key
    // For demo purposes, we'll use sample data
    //
    // Example with NewsAPI:
    // const apiKey = 'YOUR_NEWSAPI_KEY';
    // const companies = companiesData.companies.map(c => c.keywords.join(' OR ')).join(' OR ');
    // const url = `https://newsapi.org/v2/everything?q=(${companies}) AND cosmetics&sortBy=publishedAt&apiKey=${apiKey}`;
    // const response = await fetch(url);
    // const data = await response.json();
    // return data.articles.map(article => parseNewsArticle(article));

    // For now, return sample data
    return getSampleNews();
}

// ===========================
// Get Sample News (Fallback)
// ===========================
function getSampleNews() {
    return [
        {
            id: '1',
            title: 'Amorepacific Launches AI-Powered Skin Analysis Platform',
            description: 'Leading Korean beauty company unveils new artificial intelligence technology for personalized skincare recommendations.',
            source: 'Beauty Innovation Today',
            url: '#',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            company: 'amorepacific',
            region: 'korea',
            category: 'rd'
        },
        {
            id: '2',
            title: 'Shiseido Reports Strong Q4 Financial Results',
            description: 'Japanese cosmetics giant exceeds expectations with 15% revenue growth driven by Asia-Pacific markets.',
            source: 'Financial Beauty News',
            url: '#',
            publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            company: 'shiseido',
            region: 'japan',
            category: 'financial'
        },
        {
            id: '3',
            title: "L'Oréal Acquires Sustainable Beauty Startup",
            description: 'Global beauty leader continues expansion in eco-friendly cosmetics with latest acquisition.',
            source: 'Global Cosmetics Review',
            url: '#',
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            company: 'loreal',
            region: 'europe',
            category: 'ma'
        },
        {
            id: '4',
            title: 'LG H&H Unveils New Luxury Skincare Line',
            description: 'Korean household giant enters premium beauty segment with science-backed formulations.',
            source: 'K-Beauty Insider',
            url: '#',
            publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'lghh',
            region: 'korea',
            category: 'product'
        },
        {
            id: '5',
            title: 'Estée Lauder Commits to Carbon Neutrality by 2030',
            description: 'Luxury beauty company announces ambitious sustainability goals and green packaging initiatives.',
            source: 'Sustainability in Beauty',
            url: '#',
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'estee',
            region: 'europe',
            category: 'esg'
        },
        {
            id: '6',
            title: 'Proya Cosmetics Expands International Presence',
            description: 'Chinese beauty brand announces entry into Southeast Asian markets with localized products.',
            source: 'Asia Beauty Market',
            url: '#',
            publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'proya',
            region: 'china',
            category: 'financial'
        },
        {
            id: '7',
            title: 'Cosmax Partners with Global Brands for Sustainable Packaging',
            description: 'Leading ODM manufacturer develops innovative eco-friendly packaging solutions.',
            source: 'Packaging Innovation News',
            url: '#',
            publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'cosmax',
            region: 'korea',
            category: 'rd'
        },
        {
            id: '8',
            title: 'Kosé Introduces Biotechnology-Based Anti-Aging Range',
            description: 'Japanese company leverages cutting-edge research for next-generation skincare products.',
            source: 'Beauty Science Journal',
            url: '#',
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'kose',
            region: 'japan',
            category: 'product'
        },
        {
            id: '9',
            title: 'Shanghai Jahwa Celebrates Record Sales in Domestic Market',
            description: 'Historic Chinese brand sees surge in popularity among younger consumers.',
            source: 'China Beauty Report',
            url: '#',
            publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'jahwa',
            region: 'china',
            category: 'financial'
        },
        {
            id: '10',
            title: 'Pola Orbis Invests in Digital Beauty Consultation Platform',
            description: 'Japanese beauty conglomerate embraces virtual try-on and personalized recommendations.',
            source: 'Digital Beauty Today',
            url: '#',
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'pola',
            region: 'japan',
            category: 'rd'
        },
        {
            id: '11',
            title: 'Unilever Launches Inclusive Beauty Initiative',
            description: 'Consumer goods giant expands shade ranges and launches campaigns for diverse beauty standards.',
            source: 'Beauty Inclusivity Now',
            url: '#',
            publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'unilever',
            region: 'europe',
            category: 'esg'
        },
        {
            id: '12',
            title: 'Amorepacific Opens New R&D Center for Green Chemistry',
            description: 'Korean beauty leader invests $100M in sustainable ingredient research facility.',
            source: 'Green Beauty Innovation',
            url: '#',
            publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'amorepacific',
            region: 'korea',
            category: 'rd'
        }
    ];
}

// ===========================
// Filter News
// ===========================
function filterNews() {
    let filtered = [...allNews];

    // Filter by region
    if (currentRegion !== 'all') {
        filtered = filtered.filter(news => news.region === currentRegion);
    }

    // Filter by company
    if (currentCompany !== 'all') {
        filtered = filtered.filter(news => news.company === currentCompany);
    }

    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(news => news.category === currentCategory);
    }

    displayNews(filtered);
}

// ===========================
// Display News
// ===========================
function displayNews(news) {
    const grid = document.getElementById('newsGrid');

    if (news.length === 0) {
        grid.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 3rem;">No news found matching your filters.</div>';
        return;
    }

    grid.innerHTML = news.map(article => createNewsCard(article)).join('');

    // Add click events to news cards
    grid.querySelectorAll('.news-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            if (news[index].url && news[index].url !== '#') {
                window.open(news[index].url, '_blank');
            }
        });
    });
}

// ===========================
// Create News Card
// ===========================
function createNewsCard(article) {
    const company = companiesData.companies.find(c => c.id === article.company);
    const regionColor = companiesData.regions[article.region]?.color || '#666';

    return `
        <div class="news-card">
            <div class="news-card-header">
                <div class="news-source">${article.source}</div>
                <div class="news-date">${formatDate(article.publishedAt)}</div>
            </div>
            <h3 class="news-title">${article.title}</h3>
            <p class="news-description">${truncateText(article.description, 150)}</p>
            <div class="news-tags">
                <span class="tag tag-${article.region}">${company?.name || article.company}</span>
                ${getCategoryTag(article.category)}
            </div>
        </div>
    `;
}

// ===========================
// Get Category Tag
// ===========================
function getCategoryTag(categoryId) {
    const categories = {
        product: 'New Product',
        financial: 'Financial',
        ma: 'M&A',
        rd: 'R&D',
        esg: 'ESG'
    };
    return `<span class="tag" style="background: rgba(103, 58, 183, 0.1); color: var(--secondary);">${categories[categoryId] || categoryId}</span>`;
}
