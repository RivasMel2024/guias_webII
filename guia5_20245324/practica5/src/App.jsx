import { useUIStore } from './store/uiStore'; 
 
function App() { 
  const { theme, toggleTheme } = useUIStore(); 
   
  return ( 
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}> 
      <h1 className={`text-4xl font-bold text-center pt-10 ${theme === 'dark' ? 'text-white' : 'text-blue-600'}`}> 
        Task Manager Pro 
      </h1> 
      <button onClick={toggleTheme} className="btn-primary mx-auto block mt-4"> 
        Cambiar a {theme === 'dark' ? 'Light' : 'Dark'} 
      </button> 
    </div> 
  ); 
} 
 
export default App;