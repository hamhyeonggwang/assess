import React, { useState } from 'react'
import { Download, Upload, ArrowLeft, ArrowRight } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const FIMAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    diagnosis: '',
    date: new Date().toISOString().split('T')[0],
    evaluator: ''
  })
  const [scores, setScores] = useState({
    // 운동기능 (13개 항목)
    식사: 0,
     years old면: 0,
    목욕: 0,
    상의입기: 0,
    하의입기: 0,
    화장실사용: 0,
    방광조절: 0,
    장조절: 0,
    침상의자이동: 0,
    화장실이동: 0,
    욕조샤워이동: 0,
    보행: 0,
    계단오르기: 0,
    
    // 인지기능 (5개 항목)
    이해력: 0,
    표현력: 0,
    사회적상호작용: 0,
    문제해결: 0,
    기억력: 0
  })

  const motorItems = [
    { key: '식사', name: '식사', description: '음식을 먹는 능력' },
    { key: ' years old면', name: ' years old면', description: ' years old수, 양치질, 면도 등의 능력' },
    { key: '목욕', name: '목욕', description: '목욕이나 샤워를 하는 능력' },
    { key: '상의입기', name: '상의입기', description: '상의를 입고 벗는 능력' },
    { key: '하의입기', name: '하의입기', description: '하의를 입고 벗는 능력' },
    { key: '화장실사용', name: '화장실사용', description: '화장실을 사용하는 능력' },
    { key: '방광조절', name: '방광조절', description: '소변을 조절하는 능력' },
    { key: '장조절', name: '장조절', description: '대변을 조절하는 능력' },
    { key: '침상의자이동', name: '침상의자이동', description: '침상과 의자 간 이동 능력' },
    { key: '화장실이동', name: '화장실이동', description: '화장실로 이동하는 능력' },
    { key: '욕조샤워이동', name: '욕조샤워이동', description: '욕조나 샤워실로 이동하는 능력' },
    { key: '보행', name: '보행', description: '걷는 능력' },
    { key: '계단오르기', name: '계단오르기', description: '계단을 오르내리는 능력' }
  ]

  const cognitiveItems = [
    { key: '이해력', name: '이해력', description: '말을 이해하는 능력' },
    { key: '표현력', name: '표현력', description: '의사를 표현하는 능력' },
    { key: '사회적상호작용', name: '사회적상호작용', description: '사회적 관계를 맺는 능력' },
    { key: '문제해결', name: '문제해결', description: '문제를 해결하는 능력' },
    { key: '기억력', name: '기억력', description: '기억하는 능력' }
  ]

  const scoreOptions = [
    { value: 1, label: '1 points - 완전도움 (0-25%)' },
    { value: 2, label: '2 points - 최대도움 (25-50%)' },
    { value: 3, label: '3 points - 중등도움 (50-75%)' },
    { value: 4, label: '4 points - 최소도움 (75% 이상)' },
    { value: 5, label: '5 points - 감독 (언어적 지시만)' },
    { value: 6, label: '6 points - 수정된 독립 (보조기구 사용)' },
    { value: 7, label: '7 points - 완전독립' }
  ]

  const updateScore = (item, score) => {
    setScores(prev => ({
      ...prev,
      [item]: score
    }))
  }

  const calculateMotorScore = () => {
    return motorItems.reduce((sum, item) => sum + scores[item.key], 0)
  }

  const calculateCognitiveScore = () => {
    return cognitiveItems.reduce((sum, item) => sum + scores[item.key], 0)
  }

  const calculateTotalScore = () => {
    return calculateMotorScore() + calculateCognitiveScore()
  }

  const getScoreInterpretation = (totalScore, motorScore, cognitiveScore) => {
    let level = ''
    let description = ''
    let color = ''

    if (totalScore >= 108) {
      level = '완전독립'
      description = '모든 일상생활활동을 독립적으로 수행 가능'
      color = '#28a745'
    } else if (totalScore >= 90) {
      level = '경미한 의존'
      description = '대부분의 활동을 독립적으로 수행하나 일부 도움 필요'
      color = '#ffc107'
    } else if (totalScore >= 72) {
      level = '중등도 의존'
      description = '상당한 도움이 필요한 상태'
      color = '#fd7e14'
    } else if (totalScore >= 54) {
      level = '심한 의존'
      description = '대부분의 활동에서 도움이 필요'
      color = '#dc3545'
    } else {
      level = '완전의존'
      description = '모든 일상생활활동에서 도움이 필요'
      color = '#6c757d'
    }

    return { level, description, color }
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
    const motorScore = calculateMotorScore()
    const cognitiveScore = calculateCognitiveScore()
    const interpretation = getScoreInterpretation(totalScore, motorScore, cognitiveScore)
    
    const result = {
      patientInfo,
      scores,
      totalScore,
      motorScore,
      cognitiveScore,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('fim-result', JSON.stringify(result))
    alert(`FIM 평가가 완료되었습니다!\nTotal Score: ${totalScore} points\nLevel: ${interpretation.level}`)
  }

  const generatePDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // 한글 폰트 설정
    doc.setFont('helvetica')
    
    const totalScore = calculateTotalScore()
    const motorScore = calculateMotorScore()
    const cognitiveScore = calculateCognitiveScore()
    const interpretation = getScoreInterpretation(totalScore, motorScore, cognitiveScore)
    
    doc.setFontSize(16)
    doc.text('FIM Assessment Results', 20, 20)
    
    doc.setFontSize(12)
    doc.text(`Patient Name: ${patientInfo.name}`, 20, 40)
    doc.text(`Age: ${patientInfo.age} years old`, 20, 50)
    doc.text(`Gender: ${patientInfo.gender}`, 20, 60)
    doc.text(`진단: ${patientInfo.diagnosis}`, 20, 70)
    doc.text(`Assessment Date: ${patientInfo.date}`, 20, 80)
    doc.text(`Evaluator: ${patientInfo.evaluator}`, 20, 90)
    
    doc.text(`Total Score: ${totalScore} points (126 points 만 points)`, 20, 110)
    doc.text(`운동기능: ${motorScore} points (91 points 만 points)`, 20, 120)
    doc.text(`인지기능: ${cognitiveScore} points (35 points 만 points)`, 20, 130)
    doc.text(`Level: ${interpretation.level}`, 20, 140)
    doc.text(`Description: ${interpretation.description}`, 20, 150)
    
    let yPos = 170
    doc.text('운동기능 항목별  points수:', 20, yPos)
    yPos += 10
    
    motorItems.forEach((item, index) => {
      doc.text(`${item.name}: ${scores[item.key]} points`, 20, yPos)
      yPos += 6
    })
    
    yPos += 5
    doc.text('인지기능 항목별  points수:', 20, yPos)
    yPos += 10
    
    cognitiveItems.forEach((item, index) => {
      doc.text(`${item.name}: ${scores[item.key]} points`, 20, yPos)
      yPos += 6
    })
    
    doc.save(`FIM_${patientInfo.name}_${patientInfo.date}.pdf`)
  }

  const exportToSheets = async () => {
    const totalScore = calculateTotalScore()
    const motorScore = calculateMotorScore()
    const cognitiveScore = calculateCognitiveScore()
    const interpretation = getScoreInterpretation(totalScore, motorScore, cognitiveScore)
    
    const result = {
      patientInfo,
      scores,
      totalScore,
      motorScore,
      cognitiveScore,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    const response = await exportToGoogleSheets(result, 'FIM_Results')
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
              <label className="form-label">진단</label>
              <input
                type="text"
                className="form-input"
                value={patientInfo.diagnosis}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, diagnosis: e.target.value }))}
                placeholder="예: 뇌졸중, 척수손상, 외상성뇌손상"
              />
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
          <h3 className="text-center mb-4">FIM 평가</h3>
          <p className="mb-4">
            Functional Independence Measure<br/>
            각 항목에 대해 환자의 수행 능력을 평가해주 years old요.
          </p>

          <div className="mb-4">
            <h4>운동기능 (13개 항목)</h4>
            {motorItems.map((item, index) => (
              <div key={item.key} className="card mb-3">
                <h5>{item.name}</h5>
                <p className="text-muted">{item.description}</p>
                <div className="grid grid-7">
                  {scoreOptions.map((option) => (
                    <label key={option.value} className="form-radio">
                      <input
                        type="radio"
                        name={item.key}
                        value={option.value}
                        checked={scores[item.key] === option.value}
                        onChange={() => updateScore(item.key, option.value)}
                      />
                      <span className="form-radio-label">
                        {option.value} points
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <h4>인지기능 (5개 항목)</h4>
            {cognitiveItems.map((item, index) => (
              <div key={item.key} className="card mb-3">
                <h5>{item.name}</h5>
                <p className="text-muted">{item.description}</p>
                <div className="grid grid-7">
                  {scoreOptions.map((option) => (
                    <label key={option.value} className="form-radio">
                      <input
                        type="radio"
                        name={item.key}
                        value={option.value}
                        checked={scores[item.key] === option.value}
                        onChange={() => updateScore(item.key, option.value)}
                      />
                      <span className="form-radio-label">
                        {option.value} points
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
    const motorScore = calculateMotorScore()
    const cognitiveScore = calculateCognitiveScore()
    const interpretation = getScoreInterpretation(totalScore, motorScore, cognitiveScore)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">FIM Assessment Results</h3>
          
          <div className="score-display">
            <div className="score-number">{totalScore}</div>
            <div className="score-label">총 points (126 points 만 points)</div>
          </div>

          <div className="grid grid-3 mt-4">
            <div className="card text-center">
              <h4>운동기능</h4>
              <div className="score-number-small">{motorScore}</div>
              <div className="score-label-small">91 points 만 points</div>
            </div>
            <div className="card text-center">
              <h4>인지기능</h4>
              <div className="score-number-small">{cognitiveScore}</div>
              <div className="score-label-small">35 points 만 points</div>
            </div>
            <div className="card text-center">
              <h4>독립성 수준</h4>
              <div className="score-label-small" style={{ color: interpretation.color }}>
                {interpretation.level}
              </div>
            </div>
          </div>

          <div className="card mt-4" style={{ backgroundColor: interpretation.color + '20', borderColor: interpretation.color }}>
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
              <p><strong>진단:</strong> {patientInfo.diagnosis}</p>
              <p><strong>Assessment Date:</strong> {patientInfo.date}</p>
              <p><strong>Evaluator:</strong> {patientInfo.evaluator}</p>
            </div>
            <div>
              <h4>항목별  points수</h4>
              <div className="mb-3">
                <h5>운동기능</h5>
                {motorItems.map((item) => (
                  <p key={item.key} className="mb-1">
                    <strong>{item.name}:</strong> {scores[item.key]} points
                  </p>
                ))}
              </div>
              <div>
                <h5>인지기능</h5>
                {cognitiveItems.map((item) => (
                  <p key={item.key} className="mb-1">
                    <strong>{item.name}:</strong> {scores[item.key]} points
                  </p>
                ))}
              </div>
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

export default FIMAssessment
