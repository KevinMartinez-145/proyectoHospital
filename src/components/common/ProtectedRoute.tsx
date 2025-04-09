// src/components/common/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore'; 

export function ProtectedRoute() { // Use named export
  // 1. Get the authentication status from the global Zustand store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // 2. Get the current location object (contains pathname, search, hash, state)
  const location = useLocation();

  // 3. Check if the user is authenticated
  if (!isAuthenticated) {
    // User is not logged in!
    console.log('ProtectedRoute: User not authenticated, redirecting to /login'); // Optional: for debugging

    // Redirect them to the /login page.
    // - `replace`: Replaces the current entry in the history stack, so the user
    //   can't click "back" to get to the protected route they were denied access to.
    // - `state={{ from: location }}`: Pass the current location object in the
    //   navigation state. This allows the LoginPage (or the useLogin hook)
    //   to potentially redirect the user back to the page they originally
    //   intended to visit after a successful login. (Optional enhancement)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. User is authenticated! Render the child route element.
  // The <Outlet /> component is a placeholder provided by React Router
  // that renders the matched child route defined in App.tsx
  // (in our case, this will be the <MainLayout /> route).
  return <Outlet />;
}