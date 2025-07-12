import React, { useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import SessionContext from '../context/SessionContext';
import SearchButton from './SearchButton';
import ThemeToggle from './ThemeToggle';
import supabase from '../supabase/supabase-client';
import Vault2 from '../assets/Vault2.png';
import Modal from './Modal';

export default function Header() {
  const navigate = useNavigate();
  const { session } = useContext(SessionContext);
  const [signoutMessage, setSignoutMessage] = useState('');
  const signoutModalRef = useRef(null);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setSignoutMessage(`Sign-out error: ${error.message}`);
    } else {
      setSignoutMessage('Signed out successfully!');
    }
    signoutModalRef.current?.showModal();
  };

  return (
    <>
      <header className="bg-base-100 shadow-sm grid grid-cols-3 items-center px-4 py-2">
        {/* Left: Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>

        {/* Center: Logo */}
        <div className="flex justify-center">
          <Link to="/">
            <img src={Vault2} alt="Vault logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Right: Search and user menu */}
        <div className="flex items-center justify-end space-x-2">
          <SearchButton />

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
            >
              {!session ? (
                <>
                  <li>
                    <Link to="/register" className="secondary">
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="secondary">
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <span>Hey {session.user.user_metadata.first_name}</span>
                  </li>
                  <li>
                    <Link to="/account">Edit your account</Link>
                  </li>
                  <li>
                    <button onClick={signOut}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>

      {/* Sign-out modal */}
      <Modal
        id="signout-modal"
        ref={signoutModalRef}
        title="Logout"
        onClose={() => navigate('/')}
      >
        <p>{signoutMessage}</p>
      </Modal>
    </>
  );
}
