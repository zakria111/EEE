  // Initialize elements
  const chatContainer = document.getElementById('chatContainer');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const minimizeBtn = document.getElementById('minimizeBtn');
  const chatbox = document.getElementById('chatbox');

  // Set API key directly in the code - no user input needed
  const apiKey = 'AIzaSyC1L9vaJB85AY-14v_mAl-hptOE8dPczKQ';

  // Chat history to maintain context
  let chatHistory = [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
  ];

  // Fallback responses in case the API fails
  const fallbackResponses = [
      "I'm having trouble connecting to my knowledge base right now. Could you please try again?",
      "It seems there's a connection issue. Let me try to help with what I know locally.",
      "I apologize for the inconvenience. My API service seems to be unavailable at the moment.",
      "I'm experiencing some technical difficulties. Please try again in a moment.",
      "Sorry about that! My response generator is currently not responding. Can we try again?"
  ];

  // Function to toggle chat visibility
  chatToggleBtn.addEventListener('click', () => {
      chatbox.classList.toggle('hidden');
      if (!chatbox.classList.contains('hidden')) {
          userInput.focus();
      }
  });

  // Function to minimize chat
  minimizeBtn.addEventListener('click', () => {
      chatbox.classList.add('minimized');
      setTimeout(() => {
          chatbox.classList.add('hidden');
          chatbox.classList.remove('minimized');
      }, 300);
  });

  // Function to add a message to the chat
  function addMessage(content, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
      
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'message-avatar';
      avatarDiv.textContent = isUser ? 'You' : 'AI';
      if (isUser) {
          avatarDiv.classList.add('user-avatar');
      }
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.textContent = content;
      
      messageDiv.appendChild(avatarDiv);
      messageDiv.appendChild(contentDiv);
      
      chatContainer.appendChild(messageDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Function to show typing indicator
  function showTypingIndicator() {
      const indicatorDiv = document.createElement('div');
      indicatorDiv.className = 'message bot-message typing-indicator-container';
      indicatorDiv.id = 'typingIndicator';
      
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'message-avatar';
      avatarDiv.textContent = 'AI';
      
      const typingDiv = document.createElement('div');
      typingDiv.className = 'typing-indicator';
      
      for (let i = 0; i < 3; i++) {
          const dot = document.createElement('div');
          dot.className = 'typing-dot';
          typingDiv.appendChild(dot);
      }
      
      indicatorDiv.appendChild(avatarDiv);
      indicatorDiv.appendChild(typingDiv);
      
      chatContainer.appendChild(indicatorDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Function to hide typing indicator
  function hideTypingIndicator() {
      const indicator = document.getElementById('typingIndicator');
      if (indicator) {
          indicator.remove();
      }
  }

  // Function to get AI response from Google Gemini API
  async function getAIResponse(userText) {
      try {
          // Add user message to history
          chatHistory.push({ 
              role: "user", 
              content: userText 
          });
          
          // Keep only the last 10 messages to avoid context length issues
          if (chatHistory.length > 12) {
              // Always keep the system message
              const systemMessage = chatHistory[0];
              chatHistory = [systemMessage, ...chatHistory.slice(-11)];
          }
          
          // Convert chat history to Gemini format
          const geminiContents = [];
          
          // Add system message if it exists
          if (chatHistory[0].role === "system") {
              geminiContents.push({
                  role: "user",
                  parts: [{ text: chatHistory[0].content }]
              });
              geminiContents.push({
                  role: "model",
                  parts: [{ text: "I'll follow these instructions." }]
              });
          }
          
          // Add the rest of the messages
          for (let i = 1; i < chatHistory.length; i++) {
              const message = chatHistory[i];
              if (message.role === "user") {
                  geminiContents.push({
                      role: "user",
                      parts: [{ text: message.content }]
                  });
              } else if (message.role === "assistant") {
                  geminiContents.push({
                      role: "model",
                      parts: [{ text: message.content }]
                  });
              }
          }
          
          // API endpoint for Google Gemini
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
          
          const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  contents: geminiContents.length > 0 ? geminiContents : [{
                      parts: [{ text: userText }]
                  }]
              })
          });
          
          if (!response.ok) {
              throw new Error(`API error: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Extract the response text from Gemini's response format
          let aiMessage = "I'm not sure how to respond to that.";
          
          if (data.candidates && 
              data.candidates[0] && 
              data.candidates[0].content && 
              data.candidates[0].content.parts && 
              data.candidates[0].content.parts[0] && 
              data.candidates[0].content.parts[0].text) {
              aiMessage = data.candidates[0].content.parts[0].text;
          }
          
          // Add AI response to history
          chatHistory.push({ 
              role: "assistant", 
              content: aiMessage 
          });
          
          return aiMessage;
      } catch (error) {
          console.error("Error fetching AI response:", error);
          
          // Return a fallback response
          return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      }
  }

  // Function to handle sending a message
  async function sendMessage() {
      const message = userInput.value.trim();
      if (message === '') return;
      
      // Add user message
      addMessage(message, true);
      userInput.value = '';
      
      // Disable input while waiting for response
      userInput.disabled = true;
      sendBtn.disabled = true;
      
      // Show typing indicator
      showTypingIndicator();
      
      try {
          // Get AI response from API
          const aiResponse = await getAIResponse(message);
          
          // Hide typing indicator
          hideTypingIndicator();
          
          // Add AI response to chat
          addMessage(aiResponse);
      } catch (error) {
          console.error("Error:", error);
          
          // Hide typing indicator
          hideTypingIndicator();
          
          // Add fallback response
          addMessage("I'm having trouble connecting to my brain right now. Please try again later.");
      } finally {
          // Re-enable input
          userInput.disabled = false;
          sendBtn.disabled = false;
          userInput.focus();
      }
  }

  // Event listeners
  sendBtn.addEventListener('click', sendMessage);
  
  userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          sendMessage();
      }
  });

  // Focus the input field when the chat is opened
  chatToggleBtn.addEventListener('click', () => {
      if (!chatbox.classList.contains('hidden')) {
          setTimeout(() => {
              userInput.focus();
          }, 300);
      }
  });