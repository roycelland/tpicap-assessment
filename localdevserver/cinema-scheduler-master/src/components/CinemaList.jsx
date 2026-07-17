import { useState, useEffect, useMemo } from 'react';

const CinemaList = ({ onTabChange, user }) => {
  const [runs, setRuns] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const savedShows = localStorage.getItem('cinemaShows');
    if (savedShows) {
      setRuns(JSON.parse(savedShows));
    }
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(runs.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const pageRuns = runs.slice(startIndex, endIndex);

  const currentRuns = useMemo(() => {
    if (!sortConfig.key) return pageRuns;
    
    return [...pageRuns].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'showId') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (sortConfig.key === 'showDate') {
        const convertDate = (dateStr) => {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month}-${day}`);
          }
          return new Date(dateStr);
        };
        const aDate = convertDate(aValue);
        const bDate = convertDate(bValue);
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (typeof aValue === 'boolean') {
        return sortConfig.direction === 'asc' ? 
          (aValue === bValue ? 0 : aValue ? 1 : -1) : 
          (aValue === bValue ? 0 : aValue ? -1 : 1);
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [pageRuns, sortConfig]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const handleExport = () => {
    if (runs.length === 0) return;
    
    const headers = ['Schedule ID', 'Movie Title', 'Theater', 'Show Date', 'Show Time', 'Subtitles', 'IMAX', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...runs.map(show => [
        show.showId,
        show.movieTitle,
        show.theater,
        show.showDate,
        show.showTime || '',
        show.subtitles ? 'Y' : 'N',
        show.imax ? 'Y' : 'N',
        show.notes || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cinemalist.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all cinema shows? This action cannot be undone.')) {
      localStorage.removeItem('cinemaShows');
      setRuns([]);
      setCurrentPage(1);
    }
  };

  return (
    <div className="form-section" data-section="run-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Cinema List</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${runs.length === 0 ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleExport}
            disabled={runs.length === 0}
            style={{
              cursor: runs.length === 0 ? 'not-allowed' : 'pointer',
              opacity: runs.length === 0 ? 0.6 : 1
            }}
          >
            Export
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleClearAll}
            disabled={runs.length === 0}
            data-testid="clear-all-button"
          >
            Clear All
          </button>
          <button 
            className="btn btn-success"
            onClick={() => onTabChange('forms')}
          >
            New Show
          </button>
        </div>
      </div>
      
      {runs.length === 0 ? (
        <div data-message="no-runs">
          <p>No cinema shows scheduled yet. Create a new show in the "Details" tab.</p>
        </div>
      ) : (
        <div data-table="runs">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th 
                  style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('showId')}
                  data-sort-column="showId"
                  data-sort-direction={sortConfig.key === 'showId' ? sortConfig.direction : 'none'}
                >
                  Schedule ID{getSortIcon('showId')}
                </th>
                <th 
                  style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('movieTitle')}
                  data-sort-column="movieTitle"
                  data-sort-direction={sortConfig.key === 'movieTitle' ? sortConfig.direction : 'none'}
                >
                  Movie Title{getSortIcon('movieTitle')}
                </th>
                <th 
                  style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('theater')}
                  data-sort-column="theater"
                  data-sort-direction={sortConfig.key === 'theater' ? sortConfig.direction : 'none'}
                >
                  Theater{getSortIcon('theater')}
                </th>
                <th 
                  style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('showDate')}
                  data-sort-column="showDate"
                  data-sort-direction={sortConfig.key === 'showDate' ? sortConfig.direction : 'none'}
                >
                  Show Date{getSortIcon('showDate')}
                </th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
                  Show Time
                </th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
                  Subtitles
                </th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
                  IMAX
                </th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRuns.map((show, index) => (
                <tr key={index} data-show-id={show.showId} data-show-date={show.showDate}>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }} data-value={show.showId}>
                    {show.showId}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }} data-value={show.movieTitle}>
                    {show.movieTitle}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }} data-value={show.theater}>
                    {show.theater}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }} data-value={show.showDate}>
                    {show.showDate}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }} data-value={show.showTime}>
                    {show.showTime || '-'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }} data-value={show.subtitles ? 'Y' : 'N'}>
                    {show.subtitles ? 'Y' : 'N'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }} data-value={show.imax ? 'Y' : 'N'}>
                    {show.imax ? 'Y' : 'N'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }} data-value={show.notes || '-'}>
                    {show.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} data-pagination="controls">
              <button 
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                data-page-action="previous"
                style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handlePageChange(page)}
                  data-page-number={page}
                  data-page-active={currentPage === page}
                  style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', minWidth: '2rem' }}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                data-page-action="next"
                style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
              >
                Next
              </button>
              
              <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#666' }}>
                Page {currentPage} of {totalPages} ({runs.length} total records)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CinemaList;
