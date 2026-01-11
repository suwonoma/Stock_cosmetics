// ===========================
// Papers Module
// ===========================

import {
    formatDate,
    truncateText,
    getCacheWithExpiry,
    setCacheWithExpiry,
    showLoading,
    hideLoading,
    showError,
    hideError,
    debounce
} from './main.js';

let companiesData = null;
let allPapers = [];
let filteredPapers = [];

// Cache TTL: 24 hours
const CACHE_TTL = 1440;

// Search keywords for AI & cosmetics research
const SEARCH_QUERIES = [
    'cosmetics artificial intelligence',
    'beauty AI recommendation',
    'skin analysis machine learning',
    'personalized cosmetics deep learning',
    'cosmetics computer vision',
    'skincare AI technology'
];

// ===========================
// Initialization
// ===========================
export function initPapers(data) {
    companiesData = data;

    // Setup event listeners
    setupEventListeners();

    // Load papers
    loadPapers();
}

// ===========================
// Event Listeners
// ===========================
function setupEventListeners() {
    // Search input with debounce
    const searchInput = document.getElementById('paperSearch');
    searchInput.addEventListener('input', debounce((e) => {
        filterPapers();
    }, 500));

    // Year filter
    document.getElementById('yearFilter').addEventListener('change', () => {
        filterPapers();
    });

    // Refresh button
    document.getElementById('refreshPapers').addEventListener('click', () => {
        localStorage.removeItem('papers_cache');
        loadPapers();
    });
}

// ===========================
// Load Papers
// ===========================
async function loadPapers() {
    showLoading('papersLoading');
    hideError('papersError');

    try {
        // Check cache first
        const cachedPapers = getCacheWithExpiry('papers_cache');
        if (cachedPapers) {
            allPapers = cachedPapers;
            filteredPapers = allPapers;
            displayPapers(filteredPapers);
            hideLoading('papersLoading');
            return;
        }

        // Fetch papers from API
        const papers = await fetchPapersFromAPI();
        allPapers = papers;
        filteredPapers = papers;

        // Cache the results
        setCacheWithExpiry('papers_cache', papers, CACHE_TTL);

        displayPapers(papers);
    } catch (error) {
        console.error('연구 논문 로딩 오류:', error);
        showError('papersError', '연구 논문을 불러오는데 실패했습니다. 샘플 데이터를 표시합니다.');

        // Load sample papers as fallback
        allPapers = getSamplePapers();
        filteredPapers = allPapers;
        displayPapers(allPapers);
    } finally {
        hideLoading('papersLoading');
    }
}

// ===========================
// Fetch Papers from API
// ===========================
async function fetchPapersFromAPI() {
    // Note: In production, you would use arXiv API or other academic APIs
    //
    // Example with arXiv API:
    // const query = SEARCH_QUERIES.join('+OR+');
    // const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=50&sortBy=submittedDate&sortOrder=descending`;
    // const response = await fetch(url);
    // const text = await response.text();
    // return parseArxivResponse(text);

    // For demo, return sample data
    return getSamplePapers();
}

