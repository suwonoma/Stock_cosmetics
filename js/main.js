// ===========================
// Main Application
// ===========================

import { initNews } from './news.js';
import { initStocks } from './stocks.js';
import { initPapers } from './papers.js';

// Global state
let companiesData = null;

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load companies data
        await loadCompaniesData();

        // Initialize theme
        initTheme();

        // Initialize tab navigation
        initTabs();

        // Initialize all modules
        initNews(companiesData);
        initStocks(companiesData);
        initPapers(companiesData);

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showGlobalError('Failed to initialize application. Please refresh the page.');
    }
});

// ===========================
// Load Companies Data
// ===========================
async function loadCompaniesData() {
    try {
        const response = await fetch('data/companies.json');
        if (!response.ok) {
            throw new Error('Failed to load companies data');
        }
        companiesData = await response.json();
        return companiesData;
    } catch (error) {
        console.error('Error loading companies data:', error);
        throw error;
    }
}

// ===========================
// Theme Toggle
// ===========================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Theme toggle event
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===========================
// Tab Navigation
// ===========================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.content-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update active section
            sections.forEach(section => {
                if (section.id === `${targetTab}Section`) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            // Save active tab
            localStorage.setItem('activeTab', targetTab);
        });
    });

    // Restore last active tab
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        const savedButton = document.querySelector(`[data-tab="${savedTab}"]`);
        if (savedButton) {
            savedButton.click();
        }
    }
}

// ===========================
// Utility Functions
// ===========================

// Show global error message
function showGlobalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.body.firstChild);
}

// Format date
export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Format number with commas
export function formatNumber(num) {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString();
}

// Format currency
export function formatCurrency(amount, currency = 'USD') {
    if (amount === null || amount === undefined) return '-';

    const formatOptions = {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    };

    return new Intl.NumberFormat('en-US', formatOptions).format(amount);
}

// Truncate text
export function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ===========================
// Cache Management
// ===========================

// Set cache with expiry
export function setCacheWithExpiry(key, value, ttlMinutes) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttlMinutes * 60 * 1000
    };
    localStorage.setItem(key, JSON.stringify(item));
}

// Get cache with expiry check
export function getCacheWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }

    try {
        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    } catch (error) {
        console.error('Error parsing cache:', error);
        localStorage.removeItem(key);
        return null;
    }
}

// Clear old cache
export function clearOldCache(keyPrefix) {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith(keyPrefix)) {
            getCacheWithExpiry(key); // This will remove expired items
        }
    });
}

// ===========================
// API Helper Functions
// ===========================

// Debounce function
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fetch with timeout
export async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

// Show loading state
export function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

// Hide loading state
export function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

// Show error
export function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
}

// Hide error
export function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

// Export companies data getter
export function getCompaniesData() {
    return companiesData;
}
