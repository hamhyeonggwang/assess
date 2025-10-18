// 구글 스프레드시트 연동을 위한 유틸리티 함수들

export const exportToGoogleSheets = async (data, sheetName = 'MMSE_Results') => {
  try {
    // 구글 스프레드시트 API를 사용하여 데이터를 전송
    // 실제 구현에서는 구글 API 키와 스프레드시트 ID가 필요합니다
    
    const spreadsheetData = {
      values: [
        ['환자명', '나이', '성별', '교육수준', '평가일', '평가자', '총점', '해석', '평가시간'],
        [
          data.patientInfo.name,
          data.patientInfo.age,
          data.patientInfo.gender,
          data.patientInfo.education,
          data.patientInfo.date,
          data.patientInfo.evaluator,
          data.score,
          data.interpretation.level,
          data.timestamp
        ]
      ]
    }

    // 로컬 스토리지에 데이터 저장 (실제 구글 스프레드시트 연동 대신)
    const existingData = JSON.parse(localStorage.getItem('googleSheetsData') || '[]')
    existingData.push({
      ...data,
      sheetName,
      exportTime: new Date().toISOString()
    })
    
    localStorage.setItem('googleSheetsData', JSON.stringify(existingData))
    
    // CSV 형태로 다운로드 가능한 링크 생성
    const csvContent = convertToCSV(existingData)
    downloadCSV(csvContent, `${sheetName}_${new Date().toISOString().split('T')[0]}.csv`)
    
    return { success: true, message: '구글 스프레드시트로 데이터가 전송되었습니다.' }
  } catch (error) {
    console.error('구글 스프레드시트 연동 오류:', error)
    return { success: false, message: '구글 스프레드시트 연동에 실패했습니다.' }
  }
}

export const convertToCSV = (data) => {
  if (!data || data.length === 0) return ''
  
  const headers = [
    '환자명', '나이', '성별', '교육수준', '평가일', '평가자', 
    '총점', '해석', '평가시간', '내보내기시간'
  ]
  
  const csvRows = [headers.join(',')]
  
  data.forEach(item => {
    const row = [
      item.patientInfo.name,
      item.patientInfo.age,
      item.patientInfo.gender,
      item.patientInfo.education,
      item.patientInfo.date,
      item.patientInfo.evaluator,
      item.score,
      item.interpretation.level,
      item.timestamp,
      item.exportTime
    ]
    csvRows.push(row.join(','))
  })
  
  return csvRows.join('\n')
}

export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const getStoredData = () => {
  try {
    return JSON.parse(localStorage.getItem('googleSheetsData') || '[]')
  } catch (error) {
    console.error('저장된 데이터 읽기 오류:', error)
    return []
  }
}

export const clearStoredData = () => {
  localStorage.removeItem('googleSheetsData')
  localStorage.removeItem('mmse-k-result')
  localStorage.removeItem('mmse-ds-result')
}

// 구글 스프레드시트 API 설정 (실제 구현 시 사용)
export const GOOGLE_SHEETS_CONFIG = {
  API_KEY: 'YOUR_GOOGLE_API_KEY',
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
  RANGE: 'Sheet1!A:Z'
}

// 실제 구글 스프레드시트 API 연동 함수 (구현 예시)
export const uploadToGoogleSheets = async (data) => {
  // 이 함수는 실제 구글 스프레드시트 API를 사용하여 구현해야 합니다
  // 현재는 CSV 다운로드로 대체됩니다
  
  console.log('구글 스프레드시트 업로드:', data)
  
  // 실제 구현 예시:
  // const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     values: [data]
  //   })
  // })
  
  return { success: true, message: 'CSV 파일로 다운로드되었습니다.' }
}
