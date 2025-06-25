import React, { useState } from 'react';
import { Calculator, Users, Receipt, User, DollarSign } from 'lucide-react';
import CreateUser from './components/CreateUser';
import CreateGroup from './components/CreateGroup';
import AddExpense from './components/AddExpense';
import GroupBalances from './components/GroupBalances';
import UserBalances from './components/UserBalances';
import ChatbotWidget from './components/ChatbotWidget'; 

function App() {
  const [activeTab, setActiveTab] = useState('users');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupInfo, setSelectedGroupInfo] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserCreated = (user) => {
    console.log('User created:', user);
  };

  const handleGroupCreated = (group) => {
    console.log('Group created:', group);
    setSelectedGroupId(group.id);
  };

  const handleGroupSelect = (groupId, groupInfo) => {
    setSelectedGroupId(groupId);
    setSelectedGroupInfo(groupInfo);
  };

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const tabs = [
    { id: 'users', label: 'Create User', icon: User },
    { id: 'groups', label: 'Create Group', icon: Users },
    { id: 'expenses', label: 'Add Expense', icon: Receipt },
    { id: 'group-balances', label: 'Group Balances', icon: Calculator },
    { id: 'user-balances', label: 'Personal Balance', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SplitWise Clone</h1>
                <p className="text-sm text-gray-600">Share expenses with friends</p>
              </div>
            </div>
            {selectedGroupInfo && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{selectedGroupInfo.name}</p>
                <p className="text-xs text-gray-600">Total: ${selectedGroupInfo.total_expenses?.toFixed(2) || '0.00'}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'group-balances' ? (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <GroupBalances
                groupId={selectedGroupId}
                key={`${selectedGroupId}-${refreshTrigger}`}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {activeTab === 'users' && <CreateUser onUserCreated={handleUserCreated} />}
              {activeTab === 'groups' && <CreateGroup onGroupCreated={handleGroupCreated} />}
              {activeTab === 'expenses' && (
                <AddExpense
                  groupId={selectedGroupId}
                  onExpenseAdded={handleExpenseAdded}
                />
              )}
              {activeTab === 'user-balances' && (
                <UserBalances key={refreshTrigger} />
              )}
            </div>

            <div className="space-y-6">
              {(activeTab === 'users' || activeTab === 'groups') && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to SplitWise Clone</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Create users and groups to start splitting expenses with your friends. 
                      Track who owes what and settle up easily.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'expenses' && selectedGroupId && (
                <div className="w-full max-w-2xl mx-auto">
                  <GroupBalances
                    groupId={selectedGroupId}
                    key={`expense-balances-${selectedGroupId}-${refreshTrigger}`}
                  />
                </div>
              )}

              {activeTab === 'user-balances' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Balance Summary</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      View your balance across all groups. See how much you owe or are owed 
                      in each group you're part of.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              SplitWise Clone - A React frontend for expense sharing
            </p>
          </div>
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
}

export default App;
