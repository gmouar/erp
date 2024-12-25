class SessionManager {
  static checkSession() {
    const lastActivity = localStorage.getItem('lastActivity');
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    
    if (lastActivity && (Date.now() - parseInt(lastActivity, 10)) > sessionTimeout) {
      this.clearSession();
      return false;
    }
    
    this.updateLastActivity();
    return true;
  }

  static updateLastActivity() {
    localStorage.setItem('lastActivity', Date.now().toString());
  }

  static clearSession() {
    localStorage.removeItem('lastActivity');
    // Additional cleanup if needed
  }
}

export default SessionManager;
