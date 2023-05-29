import { AiOutlinePlus } from 'react-icons/ai';

export function VideoProjects() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-start gap-10 p-4'>
      <div className='flex w-full flex-row items-center justify-between text-text '>
        <h3 className='text-4xl'>Your  Video Projects</h3>
        <button className='flex w-1/4 flex-row items-center justify-center gap-5 rounded-xl bg-contrast p-2'>
          <AiOutlinePlus size={30} />
          <span className='text-xl font-bold'>Create</span>
        </button>
      </div>
      <div className='flex h-full w-full flex-wrap items-center justify-center rounded-xl bg-secondary gap-5 p-2 py-5'>
        <span className='text-4xl text-contrast'>Coming Soon...</span>
      </div>
    </div>
  );
}
