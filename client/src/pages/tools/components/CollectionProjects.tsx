import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/redux.hook';
import { RootState } from '../../../store';
import { fetchProjectsAsync } from '../../../store/projectsSlice';
import { ProjectThumbnail } from './ProjectThumbnail';
import { fetchOneCollectionAsync } from '../../../store/collectionSlice';

export function CollectionProjects() {
  const dispatch = useAppDispatch();

  const {
    auth,
    collections: { currentCollection },
    projects: { projects },
  } = useSelector((selector: RootState) => selector);

  useEffect(() => {
    dispatch(fetchProjectsAsync(auth.me.accessToken as string));
  }, [auth]);

  return (
    <div className='flex h-full w-full flex-col items-center justify-start gap-10 p-4'>
      <div className='flex w-full flex-row items-center justify-between text-text '>
        <h3 className='text-4xl'>
          Photo Projects from{' '}
          <span className='text-contrast'>{currentCollection.title}</span>{' '}
          collection
        </h3>
      </div>
      <div className='flex h-full w-full flex-wrap items-center justify-evenly gap-5 rounded-xl bg-secondary p-2 py-5'>
        {currentCollection.projects.length ? currentCollection.projects.map((project, index) => (
          <ProjectThumbnail project={project} key={index} />
        )) : <span className='text-center text-contrast text-4xl'>Oops, nothing here...</span>}
      </div>
    </div>
  );
}
