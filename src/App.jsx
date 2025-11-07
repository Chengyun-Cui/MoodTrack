import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import TrendsPage from "./pages/TrendsPage";


function PrivateRoute({ children }) {
 // const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isLoggedIn = true;// hard code, need delete later
  return isLoggedIn ? children : <Navigate to="/auth" />;
}


function Layout({ children }) {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== "/auth";
  return (
    <div className="app">
      {showHeaderFooter && <Header />}
      <main id="main" className="main" tabIndex="-1">
        {children}
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/trends"
            element={
              <PrivateRoute>
                <TrendsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;