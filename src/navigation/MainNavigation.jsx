const MainNavigation = () => {
  // ...existing code...
  
  return (
    <nav>
      // ...existing code...
      <Link to="/careers">Careers</Link>
      {user?.role === 'HR' && (
        <>
          <Link to="/hr/recruitment">Recruitment</Link>
          <Link to="/hr/recruitment/interviews">Interviews</Link>
        </>
      )}
      // ...existing code...
    </nav>
  );
};
