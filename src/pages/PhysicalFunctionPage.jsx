import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, Eye, Activity, MessageCircle } from 'lucide-react'

const PhysicalFunctionPage = () => {
  return (
    <div className="container">
      <div className="text-center mb-4">
        <h2>신체기능 평가</h2>
        <p className="mb-4">
          신체의 구조와 기능을 체계적으로 평가합니다.<br/>
          각 영역별로 세부 평가 도구를 선택할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="text-center mb-4">
            <Brain size={48} color="#007bff" />
            <h3>인지기능 평가</h3>
            <p>인지능력과 정신기능을 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 도구:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>MMSE-K (Mini-Mental State Examination - Korean)</li>
              <li>MMSE-DS (MMSE for Dementia Screening)</li>
            </ul>
          </div>
          <Link to="/cognitive-assessment" className="btn">
            인지기능 평가 시작
          </Link>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Eye size={48} color="#28a745" />
            <h3>감각기능 평가</h3>
            <p>시각, 청각, 촉각 등 감각기능을 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>시각 기능</li>
              <li>청각 기능</li>
              <li>촉각 기능</li>
              <li>전정 기능</li>
            </ul>
          </div>
          <button className="btn btn-secondary" disabled>
            준비 중
          </button>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Activity size={48} color="#ffc107" />
            <h3>운동기능 평가</h3>
            <p>근력, 조절, 지구력 등 운동기능을 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>근력 평가</li>
              <li>조절 능력</li>
              <li>지구력</li>
              <li>균형 능력</li>
            </ul>
          </div>
          <button className="btn btn-secondary" disabled>
            준비 중
          </button>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <MessageCircle size={48} color="#6c757d" />
            <h3>언어기능 평가</h3>
            <p>언어 이해와 표현 능력을 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>언어 이해</li>
              <li>언어 표현</li>
              <li>읽기 능력</li>
              <li>쓰기 능력</li>
            </ul>
          </div>
          <button className="btn btn-secondary" disabled>
            준비 중
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="text-center mb-4">신체기능 평가 가이드</h3>
        <div className="grid grid-2">
          <div>
            <h4>평가 시 주의사항</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li>환자의 상태와 피로도를 고려하여 평가를 진행합니다.</li>
              <li>환경을 조용하고 편안하게 유지합니다.</li>
              <li>평가 결과를 객관적으로 기록합니다.</li>
              <li>환자의 동의를 구한 후 평가를 시작합니다.</li>
            </ul>
          </div>
          <div>
            <h4>평가 결과 활용</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li>평가 결과는 PDF로 저장할 수 있습니다.</li>
              <li>구글 스프레드시트로 연동하여 데이터를 관리할 수 있습니다.</li>
              <li>시간에 따른 변화를 추적할 수 있습니다.</li>
              <li>치료 계획 수립에 활용할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhysicalFunctionPage
