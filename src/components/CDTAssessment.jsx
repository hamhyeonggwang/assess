import React, { useState, useRef, useEffect } from 'react'
import { Download, Upload, ArrowLeft, ArrowRight, RotateCcw, Eraser } from 'lucide-react'
import { exportToGoogleSheets } from '../utils/googleSheets'

const CDTAssessment = () => {
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
    시계원: 0,
    숫자배치: 0,
    시침분침: 0,
    시간설정: 0
  })
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState('pen')
  const canvasRef = useRef(null)
  const [canvasData, setCanvasData] = useState(null)

  const updateScore = (item, score) => {
    setScores(prev => ({
      ...prev,
      [item]: score
    }))
  }

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0)
  }

  const getScoreInterpretation = (totalScore) => {
    if (totalScore >= 4) {
      return { 
        level: '정상', 
        description: '시각적-공간적 능력과 실행기능이 정상입니다.',
        color: '#28a745'
      }
    } else if (totalScore >= 3) {
      return { 
        level: '경미한 장애', 
        description: '경미한 시각적-공간적 능력 저하가 있을 수 있습니다.',
        color: '#ffc107'
      }
    } else if (totalScore >= 2) {
      return { 
        level: '중등도 장애', 
        description: '중등도의 시각적-공간적 능력 저하가 있습니다.',
        color: '#fd7e14'
      }
    } else {
      return { 
        level: '심한 장애', 
        description: '심한 시각적-공간적 능력 저하가 있습니다.',
        color: '#dc3545'
      }
    }
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasData(null)
  }

  const saveCanvas = () => {
    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL()
    setCanvasData(dataURL)
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
      canvasData,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('cdt-result', JSON.stringify(result))
    alert(`Clock Drawing Test가 완료되었습니다!\n총점: ${totalScore}점\n수준: ${interpretation.level}`)
  }

  const generatePDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // 한글 폰트 설정 (기본 폰트 사용)
    doc.setFont('helvetica')
    
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore)
    
    // 제목
    doc.setFontSize(16)
    doc.text('Clock Drawing Test Results', 20, 20)
    
    // 환자 정보
    doc.setFontSize(12)
    doc.text(`Patient Name: ${patientInfo.name}`, 20, 40)
    doc.text(`Age: ${patientInfo.age} years old`, 20, 50)
    doc.text(`Gender: ${patientInfo.gender}`, 20, 60)
    doc.text(`Education: ${patientInfo.education}`, 20, 70)
    doc.text(`Assessment Date: ${patientInfo.date}`, 20, 80)
    doc.text(`Evaluator: ${patientInfo.evaluator}`, 20, 90)
    
    // 결과
    doc.text(`Total Score: ${totalScore} points (out of 4)`, 20, 110)
    doc.text(`Level: ${interpretation.level}`, 20, 120)
    doc.text(`Description: ${interpretation.description}`, 20, 130)
    
    // 항목별 점수
    let yPos = 150
    doc.text('Item Scores:', 20, yPos)
    yPos += 10
    
    doc.text(`Clock Circle: ${scores.시계원} points`, 20, yPos)
    yPos += 8
    doc.text(`Number Placement: ${scores.숫자배치} points`, 20, yPos)
    yPos += 8
    doc.text(`Hands: ${scores.시침분침} points`, 20, yPos)
    yPos += 8
    doc.text(`Time Setting: ${scores.시간설정} points`, 20, yPos)
    
    // 그린 시계 이미지
    if (canvasData) {
      yPos += 20
      doc.text('Drawn Clock:', 20, yPos)
      yPos += 10
      doc.addImage(canvasData, 'PNG', 20, yPos, 100, 100)
    }
    
    doc.save(`CDT_${patientInfo.name}_${patientInfo.date}.pdf`)
  }

  const exportToSheets = async () => {
    const totalScore = calculateTotalScore()
    const interpretation = getScoreInterpretation(totalScore)
    
    const result = {
      patientInfo,
      scores,
      totalScore,
      interpretation,
      canvasData,
      timestamp: new Date().toISOString()
    }
    
    const response = await exportToGoogleSheets(result, 'CDT_Results')
    alert(response.message)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
    }
  }, [])

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
          <h3 className="text-center mb-4">Clock Drawing Test</h3>
          <p className="mb-4">
            시계를 그려주세요. 시간은 11시 10분으로 설정해주세요.
          </p>

          <div className="mb-4">
            <div className="text-center mb-4">
              <h4>시계 그리기</h4>
              <p>아래 캔버스에 마우스나 터치로 시계를 그려주세요.</p>
            </div>
            
            <div className="text-center mb-4">
              <div className="btn-group mb-3">
                <button 
                  className={`btn ${currentTool === 'pen' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCurrentTool('pen')}
                >
                  펜
                </button>
                <button 
                  className={`btn ${currentTool === 'eraser' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCurrentTool('eraser')}
                >
                  <Eraser size={16} />
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={clearCanvas}
                >
                  <RotateCcw size={16} />
                  지우기
                </button>
                <button 
                  className="btn btn-success"
                  onClick={saveCanvas}
                >
                  저장
                </button>
              </div>
              
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                style={{
                  border: '2px solid #000',
                  borderRadius: '50%',
                  cursor: currentTool === 'pen' ? 'crosshair' : 'pointer',
                  backgroundColor: '#fff'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(e) => {
                  e.preventDefault()
                  const touch = e.touches[0]
                  const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  })
                  startDrawing(mouseEvent)
                }}
                onTouchMove={(e) => {
                  e.preventDefault()
                  const touch = e.touches[0]
                  const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  })
                  draw(mouseEvent)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  stopDrawing()
                }}
              />
            </div>

            <div className="card mt-4">
              <h4>평가 기준</h4>
              <div className="grid grid-2">
                <div>
                  <h5>시계원 (1점)</h5>
                  <p>원형이거나 거의 원형</p>
                  <select
                    className="form-select"
                    value={scores.시계원}
                    onChange={(e) => updateScore('시계원', parseInt(e.target.value))}
                  >
                    <option value={0}>0점 - 원형이 아님</option>
                    <option value={1}>1점 - 원형임</option>
                  </select>
                </div>
                <div>
                  <h5>숫자배치 (1점)</h5>
                  <p>12개 숫자가 올바르게 배치</p>
                  <select
                    className="form-select"
                    value={scores.숫자배치}
                    onChange={(e) => updateScore('숫자배치', parseInt(e.target.value))}
                  >
                    <option value={0}>0점 - 숫자 배치 잘못됨</option>
                    <option value={1}>1점 - 숫자 배치 정확함</option>
                  </select>
                </div>
                <div>
                  <h5>시침분침 (1점)</h5>
                  <p>시침과 분침이 구분됨</p>
                  <select
                    className="form-select"
                    value={scores.시침분침}
                    onChange={(e) => updateScore('시침분침', parseInt(e.target.value))}
                  >
                    <option value={0}>0점 - 시침분침 구분 안됨</option>
                    <option value={1}>1점 - 시침분침 구분됨</option>
                  </select>
                </div>
                <div>
                  <h5>시간설정 (1점)</h5>
                  <p>11시 10분으로 정확히 설정</p>
                  <select
                    className="form-select"
                    value={scores.시간설정}
                    onChange={(e) => updateScore('시간설정', parseInt(e.target.value))}
                  >
                    <option value={0}>0점 - 시간 설정 잘못됨</option>
                    <option value={1}>1점 - 시간 설정 정확함</option>
                  </select>
                </div>
              </div>
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
    const interpretation = getScoreInterpretation(totalScore)
    
    return (
      <div className="container">
        <div className="card">
          <h3 className="text-center mb-4">Clock Drawing Test 결과</h3>
          
          <div className="score-display">
            <div className="score-number">{totalScore}</div>
            <div className="score-label">총점 (4점 만점)</div>
          </div>

          <div className="card mt-4" style={{ backgroundColor: interpretation.color + '20', borderColor: interpretation.color }}>
            <h4>평가 결과</h4>
            <p><strong>수준:</strong> {interpretation.level}</p>
            <p><strong>설명:</strong> {interpretation.description}</p>
          </div>

          {canvasData && (
            <div className="card mt-4">
              <h4>그린 시계</h4>
              <div className="text-center">
                <img src={canvasData} alt="그린 시계" style={{ maxWidth: '300px', border: '1px solid #ccc' }} />
              </div>
            </div>
          )}

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
              <h4>항목별 점수</h4>
              <p><strong>시계원:</strong> {scores.시계원}점</p>
              <p><strong>숫자배치:</strong> {scores.숫자배치}점</p>
              <p><strong>시침분침:</strong> {scores.시침분침}점</p>
              <p><strong>시간설정:</strong> {scores.시간설정}점</p>
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

export default CDTAssessment
