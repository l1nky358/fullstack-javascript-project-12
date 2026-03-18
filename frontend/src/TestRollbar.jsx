import { useRollbar } from './rollbar';

const TestRollbar = () => {
  const rollbar = useRollbar();

  const handleTestInfo = () => {
    rollbar?.info('Test info message', { test: true });
    alert('Info sent to Rollbar');
  };

  const handleTestWarning = () => {
    rollbar?.warning('Test warning message', { test: true });
    alert('Warning sent to Rollbar');
  };

  const handleTestError = () => {
    try {
      throw new Error('Test error');
    } catch (error) {
      rollbar?.error('Test error caught', error);
      alert('Error sent to Rollbar');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Rollbar Test Page</h2>
      <div className="d-flex gap-3 mt-4">
        <button className="btn btn-info" onClick={handleTestInfo}>
          Send Info
        </button>
        <button className="btn btn-warning" onClick={handleTestWarning}>
          Send Warning
        </button>
        <button className="btn btn-danger" onClick={handleTestError}>
          Send Error
        </button>
      </div>
    </div>
  );
};

export default TestRollbar;