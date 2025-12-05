import React, { useState, useEffect } from 'react';
import './Loader.css';

const WineGlassLoader = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('ღვინის მომზადება...');

  const messages = [
    'Crafting the wineა...',
    'Quality in progress...',
    'Almost ready...'
  ];

  const intervalTime = 40;
  const totalDurationSeconds = 2.5;

  useEffect(() => {
    const totalSteps = (totalDurationSeconds * 1000) / intervalTime;
    const progressPerStep = 100 / totalSteps;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setLoadingText('მზადაა!');
          clearInterval(interval);
          return 100;
        }
        
        const newProgress = prev + progressPerStep; 
        
        const segmentSize = 100 / messages.length;
        const messageIndex = Math.floor(newProgress / segmentSize); 
        
        if (messageIndex < messages.length) {
          setLoadingText(messages[messageIndex]);
        }
        
        return Math.min(newProgress, 100);
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [intervalTime, totalDurationSeconds, messages.length]);

  return (
    <div className="loader-container">
      {/* <h1 className="brand-title"> DOOD'S WINE</h1> */}

      <div className="wine-glass-wrapper">
        <div className="wine-glass-body">
          <div 
            className="wine-fill"
            style={{ '--wine-progress': `${progress}%` }}
          >
            <div className="wine-liquid-surface" />
            <div className="wine-reflection" />
          </div>

          {[...Array(6)].map((_, i) => (
            <div key={i} className="bubble" />
          ))}
        </div>

        {/* <div className="wine-glass-top-ring" /> */}
        <div className="wine-glass-stem" />
        <div className="wine-glass-base" />
      </div>

      <div className="loader-progress-text">
        {Math.round(progress)}%
      </div>

      <p className="loader-status-text">
        {loadingText}
      </p>
    </div>
  );
};

export default WineGlassLoader;