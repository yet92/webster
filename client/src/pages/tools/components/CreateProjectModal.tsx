import { Modal, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addError, clearErrors } from '../../../store/errorsSlice';
import { createProject } from '../../../store/projectsSlice';
import { Errors } from '../../auth/components';
import { createFetch } from '../utils/createProject';

export type FormData = {
  title: string;
  thumbnail: string;
};

const initialFormData: FormData = {
  title: '',
  thumbnail: '',
};

export default function CreateProjectModal({
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
        <h1 className='py-10 text-4xl text-text'>Create Project</h1>
        <div className='w-full max-w-sm rounded-lg shadow dark:border-gray-700 dark:bg-transparent'>
          <CreateProjectForm onClose={onClose} />
        </div>
      </Modal.Body>
    </Modal>
  );
}

function CreateProjectForm({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();
  const { me } = useSelector((selector: RootState) => selector.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    thumbnail: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async () => {
    dispatch(clearErrors());
    console.log(formData);
    setLoading(true);
    const { response, json } = await createFetch(
      formData,
      me.accessToken as string
    );
    setLoading(false);
    if (!response.ok) {
      // add error
      dispatch(addError({ message: json.message }));
    } else {
      if (json.data.project) {
        onClose();
        dispatch(clearErrors());
        setFormData(initialFormData);
        dispatch(createProject(json.data as any));
      }
    }
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src =
      'https://res.cloudinary.com/drq4rqj3n/image/upload/v1685287400/webster_ews2pu.png';
  };

  return (
    <div className='flex w-full flex-col items-center justify-center gap-8'>
      {loading ? (
        <Spinner size={100} />
      ) : (
        <>
          <div className='flex w-full flex-col gap-4 text-text'>
            <span className='text-xl'>Project Title</span>
            <input
              placeholder='Title'
              onChange={onChange}
              className='w-full border-b-2 border-text border-b-contrast bg-secondary p-2 text-text'
              id='title'
              name='title'
            />
          </div>
          <div className='flex w-full flex-col gap-4 text-text'>
            <span className='text-xl'>Project Thumbnail</span>
            <input
              placeholder='Thumbnail URL'
              onChange={onChange}
              value={formData.thumbnail}
              className='w-full border-b-2 border-text border-b-contrast bg-secondary p-2 text-text'
              id='thumbnail'
              name='thumbnail'
            />
            <img
              onError={handleImageError}
              className='max-w-[400px] rounded-xl'
              src={formData.thumbnail}
            />
          </div>
          <Errors />
          <button
            onClick={onSubmit}
            className='w-full rounded-xl bg-contrast/80 p-4 text-text hover:bg-teal-400'>
            Create
          </button>
        </>
      )}
    </div>
  );
}
