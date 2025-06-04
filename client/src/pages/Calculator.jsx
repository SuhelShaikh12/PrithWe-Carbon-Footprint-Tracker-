// import React, { useEffect } from 'react';
// import HouseholdForm from '../components/HouseholdForm';
// import BusinessForm from '../components/BusinessForm';
// import { useState } from 'react';
// import axios from 'axios';

// function Calculator() {

//   const [userType, setUserType] = useState('');

//   useEffect(() => {
//     // Fetch user type upon login
//     const fetchUserType = async () => {
//       try {
//         const response = await axios.get('/api/auth/user-type', { withCredentials: true });
//         console.log('User type response:', response.data.type);
//         setUserType(response.data.type); // Set userType with response.data.type
//       } catch (error) {
//         console.error('Error fetching user type:', error);
//       }
//     };
  
//     fetchUserType();
//   }, []);

//   /*useEffect(() => {
//     // Fetch user type upon login
//     const fetchUserType = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/user-type', { withCredentials: true });
//         console.log('User type response:', response.data.type);
//         setUserType(response.data.type); // Fix: Set userType with response.data.type
//         console.log('User type:', userType);
//       } catch (error) {
//         console.error('Error fetching user type:', error);
//       }
//     };

//     fetchUserType();
//   }, []);

//   console.log('User type:', userType); // Log the userType to check its value

//   // Render the appropriate component based on the user type
//   const renderForm = () => {
//     switch (userType) {
//       case 'business':
//         return <BusinessForm />;
//       case 'household':
//         return <HouseholdForm />;
//       default:
//         return null;
//     }
//   }; */

//   return (
//     <div className='flex-grow'>
//     {userType === 'Business' ? <BusinessForm /> : <HouseholdForm />}
//   </div>
//   );
// };

// export default Calculator;

// /*import React, { useEffect } from 'react';
// import HouseholdForm from '../components/HouseholdForm';
// import BusinessForm from '../components/BusinessForm';
// import { useState } from 'react';
// import axios from 'axios';

// function Calculator() {

//   const [userType, setUserType] = useState('');

//   useEffect(() => {
//     // Fetch user type upon login
//     const fetchUserType = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/user-type', { withCredentials: true });
//         console.log('User type response:', response.data.type);
//         setUserType(response.data.type); // Fix: Set userType with response.data.type
//       } catch (error) {
//         console.error('Error fetching user type:', error);
//       }
//     };

//     fetchUserType();
//   }, []);

//   console.log('User type:', userType); // Log the userType to check its value

//   return (
//     <div>
//       {userType === 'business' ? <BusinessForm /> : userType === 'household' ? <HouseholdForm /> : null}
//     </div>
//   );
// };

// export default Calculator;*/





import  { useEffect, useState } from 'react';
import HouseholdForm from '../components/HouseholdForm';
import BusinessForm from '../components/BusinessForm';
import axios from 'axios';

function Calculator() {
  const [userType, setUserType] = useState('');
  const [checkedAuth, setCheckedAuth] = useState(false); // To wait for backend check

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get('/api/auth/user-type', { withCredentials: true });
        setUserType(response.data.type); // auto-detect type
      } catch (error) {
        console.warn('User not logged in, allowing manual selection.');
      } finally {
        setCheckedAuth(true); // Done checking
      }
    };

    fetchUserType();
  }, []);

  if (!checkedAuth) {
    return <div>Loading calculator...</div>; // Or spinner
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-4">
      {!userType && (
        <>
          <h2>Select User Type:</h2>
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="">-- Choose --</option>
            <option value="Household">Household</option>
            <option value="Business">Business</option>
          </select>
        </>
      )}

      {userType === 'Business' && <BusinessForm />}
      {userType === 'Household' && <HouseholdForm />}
    </div>
  );
}

export default Calculator;
