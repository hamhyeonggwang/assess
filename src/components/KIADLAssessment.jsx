import React, { useState } from 'react'
import { Download, Upload, ArrowLeft, ArrowRight } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const KIADLAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    date: new Date().toISOString().split('T')[0],
    evaluator: ''
  })
  const [scores, setScores] = useState({
    전화사용: 0,
    쇼핑: 0,
    음식준비: 0,
    집안일: 0,
    세탁: 0,
    교통수단이용: 0,
    약물관리: 0,
    금전관리: 0
  })

  const activities = [
    { key: '전화사용', name: '전화사용', description: '전화를 걸고 받는 능력' },
    { key: '쇼핑', name: '쇼핑', description: '필요한 물건을 사는 능력' },
    { key: '음식준비', name: '음식준비', description: '음식을 준비하는 능력' },
    { key: '집안일', name: '집안일', description: '집안 청소 및 정리 능력' },
    { key: '세탁', name: '세탁', description: '세탁물을 관리하는 능력' },
    { key: '교통수단이용', name: '교통수단이용', description: '대중교통을 이용하는 능력' },
    { key: '약물관리', name: '약물관리', description: '약물을 올바르게 복용하는 능력' },
    { key: '금전관리', name: '금전관리', description: '돈을 관리하고 계산하는 능력' }
  ]

  const scoreOptions = [
    { value: 0, label: '0 points - 전혀 할 수 없음' },
    { value: 1, label: '1 points - 도움이 필요함' },
    { value: 2, label: '2 points - 독립적으로 수행 가능' }
  ]

  const updateScore = (activity, score) => {
    setScores(prev => ({
      ...prev,
      [activity]: score
    }))
  }

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0)
  }

  const getScoreInterpretation = (totalScore) => {
    if (totalScore >= 14) return { level: '완전독립', description: '모든 수단적 일상생활활동을 독립적으로 수행 가능' }
    if (totalScore >= 10) return { level: '경미한 의존', description: '대부분의 활동을 독립적으로 수행하나 일부 도움 필요' }
    if (totalScore >= 6) return { level: '중등도 의존', description: '상당한 도움이 필요한 상태' }
    if (totalScore >= 3) return { level: '심한 의존', description: '대부분의 활동에서 도움이 필요' }
    return { level: '완전의존', description: '모든 수단적 일상생활활동에서 도움이 필요' }
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
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore)
    
    const result = {
      patientInfo,
      scores,
      totalScore,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('kiadl-result', JSON.stringify(result))
    alert(`K-IADL 평가가 완료되었습니다!\nTotal Score: ${totalScore} points\nLevel: ${interpretation.level}`)
  }

  const generatePDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // 한글 폰트 설정
    doc.setFont('helvetica')
    
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore)
    
    doc.setFontSize(16)
    doc.text('K-IADL Assessment Results', 20, 20)
    
    doc.setFontSize(12)
    doc.text(`Patient Name: ${patientInfo.name}`, 20, 40)
    doc.text(`Age: ${patientInfo.age} years old`, 20, 50)
    doc.text(`Gender: ${patientInfo.gender}`, 20, 60)
    doc.text(`Assessment Date: ${patientInfo.date}`, 20, 70)
    doc.text(`Evaluator: ${patientInfo.evaluator}`, 20, 80)
    
    doc.text(`Total Score: ${totalScore} points`, 20, 100)
    doc.text(`Level: ${interpretation.level}`, 20, 110)
    doc.text(`Description: ${interpretation.description}`, 20, 120)
    
    let yPos = 140
    doc.text('항목별  points수:', 20, yPos)
    yPos += 10
    
    activities.forEach((activity, index) => {
      doc.text(`${activity.name}: ${scores[activity.key]} points`, 20, yPos)
      yPos += 8
    })
    
    doc.save(`K-IADL_${patientInfo.name}_${patientInfo.date}.pdf`)
  }

  const exportToSheets = async () => {
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore)
    
    const result = {
      patientInfo,
      scores,
      totalScore,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    const response = await exportToGoogleSheets(result, 'K-IADL_Results')
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
                <option value="">선택하 years old요</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
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
          <h3 className="text-center mb-4">K-IADL 평가</h3>
          <p className="mb-4">
            각 항목에 대해 환자의 수행 능력을 평가해주 years old요.<br/>
             points수: 0 points(전혀 할 수 없음) ~ 2 points(독립적으로 수행 가능)
          </p>

          <div className="mb-4">
            {activities.map((activity, index) => (
              <div key={activity.key} className="card mb-3">
                <h4>{activity.name}</h4>
                <p className="text-muted">{activity.description}</p>
                <div className="grid grid-3">
                  {scoreOptions.map((option) => (
                    <label key={option.value} className="form-radio">
                      <input
                        type="radio"
                        name={activity.key}
                        value={option.value}
                        checked={scores[activity.key] === option.value}
                        onChange={() => updateScore(activity.key, option.value)}
                      />
                      <span className="form-radio-label">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button 
              className="btn btn-secondary" 
              onClick={handlePrevious}
            >
              <ArrowLeft size={20} />
              이전
            </button>
            <button 
              className="btn ml-2" 
              onClick={handleNext}
            >
              다음
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 2) {
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">K-IADL Assessment Results</h3>
          
          <div className="score-display">
            <div className="score-number">{totalScore}</div>
            <div className="score-label">총 points (16 points 만 points)</div>
          </div>

          <div className="card mt-4">
            <h4>Assessment Results</h4>
            <p><strong>Level:</strong> {interpretation.level}</p>
            <p><strong>Description:</strong> {interpretation.description}</p>
          </div>

          <div className="grid grid-2">
            <div>
              <h4>환자 정보</h4>
              <p><strong>이름:</strong> {patientInfo.name}</p>
              <p><strong>Age:</strong> {patientInfo.age} years old</p>
              <p><strong>Gender:</strong> {patientInfo.gender}</p>
              <p><strong>Assessment Date:</strong> {patientInfo.date}</p>
              <p><strong>Evaluator:</strong> {patientInfo.evaluator}</p>
            </div>
            <div>
              <h4>항목별  points수</h4>
              {activities.map((activity) => (
                <p key={activity.key}>
                  <strong>{activity.name}:</strong> {scores[activity.key]} points
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

export default KIADLAssessment
