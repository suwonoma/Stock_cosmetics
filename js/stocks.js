// ===========================
// Stocks Module
// ===========================

import {
    formatCurrency,
    formatNumber,
    getCacheWithExpiry,
    setCacheWithExpiry,
    showLoading,
    hideLoading,
    showError,
    hideError
} from './main.js';

let companiesData = null;
let currentChart = null;
let currentPeriod = '3M';
let compareMode = false;
let selectedCompanies = [];

// Cache TTL: 15 minutes
const CACHE_TTL = 15;

// ===========================
// Initialization
// ===========================
export function initStocks(data) {
    companiesData = data;

    // Populate company dropdown
    populateCompanyDropdown();

    // Setup event listeners
    setupEventListeners();
}

// ===========================
// Event Listeners
// ===========================
function setupEventListeners() {
    // Company selection
    document.getElementById('stockCompany').addEventListener('change', (e) => {
        if (!compareMode && e.target.value) {
            loadStockData(e.target.value);
        }
    });

    // Period buttons
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentPeriod = e.target.getAttribute('data-period');

            if (!compareMode) {
                const selectedCompany = document.getElementById('stockCompany').value;
                if (selectedCompany) {
                    loadStockData(selectedCompany);
                }
            } else {
                loadCompareData();
            }
        });
    });

    // Compare mode toggle
    document.getElementById('compareMode').addEventListener('change', (e) => {
        compareMode = e.target.checked;
        toggleCompareMode();
    });

    // Load compare button
    document.getElementById('loadCompare').addEventListener('click', () => {
        loadCompareData();
    });
}

// ===========================
// Populate Company Dropdown
// ===========================
function populateCompanyDropdown() {
    const select = document.getElementById('stockCompany');

    companiesData.companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company.id;
        option.textContent = `${company.name} (${company.ticker})`;
        select.appendChild(option);
    });

    // Populate compare checkboxes
    const compareDiv = document.getElementById('compareCheckboxes');
    companiesData.companies.forEach(company => {
        const label = document.createElement('label');
        label.className = 'compare-checkbox';
        label.innerHTML = `
            <input type="checkbox" value="${company.id}">
            <span>${company.name}</span>
        `;
        compareDiv.appendChild(label);

        label.querySelector('input').addEventListener('change', (e) => {
            if (e.target.checked) {
                if (selectedCompanies.length >= 4) {
                    e.target.checked = false;
                    alert('Maximum 4 companies can be compared');
                    return;
                }
                selectedCompanies.push(company.id);
            } else {
                selectedCompanies = selectedCompanies.filter(id => id !== company.id);
            }
        });
    });
}

// ===========================
// Toggle Compare Mode
// ===========================
function toggleCompareMode() {
    const stockInfo = document.getElementById('stockInfo');
    const compareSelect = document.getElementById('compareSelect');
    const companySelect = document.getElementById('stockCompany');

    if (compareMode) {
        stockInfo.classList.add('hidden');
        compareSelect.classList.remove('hidden');
        companySelect.disabled = true;
        selectedCompanies = [];
        document.querySelectorAll('.compare-checkbox input').forEach(cb => cb.checked = false);
        clearChart();
    } else {
        stockInfo.classList.add('hidden');
        compareSelect.classList.add('hidden');
        companySelect.disabled = false;
        clearChart();
    }
}

// ===========================
// Load Stock Data
// ===========================
async function loadStockData(companyId) {
    showLoading('stockLoading');
    hideError('stockError');

    try {
        const company = companiesData.companies.find(c => c.id === companyId);
        if (!company) throw new Error('Company not found');

        // Check cache
        const cacheKey = `stock_${companyId}_${currentPeriod}`;
        const cachedData = getCacheWithExpiry(cacheKey);

        let stockData;
        if (cachedData) {
            stockData = cachedData;
        } else {
            stockData = await fetchStockData(company);
            setCacheWithExpiry(cacheKey, stockData, CACHE_TTL);
        }

        displayStockInfo(stockData, company);
        displayStockChart([{ company, data: stockData }]);
    } catch (error) {
        console.error('Error loading stock data:', error);
        showError('stockError', 'Failed to load stock data. Showing sample data instead.');

        // Load sample data as fallback
        const company = companiesData.companies.find(c => c.id === companyId);
        const sampleData = generateSampleStockData(company);
        displayStockInfo(sampleData, company);
        displayStockChart([{ company, data: sampleData }]);
    } finally {
        hideLoading('stockLoading');
    }
}

