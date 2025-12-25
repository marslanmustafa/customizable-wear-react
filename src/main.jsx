import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import store from './store/store.jsx';
import { Provider } from 'react-redux';
import { Toaster } from '@/components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
			<Toaster
				theme='light'
				
			/>
		</BrowserRouter>
	</Provider>,
);
