import {useEffect, useState} from 'react';
import {getFetchOptions} from '../../utils/utils.ts';

interface AccountData {
  name: string;
  subscription_plan: string;
  subscription_status: string;
  billing_cycle: string;
}

const Account = () => {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      const response = await fetch('/api/account', {...getFetchOptions()});
      const data = await response.json();
      setAccount(data.account);
      setIsAdmin(data.is_admin);
    };

    fetchAccount();
  }, []);

  if (!account) return <p>Loading...</p>;
  console.log(account, isAdmin);
  return (
    <div className='pb-1 shadow-md bg-zinc-50'>
      <div className='p-2 pb-0 flex items-center space-x-2 flex-col'>
        <h2 className='text-xl font-bold mb-4'>My Account</h2>
        <p>
          <strong>Company:</strong> {account.name}
        </p>
        <p>
          <strong>Subscription:</strong> {account.subscription_plan} (
          {account.subscription_status})
        </p>
        <p>
          <strong>Billing Cycle:</strong> {account.billing_cycle}
        </p>

        {isAdmin && (
          <div className='mt-4'>
            <h3 className='text-lg font-bold'>Manage Subscription</h3>
            <button className='bg-blue-500 text-white px-4 py-2 rounded'>
              Upgrade
            </button>
            <button className='bg-red-500 text-white px-4 py-2 rounded ml-2'>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
