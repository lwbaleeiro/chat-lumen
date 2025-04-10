import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DropdownMenu from './DropdownMenu';
import './Sidebar.css';

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
  onEditConversation,
  onMoveToFolder, 
  onToggleFolderVisibility, 
  currentConversationId,
  onReorderConversations,
  onReorderFolders,
  onReorderFolderChats
}) {
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editChatTitle, setEditChatTitle] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const unsortedConversations = conversations.filter(conv => 
    !folders.some(folder => folder.chats.includes(conv.id))
  );

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleEditFolder = (folderId) => {
    if (editFolderName.trim()) {
      onEditFolderName(folderId, editFolderName);
      setEditingFolderId(null);
      setEditFolderName('');
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    if (!destination) return;

    console.log('Drag ended:', result);

    const conversationId = Number(draggableId.split("-")[1]);

    if (source.droppableId === "unsorted-conversations" && destination.droppableId.startsWith("folder-")) {
      const folderId = Number(destination.droppableId.split("-")[1]);
      onMoveToFolder(conversationId, folderId);
    } 
    else if (source.droppableId === "unsorted-conversations" && destination.droppableId === "unsorted-conversations") {
      const newConversations = Array.from(unsortedConversations);
      const [moved] = newConversations.splice(source.index, 1);
      newConversations.splice(destination.index, 0, moved);
      onReorderConversations(newConversations.map(conv => conv.id));
    } 
    else if (source.droppableId === "folders" && destination.droppableId === "folders") {
      const newFolders = Array.from(folders);
      const [movedFolder] = newFolders.splice(source.index, 1);
      newFolders.splice(destination.index, 0, movedFolder);
      onReorderFolders(newFolders.map(folder => folder.id));
    } 
    else if (source.droppableId.startsWith("folder-") && destination.droppableId.startsWith("folder-") && source.droppableId === destination.droppableId) {
      const folderId = Number(source.droppableId.split("-")[1]);
      const folder = folders.find(f => f.id === folderId);
      if (!folder) return;

      const newChatOrder = Array.from(folder.chats);
      const [movedChat] = newChatOrder.splice(source.index, 1);
      newChatOrder.splice(destination.index, 0, movedChat);
      
      onReorderFolderChats(folderId, newChatOrder);
    } 
    else if (source.droppableId.startsWith("folder-") && destination.droppableId === "unsorted-conversations") {
      onMoveToFolder(conversationId, null);
    } 
    else if (source.droppableId.startsWith("folder-") && destination.droppableId.startsWith("folder-") && source.droppableId !== destination.droppableId) {
      const destFolderId = Number(destination.droppableId.split("-")[1]);
      onMoveToFolder(conversationId, destFolderId);
    }
  };

  const handleItemClick = (conversationId, event) => {
    onSelectConversation(conversationId);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title" style={{ cursor: 'pointer' }}>
        <i className="fas fa-comments"></i> My Chats
      </h2>
      <button className="new-chat-button" onClick={onNewChat}>
        <i className="fas fa-plus"></i> New chat
      </button>

      <div className="folder-section">
        {isCreatingFolder ? (
          <div className="create-folder-form">
            <input 
              type="text" 
              value={newFolderName} 
              onChange={(e) => setNewFolderName(e.target.value)} 
              placeholder="Nome da Nova Pasta"
            />
            <div className="create-folder-buttons">
              <button onClick={handleCreateFolder}>Criar</button>
              <button onClick={() => setIsCreatingFolder(false)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <button className="create-folder-button" onClick={() => setIsCreatingFolder(true)}>
            <i className="fas fa-folder-plus"></i> Criar Nova Pasta
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="folders" type="folder">
          {(provided) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps} 
              className="folders-container"
            >
              {folders.map((folder, index) => (
                <Draggable draggableId={`folder-${folder.id}`} index={index} key={folder.id}>
                  {(provided) => (
                    <div 
                      className="folder-item" 
                      ref={provided.innerRef} 
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="folder-header">
                        <h3 onClick={() => onToggleFolderVisibility(folder.id)}>
                          {folder.name}
                        </h3>
                        <DropdownMenu 
                          onEdit={() => setEditingFolderId(folder.id)}
                          onDelete={() => onDeleteFolder(folder.id)}
                          onPin={() => {
                            onReorderFolders([folder.id, ...folders.filter(f => f.id !== folder.id).map(f => f.id)]);
                          }}
                        />
                      </div>
                      {editingFolderId === folder.id && (
                        <div>
                          <input 
                            type="text"
                            value={editFolderName}
                            onChange={(e) => setEditFolderName(e.target.value)}
                            placeholder="Edit Folder Name"
                          />
                          <button onClick={() => handleEditFolder(folder.id)}>Salvar</button>
                        </div>
                      )}
                      <Droppable droppableId={`folder-${folder.id}`} type="conversation">
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef} 
                            {...provided.droppableProps} 
                            className={`folder-drop-area ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                            style={{ minHeight: '10px' }}
                          >
                            {folder.isOpen && (
                              <ul className="folder-chats">
                                {folder.chats.map((chatId, idx) => {
                                  const chat = conversations.find(conv => conv.id === chatId);
                                  if (!chat) return null;
                                  return (
                                    <Draggable draggableId={`conv-${chat.id}`} index={idx} key={chat.id}>
                                      {(provided) => (
                                        <li 
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`conversation-item ${chat.id === currentConversationId ? 'active' : ''}`}
                                          onClick={(e) => handleItemClick(chat.id, e)}
                                        >
                                          {editingChatId === chat.id ? (
                                            <div onClick={(e) => e.stopPropagation()}>
                                              <input 
                                                type="text"
                                                value={editChatTitle}
                                                onChange={(e) => setEditChatTitle(e.target.value)}
                                              />
                                              <button onClick={() => {
                                                onEditConversation(chat.id, editChatTitle);
                                                setEditingChatId(null);
                                                setEditChatTitle('');
                                              }}>Salvar</button>
                                            </div>
                                          ) : (
                                            <>
                                              <span>{chat.title}</span>
                                              <div onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu 
                                                  onEdit={() => {
                                                    setEditingChatId(chat.id);
                                                    setEditChatTitle(chat.title);
                                                  }}
                                                  onDelete={() => onDeleteConversation(chat.id)}
                                                  onPin={() => onPinConversation(chat.id)}
                                                />
                                              </div>
                                            </>
                                          )}
                                        </li>
                                      )}
                                    </Draggable>
                                  );
                                })}
                              </ul>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="unsorted-conversations" type="conversation">
          {(provided, snapshot) => (
            <div className="unsorted-container">
              <h3>------------------------</h3>
              <ul 
                className={`conversation-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                ref={provided.innerRef} 
                {...provided.droppableProps}
              >
                {unsortedConversations.map((conv, index) => (
                  <Draggable draggableId={`conv-${conv.id}`} index={index} key={conv.id}>
                    {(provided) => (
                      <li 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
                        onClick={(e) => handleItemClick(conv.id, e)}
                      >
                        {editingChatId === conv.id ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="text"
                              value={editChatTitle}
                              onChange={(e) => setEditChatTitle(e.target.value)}
                            />
                            <button onClick={() => {
                              onEditConversation(conv.id, editChatTitle);
                              setEditingChatId(null);
                              setEditChatTitle('');
                            }}>Salvar</button>
                          </div>
                        ) : (
                          <>
                            <span>{conv.title}</span>
                            <div onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu 
                                onEdit={() => {
                                  setEditingChatId(conv.id);
                                  setEditChatTitle(conv.title);
                                }}
                                onDelete={() => onDeleteConversation(conv.id)}
                                onPin={() => onPinConversation(conv.id)}
                              />
                            </div>
                          </>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

Sidebar.defaultProps = {
  onEditConversation: () => {},
};

export default Sidebar;