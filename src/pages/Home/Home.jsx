import React from 'react';
import css from './home.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const Home = () => {
	const rotateX = [280, 350];
	const rotateY = 360;
	const rangeX = rotateX[1] - rotateX[0];
	// const rotateX
	const [isMouseDown, setIsMouseDown] = useState(false);
	const [previousTouch, setPreviousTouch] = useState(null);
	const [rotationX, setRotationX] = useState(340);
	const [rotationY, setRotationY] = useState(30);
	const heightRef = useRef(null);
	// console.log(rangeX,rotationX);

	const [timer, setTimer] = useState(0);

	const [dragging, setDragging] = useState(false);
	const [fileHovered, setFileHovered] = useState(false);

	useEffect(() => {
		if (dragging && !fileHovered) {
			const timeoutId = setTimeout(() => {
				setDragging(false);
			}, 5000);

			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, []);

	useEffect(() => {
		if (fileHovered) {
			setDragging(true);
		}
	}, [fileHovered]);

	useEffect(() => {
		const t = setInterval(() => {
			setTimer(t => t + 1);
		}, 100);
		return () => {
			clearInterval(t);
		};
	}, []);

	useEffect(() => {
		if (!dragging) {
			setRotationY(prev => prev - 2.5);
			if (rotationX < 340) {
				setRotationX(prev => prev + 0.5);
			} else if (rotateX > 340) {
				setRotationX(prev => prev - 0.5);
			}
		}
	}, [timer]);

	const mouseMove = e => {
		if (isMouseDown) {
			setDragging(true);
			// setPositionX(e.clientX);
			// setPositionY(e.clientY);
			const height = heightRef ? heightRef.current.clientHeight : window.innerHeight;
			if (e.type == 'touchmove') {
				const touch = e.touches[0];

				if (previousTouch) {
					// be aware that these only store the movement of the first touch in the touches array
					e.movementX = touch.pageX - previousTouch.pageX;
					e.movementY = touch.pageY - previousTouch.pageY;
				}
				setPreviousTouch(touch);
			}

			// console.log(e, e.clientX, e.clientY);

			if (!('movementX' in e) || !('movementY' in e)) return;

			const movementX = e.movementX / innerWidth;
			const movementY = e.movementY / height;
			var possibleX = rotationX + movementY * -3 * rangeX;
			// console.log(possibleX, height, e.movementY);
			// console.log(rotationX, movementY, rangeX);
			if (possibleX <= rotateX[0]) possibleX = rotateX[0];
			if (possibleX >= rotateX[1]) possibleX = rotateX[1];
			setRotationX(possibleX);
			setRotationY(prev => prev + movementX * rotateY);
		}
	};

	return (
		<>
			<div
				style={{
					width: '15px',
					height: '15px',
					backgroundColor: dragging ? 'green' : 'red',
					position: 'fixed',
					top: '10px',
					left: '10px',
				}}></div>
			<div
				className={css.drawerWrapper}
				onMouseMove={mouseMove}
				onTouchMove={mouseMove}
				onMouseDown={() => {
					setIsMouseDown(true);
					setDragging(true);
				}}
				onTouchStart={() => {
					setIsMouseDown(true);
					setDragging(true);
				}}
				onMouseUp={() => setIsMouseDown(false)}
				onTouchEnd={() => {
					setIsMouseDown(false);
					setPreviousTouch(null);
				}}
				onTouchCancel={() => {
					setIsMouseDown(false);
					setPreviousTouch(null);
				}}
				ref={heightRef}>
				<div
					className={css.drawerContainer}
					style={{
						transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
					}}>
					<DrawerBox
						text='some text'
						fileOnEnter={() => setFileHovered(true)}
						fileOnLeave={() => setFileHovered(false)}
					/>
					<DrawerBox
						text='other text'
						fileOnEnter={() => setFileHovered(true)}
						fileOnLeave={() => setFileHovered(false)}
					/>
					{/* <DrawerBox text='other text' />
					<DrawerBox text='other text' /> */}
					<div className={`${css.drawerTop}`}>
						<div className={`${css.topTop} ${css.wall}`}></div>
						<div className={`${css.leftTop} ${css.wall}`}></div>
						<div className={`${css.rightTop} ${css.wall}`}></div>
						<div className={`${css.frontTop} ${css.wall}`}></div>
						<div className={`${css.backTop} ${css.wall}`}></div>
					</div>
					<div className={`${css.drawerWall} ${css.left}`}></div>
					<div className={`${css.drawerWall} ${css.right}`}></div>
					<div className={`${css.drawerWall} ${css.front}`}>
						<div className={`${css.frontLeft}`}></div>
						<div className={`${css.frontRight}`}></div>
						<div className={`${css.frontTop}`}></div>
						<div className={`${css.frontBottom}`}></div>
					</div>
					<div className={`${css.drawerWall} ${css.back}`}></div>
				</div>
			</div>
		</>
	);
};

const DrawerBox = ({ text, fileOnEnter, fileOnLeave }) => {
	const [opened, setOpened] = useState(false);
	const [closing, setClosing] = useState(false);
	const toggle = e => {
		if (e.target.dataset.file) return;
		if (opened) {
			setClosing(true);
			setOpened(false);
		} else {
			setClosing(false);
			setOpened(true);
		}
	};
	return (
		<div className={css.boxWrapper}>
			<div
				className={`${css.drawerBox} ${opened ? css.opened : ''} ${
					closing ? css.closed : ''
				}`}
				onClick={toggle}>
				<div className={`${css.wallBox} ${css.leftBox}`}></div>
				<div className={`${css.wallBox} ${css.rightBox}`}></div>
				<div className={`${css.wallBox} ${css.frontBox}`}>
					<div className={`${css.frontFront}`}>
						<div className={`${css.handleFront}`}></div>
						<div className={`${css.handleLeft}`}></div>
						<div className={`${css.handleRight}`} onClick={toggle}></div>
						<div className={`${css.handleTop}`} onClick={toggle}></div>
						<div className={`${css.sign}`}>
							<p>{text}</p>
						</div>
					</div>
					<div className={`${css.leftFront}`}></div>
					<div className={`${css.rightFront}`}></div>
					<div className={`${css.topFront}`}></div>
				</div>
				<div className={`${css.wallBox} ${css.backBox}`}></div>
				<div className={`${css.wallBox} ${css.bottomBox}`}>
					<File fileHover={[fileOnEnter, fileOnLeave]} />
					<File fileHover={[fileOnEnter, fileOnLeave]} />
					<File fileHover={[fileOnEnter, fileOnLeave]} />
					<File fileHover={[fileOnEnter, fileOnLeave]} />
				</div>
			</div>
		</div>
	);
};

const File = ({ fileHover }) => {
	const [clicked, setClicked] = useState(null);
	const fileClick = () => {
		if (clicked) {
			setClicked(false);
			fileHover[1]();
		} else {
			setClicked(true);
			fileHover[0]();
		}
	};

	return (
		<div
			className={`${css.folder}`}
			onMouseEnter={() => fileHover[0]()}
			onMouseLeave={() => fileHover[1]()}
			onClick={fileClick}
			data-file='true'>
			<div className={`${css.folderBack}`} data-file='true'></div>
			<div className={`${css.folderFront}`} data-file='true'></div>
			<div className={`${css.fileWrapper}`} data-file='true'>
				<div
					className={`${css.file} ${
						clicked === true ? css.clicked : clicked === false ? css.notClicked : ''
					}`}
					data-file='true'>
					test
				</div>
			</div>
		</div>
	);
};

export default Home;
