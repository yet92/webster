import { Dropdown } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/redux.hook';
import { RootState } from '../../../store';
import { User } from '../../../store/authSlice';
import { fetchUsersAsync } from '../../../store/usersSlice';
import { useNavigate } from 'react-router-dom';
import { BiPhotoAlbum, BiVideo } from 'react-icons/bi';
import { AiOutlineSearch } from 'react-icons/ai';

export default function UsersTable() {
  const { users } = useSelector((selector: RootState) => selector.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, []);

  const [search, setSearch] = useState("");

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(search);
  };

  return (
    <div className='flex w-full flex-col items-center justify-start gap-10 rounded-xl p-5'>
      <div className='flex w-full flex-row items-center justify-between border-b-2 border-b-contrast p-5 text-text'>
        <span className='text-3xl'>WEBSTER Users</span>
        <div className='flex w-[25vw] flex-row items-center justify-between gap-2 border-b-2 border-b-contrast text-text'>
          <div className='absolute'>
            <AiOutlineSearch size={30} />
          </div>
          <input
            onChange={onSearchChange}
            className='w-full bg-transparent p-4 pl-10 focus:outline-none focus:ring-0'
            placeholder='Search for Projects'></input>
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-evenly gap-5'>
        {users && users.filter((user) => user?.login?.includes(search) || user?.email?.includes(search)).map((user, index) => (
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
        <div className='flex w-full flex-row items-center justify-center gap-4'>
          <img
            alt='avatar'
            src={user.avatar}
            className='h-[120px] rounded-2xl'
          />
          <div className='flex w-full flex-col items-start justify-center gap-5'>
            <div className='flex w-full flex-col items-start justify-center gap-4'>
              <span className='text-xl text-contrast'>Name</span>
              <span className='max-w-[200px] break-all'>
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
