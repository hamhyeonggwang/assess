import React from 'react'
import MMSEKAssessment from '../components/MMSEKAssessment'

const MMSEKPage = () => {
  return (
    <div>
      <div className="container">
        <div className="text-center mb-4">
          <h2>MMSE-K 평가</h2>
          <p className="mb-4">
            Mini-Mental State Examination - Korean Version<br/>
            인지기능을 종합적으로 평가하는 표준화된 도구입니다.
          </p>
        </div>
      </div>
      <MMSEKAssessment />
    </div>
  )
}

export default MMSEKPage
