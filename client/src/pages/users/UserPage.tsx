import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UsersPageHeader from './components/Header';
import { PhotoProjects } from './components/PhotoProjects';
import { SideBar } from './components/SideBar';
import { VideoProjects } from './components/VideoProjects';
import { useAppDispatch } from '../../hooks/redux.hook';
import { fetchUserAsync } from '../../store/usersSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import { Project } from '../../store/projectsSlice';

export type ProjectType = 'photo' | 'video';

enum projectTypes {
  photo = 'photo',
  video = 'video',
}

export default function UserPage() {
  const { currentUser } = useSelector((selector: RootState) => selector.users);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [currentProjects, setCurrentProjects] = useState<ProjectType | null>(
    null
  );

  useEffect(() => {
    console.log(
      location.pathname.slice(
        location.pathname.lastIndexOf('/') + 1,
        location.pathname.length
      )
    );
    dispatch(
      fetchUserAsync(
        location.pathname.slice(
          location.pathname.lastIndexOf('/') + 1,
          location.pathname.length
        )
      )
    );
  }, []);

  return (
    <div className='relative flex h-full w-full flex-col gap-20'>
      <UsersPageHeader />
      <div className='flex h-full w-full flex-wrap justify-between'>
        <div className='flex w-full flex-row items-center justify-center'>
          <div className='flex h-full w-1/4 justify-start'>
            <SideBar
              user={currentUser}
              setCurrentProjects={setCurrentProjects}
            />
          </div>
          <div className='flex h-full w-5/6 justify-start'>
            {(() => {
              switch (currentProjects) {
                case projectTypes.photo:
                  return (
                    <PhotoProjects projects={currentUser.projects || []} />
                  );
                case projectTypes.video:
                  return (
                    <VideoProjects projects={currentUser.projects || []} />
                  );
                default:
                  return (
                    <PhotoProjects projects={currentUser.projects || []} />
                  );
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
