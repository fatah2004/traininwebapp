// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { user, userRole, logout } = useAuth();
  const [showLinks, setShowLinks] = useState(false);

  const handleToggleLinks = () => {
    setShowLinks(!showLinks);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {user && (
          <>
            <Link className="navbar-brand" to="/home">
              Your Logo
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              onClick={handleToggleLinks}
            >
              ☰
            </button>

            <div
              className={`navbar-collapse ${showLinks ? 'd-flex' : 'd-none'}`}
            >
              <ul className="navbar-nav ml-auto">
                {userRole === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/manage-users">
                        Manage Users
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/manage-formations">
                        Manage Formations
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/manage-feedback">
                        Manage Feedback
                      </Link>
                    </li>
                  </>
                )}
                {userRole === 'institution' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/institution-formations">
                        Institution Formations
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/trainers">
                        Trainers
                      </Link>
                    </li>
                  </>
                )}
                {userRole === 'trainer' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/formations">
                        Formations
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/feedback">
                        Feedback
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