// ===========================
// Get Sample Papers (Fallback)
// ===========================
function getSamplePapers() {
    return [
        {
            id: '1',
            title: 'Deep Learning Approaches for Personalized Cosmetic Product Recommendations',
            authors: 'Kim, S., Park, J., Lee, H.',
            publishedDate: '2025-12-15',
            abstract: 'This paper presents a novel deep learning framework for personalized cosmetic product recommendations based on skin type analysis, personal preferences, and historical purchase data. Our approach achieves 94% accuracy in matching users with suitable products.',
            url: 'https://arxiv.org/abs/example1',
            keywords: ['deep learning', 'recommendation systems', 'personalization', 'cosmetics'],
            citations: 45,
            year: 2025
        },
        {
            id: '2',
            title: 'Computer Vision-Based Skin Condition Assessment Using Convolutional Neural Networks',
            authors: 'Tanaka, M., Suzuki, Y., Nakamura, K.',
            publishedDate: '2025-11-08',
            abstract: 'We develop a computer vision system that accurately assesses various skin conditions including acne, wrinkles, and pigmentation using CNNs trained on a dataset of over 100,000 facial images. The system demonstrates clinical-grade accuracy.',
            url: 'https://arxiv.org/abs/example2',
            keywords: ['computer vision', 'CNN', 'skin analysis', 'dermatology'],
            citations: 67,
            year: 2025
        },
        {
            id: '3',
            title: 'AI-Powered Virtual Makeup Try-On: A Real-Time Implementation',
            authors: 'Chen, L., Wang, X., Zhang, Y.',
            publishedDate: '2025-10-22',
            abstract: 'This study introduces a real-time AI-powered virtual makeup application using generative adversarial networks (GANs) that allows users to virtually try different cosmetic products with high photorealism and minimal latency.',
            url: 'https://arxiv.org/abs/example3',
            keywords: ['GAN', 'virtual try-on', 'augmented reality', 'cosmetics'],
            citations: 89,
            year: 2025
        },
        {
            id: '4',
            title: 'Machine Learning for Cosmetic Ingredient Safety Assessment',
            authors: 'Johnson, A., Smith, B., Williams, C.',
            publishedDate: '2025-09-14',
            abstract: 'We present a machine learning model that predicts potential skin irritation and allergic reactions to cosmetic ingredients by analyzing molecular structures and historical safety data, significantly reducing testing time.',
            url: 'https://arxiv.org/abs/example4',
            keywords: ['machine learning', 'safety assessment', 'cosmetic ingredients', 'toxicology'],
            citations: 52,
            year: 2025
        },
        {
            id: '5',
            title: 'Natural Language Processing for Cosmetic Product Review Analysis',
            authors: 'Garcia, M., Rodriguez, P., Martinez, J.',
            publishedDate: '2025-08-30',
            abstract: 'This research applies advanced NLP techniques to analyze millions of cosmetic product reviews, extracting key insights about product performance, user satisfaction, and emerging beauty trends for market research applications.',
            url: 'https://arxiv.org/abs/example5',
            keywords: ['NLP', 'sentiment analysis', 'product reviews', 'market research'],
            citations: 38,
            year: 2025
        },
        {
            id: '6',
            title: 'Skin Aging Prediction Using Deep Neural Networks and Biomarker Analysis',
            authors: 'Lee, K., Choi, S., Kim, H.',
            publishedDate: '2025-07-18',
            abstract: 'Our study develops a predictive model for skin aging using deep neural networks trained on biomarker data and facial images, enabling personalized anti-aging cosmetic recommendations with 92% prediction accuracy.',
            url: 'https://arxiv.org/abs/example6',
            keywords: ['deep learning', 'skin aging', 'biomarkers', 'prediction'],
            citations: 71,
            year: 2025
        },
        {
            id: '7',
            title: 'Automated Cosmetic Formulation Optimization Using Reinforcement Learning',
            authors: 'Brown, D., Davis, E., Wilson, F.',
            publishedDate: '2024-12-05',
            abstract: 'We propose a reinforcement learning approach for optimizing cosmetic formulations that balances efficacy, safety, and sensory properties, reducing development time by 60% compared to traditional methods.',
            url: 'https://arxiv.org/abs/example7',
            keywords: ['reinforcement learning', 'formulation', 'optimization', 'R&D'],
            citations: 94,
            year: 2024
        },
        {
            id: '8',
            title: 'Transfer Learning for Cross-Cultural Beauty Preference Analysis',
            authors: 'Zhang, W., Liu, Q., Chen, M.',
            publishedDate: '2024-11-12',
            abstract: 'This paper explores how transfer learning can be applied to understand beauty preferences across different cultures, enabling cosmetic brands to develop culturally-sensitive products and marketing strategies.',
            url: 'https://arxiv.org/abs/example8',
            keywords: ['transfer learning', 'cultural analysis', 'beauty preferences', 'marketing'],
            citations: 43,
            year: 2024
        },
        {
            id: '9',
            title: 'AI-Based Color Matching System for Foundation and Concealer Products',
            authors: 'Patel, R., Kumar, S., Sharma, A.',
            publishedDate: '2024-10-28',
            abstract: 'We develop an AI-powered color matching system that accurately determines optimal foundation and concealer shades for individuals using spectrophotometry and machine learning, achieving 98% customer satisfaction.',
            url: 'https://arxiv.org/abs/example9',
            keywords: ['color matching', 'AI', 'foundation', 'spectrophotometry'],
            citations: 56,
            year: 2024
        },
        {
            id: '10',
            title: 'Blockchain and AI Integration for Cosmetic Supply Chain Transparency',
            authors: 'Anderson, G., Thomas, H., Jackson, I.',
            publishedDate: '2024-09-15',
            abstract: 'This study presents an integrated blockchain-AI system that ensures cosmetic supply chain transparency, ingredient authenticity, and quality control using smart contracts and machine learning verification.',
            url: 'https://arxiv.org/abs/example10',
            keywords: ['blockchain', 'AI', 'supply chain', 'transparency'],
            citations: 62,
            year: 2024
        },
        {
            id: '11',
            title: 'Facial Recognition for Personalized Skincare Routine Recommendations',
            authors: 'Yamamoto, T., Sato, R., Kobayashi, N.',
            publishedDate: '2024-08-07',
            abstract: 'Our facial recognition system analyzes 127 facial features to provide personalized skincare routine recommendations, considering skin type, age, lifestyle factors, and environmental conditions.',
            url: 'https://arxiv.org/abs/example11',
            keywords: ['facial recognition', 'skincare', 'personalization', 'AI'],
            citations: 48,
            year: 2024
        },
        {
            id: '12',
            title: 'Predictive Analytics for Cosmetic Trend Forecasting Using Social Media Data',
            authors: 'Miller, K., Moore, L., Taylor, M.',
            publishedDate: '2024-07-20',
            abstract: 'We employ predictive analytics on social media data to forecast emerging cosmetic trends with 85% accuracy, enabling brands to stay ahead of market demands and consumer preferences.',
            url: 'https://arxiv.org/abs/example12',
            keywords: ['predictive analytics', 'trend forecasting', 'social media', 'big data'],
            citations: 76,
            year: 2024
        },
        {
            id: '13',
            title: 'Generative AI for Novel Cosmetic Ingredient Discovery',
            authors: 'Wang, Y., Li, X., Zhou, H.',
            publishedDate: '2024-06-11',
            abstract: 'This research demonstrates how generative AI models can discover novel cosmetic ingredients with desired properties, significantly accelerating the R&D process for innovative beauty products.',
            url: 'https://arxiv.org/abs/example13',
            keywords: ['generative AI', 'ingredient discovery', 'R&D', 'innovation'],
            citations: 103,
            year: 2024
        },
        {
            id: '14',
            title: 'Hyperspectral Imaging and Machine Learning for Skin Hydration Assessment',
            authors: 'Schmidt, O., Mueller, P., Weber, Q.',
            publishedDate: '2024-05-25',
            abstract: 'We combine hyperspectral imaging with machine learning algorithms to non-invasively assess skin hydration levels with accuracy comparable to clinical devices, enabling at-home skin monitoring.',
            url: 'https://arxiv.org/abs/example14',
            keywords: ['hyperspectral imaging', 'machine learning', 'skin hydration', 'diagnostics'],
            citations: 58,
            year: 2024
        },
        {
            id: '15',
            title: 'Edge AI for Real-Time Cosmetic Quality Control in Manufacturing',
            authors: 'Ferrari, S., Romano, T., Bianchi, U.',
            publishedDate: '2024-04-18',
            abstract: 'Our edge AI solution provides real-time quality control during cosmetic manufacturing, detecting defects in color, texture, and packaging with 99.7% accuracy while maintaining production speed.',
            url: 'https://arxiv.org/abs/example15',
            keywords: ['edge AI', 'quality control', 'manufacturing', 'computer vision'],
            citations: 41,
            year: 2024
        },
        {
            id: '16',
            title: 'Multi-Modal AI for Comprehensive Skin Health Assessment',
            authors: 'Dubois, V., Laurent, W., Martin, X.',
            publishedDate: '2023-12-22',
            abstract: 'This paper presents a multi-modal AI system integrating visual, thermal, and moisture sensors to provide comprehensive skin health assessments for personalized cosmetic recommendations.',
            url: 'https://arxiv.org/abs/example16',
            keywords: ['multi-modal AI', 'skin health', 'sensors', 'assessment'],
            citations: 85,
            year: 2023
        },
        {
            id: '17',
            title: 'Federated Learning for Privacy-Preserving Cosmetic Recommendation Systems',
            authors: 'Nielsen, Y., Olsen, Z., Jensen, A.',
            publishedDate: '2023-11-09',
            abstract: 'We implement federated learning to build cosmetic recommendation systems that maintain user privacy while leveraging collective intelligence from distributed data sources.',
            url: 'https://arxiv.org/abs/example17',
            keywords: ['federated learning', 'privacy', 'recommendations', 'distributed learning'],
            citations: 69,
            year: 2023
        },
        {
            id: '18',
            title: 'AI-Driven Microbiome Analysis for Personalized Skincare',
            authors: 'Santos, B., Silva, C., Costa, D.',
            publishedDate: '2023-10-14',
            abstract: 'Our research uses AI to analyze skin microbiome data, enabling the development of personalized skincare products that promote healthy skin flora and address individual skin concerns.',
            url: 'https://arxiv.org/abs/example18',
            keywords: ['AI', 'microbiome', 'skincare', 'personalization'],
            citations: 92,
            year: 2023
        }
    ];
}

