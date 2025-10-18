import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, Activity, Users, Settings, Globe } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="container">
      <div className="text-center mb-4">
        <h2>작업치료 평가 시스템</h2>
        <p className="mb-4">
          ICF(국제기능분류) 기반의 종합적인 작업치료 평가 도구입니다.<br/>
          환자의 신체기능, 활동, 참여, 환경요인을 체계적으로 평가할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="text-center mb-4">
            <Activity size={48} color="#007bff" />
            <h3>신체기능 평가</h3>
            <p>신체의 구조와 기능을 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>포함 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>인지기능 (MMSE-K, MMSE-DS)</li>
              <li>감각기능</li>
              <li>운동기능</li>
              <li>언어기능</li>
            </ul>
          </div>
          <Link to="/physical-function" className="btn">
            신체기능 평가 시작
          </Link>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Users size={48} color="#28a745" />
            <h3>활동/참여 평가</h3>
            <p>개인의 수행 능력과 사회적 참여를 종합적으로 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>포함 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>WHODAS 2.0 (종합 장애 평가)</li>
              <li>COPM (개인 맞춤형 평가)</li>
              <li>일상생활활동 (ADL)</li>
              <li>수단적 일상생활활동 (IADL)</li>
              <li>직업 활동</li>
              <li>여가 활동</li>
              <li>이동능력</li>
            </ul>
          </div>
          <Link to="/activity-participation" className="btn">
            활동/참여 평가 시작
          </Link>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Settings size={48} color="#6c757d" />
            <h3>환경요인 평가</h3>
            <p>환경적 장벽과 촉진요인을 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>포함 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>물리적 환경</li>
              <li>사회적 환경</li>
              <li>정책적 환경</li>
              <li>서비스 환경</li>
            </ul>
          </div>
          <button className="btn btn-secondary" disabled>
            준비 중
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="text-center mb-4">ICF 평가 체계</h3>
        <div className="grid grid-2">
          <div>
            <h4>신체기능 (Body Functions)</h4>
            <p>신체계의 생리적 기능을 의미합니다.</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>정신기능</li>
              <li>감각기능</li>
              <li>음성 및 언어기능</li>
              <li>심혈관계, 혈액계, 면역계 기능</li>
            </ul>
          </div>
          <div>
            <h4>활동/참여 (Activities/Participation)</h4>
            <p>개인의 수행 능력과 사회적 참여를 의미합니다.</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>일상생활활동 (ADL)</li>
              <li>수단적 일상생활활동 (IADL)</li>
              <li>직업 활동</li>
              <li>여가 활동</li>
              <li>사회적 참여</li>
            </ul>
          </div>
          <div>
            <h4>환경요인 (Environmental Factors)</h4>
            <p>개인의 기능과 장애에 영향을 미치는 환경을 의미합니다.</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>제품과 기술</li>
              <li>자연환경과 인공환경</li>
              <li>지지와 관계</li>
              <li>태도</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
