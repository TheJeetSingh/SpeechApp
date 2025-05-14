import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiUsers, FiClock, FiTrash2 } from 'react-icons/fi';

const CollaborativeRoomsList = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // In a real app, this would fetch from a backend
  // For demo purposes, we'll use mock data
  useEffect(() => {
    // Mock room data
    const mockRooms = [
      {
        id: '1',
        name: 'Impromptu Speaking Practice',
        participants: 3,
        active: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: '2',
        name: 'Speech Evaluation Feedback',
        participants: 1,
        active: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      },
      {
        id: '3',
        name: 'Persuasive Speech Practice',
        participants: 2,
        active: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      }
    ];
    
    setRooms(mockRooms);
  }, []);

  const joinRoom = (roomId) => {
    navigate(`/collaborative-room/${roomId}`);
  };

  const createRoom = () => {
    if (newRoomName.trim()) {
      const newRoom = {
        id: Math.random().toString(36).substr(2, 9), // Generate random ID
        name: newRoomName,
        participants: 0,
        active: true,
        createdAt: new Date(),
      };
      
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      setIsCreatingRoom(false);
      
      // Navigate to the new room
      navigate(`/collaborative-room/${newRoom.id}`);
    }
  };

  const deleteRoom = (e, roomId) => {
    e.stopPropagation();
    setRooms(rooms.filter(room => room.id !== roomId));
  };

  const formatTime = (date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Collaborative Speech Practice Rooms</h1>
      
      <p style={styles.description}>
        Join a room to practice speeches with others, receive real-time feedback, and improve together.
      </p>
      
      <div style={styles.roomsContainer}>
        {rooms.map(room => (
          <motion.div
            key={room.id}
            style={styles.roomCard}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
            onClick={() => joinRoom(room.id)}
          >
            <div style={styles.roomInfo}>
              <h3 style={styles.roomName}>{room.name}</h3>
              <div style={styles.roomStats}>
                <div style={styles.roomStat}>
                  <FiUsers style={styles.roomStatIcon} />
                  <span>{room.participants} active</span>
                </div>
                <div style={styles.roomStat}>
                  <FiClock style={styles.roomStatIcon} />
                  <span>{formatTime(room.createdAt)}</span>
                </div>
              </div>
            </div>
            <div style={styles.roomActions}>
              <button 
                style={styles.joinButton}
                onClick={() => joinRoom(room.id)}
              >
                Join
              </button>
              <motion.button
                style={styles.deleteButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => deleteRoom(e, room.id)}
              >
                <FiTrash2 size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {isCreatingRoom ? (
        <div style={styles.createRoomForm}>
          <input
            style={styles.roomInput}
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter room name..."
            onKeyPress={(e) => e.key === 'Enter' && createRoom()}
            autoFocus
          />
          <div style={styles.formButtons}>
            <motion.button
              style={styles.createButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createRoom}
            >
              Create
            </motion.button>
            <motion.button
              style={styles.cancelButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreatingRoom(false)}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.button
          style={styles.newRoomButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreatingRoom(true)}
        >
          <FiPlus size={20} style={{ marginRight: '8px' }} />
          New Practice Room
        </motion.button>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1e3c72',
    textAlign: 'center',
  },
  description: {
    fontSize: '1.1rem',
    color: '#555',
    marginBottom: '2rem',
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto 2rem auto',
  },
  roomsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  roomCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    height: '100%',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#2a5298',
  },
  roomStats: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  roomStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#666',
  },
  roomStatIcon: {
    color: '#3498db',
  },
  roomActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  },
  joinButton: {
    padding: '0.6rem 1.5rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  deleteButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    color: '#e74c3c',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  newRoomButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.8rem 2rem',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    margin: '2rem auto 0 auto',
    boxShadow: '0 4px 10px rgba(46, 204, 113, 0.3)',
  },
  createRoomForm: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    marginTop: '2rem',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  roomInput: {
    padding: '0.8rem 1rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '1rem',
    width: '100%',
  },
  formButtons: {
    display: 'flex',
    gap: '1rem',
  },
  createButton: {
    padding: '0.8rem 2rem',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
  },
  cancelButton: {
    padding: '0.8rem 2rem',
    backgroundColor: '#f1f2f6',
    color: '#555',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
  },
};

export default CollaborativeRoomsList; 