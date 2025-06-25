import React, { useState, useEffect } from 'react';
import { Users, Plus, Loader, X } from 'lucide-react';
import apiService from '../services/api';

const CreateGroup = ({ onGroupCreated, className = '' }) => {
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userList = await apiService.getUsers();
      setUsers(userList);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0) return;

    setLoading(true);
    setError('');
    
    try {
      const group = await apiService.createGroup({
        name: groupName.trim(),
        user_ids: selectedUsers
      });
      setGroupName('');
      setSelectedUsers([]);
      onGroupCreated?.(group);
    } catch (err) {
      setError('Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Users className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Create New Group</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
            Group Name
          </label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Members
          </label>
          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users available. Create some users first.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.map(user => (
                <label
                  key={user.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-gray-700">{user.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map(userId => {
              const user = users.find(u => u.id === userId);
              return (
                <span
                  key={userId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {user?.name}
                  <button
                    type="button"
                    onClick={() => handleUserToggle(userId)}
                    className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || !groupName.trim() || selectedUsers.length === 0}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;