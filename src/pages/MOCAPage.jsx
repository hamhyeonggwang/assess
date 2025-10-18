import React from 'react'
import MOCAAssessment from '../components/MOCAAssessment'

const MOCAPage = () => {
  return (
    <div>
      <div className="container">
        <div className="text-center mb-4">
          <h2>MoCA 평가</h2>
          <p className="mb-4">
            Montreal Cognitive Assessment<br/>
            경도인지장애 선별을 위한 종합적인 인지기능 평가 도구입니다.
          </p>
        </div>
      </div>
      <MOCAAssessment />
    </div>
  )
}

export default MOCAPage
