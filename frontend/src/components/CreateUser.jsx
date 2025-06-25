import React, { useState } from 'react';
import { User, Plus, Loader } from 'lucide-react';
import apiService from '../services/api';

const CreateUser = ({ onUserCreated, className = '' }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const user = await apiService.createUser({ name: name.trim() });
      setName('');
      onUserCreated?.(user);
    } catch (err) {
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Create New User</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            id="userName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter user name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;