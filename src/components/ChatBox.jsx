import { useState, useRef, useEffect } from 'react';
import { askCountryQuestion } from '../services/gemini';

function ChatBox({ countryData }) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: `Hello! I'm your AI assistant. Ask me anything about ${countryData.name.common}!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = { type: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await askCountryQuestion(countryData, input.trim());
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Sorry, I had trouble processing your request. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-[400px] sm:h-[500px] flex flex-col w-full overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary-600 text-white px-4 py-3 rounded-t-lg">
        <h3 className="font-medium text-sm sm:text-base">Ask about {countryData.name.common}</h3>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 ${
              message.type === 'user' ? 'flex justify-end' : 'flex justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-2 sm:p-3 rounded-lg text-sm sm:text-base ${
                message.type === 'user'
                  ? 'bg-primary-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="break-words">{message.text}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="max-w-[75%] p-2 sm:p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <div className="border-t p-2 sm:p-4">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`w-full md:w-auto px-4 py-2 bg-primary-500 text-white rounded-lg ${
              loading || !input.trim() 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-primary-600'
            }`}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;