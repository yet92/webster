import { Tooltip } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/redux.hook';
import { RootState } from '../../../store';
import {
  Collection,
  fetchCollectionsAsync,
  fetchOneCollectionAsync,
  removeCollectionAsync,
} from '../../../store/collectionSlice';
import { ProjectType } from '../ToolsPage';
import CreateCollectionModal from './CreateCollectionModal';

export function SideBar({
  setCurrentProjects,
}: {
  setCurrentProjects: React.Dispatch<React.SetStateAction<ProjectType | null>>;
}) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();
  const {
    auth,
    collections: { collections },
  } = useSelector((selector: RootState) => selector);

  const onCreateClick = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    dispatch(fetchCollectionsAsync(auth.me.accessToken as string));
  }, [auth]);

  const { me } = useSelector((selector: RootState) => selector.auth);
  return (
    <div className='flex w-full flex-col items-center gap-5 p-5'>
      <div className='flex w-full flex-col items-center justify-center gap-5 rounded-xl bg-secondary p-5'>
        <img
          className='h-[150px] w-[150px] rounded-full'
          alt='avatar'
          src={me.avatar}
        />
        <span className='text-center text-xl text-text'>
          {me.login || me.email.slice(0, me.email.indexOf('@'))}
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
        <div
          onClick={onCreateClick}
          className='flex w-full cursor-pointer flex-row items-center gap-5 rounded-xl p-1 hover:bg-contrast hover:text-text'>
          <AiOutlinePlusSquare size={50} />
          <span>Create Collection</span>
          <CreateCollectionModal show={showModal} onClose={onCreateClick} />
        </div>
        {collections &&
          collections.map((collection, index) => (
            <CollectionItem
              key={index}
              collection={collection}
              setCurrentProjects={setCurrentProjects}
            />
          ))}
      </div>
    </div>
  );
}

const CollectionItem = ({
  collection,
  setCurrentProjects,
}: {
  collection: Collection;
  setCurrentProjects: React.Dispatch<React.SetStateAction<ProjectType | null>>;
}) => {
  const dispatch = useAppDispatch();
  const { auth } = useSelector((selector: RootState) => selector);

  const handleRemoveClick = () => {
    if (auth.me.accessToken)
      dispatch(
        removeCollectionAsync({
          accessToken: auth.me.accessToken,
          id: collection.id,
        })
      );
    setCurrentProjects('photo');
  };

  const handleCollectionClick = () => {
    setCurrentProjects('collection');
    if (auth.me.accessToken)
      dispatch(
        fetchOneCollectionAsync({
          accessToken: auth.me.accessToken,
          id: collection.id,
        })
      );
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src =
      'https://res.cloudinary.com/drq4rqj3n/image/upload/v1685287400/webster_ews2pu.png';
  };

  return (
    <div className='border-contrast-contrast flex w-full flex-row items-center gap-5 rounded-xl border-b hover:bg-contrast'>
      <div
        className='flex w-full flex-row items-center gap-5 rounded-xl'
        onClick={handleCollectionClick}>
        <img
          onError={handleImageError}
          alt='preview'
          src={collection.thumbnail || ''}
          className='h-[50px] w-[50px] rounded-md'
        />
        <span className=' text-text'>{collection.title}</span>
      </div>
      <Tooltip content='Delete Collection' style='dark'>
        <div
          className='cursor-pointer p-4 text-contrast hover:text-black'
          onClick={handleRemoveClick}>
          <BsFillTrashFill size={15} />
        </div>
      </Tooltip>
    </div>
  );
};
