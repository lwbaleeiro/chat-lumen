import React from 'react';
import ModelSelector from './ModelSelector';
import PromptSelector from './PromptSelector';

function Header() {
  return (
    <header className="app-header">
      <div className="header-controls">
        <PromptSelector />
        <ModelSelector />
      </div>
      <div className="header-actions">
        <button className="icon-button">
          <i className="fas fa-code"></i> Developer
        </button>
      </div>
    </header>
  );
}

export default Header;