// ===========================
// Load Compare Data
// ===========================
async function loadCompareData() {
    if (selectedCompanies.length === 0) {
        alert('Please select at least one company');
        return;
    }

    showLoading('stockLoading');
    hideError('stockError');

    try {
        const datasets = [];

        for (const companyId of selectedCompanies) {
            const company = companiesData.companies.find(c => c.id === companyId);
            const cacheKey = `stock_${companyId}_${currentPeriod}`;
            let stockData = getCacheWithExpiry(cacheKey);

            if (!stockData) {
                stockData = await fetchStockData(company);
                setCacheWithExpiry(cacheKey, stockData, CACHE_TTL);
            }

            datasets.push({ company, data: stockData });
        }

        displayStockChart(datasets);
    } catch (error) {
        console.error('Error loading comparison data:', error);
        showError('stockError', 'Failed to load comparison data. Showing sample data instead.');

        // Load sample data for comparison
        const datasets = selectedCompanies.map(id => {
            const company = companiesData.companies.find(c => c.id === id);
            return { company, data: generateSampleStockData(company) };
        });
        displayStockChart(datasets);
    } finally {
        hideLoading('stockLoading');
    }
}

// ===========================
// Fetch Stock Data from API
// ===========================
async function fetchStockData(company) {
    // Note: In production, you would use a real stock API like Alpha Vantage or Finnhub
    //
    // Example with Alpha Vantage:
    // const apiKey = 'YOUR_ALPHA_VANTAGE_KEY';
    // const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${company.ticker}&apiKey=${apiKey}`;
    // const response = await fetch(url);
    // const data = await response.json();
    // return parseAlphaVantageData(data, currentPeriod);

    // For demo, return sample data
    return generateSampleStockData(company);
}

// ===========================
// Generate Sample Stock Data
// ===========================
function generateSampleStockData(company) {
    const periods = {
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        'YTD': getYTDDays()
    };

    const days = periods[currentPeriod] || 90;
    const basePrice = getBasePrice(company.region);
    const dates = [];
    const prices = [];
    const volumes = [];

    let currentPrice = basePrice;
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        dates.push(date.toISOString().split('T')[0]);

        // Random walk with slight upward bias
        const change = (Math.random() - 0.48) * basePrice * 0.03;
        currentPrice = Math.max(currentPrice + change, basePrice * 0.7);
        prices.push(parseFloat(currentPrice.toFixed(2)));

        // Random volume
        volumes.push(Math.floor(Math.random() * 1000000 + 500000));
    }

    const lastPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const change = lastPrice - firstPrice;
    const changePercent = ((change / firstPrice) * 100).toFixed(2);

    return {
        dates,
        prices,
        volumes,
        currentPrice: lastPrice,
        change: change.toFixed(2),
        changePercent,
        high52w: Math.max(...prices) * 1.05,
        low52w: Math.min(...prices) * 0.95,
        volume: volumes[volumes.length - 1],
        currency: company.currency
    };
}

// ===========================
// Display Stock Info
// ===========================
function displayStockInfo(data, company) {
    const stockInfo = document.getElementById('stockInfo');
    stockInfo.classList.remove('hidden');

    document.getElementById('currentPrice').textContent = formatCurrency(data.currentPrice, data.currency);

    const changeEl = document.getElementById('priceChange');
    const changeValue = `${data.change >= 0 ? '+' : ''}${data.change} (${data.changePercent >= 0 ? '+' : ''}${data.changePercent}%)`;
    changeEl.textContent = changeValue;
    changeEl.className = `stock-value ${data.change >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('volume').textContent = formatNumber(data.volume);
    document.getElementById('high52w').textContent = formatCurrency(data.high52w, data.currency);
    document.getElementById('low52w').textContent = formatCurrency(data.low52w, data.currency);
}

// ===========================
// Display Stock Chart
// ===========================
function displayStockChart(datasets) {
    const ctx = document.getElementById('stockChart');

    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }

    // Get theme
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const textColor = theme === 'dark' ? '#FFFFFF' : '#212121';
    const gridColor = theme === 'dark' ? '#333333' : '#E0E0E0';

    const chartDatasets = datasets.map((dataset, index) => {
        const colors = ['#E91E63', '#673AB7', '#FF9800', '#2196F3'];
        const color = colors[index % colors.length];

        return {
            label: dataset.company.name,
            data: dataset.data.prices,
            borderColor: color,
            backgroundColor: `${color}20`,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            tension: 0.1,
            fill: datasets.length === 1
        };
    });

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datasets[0].data.dates,
            datasets: chartDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: datasets.length > 1,
                    labels: {
                        color: textColor,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const company = datasets[context.datasetIndex].company;
                            const value = formatCurrency(context.parsed.y, company.currency);
                            return `${context.dataset.label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor,
                        maxTicksLimit: 10
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return formatCurrency(value, datasets[0].data.currency);
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// ===========================
// Clear Chart
// ===========================
function clearChart() {
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
}

// ===========================
// Helper Functions
// ===========================
function getBasePrice(region) {
    const basePrices = {
        korea: 80000,
        japan: 3500,
        china: 45,
        europe: 150
    };
    return basePrices[region] || 100;
}

function getYTDDays() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Listen for theme changes to update chart
document.addEventListener('click', (e) => {
    if (e.target.closest('#themeToggle') && currentChart) {
        setTimeout(() => {
            if (compareMode && selectedCompanies.length > 0) {
                loadCompareData();
            } else {
                const selectedCompany = document.getElementById('stockCompany').value;
                if (selectedCompany) {
                    loadStockData(selectedCompany);
                }
            }
        }, 100);
    }
});
