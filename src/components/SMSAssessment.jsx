import React, { useState } from 'react'
import { Download, Upload, ArrowLeft, ArrowRight } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const SMSAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    birthDate: '',
    date: new Date().toISOString().split('T')[0],
    evaluator: '',
    caregiver: ''
  })
  const [scores, setScores] = useState({
    // 자가관리 영역
    식사: 0,
    목욕: 0,
    옷입기: 0,
    화장실사용: 0,
    개인위생: 0,
    
    // 이동 영역
    걷기: 0,
    계단오르기: 0,
    문열기: 0,
    의자에앉기: 0,
    
    // 작업 영역
    놀이: 0,
    집안일: 0,
    학습: 0,
    작업: 0,
    
    // 의사소통 영역
    말하기: 0,
    듣기: 0,
    읽기: 0,
    쓰기: 0,
    
    // 사회화 영역
    사회적관계: 0,
    협력: 0,
    책임감: 0,
    리더십: 0
  })

  const ageGroups = [
    { min: 0, max: 6, label: '0-6세 (영아기)' },
    { min: 7, max: 12, label: '7-12세 (아동기)' },
    { min: 13, max: 18, label: '13-18세 (청소년기)' },
    { min: 19, max: 25, label: '19-25세 (성인기)' }
  ]

  const getAgeGroup = (age) => {
    const numAge = parseInt(age)
    return ageGroups.find(group => numAge >= group.min && numAge <= group.max) || ageGroups[0]
  }

  const updateScore = (item, score) => {
    setScores(prev => ({
      ...prev,
      [item]: score
    }))
  }

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0)
  }

  const calculateSocialAge = () => {
    const totalScore = calculateTotalScore()
    const chronologicalAge = parseInt(patientInfo.age)
    
    // SMS 공식: 사회연령 = (총점 / 100) * 25
    const socialAge = Math.round((totalScore / 100) * 25 * 10) / 10
    
    return {
      socialAge,
      chronologicalAge,
      quotient: Math.round((socialAge / chronologicalAge) * 100)
    }
  }

  const getScoreInterpretation = (quotient) => {
    if (quotient >= 90) {
      return { 
        level: '정상', 
        description: '사회적 발달이 정상 범위에 있습니다.',
        color: '#28a745'
      }
    } else if (quotient >= 80) {
      return { 
        level: '경미한 지연', 
        description: '사회적 발달에 경미한 지연이 있을 수 있습니다.',
        color: '#ffc107'
      }
    } else if (quotient >= 70) {
      return { 
        level: '중등도 지연', 
        description: '사회적 발달에 중등도 지연이 있습니다.',
        color: '#fd7e14'
      }
    } else {
      return { 
        level: '심한 지연', 
        description: '사회적 발달에 심한 지연이 있습니다.',
        color: '#dc3545'
      }
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
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
    const { socialAge, chronologicalAge, quotient } = calculateSocialAge()
    const interpretation = getScoreInterpretation(quotient)
    
    const result = {
      patientInfo,
      scores,
      totalScore,
      socialAge,
      chronologicalAge,
      quotient,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('sms-result', JSON.stringify(result))
    alert(`사회성숙도 검사가 완료되었습니다!\n총점: ${totalScore}점\n사회연령: ${socialAge}세\n지수: ${quotient}\n수준: ${interpretation.level}`)
  }

  const generatePDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // 한글 폰트 설정
    doc.setFont('helvetica')
    
    const totalScore = calculateTotalScore()
    const { socialAge, chronologicalAge, quotient } = calculateSocialAge()
    const interpretation = getScoreInterpretation(quotient)
    
    // 제목
    doc.setFontSize(16)
    doc.text('Social Maturity Scale (SMS) Results', 20, 20)
    
    // 환자 정보
    doc.setFontSize(12)
    doc.text(`Child Name: ${patientInfo.name}`, 20, 40)
    doc.text(`Age: ${patientInfo.age} years old`, 20, 50)
    doc.text(`Gender: ${patientInfo.gender}`, 20, 60)
    doc.text(`Birth Date: ${patientInfo.birthDate}`, 20, 70)
    doc.text(`Assessment Date: ${patientInfo.date}`, 20, 80)
    doc.text(`Evaluator: ${patientInfo.evaluator}`, 20, 90)
    doc.text(`Caregiver: ${patientInfo.caregiver}`, 20, 100)
    
    // 결과
    doc.text(`Total Score: ${totalScore} points`, 20, 120)
    doc.text(`Chronological Age: ${chronologicalAge} years`, 20, 130)
    doc.text(`Social Age: ${socialAge} years`, 20, 140)
    doc.text(`Social Quotient: ${quotient}`, 20, 150)
    doc.text(`Level: ${interpretation.level}`, 20, 160)
    doc.text(`Description: ${interpretation.description}`, 20, 170)
    
    // 영역별 점수
    let yPos = 190
    doc.text('Area Scores:', 20, yPos)
    yPos += 10
    
    // 자가관리 영역
    doc.text('Self-Care Area:', 20, yPos)
    yPos += 8
    doc.text(`Eating: ${scores.식사} points`, 20, yPos)
    yPos += 6
    doc.text(`Bathing: ${scores.목욕} points`, 20, yPos)
    yPos += 6
    doc.text(`Dressing: ${scores.옷입기} points`, 20, yPos)
    yPos += 6
    doc.text(`Toilet Use: ${scores.화장실사용} points`, 20, yPos)
    yPos += 6
    doc.text(`Personal Hygiene: ${scores.개인위생} points`, 20, yPos)
    yPos += 10
    
    // 이동 영역
    doc.text('Mobility Area:', 20, yPos)
    yPos += 8
    doc.text(`Walking: ${scores.걷기} points`, 20, yPos)
    yPos += 6
    doc.text(`Stairs: ${scores.계단오르기} points`, 20, yPos)
    yPos += 6
    doc.text(`Door Opening: ${scores.문열기} points`, 20, yPos)
    yPos += 6
    doc.text(`Sitting: ${scores.의자에앉기} points`, 20, yPos)
    yPos += 10
    
    // 작업 영역
    doc.text('Work Area:', 20, yPos)
    yPos += 8
    doc.text(`Play: ${scores.놀이} points`, 20, yPos)
    yPos += 6
    doc.text(`Housework: ${scores.집안일} points`, 20, yPos)
    yPos += 6
    doc.text(`Learning: ${scores.학습} points`, 20, yPos)
    yPos += 6
    doc.text(`Work: ${scores.작업} points`, 20, yPos)
    yPos += 10
    
    // 의사소통 영역
    doc.text('Communication Area:', 20, yPos)
    yPos += 8
    doc.text(`Speaking: ${scores.말하기} points`, 20, yPos)
    yPos += 6
    doc.text(`Listening: ${scores.듣기} points`, 20, yPos)
    yPos += 6
    doc.text(`Reading: ${scores.읽기} points`, 20, yPos)
    yPos += 6
    doc.text(`Writing: ${scores.쓰기} points`, 20, yPos)
    yPos += 10
    
    // 사회화 영역
    doc.text('Socialization Area:', 20, yPos)
    yPos += 8
    doc.text(`Social Relations: ${scores.사회적관계} points`, 20, yPos)
    yPos += 6
    doc.text(`Cooperation: ${scores.협력} points`, 20, yPos)
    yPos += 6
    doc.text(`Responsibility: ${scores.책임감} points`, 20, yPos)
    yPos += 6
    doc.text(`Leadership: ${scores.리더십} points`, 20, yPos)
    
    doc.save(`SMS_${patientInfo.name}_${patientInfo.date}.pdf`)
  }

  const exportToSheets = async () => {
    const totalScore = calculateTotalScore()
    const { socialAge, chronologicalAge, quotient } = calculateSocialAge()
    const interpretation = getScoreInterpretation(quotient)
    
    const result = {
      patientInfo,
      scores,
      totalScore,
      socialAge,
      chronologicalAge,
      quotient,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    const response = await exportToGoogleSheets(result, 'SMS_Results')
    alert(response.message)
  }

  if (currentStep === 0) {
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">환자 정보 입력</h3>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">아동명</label>
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
              <label className="form-label">생년월일</label>
              <input
                type="date"
                className="form-input"
                value={patientInfo.birthDate}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, birthDate: e.target.value }))}
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
            <div className="form-group">
              <label className="form-label">보호자</label>
              <input
                type="text"
                className="form-input"
                value={patientInfo.caregiver}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, caregiver: e.target.value }))}
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
    const ageGroup = getAgeGroup(patientInfo.age)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">사회성숙도 검사 - 자가관리 영역</h3>
          <p className="mb-4">
            아동의 자가관리 능력을 평가합니다. (연령대: {ageGroup.label})
          </p>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">식사</label>
              <select
                className="form-select"
                value={scores.식사}
                onChange={(e) => updateScore('식사', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">목욕</label>
              <select
                className="form-select"
                value={scores.목욕}
                onChange={(e) => updateScore('목욕', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">옷입기</label>
              <select
                className="form-select"
                value={scores.옷입기}
                onChange={(e) => updateScore('옷입기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">화장실사용</label>
              <select
                className="form-select"
                value={scores.화장실사용}
                onChange={(e) => updateScore('화장실사용', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">개인위생</label>
              <select
                className="form-select"
                value={scores.개인위생}
                onChange={(e) => updateScore('개인위생', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
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
    const ageGroup = getAgeGroup(patientInfo.age)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">사회성숙도 검사 - 이동 및 작업 영역</h3>
          <p className="mb-4">
            아동의 이동 능력과 작업 수행 능력을 평가합니다. (연령대: {ageGroup.label})
          </p>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">걷기</label>
              <select
                className="form-select"
                value={scores.걷기}
                onChange={(e) => updateScore('걷기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">계단오르기</label>
              <select
                className="form-select"
                value={scores.계단오르기}
                onChange={(e) => updateScore('계단오르기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">문열기</label>
              <select
                className="form-select"
                value={scores.문열기}
                onChange={(e) => updateScore('문열기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">의자에앉기</label>
              <select
                className="form-select"
                value={scores.의자에앉기}
                onChange={(e) => updateScore('의자에앉기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">놀이</label>
              <select
                className="form-select"
                value={scores.놀이}
                onChange={(e) => updateScore('놀이', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">집안일</label>
              <select
                className="form-select"
                value={scores.집안일}
                onChange={(e) => updateScore('집안일', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">학습</label>
              <select
                className="form-select"
                value={scores.학습}
                onChange={(e) => updateScore('학습', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">작업</label>
              <select
                className="form-select"
                value={scores.작업}
                onChange={(e) => updateScore('작업', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
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

  if (currentStep === 3) {
    const ageGroup = getAgeGroup(patientInfo.age)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">사회성숙도 검사 - 의사소통 및 사회화 영역</h3>
          <p className="mb-4">
            아동의 의사소통 능력과 사회화 능력을 평가합니다. (연령대: {ageGroup.label})
          </p>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">말하기</label>
              <select
                className="form-select"
                value={scores.말하기}
                onChange={(e) => updateScore('말하기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">듣기</label>
              <select
                className="form-select"
                value={scores.듣기}
                onChange={(e) => updateScore('듣기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">읽기</label>
              <select
                className="form-select"
                value={scores.읽기}
                onChange={(e) => updateScore('읽기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">쓰기</label>
              <select
                className="form-select"
                value={scores.쓰기}
                onChange={(e) => updateScore('쓰기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">사회적관계</label>
              <select
                className="form-select"
                value={scores.사회적관계}
                onChange={(e) => updateScore('사회적관계', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">협력</label>
              <select
                className="form-select"
                value={scores.협력}
                onChange={(e) => updateScore('협력', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">책임감</label>
              <select
                className="form-select"
                value={scores.책임감}
                onChange={(e) => updateScore('책임감', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">리더십</label>
              <select
                className="form-select"
                value={scores.리더십}
                onChange={(e) => updateScore('리더십', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 전혀 할 수 없음</option>
                <option value={1}>1점 - 부분적으로 가능</option>
                <option value={2}>2점 - 독립적으로 가능</option>
                <option value={3}>3점 - 완전히 독립적</option>
              </select>
            </div>
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

  if (currentStep === 4) {
    const totalScore = calculateTotalScore()
    const { socialAge, chronologicalAge, quotient } = calculateSocialAge()
    const interpretation = getScoreInterpretation(quotient)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">사회성숙도 검사 결과</h3>
          
          <div className="score-display">
            <div className="score-number">{totalScore}</div>
            <div className="score-label">총점 (100점 만점)</div>
          </div>

          <div className="card mt-4" style={{ backgroundColor: interpretation.color + '20', borderColor: interpretation.color }}>
            <h4>평가 결과</h4>
            <p><strong>사회연령:</strong> {socialAge}세</p>
            <p><strong>생활연령:</strong> {chronologicalAge}세</p>
            <p><strong>사회성숙도 지수:</strong> {quotient}</p>
            <p><strong>수준:</strong> {interpretation.level}</p>
            <p><strong>설명:</strong> {interpretation.description}</p>
          </div>

          <div className="grid grid-2">
            <div>
              <h4>아동 정보</h4>
              <p><strong>이름:</strong> {patientInfo.name}</p>
              <p><strong>나이:</strong> {patientInfo.age}세</p>
              <p><strong>성별:</strong> {patientInfo.gender}</p>
              <p><strong>생년월일:</strong> {patientInfo.birthDate}</p>
              <p><strong>평가일:</strong> {patientInfo.date}</p>
              <p><strong>평가자:</strong> {patientInfo.evaluator}</p>
              <p><strong>보호자:</strong> {patientInfo.caregiver}</p>
            </div>
            <div>
              <h4>영역별 점수</h4>
              <p><strong>자가관리:</strong> {scores.식사 + scores.목욕 + scores.옷입기 + scores.화장실사용 + scores.개인위생}점</p>
              <p><strong>이동:</strong> {scores.걷기 + scores.계단오르기 + scores.문열기 + scores.의자에앉기}점</p>
              <p><strong>작업:</strong> {scores.놀이 + scores.집안일 + scores.학습 + scores.작업}점</p>
              <p><strong>의사소통:</strong> {scores.말하기 + scores.듣기 + scores.읽기 + scores.쓰기}점</p>
              <p><strong>사회화:</strong> {scores.사회적관계 + scores.협력 + scores.책임감 + scores.리더십}점</p>
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

export default SMSAssessment
