const API_BASE = 'https://splitwise-onpc.onrender.com';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User 
  async createUser(userData) {
    return this.request('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUsers() {
    return this.request('/users/');
  }

  // Group 
  async createGroup(groupData) {
    return this.request('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async getGroup(groupId) {
    return this.request(`/groups/${groupId}`);
  }

  async addExpense(groupId, expenseData) {
    return this.request(`/groups/${groupId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  async getGroupBalances(groupId) {
    return this.request(`/groups/${groupId}/balances`);
  }

  async getUserBalances(userId) {
    return this.request(`/users/${userId}/balances`);
  }

  async getAllGroups() {
  return this.request('/groups');
}

    async askChatbot(message) {
    return this.request('/chatbot', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }


}



export default new ApiService();