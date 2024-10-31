import { HiChevronRight, HiHome, HiOutlineInformationCircle, HiOutlineLogout } from 'react-icons/hi';
import { FiImage, FiSettings } from 'react-icons/fi';

export default function Sidebar() {
  return (
    <>
      <div className='toggle'>
        <span className='icon'>
          <HiChevronRight className='caret-forward' />
          <HiChevronRight className='caret-backward' />
        </span>
      </div>
      <div className='sidebar'>
        <ul>
          <li className='logo'>
            <a href='#'>
              <div className='icon'>
                <HiHome />
              </div>
              <div className='text'>OpenSMM</div>
            </a>
          </li>
          <div className='menu-list'>
            <li id='sidebar-home'>
              <a href='/'>
                <div className='icon'>
                  <HiHome />
                </div>
                <div className='text'>Home</div>
              </a>
            </li>
            <li id='sidebar-media'>
              <a href='/media'>
                <div className='icon'>
                  <FiImage />
                </div>
                <div className='text'>Media</div>
              </a>
            </li>
            <li id='sidebar-settings'>
              <a href='/settings'>
                <div className='icon'>
                  <FiSettings />
                </div>
                <div className='text'>Settings</div>
              </a>
            </li>
          </div>
          <li id='sidebar-about'>
            <a href='/about'>
              <div className='icon'>
                <HiOutlineInformationCircle />
              </div>
              <div className='text'>About</div>
            </a>
          </li>
          <div className='bottom'>
            <li>
              <a href='#'>
                <div className='icon'>
                  <div className='imgBx'>
                    <img src='assets/img/user-default.png' alt='img' />
                  </div>
                </div>
                <div id='user-email' className='text'>
                  Username
                </div>
              </a>
            </li>
            <li>
              <a href='/logout'>
                <div className='icon'>
                  <HiOutlineLogout />
                </div>
                <div className='text'>Logout</div>
              </a>
            </li>
          </div>
        </ul>
      </div>
    </>
  );
}
