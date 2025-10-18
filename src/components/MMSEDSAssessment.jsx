import React, { useState } from 'react'
import { Download, FileText, Upload } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const MMSEDSAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [patientResponses, setPatientResponses] = useState({})
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    education: '',
    date: new Date().toISOString().split('T')[0],
    evaluator: ''
  })

  const questions = [
    {
      id: 'time_orientation',
      title: '시간 지남력 (5점)',
      questions: [
        { id: 'year', text: '올 해는 몇 년도 입니까?', points: 1 },
        { id: 'season', text: '지금은 무슨 계절입니까?', points: 1 },
        { id: 'date', text: '오늘은 몇 일입니까?', points: 1 },
        { id: 'day', text: '오늘은 무슨 요일입니까?', points: 1 },
        { id: 'month', text: '지금은 몇 월입니까?', points: 1 }
      ]
    },
    {
      id: 'place_orientation',
      title: '장소 지남력 (5점)',
      questions: [
        { id: 'province', text: '여기는 무슨 도/특별시/광역시입니까?', points: 1 },
        { id: 'city', text: '여기는 무슨 시/군/구입니까?', points: 1 },
        { id: 'district', text: '여기는 무슨 읍/면/동입니까?', points: 1 },
        { id: 'floor', text: '여기는 건물의 몇 층입니까?', points: 1 },
        { id: 'place_name', text: '이곳의 이름은 무엇입니까?', points: 1 }
      ]
    },
    {
      id: 'registration',
      title: '기억 등록 (3점)',
      questions: [
        { id: 'instruction', text: '지금부터 제가 세 가지 물건 이름을 말씀 드리겠습니다. 끝까지 다 들으신 다음에 세 가지 물건의 이름을 모두 말씀해 보십시오. 그리고 몇 분 후에는 그 세 가지 물건의 이름들을 다시 물어볼 것이니 들으신 물건의 이름들을 잘 기억하고 계십시오.', points: 0, instruction: '나무, 자동차, 모자를 말한 후 "이제 방금 들으신 세 가지 물건 이름을 모두 말씀해 보세요"라고 말하세요.' },
        { id: 'word1', text: '나무', points: 1 },
        { id: 'word2', text: '자동차', points: 1 },
        { id: 'word3', text: '모자', points: 1 }
      ]
    },
    {
      id: 'attention',
      title: '주의력 (5점)',
      questions: [
        { id: 'subtract1', text: '100에서 7을 빼면 얼마가 됩니까?', points: 1 },
        { id: 'subtract2', text: '거기에서 7을 빼면 얼마가 됩니까?', points: 1 },
        { id: 'subtract3', text: '거기에서 7을 빼면 얼마가 됩니까?', points: 1 },
        { id: 'subtract4', text: '거기에서 7을 빼면 얼마가 됩니까?', points: 1 },
        { id: 'subtract5', text: '거기에서 7을 빼면 얼마가 됩니까?', points: 1 }
      ]
    },
    {
      id: 'recall',
      title: '지연회상 (3점)',
      questions: [
        { id: 'recall1', text: '조금 전에 제가 기억하라고 말씀 드렸던 세 가지 물건의 이름이 무엇인지를 말씀하여 주십시오.', points: 1 },
        { id: 'recall2', text: '나무', points: 1 },
        { id: 'recall3', text: '자동차', points: 1 },
        { id: 'recall4', text: '모자', points: 1 }
      ]
    },
    {
      id: 'naming',
      title: '이름대기 (2점)',
      questions: [
        { id: 'naming1', text: '(시계를 보여주며) 이것을 무엇이라고 합니까?', points: 1 },
        { id: 'naming2', text: '(연필을 보여주며) 이것을 무엇이라고 합니까?', points: 1 }
      ]
    },
    {
      id: 'repetition',
      title: '따라 말하기 (1점)',
      questions: [
        { id: 'repeat', text: '제가 하는 말을 끝까지 듣고 따라 해 보십시오. 한번만 말씀 드릴 것이니 잘 듣고 따라 하십시오. 간 장 공 장 공 장 장', points: 1 }
      ]
    },
    {
      id: 'command',
      title: '3단계 명령 이행 (3점)',
      questions: [
        { id: 'command1', text: '제가 종이를 한 장 드릴 것입니다. 그러면 그 종이를 오른손으로 받아', points: 1 },
        { id: 'command2', text: '반으로 접은 다음', points: 1 },
        { id: 'command3', text: '무릎 위에 올려놓으세요.', points: 1 }
      ]
    },
    {
      id: 'construction',
      title: '구성 능력 (1점)',
      questions: [
        { id: 'draw', text: '(별지의 겹친 오각형 그림을 가리키며) 여기에 오각형이 겹쳐져 있는 그림이 있습니다. 이 그림을 아래 빈 곳에 그대로 그려 보세요.', points: 1 }
      ]
    },
    {
      id: 'judgment',
      title: '판단력 및 추상적 사고력 (2점)',
      questions: [
        { id: 'judgment1', text: '옷은 왜 빨아서 입습니까?', points: 1 },
        { id: 'judgment2', text: '"티끌 모아 태산" 은 무슨 뜻입니까?', points: 1 }
      ]
    }
  ]

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleResponseChange = (questionId, response) => {
    setPatientResponses(prev => ({
      ...prev,
      [questionId]: response
    }))
  }

  const calculateScore = () => {
    let totalScore = 0
    questions.forEach(section => {
      section.questions.forEach(question => {
        if (answers[question.id] === 'correct') {
          totalScore += question.points
        }
      })
    })
    return totalScore
  }

  const getInterpretation = (score) => {
    if (score >= 24) return { level: '정상', color: '#28a745' }
    if (score >= 18) return { level: '경도 인지장애', color: '#ffc107' }
    return { level: '중등도-중증 인지장애', color: '#dc3545' }
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const score = calculateScore()
    const interpretation = getInterpretation(score)
    
    // 결과를 로컬 스토리지에 저장
    const result = {
      patientInfo,
      answers,
      patientResponses,
      score,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('mmse-ds-result', JSON.stringify(result))
    alert(`평가가 완료되었습니다!\n총점: ${score}/30점\n해석: ${interpretation.level}`)
  }

  const generatePDF = async () => {
    // PDF 생성 로직 (jspdf 사용)
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // 한글 폰트 설정
    doc.setFont('helvetica')
    
    const score = calculateScore()
    const interpretation = getInterpretation(score)
    
    doc.setFontSize(16)
    doc.text('MMSE-DS Assessment Results', 20, 20)
    
    doc.setFontSize(12)
    doc.text(`Patient Name: ${patientInfo.name}`, 20, 40)
    doc.text(`Age: ${patientInfo.age} years old`, 20, 50)
    doc.text(`Gender: ${patientInfo.gender}`, 20, 60)
    doc.text(`Education: ${patientInfo.education}`, 20, 70)
    doc.text(`Assessment Date: ${patientInfo.date}`, 20, 80)
    doc.text(`Evaluator: ${patientInfo.evaluator}`, 20, 90)
    
    doc.text(`Total Score: ${score}/30 points`, 20, 110)
    doc.text(`Interpretation: ${interpretation.level}`, 20, 120)
    
    // 문항별 답변 내용
    let yPos = 140
    doc.text('Question Responses:', 20, yPos)
    yPos += 10
    
    questions.forEach(section => {
      doc.text(`${section.title}:`, 20, yPos)
      yPos += 6
      
      section.questions.forEach(question => {
        const response = patientResponses[question.id] || 'No response'
        const isCorrect = answers[question.id] === 'correct'
        doc.text(`  ${question.id}: "${response}" (${isCorrect ? 'Correct' : 'Incorrect'})`, 20, yPos)
        yPos += 6
      })
      yPos += 3
    })
    
    doc.save(`MMSE-DS_${patientInfo.name}_${patientInfo.date}.pdf`)
  }

  const exportToSheets = async () => {
    const score = calculateScore()
    const interpretation = getInterpretation(score)
    
    const result = {
      patientInfo,
      answers,
      patientResponses,
      score,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    const response = await exportToGoogleSheets(result, 'MMSE-DS_Results')
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

  if (currentStep === questions.length) {
    const score = calculateScore()
    const interpretation = getInterpretation(score)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">MMSE-DS 평가 결과</h3>
          
          <div className="score-display">
            <div className="score-number">{score}</div>
            <div className="score-label">/ 30점</div>
            <div style={{ color: interpretation.color, fontSize: '1.2rem', fontWeight: 'bold' }}>
              {interpretation.level}
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
              {questions.map((section, index) => {
                const sectionScore = section.questions.reduce((sum, q) => 
                  sum + (answers[q.id] === 'correct' ? q.points : 0), 0
                )
                const maxScore = section.questions.reduce((sum, q) => sum + q.points, 0)
                return (
                  <p key={index}>
                    <strong>{section.title}:</strong> {sectionScore}/{maxScore}점
                  </p>
                )
              })}
            </div>
          </div>

          <div className="card mt-4">
            <h4>문항별 답변 내용</h4>
            {questions.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-4">
                <h5>{section.title}</h5>
                {section.questions.map((question, questionIndex) => {
                  const response = patientResponses[question.id] || '답변 없음'
                  const isCorrect = answers[question.id] === 'correct'
                  return (
                    <div key={questionIndex} className="mb-3 p-3" style={{ 
                      backgroundColor: isCorrect ? '#d4edda' : '#f8d7da', 
                      border: `1px solid ${isCorrect ? '#c3e6cb' : '#f5c6cb'}`,
                      borderRadius: '4px'
                    }}>
                      <p><strong>{question.text}</strong></p>
                      <p><strong>답변:</strong> {response}</p>
                      <p><strong>정답 여부:</strong> 
                        <span style={{ color: isCorrect ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                          {isCorrect ? ' 정답' : ' 오답'}
                        </span>
                      </p>
                    </div>
                  )
                })}
              </div>
            ))}
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

  const currentSection = questions[currentStep]

  return (
    <div className="container">
      <div className="card">
        <h3 className="text-center mb-4">{currentSection.title}</h3>
        
        <div className="mb-4">
          <div className="text-center">
            <span>진행률: {currentStep + 1} / {questions.length}</span>
          </div>
        </div>

        {currentSection.questions.map((question, index) => (
          <div key={question.id} className="mb-4">
            <div className="form-group">
              <label className="form-label">
                {question.text}
                {question.instruction && (
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                    {question.instruction}
                  </div>
                )}
              </label>
              
              {/* 환자 답변 입력 */}
              <div className="mb-3">
                <label className="form-label">환자 답변:</label>
                <textarea
                  className="form-input"
                  rows="2"
                  placeholder="환자의 답변을 입력하세요..."
                  value={patientResponses[question.id] || ''}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                />
              </div>
              
              {/* 정/오답 선택 */}
              <div className="radio-group">
                <div 
                  className={`radio-item ${answers[question.id] === 'correct' ? 'selected' : ''}`}
                  onClick={() => handleAnswerChange(question.id, 'correct')}
                >
                  <input 
                    type="radio" 
                    name={question.id} 
                    checked={answers[question.id] === 'correct'}
                    onChange={() => handleAnswerChange(question.id, 'correct')}
                  />
                  <span>정답</span>
                </div>
                <div 
                  className={`radio-item ${answers[question.id] === 'incorrect' ? 'selected' : ''}`}
                  onClick={() => handleAnswerChange(question.id, 'incorrect')}
                >
                  <input 
                    type="radio" 
                    name={question.id} 
                    checked={answers[question.id] === 'incorrect'}
                    onChange={() => handleAnswerChange(question.id, 'incorrect')}
                  />
                  <span>오답</span>
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
            onClick={currentStep === questions.length - 1 ? handleSubmit : handleNext}
          >
            {currentStep === questions.length - 1 ? '평가 완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MMSEDSAssessment
