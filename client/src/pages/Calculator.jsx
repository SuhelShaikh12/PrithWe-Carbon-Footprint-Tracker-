import { useState } from 'react';
import { calculateTotalCarbonFootprint, calculateContributions } from '../CarbonCalculator';

const Calculator = () => {
  const [formData, setFormData] = useState({
    electricityUsage: '',
    waterUsage: '',
    wasteGeneration: '',
    gasCylinder: ''
  });

  const [familyData, setFamilyData] = useState([
    {
      transportation: { privateVehicle: '', publicVehicle: '', airTravel: '' },
      food: { vegMeals: '', nonVegMeals: '' }
    }
  ]);

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFamilyChange = (index, field, subField, value) => {
    const updated = [...familyData];
    updated[index][field][subField] = value;
    setFamilyData(updated);
  };

  const addFamilyMember = () => {
    setFamilyData(prev => [
      ...prev,
      {
        transportation: { privateVehicle: '', publicVehicle: '', airTravel: '' },
        food: { vegMeals: '', nonVegMeals: '' }
      }
    ]);
  };

  const calculate = () => {
    const total = calculateTotalCarbonFootprint(formData, familyData);
    const contributions = calculateContributions(formData, familyData, total);
    setResult({ total, contributions });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Carbon Footprint Calculator</h1>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Electricity Usage (kWh)</label>
            <input
              type="number"
              name="electricityUsage"
              value={formData.electricityUsage}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Other inputs... */}
        </div>

        <h2 className="text-xl font-semibold mt-6">Family Members</h2>
        {familyData.map((member, index) => (
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
              {/* Other member inputs... */}
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
          onClick={calculate}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 mt-4"
        >
          Calculate
        </button>
      </div>

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