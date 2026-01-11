// ===========================
// 뉴스 모듈
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
let currentCompany = 'all';
let currentCategory = 'all';

// 캐시 TTL: 1시간
const CACHE_TTL = 60;

// ===========================
// 초기화
// ===========================
export function initNews(data) {
    companiesData = data;

    // 회사 필터 채우기
    populateCompanyFilter();

    // 이벤트 리스너 추가
    setupEventListeners();

    // 뉴스 로드
    loadNews();
}

// ===========================
// 이벤트 리스너
// ===========================
function setupEventListeners() {
    // 회사 필터
    document.getElementById('companyFilter').addEventListener('change', (e) => {
        currentCompany = e.target.value;
        filterNews();
    });

    // 카테고리 필터
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        currentCategory = e.target.value;
        filterNews();
    });

    // 새로고침 버튼
    document.getElementById('refreshNews').addEventListener('click', () => {
        localStorage.removeItem('news_cache');
        loadNews();
    });
}

// ===========================
// 회사 필터 채우기
// ===========================
function populateCompanyFilter() {
    const select = document.getElementById('companyFilter');
    companiesData.companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company.id;
        option.textContent = company.name;
        select.appendChild(option);
    });
}

// ===========================
// 뉴스 로드
// ===========================
async function loadNews() {
    showLoading('newsLoading');
    hideError('newsError');

    try {
        // 먼저 캐시 확인
        const cachedNews = getCacheWithExpiry('news_cache');
        if (cachedNews) {
            allNews = cachedNews;
            displayNews(allNews);
            hideLoading('newsLoading');
            return;
        }

        // API에서 뉴스 가져오기
        const news = await fetchNewsFromAPI();
        allNews = news;

        // 결과 캐시
        setCacheWithExpiry('news_cache', news, CACHE_TTL);

        displayNews(news);
    } catch (error) {
        console.error('뉴스 로딩 오류:', error);
        showError('newsError', '뉴스를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.');

        // 대체 샘플 뉴스 로드
        allNews = getSampleNews();
        displayNews(allNews);
    } finally {
        hideLoading('newsLoading');
    }
}

// ===========================
// API에서 뉴스 가져오기
// ===========================
async function fetchNewsFromAPI() {
    // 참고: 프로덕션에서는 실제 API 키와 함께 NewsAPI를 사용합니다
    // 데모 목적으로 샘플 데이터를 사용합니다
    //
    // NewsAPI 사용 예시:
    // const apiKey = 'YOUR_NEWSAPI_KEY';
    // const companies = companiesData.companies.map(c => c.keywords.join(' OR ')).join(' OR ');
    // const url = `https://newsapi.org/v2/everything?q=(${companies}) AND cosmetics&sortBy=publishedAt&apiKey=${apiKey}`;
    // const response = await fetch(url);
    // const data = await response.json();
    // return data.articles.map(article => parseNewsArticle(article));

    // 현재는 샘플 데이터 반환
    return getSampleNews();
}

