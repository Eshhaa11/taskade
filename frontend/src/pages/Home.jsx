import React from 'react';
import { 
  CheckSquare, 
  Users, 
  Clock, 
  Zap, 
  Star, 
  ArrowRight,
  Play,
  BarChart3,
  Calendar,
  MessageSquare
} from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Organize your work and life,{' '}
              <span className="hero-title-accent">
                finally
              </span>
            </h1>
            <p className="hero-description">
              Taskade is the all-in-one workspace where teams come together to plan, organize, 
              and collaborate on any project. Turn chaos into clarity with our intuitive task management platform.
            </p>
            <div className="hero-buttons">
              <button className="hero-cta-primary">
                <span>Start for free</span>
                <ArrowRight className="hero-button-icon" />
              </button>
              <button className="hero-cta-secondary">
                <Play className="hero-button-icon" />
                <span>Watch demo</span>
              </button>
            </div>
            <p className="hero-subtext">
              ✨ Free forever • No credit card required • 2 minutes setup
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Everything you need to stay productive
            </h2>
            <p className="features-description">
              Powerful features that help you organize tasks, collaborate with teams, and achieve your goals faster.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card feature-card-blue">
              <div className="feature-icon feature-icon-blue">
                <CheckSquare className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">Smart Task Management</h3>
              <p className="feature-description">
                Create, organize, and prioritize tasks with intelligent automation and deadline tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card feature-card-purple">
              <div className="feature-icon feature-icon-purple">
                <Users className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">Team Collaboration</h3>
              <p className="feature-description">
                Work together seamlessly with real-time updates, comments, and shared workspaces.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card feature-card-green">
              <div className="feature-icon feature-icon-green">
                <Clock className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">Time Tracking</h3>
              <p className="feature-description">
                Monitor productivity with built-in time tracking and detailed progress reports.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card feature-card-orange">
              <div className="feature-icon feature-icon-orange">
                <Calendar className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">Calendar Integration</h3>
              <p className="feature-description">
                Sync with your favorite calendar apps and never miss a deadline again.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card feature-card-teal">
              <div className="feature-icon feature-icon-teal">
                <BarChart3 className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">Analytics & Insights</h3>
              <p className="feature-description">
                Get detailed insights into your productivity patterns and team performance.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card feature-card-pink">
              <div className="feature-icon feature-icon-pink">
                <MessageSquare className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">Built-in Chat</h3>
              <p className="feature-description">
                Communicate instantly with team members without leaving your workspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to supercharge your productivity?
          </h2>
          <p className="cta-description">
            Join thousands of teams who have transformed their workflow with Taskade.
          </p>
          <div className="cta-buttons">
            <button className="cta-primary">
              <Zap className="cta-button-icon" />
              <span>Start free trial</span>
            </button>
            <button className="cta-secondary">
              <Star className="cta-button-icon" />
              <span>View pricing</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <CheckSquare className="footer-logo-svg" />
                </div>
                <span className="footer-logo-text">Taskade</span>
              </div>
              <p className="footer-brand-description">
                The all-in-one workspace for teams to plan, organize, and collaborate on any project.
              </p>
            </div>
            
            <div className="footer-links">
              <h3 className="footer-links-title">Product</h3>
              <ul className="footer-links-list">
                <li><a href="#" className="footer-link">Features</a></li>
                <li><a href="#" className="footer-link">Pricing</a></li>
                <li><a href="#" className="footer-link">Templates</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h3 className="footer-links-title">Company</h3>
              <ul className="footer-links-list">
                <li><a href="#" className="footer-link">About</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 Taskade. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;