import React from 'react';

function ModelSelector({ selectedModel, setSelectedModel }) {
  const models = ['ChatGPT', 'Claude 3.5 Sonnet', 'Gemini'];

  return (
    <div className="selector">
      <select 
        value={selectedModel} 
        onChange={(e) => setSelectedModel(e.target.value)}
        className="selector-input"
      >
        <option value="">AI Claude 3.5 Sonnet</option>
        {models.map(model => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>
      <i className="fas fa-chevron-down selector-icon"></i>
    </div>
  );
}

export default ModelSelector;