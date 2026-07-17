import { useState } from 'react';
import TabsComponent from './TabsComponent';
import CinemaList from './CinemaList';
import FormSection from './FormSection';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('runlist');
  const [isTabLoading, setIsTabLoading] = useState(false);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'runlist', label: 'Cinema List' },
    { id: 'forms', label: 'Details' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'runlist':
        return <CinemaList onTabChange={handleTabChange} user={user} />;
      case 'forms':
        return <FormSection onTabChange={handleTabChange} />;
      default:
        return <CinemaList />;
    }
  };

  return (
    <div className="dashboard" data-testid="dashboard">
      <div className="header">
        <h1>Welcome, {user.username}!</h1>
        <button 
          className="btn btn-primary" 
          onClick={onLogout}
          data-testid="logout-button"
        >
          Logout
        </button>
      </div>

      <TabsComponent 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isLoading={isTabLoading}
      />

      <div className="tab-content">
        {isTabLoading ? (
          <div data-testid="tab-content-loading">Loading tab content...</div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default Dashboard;
