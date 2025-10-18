import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, FileText, Users } from 'lucide-react'

const CognitiveAssessmentPage = () => {
  return (
    <div className="container">
      <div className="text-center mb-4">
        <h2>인지기능 평가</h2>
        <p className="mb-4">
          인지능력과 정신기능을 체계적으로 평가합니다.<br/>
          MMSE-K와 MMSE-DS 두 가지 버전을 제공합니다.
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="text-center mb-4">
            <Brain size={48} color="#007bff" />
            <h3>MMSE-K</h3>
            <p>Mini-Mental State Examination - Korean Version</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>시간 지남력 (5점)</li>
              <li>장소 지남력 (5점)</li>
              <li>기억 등록 (3점)</li>
              <li>주의집중 및 계산 (5점)</li>
              <li>기억 회상 (3점)</li>
              <li>언어 기능 (9점)</li>
            </ul>
            <p><strong>총점: 30점</strong></p>
          </div>
          <div className="mb-4">
            <h4>해석 기준:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>24-30점: 정상</li>
              <li>18-23점: 경도 인지장애</li>
              <li>0-17점: 중등도-중증 인지장애</li>
            </ul>
          </div>
          <Link to="/mmse-k" className="btn">
            MMSE-K 평가 시작
          </Link>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Users size={48} color="#28a745" />
            <h3>MMSE-DS</h3>
            <p>MMSE for Dementia Screening</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>시간 지남력 (5점)</li>
              <li>장소 지남력 (5점)</li>
              <li>기억 등록 (3점)</li>
              <li>주의집중 및 계산 (5점)</li>
              <li>기억 회상 (3점)</li>
              <li>언어 기능 (9점)</li>
            </ul>
            <p><strong>총점: 30점</strong></p>
          </div>
          <div className="mb-4">
            <h4>해석 기준:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>24-30점: 정상</li>
              <li>18-23점: 경도 인지장애</li>
              <li>0-17점: 중등도-중증 인지장애</li>
            </ul>
          </div>
          <Link to="/mmse-ds" className="btn">
            MMSE-DS 평가 시작
          </Link>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="text-center mb-4">MMSE 평가 가이드</h3>
        <div className="grid grid-2">
          <div>
            <h4>MMSE-K 특징</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li>한국어로 표준화된 MMSE</li>
              <li>한국인의 인지 특성을 반영</li>
              <li>교육 수준에 따른 보정 가능</li>
              <li>임상에서 널리 사용되는 도구</li>
            </ul>
          </div>
          <div>
            <h4>MMSE-DS 특징</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li>치매 선별을 위한 특화된 버전</li>
              <li>민감도와 특이도가 높음</li>
              <li>초기 치매 진단에 유용</li>
              <li>간단하고 빠른 평가 가능</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="text-center mb-4">평가 시 주의사항</h3>
        <div className="grid grid-2">
          <div>
            <h4>평가 전 준비사항</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li>조용하고 편안한 환경 조성</li>
              <li>충분한 시간 확보 (15-20분)</li>
              <li>필요한 도구 준비 (펜, 종이 등)</li>
              <li>환자의 동의 및 협조 확인</li>
            </ul>
          </div>
          <div>
            <h4>평가 중 주의사항</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li>명확하고 천천히 질문하기</li>
              <li>환자의 반응을 정확히 기록</li>
              <li>힌트나 답변 제공 금지</li>
              <li>환자의 피로도 확인</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CognitiveAssessmentPage
