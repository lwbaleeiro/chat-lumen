import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [conversations, setConversations] = useState([]);
  const [folders, setFolders] = useState([]); // Estado para pastas
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const createNewChat = () => {
    const newId = Date.now();
    setConversations([{ id: newId, title: 'New Chat', messages: [] }, ...conversations]);
    setCurrentConversationId(newId);
  };

  const handleSendMessage = (message) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [
          ...conv.messages,
          { user: 'You', message },
          { user: 'AI', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
        ];
        return { ...conv, messages: updatedMessages, title: message.slice(0, 30) + '...' };
      }
      return conv;
    });
    setConversations(updatedConversations);
  };

  const selectConversation = (id) => {
    setCurrentConversationId(id);
  };

  const deleteConversation = (id) => {
    setConversations(conversations.filter(conv => conv.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null); // Reseta a conversa atual se excluída
    }
  };

  const pinConversation = (id) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    const pinnedConversation = conversations.find(conv => conv.id === id);
    setConversations([pinnedConversation, ...updatedConversations]);
  };

  const createFolder = (name) => {
    const newFolder = { id: Date.now(), name, chats: [], isOpen: false };
    setFolders([...folders, newFolder]);
  };

  const deleteFolder = (id) => {
    setFolders(folders.filter(folder => folder.id !== id));
  };

  const editFolderName = (id, newName) => {
    setFolders(folders.map(folder => folder.id === id ? { ...folder, name: newName } : folder));
  };

  const moveToFolder = (conversationId, folderId) => {
    // Remove a conversa do estado de conversas
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
  
    // Adiciona a conversa à pasta correspondente
    const updatedFolders = folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, chats: [...folder.chats, conversationId] };
      }
      return folder;
    });
  
    setConversations(updatedConversations);
    setFolders(updatedFolders);
  };

  const toggleFolderVisibility = (folderId) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, isOpen: !folder.isOpen }; // Alterna a visibilidade da pasta
      }
      return folder;
    }));
  };

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);

  return (
    <div className="app">
      <Sidebar 
        conversations={conversations} 
        folders={folders}
        onNewChat={createNewChat}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onPinConversation={pinConversation}
        onCreateFolder={createFolder}
        onDeleteFolder={deleteFolder}
        onEditFolderName={editFolderName}
        onMoveToFolder={moveToFolder}
        onToggleFolderVisibility={toggleFolderVisibility}
        currentConversationId={currentConversationId}
      />
      <div className="main-content">
        <Header />
        {currentConversationId ? (
          <ChatArea 
            conversation={currentConversation.messages} 
            onSendMessage={handleSendMessage}
          />
        ) : (
          <WelcomeScreen />
        )}
      </div>
    </div>
  );
}

export default App;