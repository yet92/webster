import { Modal } from 'flowbite-react';
import { AiOutlineClose } from 'react-icons/ai';

export default function CreateCollectionModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      size='md'
      className='bg-secondary backdrop-blur-sm'
      show={show}
      onClose={onClose}
      dismissible={true}>
      <Modal.Body className='flex flex-col items-center justify-center rounded-lg bg-secondary drop-shadow-2xl'>
        <AiOutlineClose
          size={20}
          className='absolute right-5 top-5 cursor-pointer text-text hover:text-contrast'
          onClick={onClose}
        />
        <h1 className='py-20 text-4xl text-text'>WEBSTER</h1>
        <div className='w-full max-w-sm rounded-lg shadow dark:border-gray-700 dark:bg-transparent'>
          <CreateCollectionForm />
        </div>
      </Modal.Body>
    </Modal>
  );
}

function CreateCollectionForm() {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-5'>
      <div className='flex w-full flex-col gap-4 text-text'>
        <span className='text-xl'>Collection Title</span>
      </div>
    </div>
  );
}
