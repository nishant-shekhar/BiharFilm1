import React from 'react';

const FilmSubsidyTable = () => {
  const filmData = [
    {
      filmNo: '1st Film',
      ranges: [
        { subsidy: 'Up to ₹2 Crore or 25% of total film cost, whichever is lower', criteria: 'Minimum 50% of total shooting days in the State' },
        { subsidy: 'Up to ₹2.50 Crore or 25% of total film cost, whichever is lower', criteria: 'Minimum 75% of total shooting days in the State' },
      ],
    },
    {
      filmNo: '2nd Film',
      ranges: [
        { subsidy: 'Up to ₹2.75 Crore or 25% of total film cost, whichever is lower', criteria: 'Minimum 50% of total shooting days in the State' },
        { subsidy: 'Up to ₹3.00 Crore or 25% of total film cost, whichever is lower', criteria: 'Minimum 75% of total shooting days in the State' },
      ],
    },
    {
      filmNo: '3rd Film',
      ranges: [
        { subsidy: 'Up to ₹3.50 Crore or 25% of total film cost, whichever is lower', criteria: 'Minimum 50% of total shooting days in the State' },
        { subsidy: 'Up to ₹4.00 Crore or 25% of total film cost, whichever is lower', criteria: 'Minimum 75% of total shooting days in the State' },
      ],
    },
  ];

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full text-sm text-left border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Film Category</th>
            <th className="p-3 border">Grant / Subsidy</th>
            <th className="p-3 border">Criteria</th>
          </tr>
        </thead>
        <tbody>
          {filmData.map((film, index) =>
            film.ranges.map((range, i) => (
              <tr key={`${index}-${i}`} className="hover:bg-gray-50">
                {i === 0 && (
                  <td
                    rowSpan={film.ranges.length}
                    className="p-3 border font-medium bg-gray-50 align-middle text-center"
                  >
                    {film.filmNo}
                  </td>
                )}
                <td className="p-3 border">{range.subsidy}</td>
                <td className="p-3 border">{range.criteria}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilmSubsidyTable;