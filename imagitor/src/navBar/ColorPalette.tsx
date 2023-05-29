import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  Modal,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { ColorResult, SketchPicker } from 'react-color';
import { BsFillPlusSquareFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import useItem from '../hook/useItem';
import { setCurrentColors, setToolColor } from '../redux/selectTool';
import { StoreState } from '../redux/store';

export default function ColorPalette({selectedItems}: {selectedItems: any}) {
  const {updateItem} = useItem();
	const [show, setShow] = useState(false);
	const [color, setColor] = useState<ColorResult>(
		'#ffffff' as unknown as ColorResult
	);
	const dispatch = useDispatch();

	const onClose = () => {
		setShow(!show);
	};

	const { currentColors } = useSelector(
		(selector: StoreState) => selector.toolSelection
	);

	const onAddColor = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		window.getSelection()?.removeAllRanges();
		selectedItems.forEach((item: any) => {
			if (e.shiftKey) {
				item.attrs.stroke = color.hex;
			} else {
				item.attrs.fill = color.hex;
			}
			updateItem(item.id(), () => item.attrs);
		});
		if (selectedItems[0])
    selectedItems[0].getStage()?.batchDraw();
		dispatch(setToolColor(color.hex));
		dispatch(setCurrentColors(color.hex));
		setShow(!show);
	};

	const onColorClick = (e: React.MouseEvent<HTMLDivElement>,clr: string) => {
    e.preventDefault();
		e.stopPropagation();
		window.getSelection()?.removeAllRanges();
		selectedItems.forEach((item: any) => {
			if (e.shiftKey) {
				item.attrs.stroke = clr;
			} else {
				item.attrs.fill = clr;
			}
			updateItem(item.id(), () => item.attrs);
		});
		if (selectedItems[0])
    selectedItems[0].getStage()?.batchDraw();
    dispatch(setToolColor(clr));
	};

	return (
		<Dropdown drop='end'>
			<Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
			<Dropdown.Menu className='tw-w-[10vw] tw-bg-secondary tw-text-text'>
				<div className='p-2 tw-flex tw-w-full tw-flex-col tw-justify-center tw-gap-2'>
					<div
						className='py-2 tw-flex tw-w-full tw-flex-row tw-justify-between tw-gap-2 tw-border-contrast'
						style={{ borderBottom: '2px solid' }}
					>
						<span className='tw-text-lg'>Color Palette</span>
						<div
							onClick={onClose}
							className='p-1 tw-flex tw-items-center tw-justify-center tw-rounded-md tw-text-contrast hover:tw-bg-contrast hover:tw-text-text'
						>
							<BsFillPlusSquareFill size={20} />
						</div>
						<Modal
							onClose={onClose}
							onHide={onClose}
							className='tw-text-text'
							centered
							show={show}
						>
							<Modal.Header
								className='tw-bg-secondary'
								closeButton
							>
								<Modal.Title id='contained-modal-title-vcenter'>
									Pick Color
								</Modal.Title>
							</Modal.Header>
							<Modal.Body className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-5 tw-bg-secondary'>
								<SketchPicker
									color={color as any}
									onChange={(newColor) => {
										setColor(newColor);
									}}
									className='tw-w-5/6 tw-bg-secondary'
								/>
								<div
									onClick={onAddColor}
									className='tw-w-2/3 tw-rounded-xl tw-bg-contrast tw-p-3 tw-text-center'
								>
									Add Color
								</div>
							</Modal.Body>
						</Modal>
					</div>
					<div className='tw-flex tw-w-full tw-flex-wrap tw-items-center tw-justify-evenly tw-gap-2'>
						{currentColors.map((clr) => (
							<div
								onClick={(e) => {
									onColorClick(e, clr);
								}}
								className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-1'
							>
								<div
									className='tw-h-[30px] tw-w-[30px]'
									style={{ backgroundColor: clr }}
								></div>
								<span className='tw-text-xs tw-text-contrast'>
									{clr}
								</span>
							</div>
						))}
					</div>
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
