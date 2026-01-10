# 글로벌 화장품 산업 대시보드

한국, 일본, 중국, 유럽의 주요 화장품 기업 뉴스, 주가, AI 연구를 추적하는 종합 웹 대시보드입니다.

![대시보드 미리보기](https://via.placeholder.com/1200x600/E91E63/FFFFFF?text=Global+Cosmetics+Dashboard)

## 주요 기능

### 1. 최신 뉴스 섹션
- 여러 출처의 실시간 산업 뉴스
- 지역별 필터링 (한국, 일본, 중국, 유럽)
- 회사 및 카테고리별 필터링
- 자동 캐싱 (1시간 TTL)
- 카테고리: 신제품, 재무 실적, M&A, 연구개발, ESG

### 2. 주가 차트
- Chart.js를 활용한 인터랙티브 주가 시각화
- 다양한 기간 지원 (1주, 1개월, 3개월, 6개월, 1년, YTD)
- 최대 4개 회사 동시 비교
- 실시간 가격 지표 및 52주 최고/최저가
- 자동 캐싱 (15분 TTL)

### 3. AI 연구 논문
- 화장품 분야 AI 응용 학술 논문
- 검색 및 필터링 기능
- 연도별 필터링
- arXiv 및 학술 데이터베이스 통합
- 성능 향상을 위한 24시간 캐시

### 4. 추가 기능
- 다크/라이트 테마 전환
- 완전 반응형 디자인 (모바일, 태블릿, 데스크톱)
- API 호출 감소를 위한 로컬 스토리지 캐싱
- 부드러운 애니메이션 및 전환 효과
- 화장품에서 영감받은 깔끔하고 모던한 UI

## 기술 스택

- **프론트엔드**: HTML5, CSS3, Vanilla JavaScript (ES6 모듈)
- **차트**: Chart.js 4.4.1
- **아이콘**: Font Awesome 6.5.1
- **호스팅**: GitHub Pages (정적 호스팅)
- **API**: NewsAPI, Alpha Vantage, arXiv

## 프로젝트 구조

```
Stock_cosmetics/
├── index.html              # 메인 HTML 파일
├── css/
│   └── styles.css         # 모든 스타일링 및 테마
├── js/
│   ├── main.js            # 핵심 앱 로직 및 유틸리티
│   ├── news.js            # 뉴스 모듈
│   ├── stocks.js          # 주가 차트 모듈
│   └── papers.js          # 연구 논문 모듈
├── data/
│   └── companies.json     # 회사 데이터 및 메타데이터
├── assets/
│   ├── images/            # 이미지 자산
│   └── logos/             # 회사 로고
└── README.md              # 이 파일
```

## 추적 중인 회사

### 한국 (10개 회사)
- **아모레퍼시픽** (090430.KS) - 설화수, 라네즈, 이니스프리
- **LG생활건강** (051900.KS) - 더페이스샵, 오휘
- **코스맥스** (192820.KS) - 선도적인 ODM 제조업체
- **에이블씨엔씨** (078520.KS) - 미샤, 어퓨
- **한국콜마** (161890.KS) - 화장품 ODM/OEM 제조
- **코스메카코리아** (241710.KQ) - 화장품 제조
- **한국화장품** (002790.KS) - 화장품 제조 및 유통
- **토니모리** - K-뷰티 브랜드
- **네이처리퍼블릭** - 자연주의 화장품
- **클리오** (237880.KQ) - 색조 화장품

### 일본 (10개 회사)
- **시세이도** (4911.T) - 글로벌 화장품 리더
- **코세** (4922.T) - 혁신 중심 뷰티 회사
- **폴라 오르비스 홀딩스** (4927.T) - 프리미엄 뷰티 브랜드
- **카오** (4452.T) - 생활용품 및 화장품 대기업
- **판클** (4921.T) - 무첨가 화장품 전문
- **DHC** - 통신판매 화장품 선두
- **칸에보** - 카오 그룹 프리미엄 브랜드
- **맨담** (4917.T) - 남성 화장품 전문
- **노에비어 홀딩스** (4928.T) - 고급 화장품
- **밀본** (4919.T) - 전문 헤어케어

### 중국
- **상하이 자화** (600315.SS) - 역사 깊은 중국 뷰티 회사
- **프로야 코스메틱스** (603605.SS) - 선도적인 스킨케어 브랜드

### 유럽/글로벌
- **로레알** (OR.PA) - 세계 최대 화장품 회사
- **에스티 로더** (EL) - 럭셔리 뷰티 리더
- **유니레버** (UL) - 글로벌 소비재 대기업

## 설치 방법

### 1. 저장소 클론

```bash
git clone https://github.com/yourusername/Stock_cosmetics.git
cd Stock_cosmetics
```

### 2. API 키 설정 (선택사항)

실제 데이터로 프로덕션 사용을 위해 API 키 설정이 필요합니다:

#### NewsAPI
1. [NewsAPI.org](https://newsapi.org/)에서 가입
2. 무료 API 키 발급
3. `js/news.js` 파일을 수정하여 API 키 추가:

```javascript
const apiKey = 'YOUR_NEWSAPI_KEY';
```

#### 주가 데이터 - Alpha Vantage
1. [Alpha Vantage](https://www.alphavantage.co/)에서 가입
2. 무료 API 키 발급
3. `js/stocks.js` 파일을 수정하여 API 키 추가:

```javascript
const apiKey = 'YOUR_ALPHA_VANTAGE_KEY';
```

#### arXiv API
API 키가 필요 없습니다! arXiv API는 무료이며 오픈되어 있습니다.

### 3. 로컬 개발

웹 브라우저에서 `index.html`을 열기만 하면 됩니다:

```bash
# Python 내장 서버 사용
python -m http.server 8000

# 또는 Node.js 사용
npx http-server

# 그런 다음 http://localhost:8000 방문
```

### 4. GitHub Pages 배포

1. 코드를 GitHub에 푸시:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. GitHub Pages 활성화:
   - 저장소 Settings로 이동
   - Pages 섹션으로 이동
   - "main" 브랜치와 root 폴더 선택
   - 저장

3. 사이트가 다음 주소에서 이용 가능합니다:
   ```
   https://yourusername.github.io/Stock_cosmetics/
   ```

## 설정

### 캐시 설정

각 모듈에서 캐시 기간 수정:

```javascript
// news.js에서
const CACHE_TTL = 60; // 60분

// stocks.js에서
const CACHE_TTL = 15; // 15분

// papers.js에서
const CACHE_TTL = 1440; // 24시간
```

### 테마 커스터마이징

`css/styles.css`에서 CSS 변수 편집:

```css
:root {
    --primary: #E91E63;      /* 핑크 */
    --secondary: #673AB7;    /* 보라 */
    --accent: #FF9800;       /* 오렌지 */
    --background: #FAFAFA;   /* 밝은 배경 */
}
```

### 새 회사 추가

`data/companies.json` 편집:

```json
{
  "id": "newcompany",
  "name": "New Company",
  "region": "korea",
  "ticker": "TICKER.EX",
  "exchange": "Exchange",
  "currency": "KRW",
  "website": "https://example.com",
  "description": "회사 설명",
  "keywords": ["키워드1", "키워드2"]
}
```

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)
- 모바일 브라우저 (iOS Safari, Chrome Mobile)

## 성능 최적화

- **지연 로딩**: 필요할 때만 이미지 로드
- **캐싱**: 적극적인 로컬 스토리지 캐싱으로 API 호출 감소
- **디바운싱**: 검색 입력 디바운싱으로 처리 최소화
- **CDN**: CDN에서 외부 라이브러리 로드
- **최소화**: 프로덕션용 CSS/JS 최소화 권장

## 개발 로드맵

### Phase 1: 핵심 기능 ✅
- [x] 기본 UI 및 네비게이션
- [x] 필터링 기능이 있는 뉴스 섹션
- [x] 다양한 기간의 주가 차트
- [x] 연구 논문 통합

### Phase 2: 향상된 기능
- [ ] 사용자 인증 (선택사항)
- [ ] 북마크 기능
- [ ] 가격 변동 이메일 알림
- [ ] CSV/PDF로 데이터 내보내기
- [ ] 시장 점유율 시각화

### Phase 3: 고급 분석
- [ ] 트렌드 분석 대시보드
- [ ] 뉴스 감성 분석
- [ ] 예측 가격 모델링
- [ ] 회사 비교 테이블

### Phase 4: 모바일 앱
- [ ] 프로그레시브 웹 앱 (PWA)
- [ ] 네이티브 모바일 앱
- [ ] 푸시 알림

## API 사용 제한

API 사용 제한에 유의하세요:

- **NewsAPI 무료**: 100 요청/일
- **Alpha Vantage 무료**: 5 요청/분, 500/일
- **arXiv**: 공식 제한 없음, 단 배려하여 사용

## 기여

기여를 환영합니다! 다음 단계를 따르세요:

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add AmazingFeature'`)
4. 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 열기

## 라이선스

이 프로젝트는 MIT 라이선스로 제공됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 감사의 말

- Chart.js - 아름다운 차트 시각화
- Font Awesome - 아이콘
- NewsAPI - 뉴스 데이터
- Alpha Vantage - 주식 시장 데이터
- arXiv - 학술 연구 논문

## 지원

문제, 질문 또는 제안사항:
- GitHub에서 이슈 열기
- 연락처: your-email@example.com

## 면책 조항

이 대시보드는 정보 및 교육 목적으로만 제공됩니다. 금융 조언으로 사용되지 않습니다. 투자 결정을 내리기 전에 항상 데이터를 독립적으로 확인하고 금융 전문가와 상담하세요.

---

**글로벌 화장품 산업을 위해 ❤️로 제작되었습니다**

최종 업데이트: 2026년 1월
