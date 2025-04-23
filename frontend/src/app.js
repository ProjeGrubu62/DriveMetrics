// ... existing code ...

// Yönlendirme ekranı yerine direkt login sayfasına gideceğiz
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/dashboard/*" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

// ... existing code ...