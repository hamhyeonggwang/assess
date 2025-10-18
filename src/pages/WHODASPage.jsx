import React from 'react'
import WHODASAssessment from '../components/WHODASAssessment'

const WHODASPage = () => {
  return (
    <div>
      <div className="container">
        <div className="text-center mb-4">
          <h2>WHODAS 2.0 평가</h2>
          <p className="mb-4">
            World Health Organization Disability Assessment Schedule 2.0<br/>
            WHO에서 개발한 장애 평가 도구로 ICF와 연계되어 있습니다.
          </p>
        </div>
      </div>
      <WHODASAssessment />
    </div>
  )
}

export default WHODASPage
