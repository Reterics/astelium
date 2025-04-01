import LineChart from '../../components/visualizations/LineChart.tsx';
import {useApi} from '../../hooks/useApi.ts';
import SankeyChart from '../../components/visualizations/SankeyChart.tsx';
import ScatterChart from '../../components/visualizations/ScatterChart.tsx';
import SunburstChart from '../../components/visualizations/SunburstChart.tsx';
import TreeMapVisualization from '../../components/visualizations/TreeMapVisualization.tsx';
import GraphModal from '../../components/GraphModal.tsx';

const Reports = () => {
  const {isLoading: storagesAreLoading} = useApi('storage');
  const {isLoading: projectsAreLoading} = useApi('projects');
  const {isLoading: usersAreLoading} = useApi('users');
  const {isLoading: tasksAreLoading} = useApi('tasks');

  const generatedData = [
    {
      timestamp: '2025-03-10T18:31:16.943695',
      value: 84,
      category: 'A',
      subCategory: 'Y',
      amount: 432.0103491026807,
      logValue: 72.4652050684703,
      nestedKey: 'Group3',
      country: 'France',
      ip_address: '192.173.43.48',
      os: 'MacOS',
      task: 'Task A',
      project: 'Project Alpha',
      user: 'User1',
    },
    {
      timestamp: '2025-03-09T18:31:16.943737',
      value: 83,
      category: 'D',
      subCategory: 'X',
      amount: 145.3485107287438,
      logValue: 785.8215436500014,
      nestedKey: 'Group3',
      country: 'Japan',
      ip_address: '127.135.114.25',
      os: 'iOS',
      task: 'Task C',
      project: 'Project Alpha',
      user: 'User1',
    },
    {
      timestamp: '2025-03-08T18:31:16.943751',
      value: 58,
      category: 'C',
      subCategory: 'Z',
      amount: 308.39801248598076,
      logValue: 190.30513181030645,
      nestedKey: 'Group3',
      country: 'Japan',
      ip_address: '176.239.67.156',
      os: 'Android',
      task: 'Task B',
      project: 'Project Alpha',
      user: 'User4',
    },
    {
      timestamp: '2025-03-07T18:31:16.943763',
      value: 59,
      category: 'A',
      subCategory: 'Z',
      amount: 428.7412356975422,
      logValue: 910.969854552351,
      nestedKey: 'Group1',
      country: 'UK',
      ip_address: '187.13.7.60',
      os: 'iOS',
      task: 'Task D',
      project: 'Project Beta',
      user: 'User3',
    },
    {
      timestamp: '2025-03-06T18:31:16.943774',
      value: 4,
      category: 'D',
      subCategory: 'Z',
      amount: 328.07573103790173,
      logValue: 525.914235014053,
      nestedKey: 'Group1',
      country: 'France',
      ip_address: '45.101.193.227',
      os: 'Android',
      task: 'Task C',
      project: 'Project Alpha',
      user: 'User3',
    },
    {
      timestamp: '2025-03-05T18:31:16.943786',
      value: 59,
      category: 'D',
      subCategory: 'Z',
      amount: 359.8495985322389,
      logValue: 717.9706693377238,
      nestedKey: 'Group3',
      country: 'France',
      ip_address: '36.131.158.131',
      os: 'Android',
      task: 'Task A',
      project: 'Project Gamma',
      user: 'User1',
    },
    {
      timestamp: '2025-03-04T18:31:16.943798',
      value: 41,
      category: 'C',
      subCategory: 'X',
      amount: 374.0654572811781,
      logValue: 440.8373725048635,
      nestedKey: 'Group3',
      country: 'USA',
      ip_address: '193.101.136.14',
      os: 'Linux',
      task: 'Task D',
      project: 'Project Gamma',
      user: 'User3',
    },
    {
      timestamp: '2025-03-03T18:31:16.943811',
      value: 3,
      category: 'B',
      subCategory: 'X',
      amount: 401.7350243504914,
      logValue: 297.90311653942007,
      nestedKey: 'Group1',
      country: 'France',
      ip_address: '56.62.49.252',
      os: 'Linux',
      task: 'Task C',
      project: 'Project Gamma',
      user: 'User3',
    },
    {
      timestamp: '2025-03-02T18:31:16.943826',
      value: 48,
      category: 'D',
      subCategory: 'X',
      amount: 314.3095415964408,
      logValue: 513.6823942658668,
      nestedKey: 'Group2',
      country: 'France',
      ip_address: '194.73.232.81',
      os: 'MacOS',
      task: 'Task B',
      project: 'Project Beta',
      user: 'User2',
    },
    {
      timestamp: '2025-03-01T18:31:16.943837',
      value: 45,
      category: 'A',
      subCategory: 'Z',
      amount: 125.75275315106293,
      logValue: 304.96601527566094,
      nestedKey: 'Group2',
      country: 'UK',
      ip_address: '216.185.107.130',
      os: 'Windows',
      task: 'Task A',
      project: 'Project Alpha',
      user: 'User4',
    },
    {
      timestamp: '2025-02-28T18:31:16.943849',
      value: 35,
      category: 'A',
      subCategory: 'Y',
      amount: 205.84727649976634,
      logValue: 303.5616744993225,
      nestedKey: 'Group3',
      country: 'France',
      ip_address: '171.135.148.55',
      os: 'Linux',
      task: 'Task B',
      project: 'Project Gamma',
      user: 'User1',
    },
    {
      timestamp: '2025-02-27T18:31:16.943860',
      value: 93,
      category: 'B',
      subCategory: 'Y',
      amount: 84.49499935501315,
      logValue: 585.908587162444,
      nestedKey: 'Group1',
      country: 'Germany',
      ip_address: '5.207.61.126',
      os: 'Android',
      task: 'Task D',
      project: 'Project Alpha',
      user: 'User4',
    },
    {
      timestamp: '2025-02-26T18:31:16.943871',
      value: 72,
      category: 'A',
      subCategory: 'Z',
      amount: 136.94688874595107,
      logValue: 508.7014705684759,
      nestedKey: 'Group1',
      country: 'Japan',
      ip_address: '227.48.165.203',
      os: 'MacOS',
      task: 'Task C',
      project: 'Project Gamma',
      user: 'User3',
    },
    {
      timestamp: '2025-02-25T18:31:16.943881',
      value: 19,
      category: 'D',
      subCategory: 'Y',
      amount: 50.890953285863134,
      logValue: 555.3545205816257,
      nestedKey: 'Group3',
      country: 'Germany',
      ip_address: '227.215.185.100',
      os: 'Windows',
      task: 'Task C',
      project: 'Project Beta',
      user: 'User4',
    },
    {
      timestamp: '2025-02-24T18:31:16.943891',
      value: 66,
      category: 'D',
      subCategory: 'Y',
      amount: 429.80565002230566,
      logValue: 501.4956203640937,
      nestedKey: 'Group2',
      country: 'France',
      ip_address: '197.118.242.90',
      os: 'iOS',
      task: 'Task D',
      project: 'Project Beta',
      user: 'User2',
    },
    {
      timestamp: '2025-02-23T18:31:16.943901',
      value: 6,
      category: 'D',
      subCategory: 'Z',
      amount: 232.41888867943726,
      logValue: 472.3056298490174,
      nestedKey: 'Group1',
      country: 'USA',
      ip_address: '133.20.231.151',
      os: 'Windows',
      task: 'Task C',
      project: 'Project Gamma',
      user: 'User3',
    },
    {
      timestamp: '2025-02-22T18:31:16.943911',
      value: 17,
      category: 'B',
      subCategory: 'Z',
      amount: 382.8525570761895,
      logValue: 282.9245468997621,
      nestedKey: 'Group3',
      country: 'UK',
      ip_address: '48.54.37.66',
      os: 'MacOS',
      task: 'Task A',
      project: 'Project Beta',
      user: 'User1',
    },
    {
      timestamp: '2025-02-21T18:31:16.943921',
      value: 27,
      category: 'B',
      subCategory: 'X',
      amount: 360.3082662061177,
      logValue: 382.70028683793066,
      nestedKey: 'Group1',
      country: 'France',
      ip_address: '8.18.176.122',
      os: 'iOS',
      task: 'Task C',
      project: 'Project Beta',
      user: 'User3',
    },
    {
      timestamp: '2025-02-20T18:31:16.943932',
      value: 16,
      category: 'D',
      subCategory: 'X',
      amount: 489.3704246334281,
      logValue: 575.6863885257908,
      nestedKey: 'Group1',
      country: 'France',
      ip_address: '104.251.120.65',
      os: 'Android',
      task: 'Task A',
      project: 'Project Beta',
      user: 'User3',
    },
    {
      timestamp: '2025-02-19T18:31:16.943942',
      value: 35,
      category: 'D',
      subCategory: 'Y',
      amount: 403.39282412584623,
      logValue: 246.9932439206769,
      nestedKey: 'Group3',
      country: 'UK',
      ip_address: '174.108.212.61',
      os: 'Linux',
      task: 'Task D',
      project: 'Project Alpha',
      user: 'User2',
    },
    {
      timestamp: '2025-02-18T18:31:16.943951',
      value: 100,
      category: 'A',
      subCategory: 'Y',
      amount: 95.37481562617519,
      logValue: 736.2156438322253,
      nestedKey: 'Group1',
      country: 'UK',
      ip_address: '121.98.95.179',
      os: 'Windows',
      task: 'Task A',
      project: 'Project Beta',
      user: 'User2',
    },
    {
      timestamp: '2025-02-17T18:31:16.943961',
      value: 89,
      category: 'B',
      subCategory: 'Y',
      amount: 493.8595851830939,
      logValue: 815.2035116091947,
      nestedKey: 'Group2',
      country: 'Japan',
      ip_address: '211.163.235.27',
      os: 'Linux',
      task: 'Task B',
      project: 'Project Alpha',
      user: 'User4',
    },
    {
      timestamp: '2025-02-16T18:31:16.943971',
      value: 76,
      category: 'D',
      subCategory: 'Z',
      amount: 330.0987450874725,
      logValue: 673.4856741012563,
      nestedKey: 'Group2',
      country: 'Germany',
      ip_address: '88.193.201.115',
      os: 'MacOS',
      task: 'Task B',
      project: 'Project Gamma',
      user: 'User1',
    },
    {
      timestamp: '2025-02-15T18:31:16.943981',
      value: 92,
      category: 'B',
      subCategory: 'X',
      amount: 421.25742548323984,
      logValue: 936.7974701431574,
      nestedKey: 'Group3',
      country: 'UK',
      ip_address: '95.20.58.184',
      os: 'Windows',
      task: 'Task C',
      project: 'Project Gamma',
      user: 'User2',
    },
    {
      timestamp: '2025-02-14T18:31:16.943990',
      value: 38,
      category: 'D',
      subCategory: 'Z',
      amount: 399.95542538334075,
      logValue: 421.0989002011938,
      nestedKey: 'Group3',
      country: 'UK',
      ip_address: '8.59.192.170',
      os: 'Android',
      task: 'Task B',
      project: 'Project Beta',
      user: 'User4',
    },
  ];

  if (
    storagesAreLoading ||
    projectsAreLoading ||
    usersAreLoading ||
    tasksAreLoading
  ) {
    return <p>Loading...</p>;
  }

  return (
    <div className='flex flex-wrap gap-4 p-4'>
      <div className='flex-1 min-w-[50%]'>
        <GraphModal
          data={generatedData}
          component={LineChart}
          title='Line Chart'
          onClose={() => console.log('Close Line Chart')}
          onMaximize={() => console.log('Maximize Line Chart')}
        />
      </div>
      <div className='flex-1 min-w-[50%]'>
        <GraphModal
          data={generatedData}
          component={ScatterChart}
          title='Scatter Chart'
          onClose={() => console.log('Close Scatter Chart')}
          onMaximize={() => console.log('Maximize Scatter Chart')}
        />
      </div>
      <div className='flex-1 min-w-[50%]'>
        <GraphModal
          data={generatedData}
          component={SunburstChart}
          title='Sunburst Chart'
          onClose={() => console.log('Close Sunburst Chart')}
          onMaximize={() => console.log('Maximize Sunburst Chart')}
        />
      </div>
      <div className='flex-1 min-w-[50%]'>
        <GraphModal
          data={generatedData}
          component={TreeMapVisualization}
          title='Tree Map'
          onClose={() => console.log('Close Tree Map')}
          onMaximize={() => console.log('Maximize Tree Map')}
        />
      </div>
      <div className='flex-1 min-w-[50%]'>
        <GraphModal
          data={generatedData}
          component={SankeyChart}
          title='Sankey Chart'
          onClose={() => console.log('Close Sankey Chart')}
          onMaximize={() => console.log('Maximize Sankey Chart')}
        />
      </div>
    </div>
  );
};

export default Reports;
