import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/redux.hook';
import { RootState } from '../../../store';
import { fetchProjectsAsync } from '../../../store/projectsSlice';
import { ProjectThumbnail } from './ProjectThumbnail';
import { AiOutlineSearch } from 'react-icons/ai';

export function CollectionProjects() {
  const dispatch = useAppDispatch();

  const {
    auth,
    collections: { currentCollection },
  } = useSelector((selector: RootState) => selector);

  useEffect(() => {
    dispatch(fetchProjectsAsync(auth.me.accessToken as string));
  }, [auth]);

  const [search, setSearch] = useState('');

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className='flex h-full w-full flex-col items-center justify-start gap-10 p-4'>
      <div className='flex w-full flex-row items-center justify-between text-text '>
        <h3 className='text-4xl'>
          Photo Projects from{' '}
          <span className='text-contrast'>{currentCollection.title}</span>{' '}
          collection
        </h3>
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
      <div className='flex h-full w-full flex-wrap items-center justify-evenly gap-5 rounded-xl bg-secondary p-2 py-5'>
        {currentCollection.projects.length ? (
          currentCollection.projects
            .filter((project) => project.title.includes(search))
            .map((project, index) => (
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
