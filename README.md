# 작업치료 평가 툴

ICF(국제기능분류) 기반의 종합적인 작업치료 평가 시스템입니다.

## 주요 기능

### 1. ICF 기반 평가 체계
- **신체기능 (Body Functions)**: 신체계의 생리적 기능 평가
- **활동 (Activities)**: 개인이 수행하는 작업이나 과제 평가  
- **참여 (Participation)**: 생활 상황에서의 참여 평가
- **환경요인 (Environmental Factors)**: 개인의 기능과 장애에 영향을 미치는 환경 평가

### 2. 인지기능 평가
- **MMSE-K**: Mini-Mental State Examination - Korean Version
- **MMSE-DS**: MMSE for Dementia Screening

### 3. WHODAS 2.0 평가
- **WHODAS 2.0**: World Health Organization Disability Assessment Schedule 2.0
- 6개 영역별 종합적인 장애 평가 도구

### 4. 평가 결과 관리
- PDF 형태로 평가 결과 저장
- 구글 스프레드시트 연동 (CSV 다운로드)
- 환자별 평가 이력 관리

## 설치 및 실행

### 필요 조건
- Node.js 16.0 이상
- npm 또는 yarn

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

## 사용법

### 1. 랜딩페이지
- ICF 기반 평가 카테고리 선택
- 각 평가 영역에 대한 설명 확인

### 2. 신체기능 평가
- 인지기능, 감각기능, 운동기능, 언어기능 평가
- 현재 인지기능 평가(MMSE) 구현 완료

### 3. MMSE 평가
- 환자 정보 입력 (이름, 나이, 성별, 교육수준, 평가일, 평가자)
- 6개 영역별 평가 진행:
  - 시간 지남력 (5점)
  - 장소 지남력 (5점)  
  - 기억 등록 (3점)
  - 주의집중 및 계산 (5점)
  - 기억 회상 (3점)
  - 언어 기능 (9점)

### 4. WHODAS 2.0 평가
- 환자 정보 입력
- 6개 영역별 평가 진행:
  - 인지 영역 (6문항)
  - 이동 영역 (4문항)
  - 자가관리 영역 (4문항)
  - 사람들과 어울리기 (4문항)
  - 생활활동 영역 (4문항)
  - 사회참여 영역 (4문항)
- 각 문항은 1-5점 척도로 평가

### 5. 평가 결과
- 총점 계산 및 해석
- 영역별 점수 확인
- PDF 저장
- 구글 스프레드시트 연동 (CSV 다운로드)

## 평가 해석 기준

### MMSE 점수 해석
- **24-30점**: 정상
- **18-23점**: 경도 인지장애
- **0-17점**: 중등도-중증 인지장애

### WHODAS 2.0 점수 해석
- **1.0-1.5점**: 경미한 장애
- **1.5-2.5점**: 경도 장애
- **2.5-3.5점**: 중등도 장애
- **3.5-5.0점**: 중증 장애

## 기술 스택

- **Frontend**: React 18, React Router
- **Styling**: CSS3 (반응형 디자인)
- **PDF 생성**: jsPDF
- **아이콘**: Lucide React
- **빌드 도구**: Vite

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Header.jsx      # 헤더 컴포넌트
│   ├── MMSEKAssessment.jsx    # MMSE-K 평가 컴포넌트
│   ├── MMSEDSAssessment.jsx    # MMSE-DS 평가 컴포넌트
│   └── WHODASAssessment.jsx    # WHODAS 2.0 평가 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── LandingPage.jsx         # 랜딩페이지
│   ├── PhysicalFunctionPage.jsx   # 신체기능 평가 페이지
│   ├── CognitiveAssessmentPage.jsx # 인지평가 페이지
│   ├── MMSEKPage.jsx          # MMSE-K 페이지
│   ├── MMSEDSPage.jsx         # MMSE-DS 페이지
│   └── WHODASPage.jsx         # WHODAS 2.0 페이지
├── utils/               # 유틸리티 함수
│   └── googleSheets.js        # 구글 스프레드시트 연동
├── App.jsx             # 메인 앱 컴포넌트
├── main.jsx           # 앱 진입점
└── index.css          # 전역 스타일
```

## 향후 개발 계획

### 1. 추가 평가 도구
- [ ] 감각기능 평가
- [ ] 운동기능 평가  
- [ ] 언어기능 평가
- [ ] 일상생활활동(ADL) 평가
- [ ] 수단적 일상생활활동(IADL) 평가

### 2. 데이터 관리
- [ ] 환자 데이터베이스 연동
- [ ] 평가 이력 추적
- [ ] 통계 및 분석 기능

### 3. 사용자 경험 개선
- [ ] 다국어 지원
- [ ] 접근성 개선
- [ ] 모바일 최적화

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
