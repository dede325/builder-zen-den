import { RequestHandler } from 'express';
import { database } from '../database';
import { getWebSocketManager } from '../websocket';

// Get messages for a user
export const getMessages: RequestHandler = (req, res) => {
  try {
    const { userId } = req.query;
    const { otherUserId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const messages = database.getMessages(
      userId as string, 
      otherUserId as string | undefined
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

// Send a new message
export const sendMessage: RequestHandler = (req, res) => {
  try {
    const { from_user_id, to_user_id, message, type = 'text', file_url, file_name, file_size } = req.body;

    if (!from_user_id || !to_user_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: from_user_id, to_user_id, message'
      });
    }

    // Create message in database
    const newMessage = database.createMessage({
      from_user_id,
      to_user_id,
      message,
      type,
      file_url,
      file_name,
      file_size,
      read: false
    });

    // Send via WebSocket if recipient is online
    const wsManager = getWebSocketManager();
    if (wsManager) {
      wsManager.sendToUser(to_user_id, {
        type: 'message',
        data: newMessage
      });
    }

    res.json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Mark message as read
export const markMessageAsRead: RequestHandler = (req, res) => {
  try {
    const { messageId } = req.params;

    const success = database.markMessageAsRead(messageId);

    if (success) {
      res.json({
        success: true,
        message: 'Message marked as read'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read'
    });
  }
};

// Get conversation between two users
export const getConversation: RequestHandler = (req, res) => {
  try {
    const { userId, otherUserId } = req.params;

    const messages = database.getMessages(userId, otherUserId);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation'
    });
  }
};

// Get all users for messaging (staff members)
export const getMessagingContacts: RequestHandler = (req, res) => {
  try {
    const { userRole } = req.query;

    // Get staff members based on user role
    let contacts: any[] = [];

    if (userRole === 'patient') {
      // Patients can message doctors, nurses, and receptionists
      contacts = [
        ...database.getUsersByRole('doctor'),
        ...database.getUsersByRole('nurse'),
        ...database.getUsersByRole('receptionist')
      ];
    } else if (userRole === 'nurse') {
      // Nurses can message doctors, other nurses, and receptionists
      contacts = [
        ...database.getUsersByRole('doctor'),
        ...database.getUsersByRole('nurse'),
        ...database.getUsersByRole('receptionist')
      ];
    } else if (userRole === 'receptionist') {
      // Receptionists can message everyone
      contacts = [
        ...database.getUsersByRole('doctor'),
        ...database.getUsersByRole('nurse'),
        ...database.getUsersByRole('patient'),
        ...database.getUsersByRole('admin')
      ];
    } else if (userRole === 'doctor') {
      // Doctors can message everyone
      contacts = [
        ...database.getUsersByRole('nurse'),
        ...database.getUsersByRole('receptionist'),
        ...database.getUsersByRole('patient'),
        ...database.getUsersByRole('admin')
      ];
    } else if (userRole === 'admin') {
      // Admins can message everyone
      contacts = [
        ...database.getUsersByRole('doctor'),
        ...database.getUsersByRole('nurse'),
        ...database.getUsersByRole('receptionist'),
        ...database.getUsersByRole('patient')
      ];
    }

    // Remove sensitive data
    const safeContacts = contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      role: contact.role,
      avatar_url: contact.avatar_url
    }));

    res.json({
      success: true,
      data: safeContacts
    });
  } catch (error) {
    console.error('Error fetching messaging contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};
