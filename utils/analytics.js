// Simple analytics service
class Analytics {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      endpoints: new Map(),
      users: new Set()
    };
  }

  trackRequest(req, res, responseTime) {
    this.metrics.requests++;
    this.metrics.responseTime.push(responseTime);
    
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    this.metrics.endpoints.set(endpoint, 
      (this.metrics.endpoints.get(endpoint) || 0) + 1
    );

    if (req.user?.userId) {
      this.metrics.users.add(req.user.userId);
    }
  }

  trackError() {
    this.metrics.errors++;
  }

  getStats() {
    const avgResponseTime = this.metrics.responseTime.length > 0 
      ? this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length 
      : 0;

    return {
      totalRequests: this.metrics.requests,
      totalErrors: this.metrics.errors,
      errorRate: (this.metrics.errors / this.metrics.requests * 100).toFixed(2) + '%',
      avgResponseTime: Math.round(avgResponseTime) + 'ms',
      uniqueUsers: this.metrics.users.size,
      topEndpoints: Array.from(this.metrics.endpoints.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    };
  }

  reset() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      endpoints: new Map(),
      users: new Set()
    };
  }
}

module.exports = new Analytics();