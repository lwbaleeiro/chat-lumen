import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DropdownMenu from './DropdownMenu';

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

  const unsortedConversations = conversations.filter(conv => 
    !folders.some(folder => folder.chats.includes(conv.id))
  );

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

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    console.log('Drag ended:', result);  // Log para depuração

    if (source.droppableId === "unsorted-conversations" && destination.droppableId.startsWith("folder-")) {
      const folderId = Number(destination.droppableId.split("-")[1]);
      const conversationId = Number(draggableId.split("-")[1]);
      onMoveToFolder(conversationId, folderId);
    } else if (source.droppableId === "unsorted-conversations" && destination.droppableId === "unsorted-conversations") {
      const newConversations = Array.from(unsortedConversations);
      const [moved] = newConversations.splice(source.index, 1);
      newConversations.splice(destination.index, 0, moved);
      onReorderConversations(newConversations);
    } else if (source.droppableId === "folders" && destination.droppableId === "folders") {
      const newFolders = Array.from(folders);
      const [movedFolder] = newFolders.splice(source.index, 1);
      newFolders.splice(destination.index, 0, movedFolder);
      onReorderFolders(newFolders);
    } else if (source.droppableId.startsWith("folder-") && destination.droppableId.startsWith("folder-") && source.droppableId === destination.droppableId) {
      const folderId = Number(source.droppableId.split("-")[1]);
      const folder = folders.find(f => f.id === folderId);
      const newChatOrder = Array.from(folder.chats);
      const [movedChat] = newChatOrder.splice(source.index, 1);
      newChatOrder.splice(destination.index, 0, movedChat);
      if (onReorderFolderChats) {
        onReorderFolderChats(folderId, newChatOrder);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="sidebar">
        <h2 className="sidebar-title" style={{ cursor: 'pointer' }}>
          <i className="fas fa-comments"></i> My Chats
        </h2>
        <button className="new-chat-button" onClick={onNewChat}>
          <i className="fas fa-plus"></i> New chat
        </button>

        <div className="folder-section">
          <input 
            type="text" 
            value={newFolderName} 
            onChange={(e) => setNewFolderName(e.target.value)} 
            placeholder="New Folder Name"
          />
          <button onClick={handleCreateFolder}>Create Folder</button>
        </div>

        <Droppable droppableId="folders" type="folder">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
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
                            onReorderFolders([folder, ...folders.filter(f => f.id !== folder.id)]);
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
                      {folder.isOpen && (
                        <Droppable droppableId={`folder-${folder.id}`} type="conversation">
                          {(provided) => (
                            <ul ref={provided.innerRef} {...provided.droppableProps}>
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
                                        onClick={() => onSelectConversation(chat.id)}
                                      >
                                        {editingChatId === chat.id ? (
                                          <div>
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
                                            <DropdownMenu 
                                              onEdit={() => {
                                                setEditingChatId(chat.id);
                                                setEditChatTitle(chat.title);
                                              }}
                                              onDelete={() => onDeleteConversation(chat.id)}
                                              onPin={() => onPinConversation(chat.id)}
                                            />
                                          </>
                                        )}
                                      </li>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="unsorted-conversations" type="conversation">
          {(provided) => (
            <ul className="conversation-list" ref={provided.innerRef} {...provided.droppableProps}>
              {unsortedConversations.map((conv, index) => (
                <Draggable draggableId={`conv-${conv.id}`} index={index} key={conv.id}>
                  {(provided) => (
                    <li 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
                      onClick={() => onSelectConversation(conv.id)}
                    >
                      {editingChatId === conv.id ? (
                        <div>
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
                          <DropdownMenu 
                            onEdit={() => {
                              setEditingChatId(conv.id);
                              setEditChatTitle(conv.title);
                            }}
                            onDelete={() => onDeleteConversation(conv.id)}
                            onPin={() => onPinConversation(conv.id)}
                          />
                        </>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}

Sidebar.defaultProps = {
  onEditConversation: () => {},
};

export default Sidebar;