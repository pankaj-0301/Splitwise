import React, { useState, useEffect } from 'react';
import { User, Loader, RefreshCw, DollarSign } from 'lucide-react';
import apiService from '../services/api';

const UserBalances = ({ userId, className = '' }) => {
  const [balances, setBalances] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(userId || '');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadUserBalances();
    }
  }, [selectedUserId]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const userList = await apiService.getUsers();
      setUsers(userList);
      if (!selectedUserId && userList.length > 0) {
        setSelectedUserId(userList[0].id);
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadUserBalances = async () => {
    if (!selectedUserId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const balanceData = await apiService.getUserBalances(selectedUserId);
      setBalances(balanceData);
    } catch (err) {
      setError('Failed to load user balances');
    } finally {
      setLoading(false);
    }
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600 bg-green-50 border-green-200';
    if (balance < 0) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getBalanceText = (balance) => {
    if (balance > 0) return `You get back $${balance.toFixed(2)}`;
    if (balance < 0) return `You owe $${Math.abs(balance).toFixed(2)}`;
    return 'You are settled up';
  };

  const selectedUser = users.find(u => u.id === parseInt(selectedUserId));
  const totalBalance = balances.reduce((sum, b) => sum + b.balance, 0);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Personal Balance</h2>
        </div>
        <button
          onClick={loadUserBalances}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="mb-6">
        <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select User
        </label>
        {loadingUsers ? (
          <div className="flex items-center justify-center py-4">
            <Loader className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <select
            id="userSelect"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedUser && (
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-800">{selectedUser.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <span className={`font-medium ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Overall: {totalBalance >= 0 ? `+$${totalBalance.toFixed(2)}` : `-$${Math.abs(totalBalance).toFixed(2)}`}
            </span>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      ) : !selectedUserId ? (
        <div className="text-center py-8 text-gray-500">
          Select a user to view their balances
        </div>
      ) : balances.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No group memberships found
        </div>
      ) : (
        <div className="space-y-3">
          {balances.map(groupBalance => (
            <div
              key={groupBalance.group_id}
              className={`p-4 border rounded-lg ${getBalanceColor(groupBalance.balance)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{groupBalance.group}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {getBalanceText(groupBalance.balance)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${groupBalance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {groupBalance.balance >= 0 ? '+' : ''}${groupBalance.balance.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBalances;