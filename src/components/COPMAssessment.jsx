import React, { useState } from 'react'
import { Download, Upload, Plus, Trash2 } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const COPMAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    education: '',
    date: new Date().toISOString().split('T')[0],
    evaluator: ''
  })
  const [problems, setProblems] = useState([])
  const [newProblem, setNewProblem] = useState({
    area: '',
    activity: '',
    performance: 1,
    satisfaction: 1
  })

  const problemAreas = [
    '자가관리 (Self-care)',
    '생산성 (Productivity)',
    '여가 (Leisure)',
    '기타 (Other)'
  ]

  const addProblem = () => {
    if (newProblem.area && newProblem.activity) {
      setProblems([...problems, { ...newProblem, id: Date.now() }])
      setNewProblem({
        area: '',
        activity: '',
        performance: 1,
        satisfaction: 1
      })
    }
  }

  const removeProblem = (id) => {
    setProblems(problems.filter(p => p.id !== id))
  }

  const updateProblem = (id, field, value) => {
    setProblems(problems.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const calculateScores = () => {
    if (problems.length === 0) return { performance: 0, satisfaction: 0 }
    
    const performanceSum = problems.reduce((sum, p) => sum + p.performance, 0)
    const satisfactionSum = problems.reduce((sum, p) => sum + p.satisfaction, 0)
    
    return {
      performance: Math.round((performanceSum / problems.length) * 100) / 100,
      satisfaction: Math.round((satisfactionSum / problems.length) * 100) / 100
    }
  }

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const scores = calculateScores()
    
    const result = {
      patientInfo,
      problems,
      scores,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('copm-result', JSON.stringify(result))
    alert(`COPM 평가가 완료되었습니다!\n수행 점수: ${scores.performance}\n만족도 점수: ${scores.satisfaction}`)
  }

  const generatePDF = () => {
    const { jsPDF } = require('jspdf')
    const doc = new jsPDF()
    
    const scores = calculateScores()
    
    doc.setFontSize(16)
    doc.text('COPM 평가 결과', 20, 20)
    
    doc.setFontSize(12)
    doc.text(`환자명: ${patientInfo.name}`, 20, 40)
    doc.text(`나이: ${patientInfo.age}세`, 20, 50)
    doc.text(`성별: ${patientInfo.gender}`, 20, 60)
    doc.text(`교육수준: ${patientInfo.education}`, 20, 70)
    doc.text(`평가일: ${patientInfo.date}`, 20, 80)
    doc.text(`평가자: ${patientInfo.evaluator}`, 20, 90)
    
    doc.text(`수행 점수: ${scores.performance}`, 20, 110)
    doc.text(`만족도 점수: ${scores.satisfaction}`, 20, 120)
    
    let yPos = 140
    doc.text('문제 영역별 평가:', 20, yPos)
    yPos += 10
    
    problems.forEach((problem, index) => {
      doc.text(`${index + 1}. ${problem.area} - ${problem.activity}`, 20, yPos)
      doc.text(`   수행: ${problem.performance}점, 만족도: ${problem.satisfaction}점`, 20, yPos + 5)
      yPos += 15
    })
    
    doc.save(`COPM_${patientInfo.name}_${patientInfo.date}.pdf`)
  }

  const exportToSheets = async () => {
    const scores = calculateScores()
    
    const result = {
      patientInfo,
      problems,
      scores,
      timestamp: new Date().toISOString()
    }
    
    const response = await exportToGoogleSheets(result, 'COPM_Results')
    alert(response.message)
  }

  if (currentStep === 0) {
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">환자 정보 입력</h3>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">환자명</label>
              <input
                type="text"
                className="form-input"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">나이</label>
              <input
                type="number"
                className="form-input"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">성별</label>
              <select
                className="form-select"
                value={patientInfo.gender}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">선택하세요</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">교육수준</label>
              <select
                className="form-select"
                value={patientInfo.education}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, education: e.target.value }))}
              >
                <option value="">선택하세요</option>
                <option value="무학">무학</option>
                <option value="초등학교">초등학교</option>
                <option value="중학교">중학교</option>
                <option value="고등학교">고등학교</option>
                <option value="대학교">대학교</option>
                <option value="대학원">대학원</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">평가일</label>
              <input
                type="date"
                className="form-input"
                value={patientInfo.date}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">평가자</label>
              <input
                type="text"
                className="form-input"
                value={patientInfo.evaluator}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, evaluator: e.target.value }))}
              />
            </div>
          </div>
          <div className="text-center mt-4">
            <button className="btn" onClick={() => setCurrentStep(1)}>
              평가 시작
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 1) {
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">문제 영역 식별</h3>
          <p className="mb-4">
            환자가 현재 어려움을 겪고 있는 작업 영역을 식별하고, 
            각 영역에서의 수행 능력과 만족도를 평가합니다.
          </p>

          <div className="mb-4">
            <h4>새로운 문제 영역 추가</h4>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">영역</label>
                <select
                  className="form-select"
                  value={newProblem.area}
                  onChange={(e) => setNewProblem(prev => ({ ...prev, area: e.target.value }))}
                >
                  <option value="">선택하세요</option>
                  {problemAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">구체적인 활동</label>
                <input
                  type="text"
                  className="form-input"
                  value={newProblem.activity}
                  onChange={(e) => setNewProblem(prev => ({ ...prev, activity: e.target.value }))}
                  placeholder="예: 요리하기, 쇼핑하기, 친구와 만나기"
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="btn" onClick={addProblem}>
                <Plus size={20} />
                문제 영역 추가
              </button>
            </div>
          </div>

          {problems.length > 0 && (
            <div className="mb-4">
              <h4>식별된 문제 영역</h4>
              {problems.map((problem, index) => (
                <div key={problem.id} className="card mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <strong>{problem.area}</strong>: {problem.activity}
                    </div>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => removeProblem(problem.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-2">
                    <div>
                      <label className="form-label">수행 능력 (1-10점)</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={problem.performance}
                        onChange={(e) => updateProblem(problem.id, 'performance', parseInt(e.target.value))}
                        className="form-input"
                      />
                      <div className="text-center">{problem.performance}점</div>
                    </div>
                    <div>
                      <label className="form-label">만족도 (1-10점)</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={problem.satisfaction}
                        onChange={(e) => updateProblem(problem.id, 'satisfaction', parseInt(e.target.value))}
                        className="form-input"
                      />
                      <div className="text-center">{problem.satisfaction}점</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <button 
              className="btn btn-secondary" 
              onClick={handlePrevious}
            >
              이전
            </button>
            <button 
              className="btn ml-2" 
              onClick={problems.length > 0 ? handleNext : () => alert('최소 하나의 문제 영역을 추가해주세요.')}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 2) {
    const scores = calculateScores()
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">COPM 평가 결과</h3>
          
          <div className="score-display">
            <div className="score-number">{scores.performance}</div>
            <div className="score-label">수행 점수</div>
          </div>

          <div className="score-display mt-4">
            <div className="score-number">{scores.satisfaction}</div>
            <div className="score-label">만족도 점수</div>
          </div>

          <div className="grid grid-2">
            <div>
              <h4>환자 정보</h4>
              <p><strong>이름:</strong> {patientInfo.name}</p>
              <p><strong>나이:</strong> {patientInfo.age}세</p>
              <p><strong>성별:</strong> {patientInfo.gender}</p>
              <p><strong>교육수준:</strong> {patientInfo.education}</p>
              <p><strong>평가일:</strong> {patientInfo.date}</p>
              <p><strong>평가자:</strong> {patientInfo.evaluator}</p>
            </div>
            <div>
              <h4>문제 영역별 점수</h4>
              {problems.map((problem, index) => (
                <p key={index}>
                  <strong>{problem.area}:</strong> 수행 {problem.performance}점, 만족도 {problem.satisfaction}점
                </p>
              ))}
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn" onClick={generatePDF}>
              <Download size={20} />
              PDF 저장
            </button>
            <button className="btn btn-success ml-2" onClick={exportToSheets}>
              <Upload size={20} />
              구글 스프레드시트 연동
            </button>
            <button className="btn btn-secondary ml-2" onClick={() => window.location.reload()}>
              새 평가 시작
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default COPMAssessment
