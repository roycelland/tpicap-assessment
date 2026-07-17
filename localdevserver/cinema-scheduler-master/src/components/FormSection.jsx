import { useState } from 'react';

const FormSection = ({ onTabChange }) => {
  const [formData, setFormData] = useState({
    movieTitle: '',
    theater: '',
    showDate: '',
    showTime: '',
    endDate: '',
    ticketPrice: '',
    discountPrice: '',
    seniorDiscountPrice: '',
    subtitles: false,
    imax: false,
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [showMovieDropdown, setShowMovieDropdown] = useState(false);

  const movieOptions = ['Avatar 3', 'Spider-Man 4', 'The Batman 2', 'Avengers 5', 'Star Wars IX', 'Jurassic World 4', 'Fast X 2', 'Mission Impossible 8', 'Top Gun 3'].sort((a, b) => {
    const aStartsWithT = a.toLowerCase().startsWith('t');
    const bStartsWithT = b.toLowerCase().startsWith('t');
    if (aStartsWithT && !bStartsWithT) return 1;
    if (!aStartsWithT && bStartsWithT) return -1;
    if (a === 'The Batman 2' && b === 'Top Gun 3') return 1;
    if (a === 'Top Gun 3' && b === 'The Batman 2') return -1;
    return a.localeCompare(b);
  });
  const theaterOptions = ['Theater 1', 'Theater 2', 'Theater 3', 'Theater 4', 'IMAX Theater', 'VIP Theater'];
  
  const filteredMovies = movieOptions.filter(movie => 
    movie.toLowerCase().includes(formData.movieTitle.toLowerCase())
  );

  const handleMovieSelect = (movie) => {
    setFormData(prev => ({ ...prev, movieTitle: movie }));
    setShowMovieDropdown(false);
    if (errors.movieTitle) {
      setErrors(prev => ({ ...prev, movieTitle: '' }));
    }
  };

  const isWeekday = (date) => {
    if (!date) return false;
    const parts = date.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const dateObj = new Date(`${year}-${month}-${day}`);
      if (isNaN(dateObj.getTime())) return false;
      const dayOfWeek = dateObj.getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6;
    }
    return false;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.movieTitle) newErrors.movieTitle = 'Movie Title is required';
    if (!formData.theater) newErrors.theater = 'Theater is required';
    if (!formData.showDate) {
      newErrors.showDate = 'Show Date is required';
    } else {
      const parts = formData.showDate.split('/');
      if (parts.length !== 3) {
        newErrors.showDate = 'Date must be in dd/mm/yyyy format';
      } else {
        const [day, month, year] = parts;
        const showDateObj = new Date(`${year}-${month}-${day}`);
        if (isNaN(showDateObj.getTime())) {
          newErrors.showDate = 'Invalid date';
        } else if (!isWeekday(formData.showDate)) {
          newErrors.showDate = 'Show Date must be a weekday';
        } else if (formData.endDate && showDateObj > new Date(formData.endDate)) {
          newErrors.showDate = 'Show Date cannot be after End Date';
        }
      }
    }
    if (!formData.showTime) {
      newErrors.showTime = 'Show Time is required';
    } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.showTime)) {
      newErrors.showTime = 'Show Time must be in HH:MM format (24-hour)';
    }
    if (!formData.ticketPrice) {
      newErrors.ticketPrice = 'Ticket Price is required';
    } else if (isNaN(formData.ticketPrice) || parseFloat(formData.ticketPrice) <= 0) {
      newErrors.ticketPrice = 'Ticket Price must be a valid positive number';
    }

    if (formData.theater && formData.movieTitle && formData.showDate && formData.showTime) {
      const existingShows = JSON.parse(localStorage.getItem('cinemaShows') || '[]');
      const isDuplicate = existingShows.some(show => 
        show.theater === formData.theater &&
        show.movieTitle === formData.movieTitle &&
        show.showDate === formData.showDate &&
        show.showTime === formData.showTime
      );
      
      if (isDuplicate) {
        setErrorBanner('This combination of theater, movie, date, and time already exists');
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0 && !errorBanner) {
      return true;
    }
    return false;
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrorBanner('');
    if (validateForm()) {
      const basePrice = parseFloat(formData.ticketPrice);
      const discountPrice = (basePrice * 0.7).toFixed(2);
      const seniorDiscountPrice = (basePrice * 0.4).toFixed(2);
      const parts = formData.showDate.split('/');
      if (parts.length !== 3) {
        return;
      }
      const [day, month, year] = parts;
      const showDateObj = new Date(`${year}-${month}-${day}`);
      if (isNaN(showDateObj.getTime())) {
        return;
      }
      const endDateObj = new Date(showDateObj);
      endDateObj.setDate(endDateObj.getDate() + 7);
      const endDate = endDateObj.toISOString().split('T')[0];
      
      const updatedFormData = {
        ...formData,
        discountPrice,
        seniorDiscountPrice,
        endDate
      };
      
      setFormData(updatedFormData);
      
      const savedShows = JSON.parse(localStorage.getItem('cinemaShows') || '[]');
      const showId = savedShows.length + 1;
      savedShows.push({
        showId: showId,
        showDate: updatedFormData.showDate,
        showTime: updatedFormData.showTime,
        movieTitle: updatedFormData.movieTitle,
        theater: updatedFormData.theater,
        subtitles: updatedFormData.subtitles,
        imax: updatedFormData.imax,
        notes: updatedFormData.notes,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('cinemaShows', JSON.stringify(savedShows));

      setSubmitted(true);
    }
  };

  const resetForm = () => {
    setFormData({
      movieTitle: '',
      theater: '',
      showDate: '',
      showTime: '',
      endDate: '',
      ticketPrice: '',
      discountPrice: '',
      seniorDiscountPrice: '',
      subtitles: false,
      imax: false,
      notes: ''
    });
    setErrors({});
    setSubmitted(false);
    setShowMovieDropdown(false);
    setErrorBanner('');
  };

  return (
    <div className="form-section" data-testid="form-section">
      <h3>Cinema Scheduler</h3>
      
      <form onSubmit={handleSave} data-testid="cinema-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="movieTitle">Movie Title *</label>
            <div style={{ position: 'relative' }} data-testid="movieTitle-typeahead">
              <input
                type="text"
                id="movieTitle"
                name="movieTitle"
                value={formData.movieTitle}
                onChange={handleInputChange}
                onFocus={() => setShowMovieDropdown(true)}
                placeholder="Type to search movies..."
                data-testid="movieTitle-input"
                autoComplete="off"
                style={errors.movieTitle ? { borderColor: '#dc3545', borderWidth: '2px' } : {}}
              />
              {showMovieDropdown && filteredMovies.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderTop: 'none',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  zIndex: 1000
                }} data-testid="movieTitle-dropdown">
                  {filteredMovies.map(movie => (
                    <div
                      key={movie}
                      onClick={() => handleMovieSelect(movie)}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      data-testid={`movieTitle-option-${movie.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {movie}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.movieTitle && <div className="error" data-testid="movieTitle-error">{errors.movieTitle}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="theater">Theater *</label>
            <select
              id="theater"
              name="theater"
              value={formData.theater}
              onChange={handleInputChange}
              data-testid="theater-select"
              autoComplete="off"
              style={errors.theater ? { borderColor: '#dc3545', borderWidth: '2px' } : {}}
            >
              <option value="">Select Theater</option>
              {theaterOptions.map(theater => (
                <option key={theater} value={theater}>{theater}</option>
              ))}
            </select>
            {errors.theater && <div className="error" data-testid="theater-error">{errors.theater}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="showDate">Show Date *</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                id="showDate"
                name="showDate"
                value={formData.showDate}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                maxLength="10"
                data-testid="showDate-input"
                title="Format: dd/mm/yyyy"
                autoComplete="off"
                style={{
                  ...errors.showDate ? { borderColor: '#dc3545', borderWidth: '2px' } : {},
                  paddingRight: '40px'
                }}
              />
              <input
                type="date"
                style={{
                  position: 'absolute',
                  right: '10px',
                  width: '20px',
                  height: '20px',
                  opacity: 0,
                  cursor: 'pointer'
                }}
                onChange={(e) => {
                  if (e.target.value) {
                    try {
                      const date = new Date(e.target.value + 'T00:00:00');
                      if (!isNaN(date.getTime())) {
                        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                        setFormData(prev => ({ ...prev, showDate: formattedDate }));
                      }
                    } catch (error) {
                      // Invalid date selected
                    }
                  }
                }}
              />
              <span style={{
                position: 'absolute',
                right: '10px',
                fontSize: '16px',
                color: '#666',
                pointerEvents: 'none'
              }}>📅</span>
            </div>
            {errors.showDate && <div className="error" data-testid="showDate-error">{errors.showDate}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="showTime">Show Time *</label>
            <input
              type="text"
              id="showTime"
              name="showTime"
              value={formData.showTime}
              onChange={handleInputChange}
              placeholder="HH:MM (24-hour format)"
              maxLength="5"
              data-testid="showTime-input"
              autoComplete="off"
              style={errors.showTime ? { borderColor: '#dc3545', borderWidth: '2px' } : {}}
            />
            {errors.showTime && <div className="error" data-testid="showTime-error">{errors.showTime}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="text"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              readOnly
              data-testid="endDate-input"
              title="End Date (calculated)"
              style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ticketPrice">Ticket Price *</label>
            <input
              type="number"
              id="ticketPrice"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleInputChange}
              placeholder="Enter ticket price"
              step="0.01"
              min="0"
              data-testid="ticketPrice-input"
              autoComplete="off"
              style={errors.ticketPrice ? { borderColor: '#dc3545', borderWidth: '2px' } : {}}
            />
            {errors.ticketPrice && <div className="error" data-testid="ticketPrice-error">{errors.ticketPrice}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="discountPrice">Student Discount Price</label>
            <input
              type="number"
              id="discountPrice"
              name="discountPrice"
              value={formData.discountPrice}
              readOnly
              data-testid="discountPrice-input"
              style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="seniorDiscountPrice">Senior Discount Price</label>
            <input
              type="number"
              id="seniorDiscountPrice"
              name="seniorDiscountPrice"
              value={formData.seniorDiscountPrice}
              readOnly
              data-testid="seniorDiscountPrice-input"
              style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="subtitles"
                name="subtitles"
                checked={formData.subtitles}
                onChange={handleInputChange}
                data-subtitles={formData.subtitles}
              />
              <label htmlFor="subtitles">Subtitles</label>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="imax"
                name="imax"
                checked={formData.imax}
                onChange={handleInputChange}
                data-imax={formData.imax}
              />
              <label htmlFor="imax">IMAX</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            maxLength="50"
            rows="3"
            placeholder="Enter notes (max 50 characters)"
            data-testid="notes-input"
            autoComplete="off"
          />
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
            {formData.notes.length}/50 characters
          </div>
        </div>

        <div className="form-row">
          <button 
            type="submit" 
            className="btn btn-primary"
            data-testid="save-button"
          >
            Save
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={resetForm}
            data-testid="reset-button"
          >
            Reset
          </button>
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={() => onTabChange('runlist')}
          >
            Back
          </button>
        </div>

        {submitted && (
          <div 
            className="success-banner" 
            data-testid="success-banner"
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: '#28a745',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '4px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            <button
              onClick={() => setSubmitted(false)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '8px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '0',
                lineHeight: '1'
              }}
              title="Close"
            >
              ×
            </button>
            ✓ Cinema show saved successfully!
          </div>
        )}

        {errorBanner && (
          <div 
            className="error-banner" 
            data-testid="error-banner"
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: '#dc3545',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '4px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            <button
              onClick={() => setErrorBanner('')}
              style={{
                position: 'absolute',
                top: '5px',
                right: '8px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '0',
                lineHeight: '1'
              }}
              title="Close"
            >
              ×
            </button>
            ✗ {errorBanner}
          </div>
        )}
      </form>
    </div>
  );
};

export default FormSection;
