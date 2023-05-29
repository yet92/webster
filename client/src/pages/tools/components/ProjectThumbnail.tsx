import { Dropdown, Tooltip } from 'flowbite-react';
import { RiSettings4Fill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/redux.hook';
import { RootState } from '../../../store';
import {
  Collection,
  removeProjFromCollection,
} from '../../../store/collectionSlice';
import {
  Project,
  addToCollectionAsync,
  changeIsPublicAsync,
  fetchProjectsAsync,
  removeFromCollectionAsync,
} from '../../../store/projectsSlice';
import { removeFetch } from '../utils/removeProject';

export const ProjectThumbnail = ({ project }: { project: Project }) => {
  const dispatch = useAppDispatch();
  const { me } = useSelector((selector: RootState) => selector.auth);
  const onClickRemove = async () => {
    await removeFetch(project.id, me.accessToken as string);
    dispatch(fetchProjectsAsync(me.accessToken as string));
  };
  const { collections } = useSelector(
    (selector: RootState) => selector.collections
  );
  const onClickChangePrivacy = async () => {
    console.log('there');
    dispatch(
      changeIsPublicAsync({
        accessToken: me.accessToken as string,
        id: project.id,
        isPublic: !project.isPublic,
      })
    );
  };
  const clickCollectionHandler = (collection: Collection) => {
    if (me.accessToken)
      dispatch(
        addToCollectionAsync({
          accessToken: me.accessToken,
          collectionId: collection.id,
          projectId: project.id,
        })
      );
  };

  const clickRemoveHandler = () => {
    if (me.accessToken)
      dispatch(
        removeFromCollectionAsync({
          accessToken: me.accessToken,
          projectId: project.id,
        })
      );
    dispatch(removeProjFromCollection(project));
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src =
      'https://res.cloudinary.com/drq4rqj3n/image/upload/v1685287400/webster_ews2pu.png';
  };
  return (
    <div className='flex h-fit w-fit cursor-pointer flex-col rounded-md border-2 border-transparent bg-bg transition hover:border-contrast hover:shadow-2xl hover:shadow-contrast'>
      <img
        className='h-[300px] w-[400px] rounded-t-xl'
        src={project.thumbnail}
        onError={handleImageError}
        alt='project img'
      />
      <div className='flex  w-full flex-row items-center justify-between gap-4'>
        <span className='p-2 text-center text-lg text-text'>
          {project.title}
        </span>

        <Dropdown
          arrowIcon={false}
          inline
          placement='top'
          label={
            <Tooltip content='Settings' style='dark'>
              <div className='p-2 text-contrast hover:text-black'>
                <RiSettings4Fill size={40} />
              </div>
            </Tooltip>
          }>
          <Dropdown.Item>
            <span>Open</span>
          </Dropdown.Item>
          {project.collectionId ? (
            <Dropdown.Item onClick={clickRemoveHandler}>
              <span className='text-red-600'>Remove from Collection</span>
            </Dropdown.Item>
          ) : (
            <Tooltip
              className='shadow-2xl shadow-contrast'
              content={
                <div className='flex w-full flex-col gap-5'>
                  {collections.map((collection, index) => (
                    <div
                      className='flex w-full flex-row items-center gap-5 rounded-xl hover:bg-contrast'
                      onClick={() => clickCollectionHandler(collection)}
                      key={index}>
                      <img
                        onError={handleImageError}
                        alt='preview'
                        src={collection.thumbnail || ''}
                        className='h-[50px] w-[50px] rounded-md'
                      />
                      <span className=' text-text'>{collection.title}</span>
                    </div>
                  ))}
                </div>
              }
              placement='left'
              style='dark'>
              <Dropdown.Item>
                <span>Add to Collection</span>
              </Dropdown.Item>
            </Tooltip>
          )}
          <Dropdown.Item onClick={onClickChangePrivacy}>
            <span
              className={`${
                project.isPublic ? 'text-contrast' : 'text-red-600'
              }`}>
              {project.isPublic ? 'Make Private' : 'Make Public'}
            </span>
          </Dropdown.Item>
          <Dropdown.Item>
            <span>Share</span>
          </Dropdown.Item>
          <Dropdown.Item onClick={onClickRemove}>
            <span className='text-red-600'>Remove</span>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
};
