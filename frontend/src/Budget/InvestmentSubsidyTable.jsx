import React from 'react';

const InvestmentSubsidyTable = () => {
  const subsidyData = [
    {
      slNo: 1,
      purpose: 'For setting up infrastructure like Film Set / Film City / Theme Park / Theme Village, Film Studio for VFX, Animation, Sound Recording / Dubbing, Color Correction.',
      minInvestment: '200',
      subsidyPercent: '25%',
      maxSubsidy: '150',
    },
    {
      slNo: 2,
      purpose: 'For Film Lighting, High Resolution Camera, Sound System, Dubbing etc. for film production and processing.',
      minInvestment: '100',
      subsidyPercent: '25%',
      maxSubsidy: '100',
    },
    {
      slNo: 3,
      purpose: 'For the establishment of a fully equipped studio.',
      minInvestment: '50',
      subsidyPercent: '25%',
      maxSubsidy: '25',
    },
    {
      slNo: 4,
      purpose: 'For the establishment of Animation and Computer Graphics Center and other technical facilities etc.',
      minInvestment: '50',
      subsidyPercent: '25%',
      maxSubsidy: '25',
    },
  ];

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full text-sm text-left border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Sl. No.</th>
            <th className="p-3 border">Grant Scheme</th>
            <th className="p-3 border">Min Project Cost (in Lakhs)</th>
            <th className="p-3 border">Max Incentive (%)</th>
            <th className="p-3 border">Max Grant Limit (in Lakhs)</th>
          </tr>
        </thead>
        <tbody>
          {subsidyData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-3 border text-center">{item.slNo}</td>
              <td className="p-3 border">{item.purpose}</td>
              <td className="p-3 border text-center">{item.minInvestment}</td>
              <td className="p-3 border text-center">{item.subsidyPercent}</td>
              <td className="p-3 border text-center">{item.maxSubsidy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentSubsidyTable;
