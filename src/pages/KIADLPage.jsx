import React from 'react'
import KIADLAssessment from '../components/KIADLAssessment'

const KIADLPage = () => {
  return (
    <div>
      <div className="container">
        <div className="text-center mb-4">
          <h2>K-IADL 평가</h2>
          <p className="mb-4">
            Korean Instrumental Activities of Daily Living<br/>
            한국어 수단적 일상생활활동 평가 도구입니다.
          </p>
        </div>
      </div>
      <KIADLAssessment />
    </div>
  )
}

export default KIADLPage
