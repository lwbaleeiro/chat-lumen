import React from 'react';
import './Selector.css';

function PromptSelector({ selectedPrompt, setSelectedPrompt }) {
  const prompts = ['Default', 'Coding', 'Creative', 'Analysis'];

  return (
    <div className="selector">
      <select 
        value={selectedPrompt} 
        onChange={(e) => setSelectedPrompt(e.target.value)}
        className="selector-input"
      >
        <option value="">Prompts</option>
        {prompts.map(prompt => (
          <option key={prompt} value={prompt}>{prompt}</option>
        ))}
      </select>
      <i className="fas fa-chevron-down selector-icon"></i>
    </div>
  );
}

export default PromptSelector;