import { Modal } from 'flowbite-react';
import { AiOutlineClose } from 'react-icons/ai';
import CreateCollectionForm from './CreateCollectionForm';

export default function CreateCollectionModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      size='lg'
      className='bg-transparent backdrop-blur-sm'
      show={show}
      onClose={onClose}
      onClick={(e) => {
        e.stopPropagation();
      }}
      dismissible={false}>
      <Modal.Body className='flex flex-col items-center justify-center rounded-lg border-2 border-contrast bg-secondary p-5 shadow-2xl shadow-contrast'>
        <AiOutlineClose
          size={20}
          className='absolute right-5 top-5 cursor-pointer text-text hover:text-contrast'
          onClick={onClose}
        />
        <h1 className='py-10 text-4xl text-text'>Create Collection</h1>
        <div className='w-full max-w-sm rounded-lg shadow dark:border-gray-700 dark:bg-transparent'>
          <CreateCollectionForm onClose={onClose} />
        </div>
      </Modal.Body>
    </Modal>
  );
}
