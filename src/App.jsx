import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import LandingPage from './pages/LandingPage'
import PhysicalFunctionPage from './pages/PhysicalFunctionPage'
import ActivityParticipationPage from './pages/ActivityParticipationPage'
import CognitiveAssessmentPage from './pages/CognitiveAssessmentPage'
import MMSEKPage from './pages/MMSEKPage'
import MMSEDSPage from './pages/MMSEDSPage'
import WHODASPage from './pages/WHODASPage'
import COPMPage from './pages/COPMPage'
import KMBIPage from './pages/KMBIPage'
import KIADLPage from './pages/KIADLPage'
import MOCAPage from './pages/MOCAPage'
import FIMPage from './pages/FIMPage'
import CDTPage from './pages/CDTPage'
import SMSPage from './pages/SMSPage'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/physical-function" element={<PhysicalFunctionPage />} />
          <Route path="/activity-participation" element={<ActivityParticipationPage />} />
          <Route path="/cognitive-assessment" element={<CognitiveAssessmentPage />} />
          <Route path="/mmse-k" element={<MMSEKPage />} />
          <Route path="/mmse-ds" element={<MMSEDSPage />} />
          <Route path="/whodas" element={<WHODASPage />} />
          <Route path="/copm" element={<COPMPage />} />
          <Route path="/k-mbi" element={<KMBIPage />} />
          <Route path="/k-iadl" element={<KIADLPage />} />
          <Route path="/moca" element={<MOCAPage />} />
          <Route path="/fim" element={<FIMPage />} />
          <Route path="/cdt" element={<CDTPage />} />
          <Route path="/sms" element={<SMSPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
