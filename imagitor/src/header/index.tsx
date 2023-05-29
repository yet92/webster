import React from 'react';
import { Col } from 'react-bootstrap';
import colorStyles from '../style/color.module.css';
import alignStyles from '../style/align.module.css';
import sizeStyles from '../style/size.module.css';
import Logo from './Logo';
import { useSelector } from 'react-redux';
import { StoreState } from '../redux/store';

type HeaderProps = {
	children: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
	const {
		stageDataList,
		auth: { me },
	} = useSelector((selector: StoreState) => selector);
	return (
		<header>
			<div className='p-2 tw-flex tw-w-full tw-flex-row tw-items-center tw-justify-between tw-gap-5 tw-rounded-xl tw-bg-secondary'>
				<span className='tw-text-2xl tw-font-bold tw-text-text'>
					WEBSTER
				</span>
				<span className='tw-text-2xl tw-font-bold tw-text-contrast'>
					{stageDataList.ids[0]}
				</span>
				<img className='tw-w-[50px] tw-h-[50px] tw-rounded-full' src={me.avatar} />
			</div>
		</header>
	);
};

export default Header;
