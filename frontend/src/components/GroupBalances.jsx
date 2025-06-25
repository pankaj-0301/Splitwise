import React, { useState, useEffect } from 'react';
import { Calculator, Loader, RefreshCw, Users } from 'lucide-react';
import apiService from '../services/api';

const GroupBalances = ({ className = '' }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [balances, setBalances] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      loadData(selectedGroupId);
    }
  }, [selectedGroupId]);

  const fetchGroups = async () => {
    try {
      const data = await apiService.getAllGroups();
      setGroups(data);
      if (data.length > 0) {
        setSelectedGroupId(data[0].id); // auto select first
      }
    } catch (err) {
      setError('Failed to load groups');
    }
  };

  const loadData = async (groupId) => {
    setLoading(true);
    setError('');
    try {
      const [balanceData, groupData] = await Promise.all([
        apiService.getGroupBalances(groupId),
        apiService.getGroup(groupId),
      ]);
      setBalances(balanceData);
      setGroupInfo(groupData);
    } catch (err) {
      setError('Failed to load balances');
    } finally {
      setLoading(false);
    }
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600 bg-green-50';
    if (balance < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getBalanceText = (balance) => {
    if (balance > 0) return `Gets back $${balance.toFixed(2)}`;
    if (balance < 0) return `Owes $${Math.abs(balance).toFixed(2)}`;
    return 'Settled up';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calculator className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Group Balances</h2>
            {groupInfo && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {groupInfo.name} • Total: ${groupInfo.total_expenses.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => loadData(selectedGroupId)}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="group-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Group
        </label>
        <select
          id="group-select"
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg">{error}</div>
      ) : balances.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No expenses recorded yet</div>
      ) : (
        <div className="space-y-3">
          {balances.map((user) => (
            <div
              key={user.user_id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-800">{user.name}</span>
              </div>
              <div className={`px-3 py-2 rounded-full text-sm font-medium ${getBalanceColor(user.balance)}`}>
                {getBalanceText(user.balance)}
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Balance Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Owed:</span>
                <span className="ml-2 font-medium text-red-600">
                  ${Math.abs(balances.filter((b) => b.balance < 0).reduce((sum, b) => sum + b.balance, 0)).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Due:</span>
                <span className="ml-2 font-medium text-green-600">
                  ${balances.filter((b) => b.balance > 0).reduce((sum, b) => sum + b.balance, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupBalances;
