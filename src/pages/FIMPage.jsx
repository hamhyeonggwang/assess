import React from 'react'
import FIMAssessment from '../components/FIMAssessment'

const FIMPage = () => {
  return (
    <div>
      <div className="container">
        <div className="text-center mb-4">
          <h2>FIM 평가</h2>
          <p className="mb-4">
            Functional Independence Measure<br/>
            기능적 독립성을 평가하는 가장 널리 사용되는 도구입니다.
          </p>
        </div>
      </div>
      <FIMAssessment />
    </div>
  )
}

export default FIMPage
