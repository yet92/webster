import { Dropdown } from 'flowbite-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/redux.hook';
import { RootState } from '../../../store';
import { User } from '../../../store/authSlice';
import { fetchUsersAsync } from '../../../store/usersSlice';
import { useNavigate } from 'react-router-dom';
import { BiPhotoAlbum, BiVideo } from 'react-icons/bi';

export default function UsersTable() {
  const { users } = useSelector((selector: RootState) => selector.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, []);

  return (
    <div className='flex w-full flex-col items-center justify-start gap-10 rounded-xl p-5'>
      <div className='flex w-full flex-row items-center justify-between border-b-2 border-b-contrast p-5 text-text'>
        <span className='text-3xl'>WEBSTER Users</span>
        <Dropdown label='Sort' className='bg-contrast'>
          <Dropdown.Item></Dropdown.Item>
          <Dropdown.Item></Dropdown.Item>
          <Dropdown.Item></Dropdown.Item>
        </Dropdown>
      </div>

      <div className='flex flex-wrap items-center justify-evenly gap-5'>
        {users.map((user, index) => (
          <UserCard user={user} key={index} />
        ))}
      </div>
    </div>
  );
}

const UserCard = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  const onCardClick = () => {
    navigate(`/users/${user.id}`);
  };

  return (
    <div
      onClick={onCardClick}
      className='flex h-[180px] w-[450px] cursor-pointer flex-col items-center justify-center rounded-xl bg-secondary p-4 hover:bg-gray-900'>
      <div className='flex h-full w-full flex-row items-center justify-between gap-4'>
        <div className='flex w-full flex-row items-center gap-4 justify-center'>
          <img
            alt='avatar'
            src={user.avatar}
            className='h-[120px] rounded-2xl'
          />
          <div className='flex w-full flex-col items-start justify-center gap-5'>
            <div className='flex w-full flex-col items-start justify-center gap-4'>
              <span className='text-xl text-contrast'>Name</span>
              <span className='break-all max-w-[200px]'>
                {user.login || user.email.slice(0, user.email.indexOf('@'))}
              </span>
            </div>
          </div>
        </div>
        <div className='flex w-1/5 flex-col items-end justify-end gap-2'>
          <div className='flex h-[60px] w-[60px] flex-row items-center justify-center gap-2 rounded-xl bg-contrast p-2'>
            <span className='text-lg'>{user.projects?.length}</span>
            <BiPhotoAlbum size={20} />
          </div>
          <div className='flex h-[60px] w-[60px] flex-row items-center justify-center gap-2 rounded-xl bg-contrast p-2'>
            <span className='text-lg'>{0}</span>
            <BiVideo size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
