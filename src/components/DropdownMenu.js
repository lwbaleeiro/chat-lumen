import React, { useState } from 'react';

const DropdownMenu = ({ onEdit, onDelete, onPin }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown-menu-container">
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          setOpen(!open); 
        }} 
        className="dropdown-toggle"
      >
        <i className="fas fa-ellipsis-h"></i>
      </button>
      {open && (
        <div className="dropdown-menu">
          <button onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}>
            Editar
          </button>
          <button onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }}>
            Deletar
          </button>
          <button onClick={(e) => { e.stopPropagation(); setOpen(false); onPin(); }}>
            Fixar
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
