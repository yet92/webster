import React from 'react';
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { StoreState } from '../redux/store';

export default function ColorPalette() {
	return (
		<Dropdown drop='end'>
			<Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
			<Dropdown.Menu className='tw-bg-secondary tw-text-text'>
				<div className='p-2 tw-flex tw-flex-col tw-justify-center tw-gap-2'>
					<div className='tw-flex tw-flex-row tw-gap-2 py-2 tw-border-contrast' style={{borderBottom: "5px"}}>
						<span className='tw-text-lg'>Color Palette</span>
            <button className='tw-text-contrast'></button>
					</div>
					<span>Smth</span>
					<span>Smth</span>
					<span>Smth</span>
				</div>
			</Dropdown.Menu>
		</Dropdown>
	);
}

const CustomToggle = React.forwardRef<HTMLButtonElement>(
	// @ts-ignore
	function CustomToggleItem({ children, onClick, data }, ref) {
		const toolColor = useSelector(
			(selector: StoreState) => selector.toolSelection.toolColor
		);
		return (
			<OverlayTrigger
				placement='right'
				overlay={<Tooltip>Pick Color</Tooltip>}
			>
				<Button
					style={{ backgroundColor: toolColor }}
					className='tw-border-2 tw-p-5'
					ref={ref}
					onClick={(e) => {
						e.preventDefault();
						onClick(e);
					}}
				>
					<i>{children}</i>
				</Button>
			</OverlayTrigger>
		);
	}
);
