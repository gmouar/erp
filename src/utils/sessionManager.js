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

  static initSession() {
    this.updateLastActivity();
    this.startSessionMonitor();
  }

  static startSessionMonitor() {
    // Check session every minute
    const interval = 60 * 1000; 
    
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    
    this._intervalId = setInterval(() => {
      this.checkSession();
    }, interval);
  }

  static stopSessionMonitor() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  static clearSession() {
    this.stopSessionMonitor();
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('user');
    // Additional cleanup if needed
  }
}

export default SessionManager;
