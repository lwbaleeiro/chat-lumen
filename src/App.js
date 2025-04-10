import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [conversations, setConversations] = useState([]);
  const [folders, setFolders] = useState([]);
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
          { user: 'AI', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
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
    setFolders(folders.map(folder => ({
      ...folder,
      chats: folder.chats.filter(chatId => chatId !== id)
    })));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const pinConversation = (id) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    const pinnedConversation = conversations.find(conv => conv.id === id);
    setConversations([pinnedConversation, ...updatedConversations]);
  };

  const editConversation = (id, newTitle) => {
    const updatedConversations = conversations.map(conv => 
      conv.id === id ? { ...conv, title: newTitle } : conv
    );
    setConversations(updatedConversations);
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
    setFolders(prevFolders => {
      const newFolders = prevFolders.map(folder => {
        // Remove o chat de qualquer pasta existente
        if (folder.chats.includes(conversationId)) {
          return { ...folder, chats: folder.chats.filter(id => id !== conversationId) };
        }
        // Adiciona à nova pasta, se folderId não for null
        if (folder.id === folderId) {
          return { ...folder, chats: [...folder.chats, conversationId] };
        }
        return folder;
      });
      return newFolders;
    });
  };

  const toggleFolderVisibility = (folderId) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, isOpen: !folder.isOpen };
      }
      return folder;
    }));
  };

  const reorderConversations = (newOrder) => {
    // Reordena apenas as conversas "soltas"
    const unsorted = conversations.filter(conv => 
      !folders.some(folder => folder.chats.includes(conv.id))
    );
    const reordered = newOrder.map(id => unsorted.find(conv => conv.id === id));
    const sorted = conversations.filter(conv => 
      folders.some(folder => folder.chats.includes(conv.id))
    );
    setConversations([...reordered, ...sorted]);
  };

  const reorderFolders = (newFoldersOrder) => {
    const reordered = newFoldersOrder.map(id => folders.find(folder => folder.id === id));
    setFolders(reordered);
  };

  const reorderFolderChats = (folderId, newChatOrder) => {
    setFolders(folders.map(folder => 
      folder.id === folderId ? { ...folder, chats: newChatOrder } : folder
    ));
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
        onEditConversation={editConversation}
        onMoveToFolder={moveToFolder}
        onToggleFolderVisibility={toggleFolderVisibility}
        onReorderConversations={reorderConversations}
        onReorderFolders={reorderFolders}
        onReorderFolderChats={reorderFolderChats}
        currentConversationId={currentConversationId}
      />
      <div className="main-content">
        <Header />
        {currentConversationId && currentConversation ? (
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