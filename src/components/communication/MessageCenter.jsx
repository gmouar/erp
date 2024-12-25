import React, { useState, useEffect } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  TextField, 
  Button, 
  Typography,
  IconButton,
  Divider,
  Paper,
  Menu,
  MenuItem
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';

const MessageCenter = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe', role: 'HR Manager', unread: 2 },
    { id: 2, name: 'Jane Smith', role: 'Finance Director', unread: 0 },
    { id: 3, name: 'Mike Johnson', role: 'Sales Lead', unread: 1 }
  ]);

  useEffect(() => {
    // TODO: Implement WebSocket connection
    // This would be replaced with actual WebSocket implementation
    const mockMessages = [
      {
        id: 1,
        text: "Hi, can we discuss the new project timeline?",
        sender: "John Doe",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true
      },
      {
        id: 2,
        text: "Sure, I'm available now.",
        sender: "You",
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        read: true
      }
    ];
    setMessages(mockMessages);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'You',
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFileUpload = (event) => {
    // TODO: Implement file upload functionality
    console.log('File upload:', event.target.files[0]);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      {/* Contacts List */}
      <Paper sx={{ width: 300, borderRadius: 0, borderRight: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Chats</Typography>
        </Box>
        <List sx={{ overflow: 'auto', maxHeight: 'calc(70vh - 64px)' }}>
          {contacts.map((contact) => (
            <ListItem
              button
              key={contact.id}
              selected={selectedChat === contact.id}
              onClick={() => setSelectedChat(contact.id)}
            >
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={contact.name}
                secondary={contact.role}
              />
              {contact.unread > 0 && (
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  {contact.unread}
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
          {selectedChat && (
            <>
              <Avatar sx={{ mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {contacts.find(c => c.id === selectedChat)?.name}
              </Typography>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>Clear Chat</MenuItem>
                <MenuItem onClick={handleMenuClose}>Block User</MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Messages */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: 'column',
                  alignItems: message.sender === 'You' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    bgcolor: message.sender === 'You' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'You' ? 'white' : 'text.primary',
                    borderRadius: 2,
                    p: 1,
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Message Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <IconButton component="span">
                <AttachFileIcon />
              </IconButton>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              size="small"
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageCenter;
