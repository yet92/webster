import { AiOutlinePlus } from 'react-icons/ai';
import { Project } from '../../../store/projectsSlice';

export function VideoProjects({ projects }: { projects: Project[] }) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-start gap-10 p-4'>
      <div className='flex w-full flex-row items-center justify-between text-text '>
        <h3 className='text-4xl'>Video Projects</h3>
      </div>
      <div className='flex h-full w-full flex-wrap items-center justify-center gap-5 rounded-xl bg-secondary p-2 py-5'>
        <span className='text-4xl text-contrast'>Coming Soon...</span>
      </div>
    </div>
  );
}
