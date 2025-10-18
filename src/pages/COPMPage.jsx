import React from 'react'
import COPMAssessment from '../components/COPMAssessment'

const COPMPage = () => {
  return (
    <div>
      <div className="container">
        <div className="text-center mb-4">
          <h2>COPM 평가</h2>
          <p className="mb-4">
            Canadian Occupational Performance Measure<br/>
            개인의 작업 수행과 만족도를 평가하는 도구입니다.
          </p>
        </div>
      </div>
      <COPMAssessment />
    </div>
  )
}

export default COPMPage
