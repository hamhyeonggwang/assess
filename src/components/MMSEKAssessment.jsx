import React, { useState } from 'react'
import { Download, FileText, Upload } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const MMSEKAssessment = () => {
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
        { id: 'year', text: '올해는 몇 년도입니까?', points: 1 },
        { id: 'season', text: '지금은 몇 계절입니까?', points: 1 },
        { id: 'month', text: '지금은 몇 월입니까?', points: 1 },
        { id: 'date', text: '오늘은 몇 일입니까?', points: 1 },
        { id: 'day', text: '오늘은 무슨 요일입니까?', points: 1 }
      ]
    },
    {
      id: 'place_orientation',
      title: '장소 지남력 (5점)',
      questions: [
        { id: 'country', text: '지금 어느 나라에 있습니까?', points: 1 },
        { id: 'city', text: '지금 어느 도시에 있습니까?', points: 1 },
        { id: 'district', text: '지금 어느 구(군)에 있습니까?', points: 1 },
        { id: 'hospital', text: '지금 어느 병원에 있습니까?', points: 1 },
        { id: 'floor', text: '지금 몇 층에 있습니까?', points: 1 }
      ]
    },
    {
      id: 'registration',
      title: '기억 등록 (3점)',
      questions: [
        { id: 'word1', text: '다음 세 단어를 기억해 주세요: "자동차, 기차, 비행기"', points: 0, instruction: '단어를 말한 후 "이 세 단어를 기억해 두세요"라고 말하세요.' },
        { id: 'word2', text: '자동차', points: 1 },
        { id: 'word3', text: '기차', points: 1 },
        { id: 'word4', text: '비행기', points: 1 }
      ]
    },
    {
      id: 'attention',
      title: '주의집중 및 계산 (5점)',
      questions: [
        { id: 'subtract1', text: '100에서 7을 빼면?', points: 1 },
        { id: 'subtract2', text: '93에서 7을 빼면?', points: 1 },
        { id: 'subtract3', text: '86에서 7을 빼면?', points: 1 },
        { id: 'subtract4', text: '79에서 7을 빼면?', points: 1 },
        { id: 'subtract5', text: '72에서 7을 빼면?', points: 1 }
      ]
    },
    {
      id: 'recall',
      title: '기억 회상 (3점)',
      questions: [
        { id: 'recall1', text: '앞서 말씀드린 세 단어 중 첫 번째는?', points: 1 },
        { id: 'recall2', text: '앞서 말씀드린 세 단어 중 두 번째는?', points: 1 },
        { id: 'recall3', text: '앞서 말씀드린 세 단어 중 세 번째는?', points: 1 }
      ]
    },
    {
      id: 'language',
      title: '언어 기능 (9점)',
      questions: [
        { id: 'naming1', text: '이것은 무엇입니까? (연필 보여주기)', points: 1 },
        { id: 'naming2', text: '이것은 무엇입니까? (시계 보여주기)', points: 1 },
        { id: 'repeat', text: '"아무것도, 만약, 하지만"을 따라 말해보세요.', points: 1 },
        { id: 'command1', text: '종이를 접어서 바닥에 놓으세요.', points: 1 },
        { id: 'command2', text: '"눈을 감으세요"라고 쓰세요.', points: 1 },
        { id: 'command3', text: '이 문장을 따라 쓰세요: "나는 집에 가겠습니다."', points: 1 },
        { id: 'draw', text: '이 그림을 그려보세요. (두 개의 교차하는 오각형)', points: 1 }
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
    
    localStorage.setItem('mmse-k-result', JSON.stringify(result))
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
    doc.text('MMSE-K Assessment Results', 20, 20)
    
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
    
    doc.save(`MMSE-K_${patientInfo.name}_${patientInfo.date}.pdf`)
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
    
    const response = await exportToGoogleSheets(result, 'MMSE-K_Results')
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
          <h3 className="text-center mb-4">MMSE-K 평가 결과</h3>
          
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

export default MMSEKAssessment
