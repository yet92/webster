import ToolsPageHeader from './components/Header';
import { PhotoProjects } from './components/PhotoProjects';
import { SideBar } from './components/SideBar';
import { useState } from 'react';
import { VideoProjects } from './components/VideoProjects';

export type ProjectType = 'photo' | 'video';

enum projectTypes {
  photo = 'photo',
  video = 'video',
}

export default function ToolsPage() {
  const [currentProjects, setCurrentProjects] = useState<ProjectType | null>(
    null
  );

  return (
    <div className='relative flex h-full w-full flex-col gap-20'>
      <ToolsPageHeader />
      <div className='flex h-full w-full flex-wrap justify-between'>
        <div className='flex w-full flex-row items-center justify-center'>
          <div className='flex h-full w-1/4 justify-start'>
            <SideBar setCurrentProjects={setCurrentProjects} />
          </div>
          <div className='flex h-full w-5/6 justify-start'>
            {(() => {
              switch (currentProjects) {
                case projectTypes.photo:
                  return <PhotoProjects />;
                case projectTypes.video:
                  return <VideoProjects />;
                default:
                  return <PhotoProjects />;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
