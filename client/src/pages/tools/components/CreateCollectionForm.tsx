import { Spinner } from 'flowbite-react';
import { useState } from 'react';
import { Errors } from '../../auth/components';
import { useDispatch, useSelector } from 'react-redux';
import { addError, clearErrors } from '../../../store/errorsSlice';
import { createFetch } from '../utils/createCollection';
import { RootState } from '../../../store';
import { createCollection } from '../../../store/collectionSlice';

export type FormData = {
  title: string;
  thumbnail: string;
};

const initialFormData: FormData = {
  title: '',
  thumbnail: '',
};

export default function CreateCollectionForm({
  onClose,
}: {
  onClose: () => void;
}) {
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
      if (json.data) {
        console.log('here)');
        onClose();
        dispatch(clearErrors());
        setFormData(initialFormData);
        dispatch(createCollection(json.data as any));
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
            <span className='text-xl'>Collection Title</span>
            <input
              placeholder='Title'
              onChange={onChange}
              className='w-full border-b-2 border-text border-b-contrast bg-secondary p-2 text-text'
              id='title'
              name='title'
            />
          </div>
          <div className='flex w-full flex-col gap-4 text-text'>
            <span className='text-xl'>Collection Thumbnail</span>
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
