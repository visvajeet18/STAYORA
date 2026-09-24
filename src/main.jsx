import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store/store';

import App from './App.jsx';
import ListPage from './pages/ListPage.jsx';
import AddPage from './pages/AddPage.jsx';
import EditPage from './pages/EditPage.jsx';
import DetailPage from './pages/DetailPage.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<ListPage />} />
              <Route path="add" element={<AddPage />} />
              <Route path="edit/:id" element={<EditPage />} />
              <Route path="hotel/:id" element={<DetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
);
