import {useEffect, useState} from 'react';

const Reports = () => {
  const [reports, setReports] = useState<any>({});

  useEffect(() => {
    fetch('reports')
      .then((res) => res.json())
      .then(setReports);
  }, []);

  return (
    <div>
      <h1>Reports</h1>
      <pre>{JSON.stringify(reports, null, 2)}</pre>
    </div>
  );
};

export default Reports;
