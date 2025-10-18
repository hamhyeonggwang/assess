import React, { useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const WHODASAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    education: '',
    date: new Date().toISOString().split('T')[0],
    evaluator: ''
  })

  const domains = [
    {
      id: 'cognition',
      title: '인지 영역 (Cognition)',
      questions: [
        { id: 'cog1', text: '집중하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'cog2', text: '새로운 정보를 기억하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'cog3', text: '문제를 해결하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'cog4', text: '새로운 작업을 배우는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'cog5', text: '일반적으로 상황을 이해하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'cog6', text: '대화를 시작하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] }
      ]
    },
    {
      id: 'mobility',
      title: '이동 영역 (Mobility)',
      questions: [
        { id: 'mob1', text: '서 있는 자세를 유지하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'mob2', text: '집 안에서 움직이는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'mob3', text: '집 밖으로 나가는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'mob4', text: '집에서 멀리 떨어진 곳까지 가는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] }
      ]
    },
    {
      id: 'self_care',
      title: '자가관리 영역 (Self-care)',
      questions: [
        { id: 'sc1', text: '씻고 몸을 단정히 하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'sc2', text: '옷을 입는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'sc3', text: '식사를 하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'sc4', text: '혼자서 살아가는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] }
      ]
    },
    {
      id: 'getting_along',
      title: '사람들과 어울리기 영역 (Getting along)',
      questions: [
        { id: 'ga1', text: '다른 사람들과 어울리는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'ga2', text: '친밀한 관계를 유지하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'ga3', text: '새로운 친구를 사귀는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'ga4', text: '성적 활동에 참여하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] }
      ]
    },
    {
      id: 'life_activities',
      title: '생활활동 영역 (Life activities)',
      questions: [
        { id: 'la1', text: '일상적인 가사일을 하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'la2', text: '일을 잘 완수하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'la3', text: '일의 양을 조절하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'la4', text: '일의 질을 유지하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] }
      ]
    },
    {
      id: 'participation',
      title: '사회참여 영역 (Participation)',
      questions: [
        { id: 'part1', text: '사회적 활동에 참여하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'part2', text: '사회적 역할을 수행하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'part3', text: '사회적 상황에서 자신을 표현하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] },
        { id: 'part4', text: '사회적 관계를 유지하는 데 어려움이 있습니까?', points: [1, 2, 3, 4, 5] }
      ]
    }
  ]

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const calculateDomainScore = (domain) => {
    let totalScore = 0
    let answeredQuestions = 0
    
    domain.questions.forEach(question => {
      if (answers[question.id] !== undefined) {
        totalScore += parseInt(answers[question.id])
        answeredQuestions++
      }
    })
    
    if (answeredQuestions === 0) return 0
    return Math.round((totalScore / answeredQuestions) * 100) / 100
  }

  const calculateOverallScore = () => {
    let totalScore = 0
    let totalQuestions = 0
    
    domains.forEach(domain => {
      domain.questions.forEach(question => {
        if (answers[question.id] !== undefined) {
          totalScore += parseInt(answers[question.id])
          totalQuestions++
        }
      })
    })
    
    if (totalQuestions === 0) return 0
    return Math.round((totalScore / totalQuestions) * 100) / 100
  }

  const getSeverityLevel = (score) => {
    if (score <= 1.5) return { level: '경미', color: '#28a745' }
    if (score <= 2.5) return { level: '경도', color: '#ffc107' }
    if (score <= 3.5) return { level: '중등도', color: '#fd7e14' }
    return { level: '중증', color: '#dc3545' }
  }

  const handleNext = () => {
    if (currentStep < domains.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const overallScore = calculateOverallScore()
    const severity = getSeverityLevel(overallScore)
    
    const result = {
      patientInfo,
      answers,
      domainScores: domains.map(domain => ({
        domain: domain.title,
        score: calculateDomainScore(domain)
      })),
      overallScore,
      severity,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('whodas-result', JSON.stringify(result))
    alert(`WHODAS 2.0 평가가 완료되었습니다!\n전체 점수: ${overallScore}\n장애 수준: ${severity.level}`)
  }

  const generatePDF = () => {
    const { jsPDF } = require('jspdf')
    const doc = new jsPDF()
    
    const overallScore = calculateOverallScore()
    const severity = getSeverityLevel(overallScore)
    
    doc.setFontSize(16)
    doc.text('WHODAS 2.0 평가 결과', 20, 20)
    
    doc.setFontSize(12)
    doc.text(`환자명: ${patientInfo.name}`, 20, 40)
    doc.text(`나이: ${patientInfo.age}세`, 20, 50)
    doc.text(`성별: ${patientInfo.gender}`, 20, 60)
    doc.text(`교육수준: ${patientInfo.education}`, 20, 70)
    doc.text(`평가일: ${patientInfo.date}`, 20, 80)
    doc.text(`평가자: ${patientInfo.evaluator}`, 20, 90)
    
    doc.text(`전체 점수: ${overallScore}`, 20, 110)
    doc.text(`장애 수준: ${severity.level}`, 20, 120)
    
    let yPos = 140
    doc.text('영역별 점수:', 20, yPos)
    yPos += 10
    
    domains.forEach(domain => {
      const domainScore = calculateDomainScore(domain)
      doc.text(`${domain.title}: ${domainScore}`, 20, yPos)
      yPos += 10
    })
    
    doc.save(`WHODAS_${patientInfo.name}_${patientInfo.date}.pdf`)
  }

  const exportToSheets = async () => {
    const overallScore = calculateOverallScore()
    const severity = getSeverityLevel(overallScore)
    
    const result = {
      patientInfo,
      answers,
      domainScores: domains.map(domain => ({
        domain: domain.title,
        score: calculateDomainScore(domain)
      })),
      overallScore,
      severity,
      timestamp: new Date().toISOString()
    }
    
    const response = await exportToGoogleSheets(result, 'WHODAS_Results')
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

  if (currentStep === domains.length) {
    const overallScore = calculateOverallScore()
    const severity = getSeverityLevel(overallScore)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">WHODAS 2.0 평가 결과</h3>
          
          <div className="score-display">
            <div className="score-number">{overallScore}</div>
            <div className="score-label">전체 점수</div>
            <div style={{ color: severity.color, fontSize: '1.2rem', fontWeight: 'bold' }}>
              {severity.level} 장애
            </div>
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
              <h4>영역별 점수</h4>
              {domains.map((domain, index) => {
                const domainScore = calculateDomainScore(domain)
                return (
                  <p key={index}>
                    <strong>{domain.title}:</strong> {domainScore}
                  </p>
                )
              })}
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

  const currentDomain = domains[currentStep]

  return (
    <div className="container">
      <div className="card">
        <h3 className="text-center mb-4">{currentDomain.title}</h3>
        
        <div className="mb-4">
          <div className="text-center">
            <span>진행률: {currentStep + 1} / {domains.length}</span>
          </div>
        </div>

        {currentDomain.questions.map((question, index) => (
          <div key={question.id} className="mb-4">
            <div className="form-group">
              <label className="form-label">
                {index + 1}. {question.text}
              </label>
              <div className="radio-group">
                <div 
                  className={`radio-item ${answers[question.id] === '1' ? 'selected' : ''}`}
                  onClick={() => handleAnswerChange(question.id, '1')}
                >
                  <input 
                    type="radio" 
                    name={question.id} 
                    checked={answers[question.id] === '1'}
                    onChange={() => handleAnswerChange(question.id, '1')}
                  />
                  <span>전혀 어려움 없음 (1점)</span>
                </div>
                <div 
                  className={`radio-item ${answers[question.id] === '2' ? 'selected' : ''}`}
                  onClick={() => handleAnswerChange(question.id, '2')}
                >
                  <input 
                    type="radio" 
                    name={question.id} 
                    checked={answers[question.id] === '2'}
                    onChange={() => handleAnswerChange(question.id, '2')}
                  />
                  <span>약간 어려움 (2점)</span>
                </div>
                <div 
                  className={`radio-item ${answers[question.id] === '3' ? 'selected' : ''}`}
                  onClick={() => handleAnswerChange(question.id, '3')}
                >
                  <input 
                    type="radio" 
                    name={question.id} 
                    checked={answers[question.id] === '3'}
                    onChange={() => handleAnswerChange(question.id, '3')}
                  />
                  <span>보통 어려움 (3점)</span>
                </div>
                <div 
                  className={`radio-item ${answers[question.id] === '4' ? 'selected' : ''}`}
                  onClick={() => handleAnswerChange(question.id, '4')}
                >
                  <input 
                    type="radio" 
                    name={question.id} 
                    checked={answers[question.id] === '4'}
                    onChange={() => handleAnswerChange(question.id, '4')}
                  />
                  <span>많이 어려움 (4점)</span>
                </div>
                <div 
                  className={`radio-item ${answers[question.id] === '5' ? 'selected' : ''}`}
                  onClick={() => handleAnswerChange(question.id, '5')}
                >
                  <input 
                    type="radio" 
                    name={question.id} 
                    checked={answers[question.id] === '5'}
                    onChange={() => handleAnswerChange(question.id, '5')}
                  />
                  <span>매우 많이 어려움 (5점)</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center mt-4">
          <button 
            className="btn btn-secondary" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            이전
          </button>
          <button 
            className="btn ml-2" 
            onClick={currentStep === domains.length - 1 ? handleSubmit : handleNext}
          >
            {currentStep === domains.length - 1 ? '평가 완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WHODASAssessment
