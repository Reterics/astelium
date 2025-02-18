import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Container from '../../components/Container.tsx';

import Dashboard from './Dashboard';
import Users from './Users';
import Projects from './Projects';
import Tasks from './Tasks';
import Clients from './Clients';
import StoragePage from './Storage';
import Transactions from './Transactions';
import Notes from './Notes';
import Reports from './Reports';
import Settings from './Settings';
import MainContent from './Example';

import Warehouses from './Warehouses';
import Domains from './Domains';
import InvoiceUsers from './InvoiceUsers';
import Invoices from './Invoices';
import ContractTemplates from './ContractTemplates';
import Contracts from './Contracts';
import PrivateRoute from '../../components/PrivateRoute.tsx';
import Board from './Board.tsx';
import Appointments from "../Appointments.tsx";

const AdminPanel = () => {
  return (
    <BrowserRouter basename='/admin/'>
      <Container>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/users' element={<Users />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/board' element={<Board />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/notes' element={<Notes />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/example' element={<MainContent />} />

            <Route path='/warehouses' element={<Warehouses />} />
            <Route path='/storage' element={<StoragePage />} />
            <Route path='/domains' element={<Domains />} />

            <Route path='/invoice-users' element={<InvoiceUsers />} />
            <Route path='/invoices' element={<Invoices />} />
            <Route path='/contract-templates' element={<ContractTemplates />} />
            <Route path='/contracts' element={<Contracts />} />
            <Route path='/transactions' element={<Transactions />} />

            <Route path='/appointments' element={<Appointments />} />
          </Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default AdminPanel;
