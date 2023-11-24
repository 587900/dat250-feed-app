// Example service function to fetch user details
export const getUserById = async (userId) => {
    // Replace with actual API endpoint and logic to fetch user details
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  };
  