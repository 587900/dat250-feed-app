// Importing React and other necessary modules
import React, {FC} from 'react';
import Login from '../../components/Login'; // Make sure this path is correct

// Defining the LoginPage component
const LoginPage: FC = () => {

  // The component's return statement
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Login />
    </div>
  );
};

// Exporting the LoginPage component
export default LoginPage;
