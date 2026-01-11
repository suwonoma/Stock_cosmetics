// ===========================
// 메인 애플리케이션
// ===========================

import { initNews } from './news.js';
import { initStocks } from './stocks.js';
import { initPapers } from './papers.js';

// 전역 상태
let companiesData = null;

// ===========================
// 초기화
// ===========================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 회사 데이터 로드
        await loadCompaniesData();

        // 테마 초기화
        initTheme();

        // 탭 네비게이션 초기화
        initTabs();

        // 모든 모듈 초기화
        initNews(companiesData);
        initStocks(companiesData);
        initPapers(companiesData);

        console.log('애플리케이션이 성공적으로 초기화되었습니다');
    } catch (error) {
        console.error('애플리케이션 초기화 오류:', error);
        showGlobalError('애플리케이션 초기화에 실패했습니다. 페이지를 새로고침 해주세요.');
    }
});

// ===========================
// 회사 데이터 로드
// ===========================
async function loadCompaniesData() {
    try {
        const response = await fetch('data/companies.json');
        if (!response.ok) {
            throw new Error('회사 데이터 로드 실패');
        }
        companiesData = await response.json();
        return companiesData;
    } catch (error) {
        console.error('회사 데이터 로딩 오류:', error);
        throw error;
    }
}

// ===========================
// 테마 전환
// ===========================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    // 저장된 테마 적용
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // 테마 전환 이벤트
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
// 탭 네비게이션
// ===========================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.content-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // 활성 탭 버튼 업데이트
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 활성 섹션 업데이트
            sections.forEach(section => {
                if (section.id === `${targetTab}Section`) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            // 활성 탭 저장
            localStorage.setItem('activeTab', targetTab);
        });
    });

    // 마지막 활성 탭 복원
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        const savedButton = document.querySelector(`[data-tab="${savedTab}"]`);
        if (savedButton) {
            savedButton.click();
        }
    }
}

// ===========================
// 유틸리티 함수
// ===========================

// 전역 오류 메시지 표시
function showGlobalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.body.firstChild);
}

// 날짜 포맷
export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return '오늘';
    } else if (diffDays === 1) {
        return '어제';
    } else if (diffDays < 7) {
        return `${diffDays}일 전`;
    } else {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// 숫자에 콤마 추가
export function formatNumber(num) {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString('ko-KR');
}

// 통화 포맷
export function formatCurrency(amount, currency = 'JPY') {
    if (amount === null || amount === undefined) return '-';

    const formatOptions = {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    };

    return new Intl.NumberFormat('ko-KR', formatOptions).format(amount);
}

// 텍스트 자르기
export function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ===========================
// 캐시 관리
// ===========================

// 만료 시간이 있는 캐시 저장
export function setCacheWithExpiry(key, value, ttlMinutes) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttlMinutes * 60 * 1000
    };
    localStorage.setItem(key, JSON.stringify(item));
}

// 만료 시간 확인하여 캐시 가져오기
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
        console.error('캐시 파싱 오류:', error);
        localStorage.removeItem(key);
        return null;
    }
}

// 오래된 캐시 정리
export function clearOldCache(keyPrefix) {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith(keyPrefix)) {
            getCacheWithExpiry(key); // 만료된 항목 제거
        }
    });
}

// ===========================
// API 헬퍼 함수
// ===========================

// 디바운스 함수
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

// 타임아웃이 있는 fetch
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

// 로딩 상태 표시
export function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

// 로딩 상태 숨기기
export function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

// 오류 표시
export function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
}

// 오류 숨기기
export function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

// 회사 데이터 가져오기
export function getCompaniesData() {
    return companiesData;
}
