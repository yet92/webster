import React, {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from 'react';
import { Modal, Button } from 'flowbite-react';
import {
  AiFillGoogleSquare,
  AiFillGithub,
  AiOutlineClose,
} from 'react-icons/ai';
import { Errors, GoogleButton } from '../../pages/auth/components';
import { useDispatch } from 'react-redux';
import { addError, clearErrors } from '../../store/errorsSlice';
import { FormData, RequestType, authFetch } from '../../pages/auth/utils/auth';
import { User, login } from '../../store/authSlice';

export default function SignInModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const [isLogin, setIsLogin] = useState(true);

  const onAuthTypeChange = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Modal
      size='md'
      className='bg-secondary backdrop-blur-sm'
      show={show}
      onClose={onClose}
      dismissible={true}>
      <Modal.Body className='drop-shadow-2xl flex flex-col justify-center items-center bg-secondary rounded-lg'>
        <AiOutlineClose
          size={20}
          className='text-text hover:text-contrast cursor-pointer absolute top-5 right-5'
          onClick={onClose}
        />
        <h1 className='text-4xl py-20 text-text'>GATHERWISE</h1>
        <div className='max-w-sm w-full rounded-lg shadow dark:bg-transparent dark:border-gray-700'>
          <EmailForm isLogin={isLogin} />
          <div className='text-xs flex flex-row gap-2 p-2'>
            <span className=' text-text'>
              {isLogin
                ? " Don't have an account yet? "
                : 'Already have an account?'}
            </span>
            <span
              className=' text-contrast cursor-pointer'
              onClick={onAuthTypeChange}>
              {isLogin ? 'Register' : 'Sign In'}
            </span>
          </div>
          <div className='pt-5 pb-1 px-2 flex justify-center items-center text-text'>
            <hr className='border-t-2 border-gray-400 flex-grow' />
            <div className='px-4 py-2'>or</div>
            <hr className='border-t-2 border-gray-400 flex-grow' />
          </div>
          <div className='flex flex-row gap-2 w-full items-center justify-center'>
            <GoogleButton />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  email: string;
  password: string;
  username: string;
  repeatPassword: string;
};

const EmailForm = ({ isLogin }: { isLogin: boolean }) => {
  const [formState, setFormState] = useState<LoginFormData | RegisterFormData>(
    isLogin
      ? { email: '', password: '' }
      : { email: '', password: '', repeatPassword: '', username: '' }
  );

  const dispatch = useDispatch();

  const onFormData = async (formData: FormData) => {
    dispatch(clearErrors());
      console.log(formData);
    const { response, json } = await authFetch(
      isLogin ? RequestType.Login : RequestType.Register,
      formData
    );

    if (!response.ok) {
      // add error
      dispatch(addError({ message: json.message }));
    } else {
      if (isLogin) {
        const user = { ... json.data.user, accessToken: json.data.token };
        dispatch(login(user as any));
      }
    }
  };

  const onFormInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormState({ ...formState, [e.target.id]: e.target.value });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (onFormData) {
      onFormData(formState as FormData);
    }
  };

  return (
    <form className='flex flex-col gap-4' onSubmit={onSubmit}>
      <div className='mt-5 flex flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          <label className='sr-only' htmlFor='email'>
            Email address
          </label>
          <div className='relative w-full'>
            <input
              placeholder='Email'
              onChange={onFormInputChange}
              className='w-full rounded-xl bg-secondary border-text text-text'
              type='email'
              id='email'
              name='email'
            />
          </div>
        </div>
        {!isLogin && (
          <div className='flex flex-col gap-4'>
            <label className='sr-only' htmlFor='email'>
              Username
            </label>
            <div className='relative w-full'>
              <input
                placeholder='Username'
                onChange={onFormInputChange}
                className='w-full rounded-xl bg-secondary border-text text-text'
                type='text'
                id='username'
                name='username'
              />
            </div>
          </div>
        )}
        <div className='flex flex-col gap-4'>
          <label className='sr-only' htmlFor='email'>
            Password
          </label>
          <div className='relative w-full'>
            <input
              placeholder='Password'
              onChange={onFormInputChange}
              className='w-full rounded-xl bg-secondary border-text text-text'
              type='password'
              id='password'
              name='password'
            />
          </div>
        </div>
        {!isLogin && (
          <div className='flex flex-col gap-4'>
            <label className='sr-only' htmlFor='email'>
              Password
            </label>
            <div className='relative w-full'>
              <input
                placeholder='Repeat Password'
                onChange={onFormInputChange}
                className='w-full rounded-xl bg-secondary border-text text-text'
                type='password'
                id='repeatPassword'
                name='repeatPassword'
              />
            </div>
          </div>
        )}
      </div>
      <Errors></Errors>
      <button
        className='hover:bg-contrast hover:text-text p-2 text-center w-full font-bold text-contrast border-contrast border-2 rounded-xl'
        type='submit'>
        {isLogin ? 'Sign In' : 'Register'}
      </button>
    </form>
  );
};
