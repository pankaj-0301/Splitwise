import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Loader } from 'lucide-react';
import apiService from '../services/api';

const AddExpense = ({ onExpenseAdded, className = '' }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [groupInfo, setGroupInfo] = useState(null);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [percentageSplits, setPercentageSplits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiService.getAllGroups()
      .then(setGroups)
      .catch(() => setError('Failed to load groups'));
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      loadGroupInfo(selectedGroupId);
    }
  }, [selectedGroupId]);

  const loadGroupInfo = async (groupId) => {
    setLoadingGroup(true);
    try {
      const info = await apiService.getGroup(groupId);
      setGroupInfo(info);
      if (info.users.length > 0) {
        setPaidBy(info.users[0].id);
        const equalPercentage = Math.floor(100 / info.users.length);
        const splits = info.users.map((user, index) => ({
          user_id: user.id,
          percentage: index === 0 ? 100 - (equalPercentage * (info.users.length - 1)) : equalPercentage
        }));
        setPercentageSplits(splits);
      }
    } catch (err) {
      setError('Failed to load group information');
    } finally {
      setLoadingGroup(false);
    }
  };

  const handlePercentageChange = (userId, percentage) => {
    setPercentageSplits(prev =>
      prev.map(split =>
        split.user_id === userId
          ? { ...split, percentage: Math.max(0, Math.min(100, percentage)) }
          : split
      )
    );
  };

  const getTotalPercentage = () => {
    return percentageSplits.reduce((sum, split) => sum + split.percentage, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || !paidBy || !selectedGroupId) return;

    if (splitType === 'percentage' && getTotalPercentage() !== 100) {
      setError('Percentages must add up to 100%');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const expenseData = {
        description: description.trim(),
        amount: parseFloat(amount),
        paid_by: parseInt(paidBy),
        split_type: splitType,
        splits: splitType === 'percentage' ? percentageSplits : []
      };

      await apiService.addExpense(selectedGroupId, expenseData);
      setDescription('');
      setAmount('');
      onExpenseAdded?.();
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Receipt className="w-5 h-5 text-orange-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Add Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Group
          </label>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="">-- Choose a Group --</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {loadingGroup && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}

        {groupInfo && (
          <>
            <p className="text-sm text-gray-600">To group: {groupInfo.name}</p>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this expense for?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-2">
                Paid by
              </label>
              <select
                id="paidBy"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                {groupInfo.users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Split Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="equal"
                    checked={splitType === 'equal'}
                    onChange={(e) => setSplitType(e.target.value)}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-gray-700">Split Equally</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="percentage"
                    checked={splitType === 'percentage'}
                    onChange={(e) => setSplitType(e.target.value)}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-gray-700">By Percentage</span>
                </label>
              </div>
            </div>

            {splitType === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Percentage Split
                </label>
                <div className="space-y-3">
                  {percentageSplits.map(split => {
                    const user = groupInfo.users.find(u => u.id === split.user_id);
                    return (
                      <div key={split.user_id} className="flex items-center gap-3">
                        <span className="flex-1 text-gray-700">{user?.name}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={split.percentage}
                            onChange={(e) => handlePercentageChange(split.user_id, parseFloat(e.target.value) || 0)}
                            className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Total:</span>
                    <span className={`font-medium ${getTotalPercentage() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {getTotalPercentage()}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !description.trim() || !amount || !paidBy}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AddExpense;
