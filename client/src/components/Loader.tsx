import React from 'react';

export function Loader() {
  return (
    <div className="bg-loader">
      <div className="spinner-border text-light mt-loader" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
