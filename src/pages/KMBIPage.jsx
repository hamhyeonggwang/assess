import React from 'react'
import KMBIAssessment from '../components/KMBIAssessment'

const KMBIPage = () => {
  return (
    <div>
      <div className="container">
        <div className="text-center mb-4">
          <h2>K-MBI 평가</h2>
          <p className="mb-4">
            Korean Modified Barthel Index<br/>
            한국어 수정된 바르텔 지수로 일상생활활동을 평가하는 도구입니다.
          </p>
        </div>
      </div>
      <KMBIAssessment />
    </div>
  )
}

export default KMBIPage
