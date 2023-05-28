import { AiOutlinePlusSquare } from 'react-icons/ai';
import { User } from '../../../store/authSlice';
import { ProjectType } from '../UserPage';

const collections = [
  {
    url: 'data:image/jpeg;base64,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',
    name: 'bird',
  },
  {
    url: 'data:image/jpeg;base64,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',
    name: 'bird',
  },
  {
    url: 'data:image/jpeg;base64,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',
    name: 'bird',
  },
];

// TODO: VLAD add collections

export function SideBar({
  user,
  setCurrentProjects,
}: {
  setCurrentProjects: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  user: User;
}) {
  return (
    <div className='flex w-full flex-col items-center gap-5 p-5'>
      <div className='flex w-full flex-col items-center justify-center gap-5 rounded-xl bg-secondary p-5'>
        <img
          className='h-[150px] w-[150px] rounded-full'
          alt='avatar'
          src={user.avatar}
        />
        <span className='text-center text-xl text-text'>
          {user.login || user.email.slice(0, user.email.indexOf('@'))}
        </span>
      </div>
      <button
        onClick={() => {
          setCurrentProjects('photo');
        }}
        className='w-full rounded-xl bg-secondary p-2 text-2xl text-text hover:bg-contrast '>
        Photo Projects
      </button>
      <button
        onClick={() => {
          setCurrentProjects('video');
        }}
        className='w-full rounded-xl bg-secondary p-2 text-2xl text-text hover:bg-contrast'>
        Video Projects
      </button>
      <span className='text-center text-2xl text-contrast'>Collections</span>
      <div className='flex w-full flex-col items-center justify-center gap-5 rounded-xl bg-secondary p-5 text-base'>
        {collections.map((collection, index) => (
          <CollectionItem key={index} collection={collection} />
        ))}
      </div>
    </div>
  );
}

const CollectionItem = ({ collection }: { collection: any }) => {
  return (
    <div className='flex w-full flex-row items-center gap-5 rounded-xl hover:bg-contrast'>
      <img
        alt='preview'
        src={collection.url}
        className='h-[50px] w-[50px] rounded-md'
      />
      <span className=' text-text'>{collection.name}</span>
    </div>
  );
};
