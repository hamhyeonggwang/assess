import React from 'react'
import { Link } from 'react-router-dom'
import { Globe, Users, Activity, Home, Briefcase, Heart } from 'lucide-react'

const ActivityParticipationPage = () => {
  return (
    <div className="container">
      <div className="text-center mb-4">
        <h2>활동/참여 평가</h2>
        <p className="mb-4">
          ICF 활동(Activities)과 참여(Participation) 영역을 통합한 평가입니다.<br/>
          개인의 수행 능력과 사회적 참여를 종합적으로 평가합니다.
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="text-center mb-4">
            <Globe size={48} color="#17a2b8" />
            <h3>WHODAS 2.0 평가</h3>
            <p>WHO에서 개발한 종합적인 장애 평가 도구입니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>인지 영역</li>
              <li>이동 영역</li>
              <li>자가관리 영역</li>
              <li>사람들과 어울리기</li>
              <li>생활활동 영역</li>
              <li>사회참여 영역</li>
            </ul>
          </div>
          <Link to="/whodas" className="btn">
            WHODAS 2.0 평가 시작
          </Link>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Users size={48} color="#28a745" />
            <h3>COPM 평가</h3>
            <p>캐나다 작업치료 성과 측정 도구입니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>자가관리 (Self-care)</li>
              <li>생산성 (Productivity)</li>
              <li>여가 (Leisure)</li>
              <li>개인 맞춤형 활동</li>
            </ul>
          </div>
          <Link to="/copm" className="btn">
            COPM 평가 시작
          </Link>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Home size={48} color="#28a745" />
            <h3>일상생활활동 (ADL)</h3>
            <p>기본적인 일상생활 수행 능력을 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>개인위생</li>
              <li>의복착용</li>
              <li>식사</li>
              <li>배변/배뇨</li>
              <li>이동</li>
            </ul>
          </div>
          <button className="btn btn-secondary" disabled>
            준비 중
          </button>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Activity size={48} color="#ffc107" />
            <h3>수단적 일상생활활동 (IADL)</h3>
            <p>복잡한 일상생활 수행 능력을 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>가사활동</li>
              <li>쇼핑</li>
              <li>교통수단 이용</li>
              <li>약물 관리</li>
              <li>금전 관리</li>
            </ul>
          </div>
          <button className="btn btn-secondary" disabled>
            준비 중
          </button>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Briefcase size={48} color="#6c757d" />
            <h3>직업 활동 평가</h3>
            <p>직업적 수행 능력과 적응을 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>직업 적성</li>
              <li>작업 수행 능력</li>
              <li>직장 적응</li>
              <li>직업 만족도</li>
            </ul>
          </div>
          <button className="btn btn-secondary" disabled>
            준비 중
          </button>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Heart size={48} color="#e83e8c" />
            <h3>여가 활동 평가</h3>
            <p>여가 시간 활용과 사회적 참여를 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>여가 활동 참여</li>
              <li>사회적 관계</li>
              <li>취미 활동</li>
              <li>사회적 역할</li>
            </ul>
          </div>
          <button className="btn btn-secondary" disabled>
            준비 중
          </button>
        </div>

        <div className="card">
          <div className="text-center mb-4">
            <Users size={48} color="#fd7e14" />
            <h3>이동능력 평가</h3>
            <p>신체적 이동 능력을 평가합니다.</p>
          </div>
          <div className="mb-4">
            <h4>평가 영역:</h4>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>보행 능력</li>
              <li>계단 오르내리기</li>
              <li>균형 유지</li>
              <li>지구력</li>
            </ul>
          </div>
          <button className="btn btn-secondary" disabled>
            준비 중
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="text-center mb-4">활동/참여 평가 가이드</h3>
        <div className="grid grid-2">
          <div>
            <h4>ICF 활동/참여 영역</h4>
            <p><strong>활동(Activities):</strong> 개인이 수행하는 작업이나 과제</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>학습과 지식의 적용</li>
              <li>일반적인 과제와 요구사항</li>
              <li>의사소통</li>
              <li>이동</li>
              <li>자가관리</li>
              <li>가정생활</li>
            </ul>
            <p><strong>참여(Participation):</strong> 생활 상황에서의 참여</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>가정생활</li>
              <li>직업</li>
              <li>여가</li>
              <li>사회생활</li>
            </ul>
          </div>
          <div>
            <h4>평가 시 주의사항</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li>환자의 실제 수행 능력을 관찰합니다.</li>
              <li>환경적 요인을 고려합니다.</li>
              <li>보조도구 사용 여부를 기록합니다.</li>
              <li>시간에 따른 변화를 추적합니다.</li>
              <li>사회적 맥락을 고려합니다.</li>
              <li>개인의 선호도와 가치를 존중합니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityParticipationPage
