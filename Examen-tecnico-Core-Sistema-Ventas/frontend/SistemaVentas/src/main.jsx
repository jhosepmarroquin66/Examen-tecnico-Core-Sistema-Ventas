import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css' // <-- ESTO CARGA LOS ESTILOS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'// ESTA LÍNEA ES LA QUE HACE QUE LOS MODALES SE ABRAN:

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)