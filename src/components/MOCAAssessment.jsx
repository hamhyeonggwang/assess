import React, { useState } from 'react'
import { Download, Upload, ArrowLeft, ArrowRight } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const MOCAAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    education: '',
    date: new Date().toISOString().split('T')[0],
    evaluator: ''
  })
  const [scores, setScores] = useState({
    // 시각적-공간적/실행기능 (5점)
    시계그리기: 0,
    입방체그리기: 0,
    
    // 명명 (3점)
    사자: 0,
    코뿔소: 0,
    낙타: 0,
    
    // 주의력 (6점)
    숫자따라하기: 0,
    숫자거꾸로따라하기: 0,
    알파벳따라하기: 0,
    
    // 언어 (3점)
    문장따라하기: 0,
    유창성: 0,
    
    // 추상적 사고 (2점)
    추상적사고: 0,
    
    // 지연회상 (5점)
    지연회상1: 0,
    지연회상2: 0,
    지연회상3: 0,
    지연회상4: 0,
    지연회상5: 0,
    
    // 지남력 (6점)
    지남력: 0
  })

  const updateScore = (item, score) => {
    setScores(prev => ({
      ...prev,
      [item]: score
    }))
  }

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0)
  }

  const getScoreInterpretation = (totalScore, education) => {
    let cutoff = 26
    if (education <= 12) cutoff = 25
    
    if (totalScore >= cutoff) {
      return { 
        level: '정상', 
        description: '인지기능이 정상 범위에 있습니다.',
        color: '#28a745'
      }
    } else if (totalScore >= cutoff - 2) {
      return { 
        level: '경미한인지장애', 
        description: '경미한 인지기능 저하가 있을 수 있습니다.',
        color: '#ffc107'
      }
    } else {
      return { 
        level: '인지장애', 
        description: '인지기능 저하가 의심됩니다.',
        color: '#dc3545'
      }
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
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore, parseInt(patientInfo.education) || 16)
    
    const result = {
      patientInfo,
      scores,
      totalScore,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('moca-result', JSON.stringify(result))
    alert(`MoCA 평가가 완료되었습니다!\n총점: ${totalScore}점\n수준: ${interpretation.level}`)
  }

  const generatePDF = () => {
    const { jsPDF } = require('jspdf')
    const doc = new jsPDF()
    
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore, parseInt(patientInfo.education) || 16)
    
    doc.setFontSize(16)
    doc.text('MoCA 평가 결과', 20, 20)
    
    doc.setFontSize(12)
    doc.text(`환자명: ${patientInfo.name}`, 20, 40)
    doc.text(`나이: ${patientInfo.age}세`, 20, 50)
    doc.text(`성별: ${patientInfo.gender}`, 20, 60)
    doc.text(`교육수준: ${patientInfo.education}년`, 20, 70)
    doc.text(`평가일: ${patientInfo.date}`, 20, 80)
    doc.text(`평가자: ${patientInfo.evaluator}`, 20, 90)
    
    doc.text(`총점: ${totalScore}점`, 20, 110)
    doc.text(`수준: ${interpretation.level}`, 20, 120)
    doc.text(`설명: ${interpretation.description}`, 20, 130)
    
    let yPos = 150
    doc.text('영역별 점수:', 20, yPos)
    yPos += 10
    
    // 영역별 점수 계산
    const visualSpatial = scores.시계그리기 + scores.입방체그리기
    const naming = scores.사자 + scores.코뿔소 + scores.낙타
    const attention = scores.숫자따라하기 + scores.숫자거꾸로따라하기 + scores.알파벳따라하기
    const language = scores.문장따라하기 + scores.유창성
    const abstraction = scores.추상적사고
    const delayedRecall = scores.지연회상1 + scores.지연회상2 + scores.지연회상3 + scores.지연회상4 + scores.지연회상5
    const orientation = scores.지남력
    
    doc.text(`시각적-공간적/실행기능: ${visualSpatial}/5점`, 20, yPos)
    yPos += 8
    doc.text(`명명: ${naming}/3점`, 20, yPos)
    yPos += 8
    doc.text(`주의력: ${attention}/6점`, 20, yPos)
    yPos += 8
    doc.text(`언어: ${language}/3점`, 20, yPos)
    yPos += 8
    doc.text(`추상적 사고: ${abstraction}/2점`, 20, yPos)
    yPos += 8
    doc.text(`지연회상: ${delayedRecall}/5점`, 20, yPos)
    yPos += 8
    doc.text(`지남력: ${orientation}/6점`, 20, yPos)
    
    doc.save(`MoCA_${patientInfo.name}_${patientInfo.date}.pdf`)
  }

  const exportToSheets = async () => {
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore, parseInt(patientInfo.education) || 16)
    
    const result = {
      patientInfo,
      scores,
      totalScore,
      interpretation,
      timestamp: new Date().toISOString()
    }
    
    const response = await exportToGoogleSheets(result, 'MoCA_Results')
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
              <label className="form-label">교육수준 (년)</label>
              <input
                type="number"
                className="form-input"
                value={patientInfo.education}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, education: e.target.value }))}
                placeholder="예: 16"
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
          <h3 className="text-center mb-4">MoCA 평가</h3>
          <p className="mb-4">
            Montreal Cognitive Assessment<br/>
            각 항목에 대해 환자의 수행 능력을 평가해주세요.
          </p>

          <div className="mb-4">
            <h4>1. 시각적-공간적/실행기능 (5점)</h4>
            <div className="card mb-3">
              <h5>시계 그리기 (3점)</h5>
              <p>환자에게 "시계를 그려주세요. 시간은 11시 10분으로 설정해주세요"라고 요청</p>
              <div className="grid grid-3">
                <label className="form-radio">
                  <input
                    type="radio"
                    name="시계그리기"
                    value={0}
                    checked={scores.시계그리기 === 0}
                    onChange={() => updateScore('시계그리기', 0)}
                  />
                  <span>0점 - 잘못됨</span>
                </label>
                <label className="form-radio">
                  <input
                    type="radio"
                    name="시계그리기"
                    value={1}
                    checked={scores.시계그리기 === 1}
                    onChange={() => updateScore('시계그리기', 1)}
                  />
                  <span>1점 - 부분적</span>
                </label>
                <label className="form-radio">
                  <input
                    type="radio"
                    name="시계그리기"
                    value={3}
                    checked={scores.시계그리기 === 3}
                    onChange={() => updateScore('시계그리기', 3)}
                  />
                  <span>3점 - 정확함</span>
                </label>
              </div>
            </div>

            <div className="card mb-3">
              <h5>입방체 그리기 (2점)</h5>
              <p>환자에게 "이 그림을 따라 그려주세요"라고 요청</p>
              <div className="grid grid-3">
                <label className="form-radio">
                  <input
                    type="radio"
                    name="입방체그리기"
                    value={0}
                    checked={scores.입방체그리기 === 0}
                    onChange={() => updateScore('입방체그리기', 0)}
                  />
                  <span>0점 - 잘못됨</span>
                </label>
                <label className="form-radio">
                  <input
                    type="radio"
                    name="입방체그리기"
                    value={1}
                    checked={scores.입방체그리기 === 1}
                    onChange={() => updateScore('입방체그리기', 1)}
                  />
                  <span>1점 - 부분적</span>
                </label>
                <label className="form-radio">
                  <input
                    type="radio"
                    name="입방체그리기"
                    value={2}
                    checked={scores.입방체그리기 === 2}
                    onChange={() => updateScore('입방체그리기', 2)}
                  />
                  <span>2점 - 정확함</span>
                </label>
              </div>
            </div>

            <h4>2. 명명 (3점)</h4>
            <div className="card mb-3">
              <p>다음 동물들의 이름을 말해주세요:</p>
              <div className="grid grid-3">
                <div>
                  <label className="form-label">사자</label>
                  <select
                    className="form-select"
                    value={scores.사자}
                    onChange={(e) => updateScore('사자', parseInt(e.target.value))}
                  >
                    <option value={0}>0점</option>
                    <option value={1}>1점</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">코뿔소</label>
                  <select
                    className="form-select"
                    value={scores.코뿔소}
                    onChange={(e) => updateScore('코뿔소', parseInt(e.target.value))}
                  >
                    <option value={0}>0점</option>
                    <option value={1}>1점</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">낙타</label>
                  <select
                    className="form-select"
                    value={scores.낙타}
                    onChange={(e) => updateScore('낙타', parseInt(e.target.value))}
                  >
                    <option value={0}>0점</option>
                    <option value={1}>1점</option>
                  </select>
                </div>
              </div>
            </div>

            <h4>3. 주의력 (6점)</h4>
            <div className="card mb-3">
              <h5>숫자 따라하기 (2점)</h5>
              <p>"2-1-8-5-4"를 따라 말해주세요</p>
              <select
                className="form-select"
                value={scores.숫자따라하기}
                onChange={(e) => updateScore('숫자따라하기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 틀림</option>
                <option value={1}>1점 - 부분적</option>
                <option value={2}>2점 - 정확함</option>
              </select>
            </div>

            <div className="card mb-3">
              <h5>숫자 거꾸로 따라하기 (2점)</h5>
              <p>"7-4-2"를 거꾸로 말해주세요</p>
              <select
                className="form-select"
                value={scores.숫자거꾸로따라하기}
                onChange={(e) => updateScore('숫자거꾸로따라하기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 틀림</option>
                <option value={1}>1점 - 부분적</option>
                <option value={2}>2점 - 정확함</option>
              </select>
            </div>

            <div className="card mb-3">
              <h5>알파벳 따라하기 (2점)</h5>
              <p>"A-1-B-2-C-3"를 따라 말해주세요</p>
              <select
                className="form-select"
                value={scores.알파벳따라하기}
                onChange={(e) => updateScore('알파벳따라하기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 틀림</option>
                <option value={1}>1점 - 부분적</option>
                <option value={2}>2점 - 정확함</option>
              </select>
            </div>

            <h4>4. 언어 (3점)</h4>
            <div className="card mb-3">
              <h5>문장 따라하기 (2점)</h5>
              <p>"고양이는 항상 개보다 작다"를 따라 말해주세요</p>
              <select
                className="form-select"
                value={scores.문장따라하기}
                onChange={(e) => updateScore('문장따라하기', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 틀림</option>
                <option value={1}>1점 - 부분적</option>
                <option value={2}>2점 - 정확함</option>
              </select>
            </div>

            <div className="card mb-3">
              <h5>유창성 (1점)</h5>
              <p>1분 동안 'ㄱ'으로 시작하는 단어를 최대한 많이 말해주세요</p>
              <select
                className="form-select"
                value={scores.유창성}
                onChange={(e) => updateScore('유창성', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 11개 미만</option>
                <option value={1}>1점 - 11개 이상</option>
              </select>
            </div>

            <h4>5. 추상적 사고 (2점)</h4>
            <div className="card mb-3">
              <p>다음 단어들의 공통점을 말해주세요:</p>
              <p><strong>바나나-오렌지:</strong> 과일</p>
              <p><strong>기차-자전거:</strong> 교통수단</p>
              <select
                className="form-select"
                value={scores.추상적사고}
                onChange={(e) => updateScore('추상적사고', parseInt(e.target.value))}
              >
                <option value={0}>0점 - 틀림</option>
                <option value={1}>1점 - 하나만 맞음</option>
                <option value={2}>2점 - 둘 다 맞음</option>
              </select>
            </div>

            <h4>6. 지연회상 (5점)</h4>
            <div className="card mb-3">
              <p>앞서 말한 동물들을 기억하고 있나요? (단서 없이)</p>
              <div className="grid grid-5">
                {['사자', '코뿔소', '낙타', '기타1', '기타2'].map((animal, index) => (
                  <div key={index}>
                    <label className="form-label">{animal}</label>
                    <select
                      className="form-select"
                      value={scores[`지연회상${index + 1}`]}
                      onChange={(e) => updateScore(`지연회상${index + 1}`, parseInt(e.target.value))}
                    >
                      <option value={0}>0점</option>
                      <option value={1}>1점</option>
                    </select>
                  </div>
                ))}
            </div>
            </div>

            <h4>7. 지남력 (6점)</h4>
            <div className="card mb-3">
              <p>오늘 날짜, 요일, 장소, 도시를 말해주세요</p>
              <select
                className="form-select"
                value={scores.지남력}
                onChange={(e) => updateScore('지남력', parseInt(e.target.value))}
              >
                <option value={0}>0점</option>
                <option value={1}>1점</option>
                <option value={2}>2점</option>
                <option value={3}>3점</option>
                <option value={4}>4점</option>
                <option value={5}>5점</option>
                <option value={6}>6점</option>
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
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore, parseInt(patientInfo.education) || 16)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">MoCA 평가 결과</h3>
          
          <div className="score-display">
            <div className="score-number">{totalScore}</div>
            <div className="score-label">총점 (30점 만점)</div>
          </div>

          <div className="card mt-4" style={{ backgroundColor: interpretation.color + '20', borderColor: interpretation.color }}>
            <h4>평가 결과</h4>
            <p><strong>수준:</strong> {interpretation.level}</p>
            <p><strong>설명:</strong> {interpretation.description}</p>
          </div>

          <div className="grid grid-2">
            <div>
              <h4>환자 정보</h4>
              <p><strong>이름:</strong> {patientInfo.name}</p>
              <p><strong>나이:</strong> {patientInfo.age}세</p>
              <p><strong>성별:</strong> {patientInfo.gender}</p>
              <p><strong>교육수준:</strong> {patientInfo.education}년</p>
              <p><strong>평가일:</strong> {patientInfo.date}</p>
              <p><strong>평가자:</strong> {patientInfo.evaluator}</p>
            </div>
            <div>
              <h4>영역별 점수</h4>
              <p><strong>시각적-공간적/실행기능:</strong> {scores.시계그리기 + scores.입방체그리기}/5점</p>
              <p><strong>명명:</strong> {scores.사자 + scores.코뿔소 + scores.낙타}/3점</p>
              <p><strong>주의력:</strong> {scores.숫자따라하기 + scores.숫자거꾸로따라하기 + scores.알파벳따라하기}/6점</p>
              <p><strong>언어:</strong> {scores.문장따라하기 + scores.유창성}/3점</p>
              <p><strong>추상적 사고:</strong> {scores.추상적사고}/2점</p>
              <p><strong>지연회상:</strong> {scores.지연회상1 + scores.지연회상2 + scores.지연회상3 + scores.지연회상4 + scores.지연회상5}/5점</p>
              <p><strong>지남력:</strong> {scores.지남력}/6점</p>
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

export default MOCAAssessment
