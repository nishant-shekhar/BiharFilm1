import React from 'react';

const OTTSubsidy = () => {
    const data = [
        {
            slNo: 1,
            subsidy: 'Up to 2 Crores or 25% of Production Cost (COP)',
            criteria: 'Minimum 50% of total shooting days or 30 days of shooting in the state',
        },
        {
            slNo: 2,
            subsidy: 'Up to 3 Crores or 25% of Production Cost (COP)',
            criteria: 'Minimum 70% of total shooting days or 60 days of shooting in the state',
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

export default OTTSubsidy;
