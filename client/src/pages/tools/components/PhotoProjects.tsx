import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/redux.hook';
import { RootState } from '../../../store';
import { fetchProjectsAsync } from '../../../store/projectsSlice';
import CreateProjectModal from './CreateProjectModal';
import { ProjectThumbnail } from './ProjectThumbnail';

export function PhotoProjects() {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();

  const {
    auth,
    projects: { projects },
  } = useSelector((selector: RootState) => selector);

  const onCreateClick = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    dispatch(fetchProjectsAsync(auth.me.accessToken as string));
  }, [auth]);

  return (
    <div className='flex h-full w-full flex-col items-center justify-start gap-10 p-4'>
      <div className='flex w-full flex-row items-center justify-between text-text '>
        <h3 className='text-4xl'>Your Photo Projects</h3>
        <button
          onClick={onCreateClick}
          className='flex w-1/4 flex-row items-center justify-center gap-5 rounded-xl bg-contrast p-2'>
          <AiOutlinePlus size={30} />
          <span className='text-xl font-bold'>Create</span>
          <CreateProjectModal show={showModal} onClose={onCreateClick} />
        </button>
      </div>
      <div className='flex h-full w-full flex-wrap items-center justify-evenly gap-5 rounded-xl bg-secondary p-2 py-5'>
        {projects.length ? (
          projects.map((project, index) => (
            <ProjectThumbnail project={project} key={index} />
          ))
        ) : (
          <span className='text-center text-4xl text-contrast'>
            Oops, nothing here...
          </span>
        )}
      </div>
    </div>
  );
}
