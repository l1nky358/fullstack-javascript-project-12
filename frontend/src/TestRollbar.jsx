import React from 'react';
import { useRollbar } from '@rollbar/react';

function TestRollbar() {
  const rollbar = useRollbar();

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body text-center">
          <h3>Rollbar Test</h3>
          <div className="mt-4">
            <button 
              className="btn btn-info me-2"
              onClick={() => rollbar.info('Test message from React')}
            >
              Send Test Message
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => {
                throw new Error('Test error from React ErrorBoundary');
              }}
            >
              Trigger Test Error
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestRollbar;