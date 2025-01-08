import React from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  return (
    <div 
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Navigation</h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Projects
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 