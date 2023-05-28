import { Button, Dropdown, Navbar } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { User, logout } from '../../store/authSlice';
import React, { MouseEventHandler, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SignInModal from './SignInModal';
import { clearAllProjects } from '../../store/projectsSlice';

export function NavBar() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const { pathname } = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const onClickAuthModal = () => {
    setShowAuthModal(!showAuthModal);
  };

  return (
    <React.Fragment>
      <Navbar
        style={{ background: '#1A1A1A' }}
        className='md:w-[95vw] md:ml-6 absolute w-full z-50 top-[56px] min-h-[72px] h-fit align-middle items-center rounded-xl'
        fluid={true}
        rounded={true}>
        <Navbar.Brand href='/'>
          <span className='text-3xl text-text mt-2'>WEBSTER</span>
        </Navbar.Brand>
        <div className='flex md:order-2 gap-4 bg-transparent mt-1'>
          <div className='self-center cursor-pointer text-text text-xs'>
            <span className='text-contrast'>EN</span>/
            <span className=''>UK</span>
          </div>
          {auth.isAuthenticated ? (
            <ProfileMenu user={auth.me} />
          ) : (
            <button
              data-modal-target='defaultModal'
              data-modal-toggle='defaultModal'
              onClick={onClickAuthModal}
              className='rounded-lg bg-contrast md:text-base text-xs text-text p-1'>
              Login
            </button>
          )}
          <Navbar.Toggle className='h-[32px]' />
        </div>
        <Navbar.Collapse className='text-text text-center mt-3'>
          <Link
            className={`self-center text-2xl font-bold ${
              pathname === '/' ? 'text-contrast' : ''
            }`}
            to='/'>
            Home
          </Link>
          <Link
            to='/tools'
            className={`self-center text-2xl font-bold ${
              pathname === '/tools' ? 'text-contrast' : ''
            }`}>
            Tools
          </Link>
          <Link
            to='/news'
            className={`self-center text-2xl font-bold ${
              pathname === '/news' ? 'text-contrast' : ''
            }`}>
            News
          </Link>
          <Link
            to='/reviews'
            className={`self-center text-2xl font-bold ${
              pathname === '/reviews' ? 'text-contrast' : ''
            }`}>
            Reviews
          </Link>
        </Navbar.Collapse>
      </Navbar>
      <SignInModal show={showAuthModal} onClose={onClickAuthModal} />
    </React.Fragment>
  );
}

function ProfileMenu({ user }: { user: User }) {
  const dispatch = useDispatch();
  const onLogoutClick = () => {
    dispatch(logout());
    dispatch(clearAllProjects());
  };
  console.log(user.avatar);
  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      label={
        <div className='relative w-[40px] h-[40px] flex items-center justify-center'>
          <img
            alt='profileImg'
            src={user.avatar as string}
            className='rounded-full'
            crossOrigin='anonymous'
          />
        </div>
      }>
      <Dropdown.Header>
        <span className='block text-sm'>{user.login}</span>
        <span className='block truncate text-sm font-medium'>{user.email}</span>
      </Dropdown.Header>
      <Link to={'/profile'}>
        <Dropdown.Item>Profile</Dropdown.Item>
      </Link>
      <Link to={'/profile/favorites'}>
        <Dropdown.Item>Favorites</Dropdown.Item>
      </Link>
      <Link to={'/events/create'}>
        <Dropdown.Item>Create Event</Dropdown.Item>
      </Link>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Link to={'/profile/organization'}>
        <Dropdown.Item>Organization</Dropdown.Item>
      </Link>
      <Dropdown.Divider />
      <Dropdown.Item onClick={onLogoutClick}>Sign out</Dropdown.Item>
    </Dropdown>
  );
}
