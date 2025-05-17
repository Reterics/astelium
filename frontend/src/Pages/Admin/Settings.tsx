import {useEffect, useState} from 'react';
import {baseURL} from "../../utils/utils.ts";

const Settings = () => {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch(baseURL + '/api/settings')
      .then((res) => res.json())
      .then(setSettings);
  }, []);

  return (
    <div>
      <h1>Settings</h1>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  );
};

export default Settings;
