import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './Dashboard';
import Users from './Users';
import Projects from './Projects';
import Tasks from './Tasks';
import Clients from './Clients';
import Reports from './Reports';
import Settings from './Settings';
import Transactions from './Transactions.tsx';
import Notes from './Notes.tsx';
import StoragePage from './Storage.tsx';
import MainContent from './Example.tsx';
import Container from '../../components/Container.tsx';

const AdminPanel = () => {
  return (
    <BrowserRouter basename='/admin/'>
      <Container>
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/users' element={<Users />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/clients' element={<Clients />} />
          <Route path='/storage' element={<StoragePage />} />
          <Route path='/transactions' element={<Transactions />} />
          <Route path='/notes' element={<Notes />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/example' element={<MainContent />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default AdminPanel;
