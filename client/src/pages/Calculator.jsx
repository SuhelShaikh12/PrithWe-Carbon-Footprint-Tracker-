

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





// Calculator.jsx
import { useState } from 'react';
import { 
  calculateTotalCarbonFootprint, 
  calculateContributions,
  calculateBusinessCarbonFootprint,
  calculateBusinessContributions 
} from '../CarbonCalculator';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState('household');
  const [result, setResult] = useState(null);
  
  // Household form state
  const [householdForm, setHouseholdForm] = useState({
    electricityUsage: '',
    waterUsage: '',
    wasteGeneration: '',
    gasCylinder: '',
  });
  
  const [familyMembers, setFamilyMembers] = useState([
    {
      transportation: { privateVehicle: '', publicVehicle: '', airTravel: '' },
      food: { vegMeals: '', nonVegMeals: '' }
    }
  ]);

  // Business form state
  const [businessForm, setBusinessForm] = useState({
    Electricity_Usage: '',
    Water_Usage: '',
    Paper_Consumption: '',
    Waste_Generation: '',
    Fuel_Consumption: '',
    Business_Travel: '',
  });

  const handleHouseholdChange = (e) => {
    const { name, value } = e.target;
    setHouseholdForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFamilyChange = (index, field, subField, value) => {
    const updated = [...familyMembers];
    updated[index][field][subField] = value;
    setFamilyMembers(updated);
  };

  const addFamilyMember = () => {
    setFamilyMembers(prev => [
      ...prev,
      {
        transportation: { privateVehicle: '', publicVehicle: '', airTravel: '' },
        food: { vegMeals: '', nonVegMeals: '' }
      }
    ]);
  };

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessForm(prev => ({ ...prev, [name]: value }));
  };

  const calculateHousehold = () => {
    const total = calculateTotalCarbonFootprint(householdForm, familyMembers);
    const contributions = calculateContributions(householdForm, familyMembers, total);
    setResult({ 
      type: 'household',
      total, 
      contributions 
    });
  };

  const calculateBusiness = () => {
    const total = calculateBusinessCarbonFootprint(businessForm);
    const contributions = calculateBusinessContributions(businessForm, total);
    setResult({ 
      type: 'business',
      total,
      contributions
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Carbon Footprint Calculator</h1>
      
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'household' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('household')}
        >
          Household
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'business' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('business')}
        >
          Business
        </button>
      </div>

      {activeTab === 'household' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Electricity Usage (kWh)</label>
              <input
                type="number"
                name="electricityUsage"
                value={householdForm.electricityUsage}
                onChange={handleHouseholdChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Water Usage (liters)</label>
              <input
                type="number"
                name="waterUsage"
                value={householdForm.waterUsage}
                onChange={handleHouseholdChange}
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Add other household inputs similarly */}
          </div>

          <h2 className="text-xl font-semibold mt-6">Family Members</h2>
          {familyMembers.map((member, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">Member {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Private Vehicle (km)</label>
                  <input
                    type="number"
                    value={member.transportation.privateVehicle}
                    onChange={(e) => handleFamilyChange(index, 'transportation', 'privateVehicle', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                {/* Add other family member inputs similarly */}
              </div>
            </div>
          ))}
          <button 
            onClick={addFamilyMember}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Family Member
          </button>

          <button 
            onClick={calculateHousehold}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 mt-4"
          >
            Calculate
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Electricity Usage (kWh)</label>
              <input
                type="number"
                name="Electricity_Usage"
                value={businessForm.Electricity_Usage}
                onChange={handleBusinessChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Water Usage (gallons)</label>
              <input
                type="number"
                name="Water_Usage"
                value={businessForm.Water_Usage}
                onChange={handleBusinessChange}
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Add other business inputs similarly */}
          </div>

          <button 
            onClick={calculateBusiness}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 mt-4"
          >
            Calculate
          </button>
        </div>
      )}

      {result && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <p className="text-lg">
            Total Carbon Footprint: <span className="font-bold">{result.total.toFixed(2)} kg CO2</span>
          </p>
          
          <h3 className="text-lg font-medium mt-4">Breakdown by Category:</h3>
          <ul className="mt-2 space-y-1">
            {result.contributions.map((item, i) => (
              <li key={i}>
                {item.name}: {item.y.toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calculator;