// ===========================
// 샘플 뉴스 가져오기 (대체용)
// ===========================
function getSampleNews() {
    return [
        {
            id: '1',
            title: '시세이도, AI 기반 피부 분석 플랫폼 출시',
            description: '일본 최대 화장품 기업이 개인 맞춤형 스킨케어 추천을 위한 새로운 인공지능 기술을 공개했습니다.',
            source: 'Beauty Innovation Today',
            url: 'https://www.shiseido.com/jp/news/',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            company: 'shiseido',
            region: 'japan',
            category: 'rd'
        },
        {
            id: '2',
            title: '코세, 4분기 실적 호조 발표',
            description: '일본 화장품 대기업이 아시아태평양 시장 주도로 15% 매출 성장을 기록하며 기대치를 초과했습니다.',
            source: 'Financial Beauty News',
            url: 'https://www.kose.co.jp/company/en/ir/',
            publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            company: 'kose',
            region: 'japan',
            category: 'financial'
        },
        {
            id: '3',
            title: '폴라 오르비스, 디지털 뷰티 상담 플랫폼에 투자',
            description: '일본 뷰티 대기업이 가상 체험과 개인 맞춤형 추천 서비스를 도입했습니다.',
            source: 'Digital Beauty Today',
            url: 'https://www.po-holdings.co.jp/en/',
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'pola',
            region: 'japan',
            category: 'rd'
        },
        {
            id: '4',
            title: '카오, 아시아 스킨케어 매출 기록 경신',
            description: '일본 생활용품 대기업이 프리미엄 스킨케어 부문에서 20% 성장을 기록했습니다.',
            source: 'Asian Business News',
            url: 'https://www.kao.com/jp/corporate/news/',
            publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'kao',
            region: 'japan',
            category: 'financial'
        },
        {
            id: '5',
            title: '판클, 고급 건강보조식품 함유 스킨케어 출시',
            description: '무첨가 화장품 선구자가 경구 및 국소 뷰티 솔루션을 결합했습니다.',
            source: 'Health & Beauty Journal',
            url: 'https://www.fancl.jp/news/',
            publishedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'fancl',
            region: 'japan',
            category: 'product'
        },
        {
            id: '6',
            title: 'DHC, 전 세계적으로 직판 플랫폼 확장',
            description: '통신판매 뷰티 선두 기업이 시장 전반에 걸쳐 디지털 커머스 역량을 강화합니다.',
            source: 'E-Commerce Beauty News',
            url: 'https://www.dhc.co.jp/company/news/',
            publishedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'dhc',
            region: 'japan',
            category: 'financial'
        },
        {
            id: '7',
            title: '칸에보, 럭셔리 안티에이징 컬렉션 공개',
            description: '프리미엄 일본 브랜드가 고급 펩타이드 기술을 적용한 고성능 스킨케어를 출시했습니다.',
            source: 'Luxury Beauty Review',
            url: 'https://www.kanebo-cosmetics.jp/press/',
            publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'kanebo',
            region: 'japan',
            category: 'product'
        },
        {
            id: '8',
            title: '맨담의 개츠비 브랜드, 아시아 남성 그루밍 시장 석권',
            description: '남성 화장품 선두 기업이 동남아시아 시장 전반에서 강력한 성장세를 보고했습니다.',
            source: 'Men\'s Beauty Trends',
            url: 'https://www.mandom.co.jp/en/news/',
            publishedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'mandom',
            region: 'japan',
            category: 'financial'
        },
        {
            id: '9',
            title: '노에비어 홀딩스, 생명공학 연구에 투자',
            description: '럭셔리 화장품 기업이 차세대 성분 개발을 위해 50억 엔을 배정했습니다.',
            source: 'Biotech Beauty News',
            url: 'https://www.noevirholdings.co.jp/en/news/',
            publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'noevir',
            region: 'japan',
            category: 'rd'
        },
        {
            id: '10',
            title: '밀본 프로페셔널 헤어케어, 유럽 살롱으로 확장',
            description: '일본 헤어케어 전문 기업이 유럽 주요 살롱 네트워크와 파트너십을 발표했습니다.',
            source: 'Professional Beauty Magazine',
            url: 'https://www.milbon.com/ja/news/',
            publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'milbon',
            region: 'japan',
            category: 'ma'
        },
        {
            id: '11',
            title: '시세이도, 2030년까지 탄소중립 약속',
            description: '글로벌 뷰티 리더가 야심찬 지속가능성 목표와 친환경 포장 이니셔티브를 발표했습니다.',
            source: 'Sustainability in Beauty',
            url: 'https://www.shiseido.com/jp/sustainability/',
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'shiseido',
            region: 'japan',
            category: 'esg'
        },
        {
            id: '12',
            title: '카오, 친환경 혁신 연구소 개설',
            description: '일본 대기업이 지속가능한 성분 연구 시설에 1억 달러를 투자했습니다.',
            source: 'Green Beauty Innovation',
            url: 'https://www.kao.com/jp/sustainability/',
            publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            company: 'kao',
            region: 'japan',
            category: 'rd'
        }
    ];
}

// ===========================
// 뉴스 필터링
// ===========================
function filterNews() {
    let filtered = [...allNews];

    // 회사별 필터
    if (currentCompany !== 'all') {
        filtered = filtered.filter(news => news.company === currentCompany);
    }

    // 카테고리별 필터
    if (currentCategory !== 'all') {
        filtered = filtered.filter(news => news.category === currentCategory);
    }

    displayNews(filtered);
}

// ===========================
// 뉴스 표시
// ===========================
function displayNews(news) {
    const grid = document.getElementById('newsGrid');

    if (news.length === 0) {
        grid.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 3rem;">필터와 일치하는 뉴스를 찾을 수 없습니다.</div>';
        return;
    }

    grid.innerHTML = news.map(article => createNewsCard(article)).join('');

    // 뉴스 카드에 클릭 이벤트 추가
    grid.querySelectorAll('.news-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            if (news[index].url && news[index].url !== '#') {
                window.open(news[index].url, '_blank', 'noopener,noreferrer');
            }
        });
        // 마우스 커서를 포인터로 변경
        card.style.cursor = 'pointer';
    });
}

// ===========================
// 뉴스 카드 생성
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
                <span class="tag tag-japan">${company?.name || article.company}</span>
                ${getCategoryTag(article.category)}
            </div>
        </div>
    `;
}

// ===========================
// 카테고리 태그 가져오기
// ===========================
function getCategoryTag(categoryId) {
    const categories = {
        product: '신제품',
        financial: '재무실적',
        ma: 'M&A',
        rd: '연구개발',
        esg: 'ESG'
    };
    return `<span class="tag" style="background: rgba(103, 58, 183, 0.1); color: var(--secondary);">${categories[categoryId] || categoryId}</span>`;
}
