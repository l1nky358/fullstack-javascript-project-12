import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import Chat from './components/Chat';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import NotFound from './components/pages/NotFound';
import { useAuth } from './hooks/useAuth';
import { useGetChannelsQuery } from './services/api';
import { setCurrentChannel } from './store/channelsSlice';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const { token } = useAuth();
  const dispatch = useDispatch();
  const { data: channels = [] } = useGetChannelsQuery();

  // Автоматически выбираем канал при загрузке
  useEffect(() => {
    if (channels.length > 0) {
      const general = channels.find(ch => ch.name === 'general');
      if (general) {
        dispatch(setCurrentChannel(general.id));
      } else {
        dispatch(setCurrentChannel(channels[0].id));
      }
    }
  }, [channels, dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="d-flex flex-column vh-100">
        <Header />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
