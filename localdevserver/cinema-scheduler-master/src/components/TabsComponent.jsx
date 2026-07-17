const TabsComponent = ({ tabs, activeTab, onTabChange, isLoading }) => {
  return (
    <div className="tabs" data-testid="tabs-container">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          disabled={isLoading}
          data-testid={`tab-${tab.id}`}
        >
          {isLoading && activeTab !== tab.id ? 'Loading...' : tab.label}
        </button>
      ))}
      {isLoading && <div data-testid="tab-loading">Switching tabs...</div>}
    </div>
  );
};

export default TabsComponent;
