import React from 'react';

const Sidebar = () => {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Logout logic here
    }
  };

  return (
    <aside>
      <h2>Plant2Tree</h2>
      
      <div>
        <h4>Admin Controls</h4>
        <h4>Clinic Management</h4>
      </div>

      <div>
        <p>Role:</p>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </aside>
  );
};

export default Sidebar;