// Mock authentication service
export const loginUser = async (email, password) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email.endsWith('@ucp.edu.pk')) {
        reject(new Error('Only UCP email addresses allowed'));
        return;
      }

      if (password === 'password123') { // Mock password
        resolve({
          _id: 'user123',
          email,
          name: email.split('@')[0],
          department: 'Computer Science',
          year: 3,
          token: 'mock-jwt-token-12345'
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const registerUser = async (userData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: 'user' + Date.now(),
        ...userData,
        token: 'mock-jwt-token-' + Date.now()
      });
    }, 1000);
  });
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};