// ===========================
// Filter Papers
// ===========================
function filterPapers() {
    const searchTerm = document.getElementById('paperSearch').value.toLowerCase();
    const selectedYear = document.getElementById('yearFilter').value;

    filteredPapers = allPapers.filter(paper => {
        // Year filter
        if (selectedYear !== 'all' && paper.year !== parseInt(selectedYear)) {
            return false;
        }

        // Search filter
        if (searchTerm) {
            const searchableText = `${paper.title} ${paper.authors} ${paper.abstract} ${paper.keywords.join(' ')}`.toLowerCase();
            return searchableText.includes(searchTerm);
        }

        return true;
    });

    displayPapers(filteredPapers);
}

// ===========================
// Display Papers
// ===========================
function displayPapers(papers) {
    const grid = document.getElementById('papersGrid');

    if (papers.length === 0) {
        grid.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 3rem;">검색 조건과 일치하는 연구 논문을 찾을 수 없습니다.</div>';
        return;
    }

    grid.innerHTML = papers.map(paper => createPaperCard(paper)).join('');
}

// ===========================
// Create Paper Card
// ===========================
function createPaperCard(paper) {
    const formattedDate = new Date(paper.publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
        <div class="paper-card">
            <h3 class="paper-title">
                <a href="${paper.url}" target="_blank" rel="noopener noreferrer">${paper.title}</a>
            </h3>
            <p class="paper-authors">
                <i class="fas fa-user"></i> ${truncateText(paper.authors, 100)}
            </p>
            <p class="paper-date">
                <i class="fas fa-calendar"></i> ${formattedDate}
                ${paper.citations ? `<span style="margin-left: 1rem;"><i class="fas fa-quote-right"></i> ${paper.citations} citations</span>` : ''}
            </p>
            <p class="paper-abstract">${truncateText(paper.abstract, 200)}</p>
            <div class="paper-keywords">
                ${paper.keywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
            </div>
        </div>
    `;
}
