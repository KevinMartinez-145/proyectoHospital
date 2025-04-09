import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar'; // Import the Sidebar
// import Header from './Header'; // Optional: Create later

export function MainLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground"> {/* Use theme variables */}
      {/* Include the Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header /> */} {/* Optional Header */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6"> {/* Add padding */}
          <Outlet /> {/* Where routed pages will render */}
        </main>
      </div>
    </div>
  );
}