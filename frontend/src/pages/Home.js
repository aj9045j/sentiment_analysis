import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="button-container">
      <button className="button" onClick={() => navigate('/amazon')}>Amazon Product</button>
      <button className="button" onClick={() => navigate('/election')}>Election</button>
      <button className="button" onClick={() => navigate('/movie')}>Movie</button>
      <button className="button" onClick={() => navigate('/twitter')}>Twitter</button>
    </div>
  );
}
