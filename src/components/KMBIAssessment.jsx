import React, { useState } from 'react'
import { Download, Upload, ArrowLeft, ArrowRight } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const KMBIAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    date: new Date().toISOString().split('T')[0],
    evaluator: ''
  })
  const [scores, setScores] = useState({
    식사: 0,
    목욕: 0,
    세면: 0,
    옷입기: 0,
    대변조절: 0,
    소변조절: 0,
    화장실사용: 0,
    침상에서의이동: 0,
    보행: 0,
    계단오르기: 0
  })

  const activities = [
    { key: '식사', name: '식사', description: '음식을 먹는 능력' },
    { key: '목욕', name: '목욕', description: '목욕이나 샤워를 하는 능력' },
    { key: ' years old면', name: ' years old면', description: ' years old수, 양치질, 면도 등의 능력' },
    { key: '옷입기', name: '옷입기', description: '옷을 입고 벗는 능력' },
    { key: '대변조절', name: '대변조절', description: '대변을 조절하는 능력' },
    { key: '소변조절', name: '소변조절', description: '소변을 조절하는 능력' },
    { key: '화장실사용', name: '화장실사용', description: '화장실을 사용하는 능력' },
    { key: '침상에서의이동', name: '침상에서의이동', description: '침상에서 일어나고 눕는 능력' },
    { key: '보행', name: '보행', description: '걷는 능력' },
    { key: '계단오르기', name: '계단오르기', description: '계단을 오르내리는 능력' }
  ]

  const scoreOptions = [
    { value: 0, label: '0 points - 전혀 도움이 필요함' },
    { value: 1, label: '1 points - 약간의 도움이 필요함' },
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
    if (totalScore >= 20) return { level: '완전독립', description: '모든 일상생활활동을 독립적으로 수행 가능' }
    if (totalScore >= 15) return { level: '경미한 의존', description: '대부분의 활동을 독립적으로 수행하나 일부 도움 필요' }
    if (totalScore >= 10) return { level: '중등도 의존', description: '상당한 도움이 필요한 상태' }
    if (totalScore >= 5) return { level: '심한 의존', description: '대부분의 활동에서 도움이 필요' }
    return { level: '완전의존', description: '모든 일상생활활동에서 도움이 필요' }
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
    
    localStorage.setItem('kmbi-result', JSON.stringify(result))
    alert(`K-MBI 평가가 완료되었습니다!\nTotal Score: ${totalScore} points\nLevel: ${interpretation.level}`)
  }

  const generatePDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // 한글 폰트 설정
    doc.setFont('helvetica')
    
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore)
    
    doc.setFontSize(16)
    doc.text('K-MBI Assessment Results', 20, 20)
    
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
    
    doc.save(`K-MBI_${patientInfo.name}_${patientInfo.date}.pdf`)
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
    
    const response = await exportToGoogleSheets(result, 'K-MBI_Results')
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
          <h3 className="text-center mb-4">K-MBI 평가</h3>
          <p className="mb-4">
            각 항목에 대해 환자의 수행 능력을 평가해주 years old요.<br/>
             points수: 0 points(전혀 도움이 필요함) ~ 2 points(독립적으로 수행 가능)
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
          <h3 className="text-center mb-4">K-MBI Assessment Results</h3>
          
          <div className="score-display">
            <div className="score-number">{totalScore}</div>
            <div className="score-label">총 points (20 points 만 points)</div>
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

export default KMBIAssessment
