import React from 'react'
import MMSEDSAssessment from '../components/MMSEDSAssessment'

const MMSEDSPage = () => {
  return (
    <div>
      <div className="container">
        <div className="text-center mb-4">
          <h2>MMSE-DS 평가</h2>
          <p className="mb-4">
            MMSE for Dementia Screening<br/>
            치매 선별을 위한 특화된 MMSE 평가 도구입니다.
          </p>
        </div>
      </div>
      <MMSEDSAssessment />
    </div>
  )
}

export default MMSEDSPage
