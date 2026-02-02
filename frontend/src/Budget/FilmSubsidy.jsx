import React from 'react';

const FilmSubsidy = () => {
  const data = [
    {
      slNo: 1,
      subsidy: 'Up to 50 Lakhs or 25% of Total Production Cost (COP), whichever is lower',
      criteria: 'Minimum 45 days shooting inside the State',
    },
    {
      slNo: 2,
      subsidy: 'Up to 1 Crore or 25% of Total Production Cost (COP), whichever is lower',
      criteria: 'Minimum 90 days shooting inside the State',
    },
  ];

  return (
    <div className="p-4 overflow-x-auto">
     
      <table className="min-w-full text-sm text-left border border-gray-300 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Sl. No.</th>
            <th className="p-3 border">Subsidy (Financial Assistance)</th>
            <th className="p-3 border">Criteria</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-3 border text-center">{row.slNo}</td>
              <td className="p-3 border">{row.subsidy}</td>
              <td className="p-3 border">{row.criteria}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilmSubsidy;
