import Description from './components/Description';
import HomePageHeader from './components/Header';

export default function Homepage() {
  return (
    <div className='relative flex h-full w-full flex-col gap-20'>
      <HomePageHeader />
      <div className='flex h-full w-full flex-wrap justify-between'>
        <Description />
      </div>
    </div>
  );
}
