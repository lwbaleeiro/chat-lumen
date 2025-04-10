import React, { useState } from 'react';

function Sidebar({ 
  conversations, 
  folders, 
  onNewChat, 
  onSelectConversation, 
  onDeleteConversation, 
  onPinConversation, 
  onCreateFolder, 
  onDeleteFolder, 
  onEditFolderName, 
  onMoveToFolder, 
  onToggleFolderVisibility, 
  currentConversationId 
}) {
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
    }
  };

  const handleEditFolder = (folderId) => {
    if (editFolderName.trim()) {
      onEditFolderName(folderId, editFolderName);
      setEditingFolderId(null);
      setEditFolderName('');
    }
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title" style={{ cursor: 'pointer' }}>
        <i className="fas fa-comments"></i> My Chats
      </h2>
      <button className="new-chat-button" onClick={onNewChat}>
        <i className="fas fa-plus"></i> New chat
      </button>

      {/* Seção de Pastas */}
      <div className="folder-section">
        <input 
          type="text" 
          value={newFolderName} 
          onChange={(e) => setNewFolderName(e.target.value)} 
          placeholder="New Folder Name"
        />
        <button onClick={handleCreateFolder}>Create Folder</button>
      </div>
      {folders.map((folder) => (
        <div key={folder.id}>
          <h3 onClick={() => onToggleFolderVisibility(folder.id)}>{folder.name}</h3>
          {folder.isOpen && (
            <ul>
              {folder.chats.map(chatId => {
                const chat = conversations.find(conv => conv.id === chatId);
                return (
                  <li key={chat.id}>
                    {chat.title}
                    <button onClick={() => onDeleteConversation(chat.id)}>Delete</button>
                    <button onClick={() => onPinConversation(chat.id)}>Pin</button>
                  </li>
                );
              })}
            </ul>
          )}
          {/* Se estamos editando a pasta, mostrará o campo de edição */}
          {editingFolderId === folder.id ? (
            <div>
              <input 
                type="text"
                value={editFolderName}
                onChange={(e) => setEditFolderName(e.target.value)}
                placeholder="Edit Folder Name"
              />
              <button onClick={() => handleEditFolder(folder.id)}>Save</button>
            </div>
          ) : (
            <button onClick={() => { setEditingFolderId(folder.id); setEditFolderName(folder.name); }}>Edit</button>
          )}
          <button onClick={() => onDeleteFolder(folder.id)}>Delete</button>
        </div>
      ))}

      {/* Seção de Conversas */}
      <ul className="conversation-list">
        {conversations.filter(conv => !folders.some(folder => folder.chats.includes(conv.id))).map((conv) => (
          <li 
            key={conv.id} 
            className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
            onClick={() => onSelectConversation(conv.id)}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", conv.id)}
          >
            {conv.title}
            <button onClick={() => onDeleteConversation(conv.id)}>Delete</button>
            <button onClick={() => onPinConversation(conv.id)}>Pin</button>
          </li>
        ))}
      </ul>

      {/* Área de Soltar para Pastas */}
      {folders.map((folder) => (
        <div 
          key={folder.id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const conversationId = e.dataTransfer.getData("text/plain");
            onMoveToFolder(conversationId, folder.id);
          }}
          style={{ padding: '10px', border: '1px dashed #ccc', margin: '10px 0' }}
        >
          Drop here to move to {folder.name}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;