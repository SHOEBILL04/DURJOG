import React from 'react';
import EmergencyForm from '../Components/EmergencyForm/EmergencyForm';
import './ReportPage.css';

const ReportPage = () => {
  const handleReportSubmit = (emergency) => {
    console.log('New emergency reported:', emergency);
    // You could redirect to the map page or show a success message
  };

  return (
    <div className="report-page">
      <div className="report-container">
        <h1>Report an Emergency</h1>
        <p className="page-description">
          Use this form to report emergencies like floods, earthquakes, medical emergencies, 
          or requests for blood donations. Your report will be visible on the map to help others.
        </p>
        <EmergencyForm onReportSubmit={handleReportSubmit} />
      </div>
    </div>
  );
};

export default ReportPage;