import React, { useState } from 'react'
import { Download, Upload, ArrowLeft, ArrowRight } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const WHODASAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [version, setVersion] = useState('12-item') // 12-item 또는 36-item
  const [assessmentType, setAssessmentType] = useState('self') // self, interviewer, proxy
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    education: '',
    date: new Date().toISOString().split('T')[0],
    evaluator: ''
  })
  const [answers, setAnswers] = useState({})
  const [additionalInfo, setAdditionalInfo] = useState({
    daysPresent: '',
    daysUnable: '',
    daysReduced: ''
  })

  // 12-항목 버전 문항
  const questions12 = [
    {
      id: 'S1',
      text: '30분 동안 서 있기와 같이 장시간 서있기',
      domain: 'mobility'
    },
    {
      id: 'S2', 
      text: '가정의 책임을 돌보기',
      domain: 'life_activities'
    },
    {
      id: 'S3',
      text: '새로운 작업을 배우기 (예: 새로운 장소로 가는 방법을 배우기)',
      domain: 'cognition'
    },
    {
      id: 'S4',
      text: '다른 사람들과 동일한 방식으로 지역사회 활동에 참여하기 (예: 축제, 종교 또는 기타 활동)',
      domain: 'participation'
    },
    {
      id: 'S5',
      text: '건강 문제로 인해 정서적으로 얼마나 영향을 받았습니까?',
      domain: 'cognition'
    },
    {
      id: 'S6',
      text: '10분 동안 무언가에 집중하기',
      domain: 'cognition'
    },
    {
      id: 'S7',
      text: '1킬로미터와 같은 먼 거리 걷기',
      domain: 'mobility'
    },
    {
      id: 'S8',
      text: '온몸 씻기',
      domain: 'self_care'
    },
    {
      id: 'S9',
      text: '옷 입기',
      domain: 'self_care'
    },
    {
      id: 'S10',
      text: '모르는 사람들과 대화하기',
      domain: 'getting_along'
    },
    {
      id: 'S11',
      text: '우정 유지하기',
      domain: 'getting_along'
    },
    {
      id: 'S12',
      text: '일상적인 일/학교 업무',
      domain: 'life_activities'
    }
  ]

  const responseOptions = [
    { value: 0, label: '없음' },
    { value: 1, label: '약간' },
    { value: 2, label: '중간' },
    { value: 3, label: '심한' },
    { value: 4, label: '극심한 또는 할 수 없음' }
  ]

  const updateAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const calculateScore = () => {
    const scores = Object.values(answers).filter(score => score !== undefined)
    if (scores.length === 0) return 0
    
    const totalScore = scores.reduce((sum, score) => sum + score, 0)
    const maxScore = questions12.length * 4 // 12개 문항 × 4점
    const percentage = Math.round((totalScore / maxScore) * 100 * 100) / 100
    
    return { totalScore, maxScore, percentage }
  }

  const getScoreInterpretation = (percentage) => {
    if (percentage <= 10) {
      return { 
        level: '경미한 장애', 
        description: '일상생활에 경미한 영향이 있습니다.',
        color: '#28a745'
      }
    } else if (percentage <= 25) {
      return { 
        level: '경도 장애', 
        description: '일상생활에 경도의 영향이 있습니다.',
        color: '#ffc107'
      }
    } else if (percentage <= 50) {
      return { 
        level: '중등도 장애', 
        description: '일상생활에 중등도의 영향이 있습니다.',
        color: '#fd7e14'
      }
    } else {
      return { 
        level: '중증 장애', 
        description: '일상생활에 중증의 영향이 있습니다.',
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
    const { totalScore, maxScore, percentage } = calculateScore()
    const interpretation = getScoreInterpretation(percentage)
    
    const result = {
      version,
      assessmentType,
      patientInfo,
      answers,
      additionalInfo,
      totalScore,
      maxScore,
      percentage,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('whodas-result', JSON.stringify(result))
    alert(`WHODAS 2.0 평가가 완료되었습니다!\n총점: ${totalScore}/${maxScore}점\n백분율: ${percentage}%\n수준: ${interpretation.level}`)
  }

  const generatePDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // 한글 폰트 설정
    doc.setFont('helvetica')
    
    const { totalScore, maxScore, percentage } = calculateScore()
    const interpretation = getScoreInterpretation(percentage)
    
    // 제목
    doc.setFontSize(16)
    doc.text('WHODAS 2.0 Assessment Results', 20, 20)
    
    // 환자 정보
    doc.setFontSize(12)
    doc.text(`Patient Name: ${patientInfo.name}`, 20, 40)
    doc.text(`Age: ${patientInfo.age} years old`, 20, 50)
    doc.text(`Gender: ${patientInfo.gender}`, 20, 60)
    doc.text(`Education: ${patientInfo.education}`, 20, 70)
    doc.text(`Assessment Date: ${patientInfo.date}`, 20, 80)
    doc.text(`Evaluator: ${patientInfo.evaluator}`, 20, 90)
    doc.text(`Version: ${version === '12-item' ? '12-Item Version' : '36-Item Version'}`, 20, 100)
    doc.text(`Assessment Type: ${assessmentType === 'self' ? 'Self-Report' : assessmentType === 'interviewer' ? 'Interviewer-Administered' : 'Proxy-Report'}`, 20, 110)
    
    // 결과
    doc.text(`Total Score: ${totalScore}/${maxScore} points`, 20, 130)
    doc.text(`Percentage: ${percentage}%`, 20, 140)
    doc.text(`Level: ${interpretation.level}`, 20, 150)
    doc.text(`Description: ${interpretation.description}`, 20, 160)
    
    // 문항별 점수
    let yPos = 180
    doc.text('Item Scores:', 20, yPos)
    yPos += 10
    
    questions12.forEach((question, index) => {
      const score = answers[question.id] || 0
      const scoreLabel = responseOptions.find(opt => opt.value === score)?.label || '미응답'
      doc.text(`${question.id}: ${score}점 (${scoreLabel})`, 20, yPos)
      yPos += 6
    })
    
    // 추가 정보
    yPos += 10
    doc.text('Additional Information:', 20, yPos)
    yPos += 10
    doc.text(`Days difficulties present: ${additionalInfo.daysPresent}`, 20, yPos)
    yPos += 6
    doc.text(`Days totally unable: ${additionalInfo.daysUnable}`, 20, yPos)
    yPos += 6
    doc.text(`Days reduced activities: ${additionalInfo.daysReduced}`, 20, yPos)
    
    doc.save(`WHODAS_${patientInfo.name}_${patientInfo.date}.pdf`)
  }

  const exportToSheets = async () => {
    const { totalScore, maxScore, percentage } = calculateScore()
    const interpretation = getScoreInterpretation(percentage)
    
    const result = {
      version,
      assessmentType,
      patientInfo,
      answers,
      additionalInfo,
      totalScore,
      maxScore,
      percentage,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    const response = await exportToGoogleSheets(result, 'WHODAS_Results')
    alert(response.message)
  }

  if (currentStep === 0) {
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">WHODAS 2.0 평가 설정</h3>
          
          <div className="mb-4">
            <h4>버전 선택</h4>
            <div className="grid grid-2">
              <label className="form-label">
                <input
                  type="radio"
                  name="version"
                  value="12-item"
                  checked={version === '12-item'}
                  onChange={(e) => setVersion(e.target.value)}
                  className="mr-2"
                />
                12-항목 버전
              </label>
              <label className="form-label">
                <input
                  type="radio"
                  name="version"
                  value="36-item"
                  checked={version === '36-item'}
                  onChange={(e) => setVersion(e.target.value)}
                  className="mr-2"
                />
                36-항목 버전
              </label>
            </div>
          </div>

          <div className="mb-4">
            <h4>평가 방식 선택</h4>
            <div className="grid grid-3">
              <label className="form-label">
                <input
                  type="radio"
                  name="assessmentType"
                  value="self"
                  checked={assessmentType === 'self'}
                  onChange={(e) => setAssessmentType(e.target.value)}
                  className="mr-2"
                />
                자가 기입식
              </label>
              <label className="form-label">
                <input
                  type="radio"
                  name="assessmentType"
                  value="interviewer"
                  checked={assessmentType === 'interviewer'}
                  onChange={(e) => setAssessmentType(e.target.value)}
                  className="mr-2"
                />
                면접관 기입식
              </label>
              <label className="form-label">
                <input
                  type="radio"
                  name="assessmentType"
                  value="proxy"
                  checked={assessmentType === 'proxy'}
                  onChange={(e) => setAssessmentType(e.target.value)}
                  className="mr-2"
                />
                대리인 기입식
              </label>
            </div>
          </div>

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
          <h3 className="text-center mb-4">WHODAS 2.0 - 12항목 버전, 자가 기입식</h3>
          
          <div className="mb-4">
            <p className="mb-4">
              본 설문지는 건강상태로 인해 겪는 어려움에 대한 질문들로 구성되어 있습니다. 
              건강상태란 질환, 질병, 장기간 또는 단기간 지속되는 기타 건강문제, 손상, 
              정신적 또는 정서적 문제 및 알코올이나 약물과 관련된 문제들을 포함합니다.
            </p>
            <p className="mb-4">
              <strong>지난 30일 동안, 본인은 다음 항목에서 얼마나 어려움이 있었습니까?</strong>
            </p>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>문항</th>
                  <th>내용</th>
                  <th>없음</th>
                  <th>약간</th>
                  <th>중간</th>
                  <th>심한</th>
                  <th>극심한 또는 할 수 없음</th>
                </tr>
              </thead>
              <tbody>
                {questions12.map((question, index) => (
                  <tr key={question.id}>
                    <td>{question.id}</td>
                    <td>{question.text}</td>
                    {responseOptions.map(option => (
                      <td key={option.value} className="text-center">
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          value={option.value}
                          checked={answers[question.id] === option.value}
                          onChange={(e) => updateAnswer(question.id, parseInt(e.target.value))}
                          className="form-radio"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">추가 정보</h3>
          
          <div className="mb-4">
            <h4>지난 30일 동안의 활동 제한</h4>
          </div>

          <div className="grid grid-1">
            <div className="form-group">
              <label className="form-label">
                H1. 전체적으로 지난 30일 동안, 이러한 어려움이 며칠 동안 있었습니까?
              </label>
              <input
                type="number"
                className="form-input"
                value={additionalInfo.daysPresent}
                onChange={(e) => setAdditionalInfo(prev => ({ ...prev, daysPresent: e.target.value }))}
                placeholder="0-30일"
                min="0"
                max="30"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                H2. 지난 30일 동안, 건강상태로 인해 평소 활동이나 일을 전혀 할 수 없었던 날이 며칠이었습니까?
              </label>
              <input
                type="number"
                className="form-input"
                value={additionalInfo.daysUnable}
                onChange={(e) => setAdditionalInfo(prev => ({ ...prev, daysUnable: e.target.value }))}
                placeholder="0-30일"
                min="0"
                max="30"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                H3. 지난 30일 동안, 전혀 할 수 없었던 날을 제외하고, 건강상태로 인해 평소 활동이나 일을 줄이거나 축소한 날이 며칠이었습니까?
              </label>
              <input
                type="number"
                className="form-input"
                value={additionalInfo.daysReduced}
                onChange={(e) => setAdditionalInfo(prev => ({ ...prev, daysReduced: e.target.value }))}
                placeholder="0-30일"
                min="0"
                max="30"
              />
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
    const { totalScore, maxScore, percentage } = calculateScore()
    const interpretation = getScoreInterpretation(percentage)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">WHODAS 2.0 평가 결과</h3>
          
          <div className="score-display">
            <div className="score-number">{percentage}%</div>
            <div className="score-label">장애 정도</div>
          </div>

          <div className="card mt-4" style={{ backgroundColor: interpretation.color + '20', borderColor: interpretation.color }}>
            <h4>평가 결과</h4>
            <p><strong>총점:</strong> {totalScore}/{maxScore}점</p>
            <p><strong>백분율:</strong> {percentage}%</p>
            <p><strong>수준:</strong> {interpretation.level}</p>
            <p><strong>설명:</strong> {interpretation.description}</p>
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
              <p><strong>버전:</strong> {version === '12-item' ? '12-항목 버전' : '36-항목 버전'}</p>
              <p><strong>평가방식:</strong> {assessmentType === 'self' ? '자가 기입식' : assessmentType === 'interviewer' ? '면접관 기입식' : '대리인 기입식'}</p>
            </div>
            <div>
              <h4>추가 정보</h4>
              <p><strong>어려움 있었던 날:</strong> {additionalInfo.daysPresent}일</p>
              <p><strong>전혀 할 수 없었던 날:</strong> {additionalInfo.daysUnable}일</p>
              <p><strong>활동을 줄인 날:</strong> {additionalInfo.daysReduced}일</p>
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

export default WHODASAssessment