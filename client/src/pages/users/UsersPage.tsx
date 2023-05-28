import UsersPageHeader from "./components/Header";
import UsersTable from "./components/Table";

export default function UsersPage() {
  return (
    <div className='relative flex h-full w-full flex-col gap-20'>
      <UsersPageHeader />
      <div className='flex h-full w-full flex-wrap justify-between'>
        <div className='flex w-full h-full flex-row items-center justify-center'>
            <UsersTable />
        </div>
      </div>
    </div>
  );
}
