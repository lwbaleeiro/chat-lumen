import React, { useState, useRef, useEffect } from 'react';
import './ChatArea.css'; // Certifique-se de importar um arquivo CSS se precisar de estilos adicionais

function ChatArea({ conversation, onSendMessage }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null); // Referência para o textarea

  useEffect(() => {
    // Ajusta a altura do textarea sempre que a mensagem mudar
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reseta a altura
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`; // Ajusta a altura
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage(''); // Limpa a mensagem
    }
  };

  const handleKeyDown = (e) => {
    // Verifica se a tecla Enter foi pressionada sem SHIFT
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Impede a quebra de linha padrão
      handleSubmit(e); // Envia a mensagem
    }
  };

  return (
    <div className="chat-area">
      <div className="messages">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.user.toLowerCase()}`}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <textarea
          ref={textareaRef} // Atribui a referência ao textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Adiciona o evento keyDown
          placeholder="Type your message..."
          className="message-input"
          rows={1} // Define o número inicial de linhas
          style={{ maxHeight: '100px' }} // Define a altura máxima do textarea
        />
        <button type="submit" className="send-button">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default ChatArea;