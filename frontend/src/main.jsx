import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom';
import './index.css'





// commented out my React Strict Mode in order to allow to render more than one expense card after clicking cancal
// react strict mode can sometimes cause double rendering, which can mess with modals and focus behavior

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
        <ChakraProvider>
          <App />
        </ChakraProvider>
    </BrowserRouter>
  // </React.StrictMode>
);

