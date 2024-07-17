import React from 'react';
import css from './home.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import projects from '../../data/projects.json';

const personalProjects = projects.filter(project => project.type === 'Personal projects');
const schoolProjects = projects.filter(project => project.type === 'School projects');

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

	const [selectedId, setSelectedId] = useState(null);
	const [isFileOpened, setIsFileOpened] = useState(false);
	const [isFileClosing, setIsFileClosing] = useState(false);

	const [dragging, setDragging] = useState(false);
	const [fileHovered, setFileHovered] = useState(false);
	// console.log(projects);

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

	const onFileClick = id => {
		setSelectedId(id);
		setIsFileOpened(true);
	};

	return (
		<>
			<div
				className={`${css.drawerWrapper} ${css.popIn}`}
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
						text='School Projects'
						fileOnEnter={() => setFileHovered(true)}
						fileOnLeave={() => setFileHovered(false)}
						onFileClick={onFileClick}
						data={schoolProjects}
					/>
					<DrawerBox
						text='Personal Projects'
						fileOnEnter={() => setFileHovered(true)}
						fileOnLeave={() => setFileHovered(false)}
						onFileClick={onFileClick}
						data={personalProjects}
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
			{isFileOpened && (
				<div className={css.fileOpen}>
					<div
						className={`${css.background} ${isFileClosing && css.out}`}
						onClick={() => {
							setIsFileClosing(true);
							setTimeout(() => {
								setIsFileClosing(false);
								setIsFileOpened(false);
							}, 1000);
						}}></div>

					<div className={`${css.fileContents} ${isFileClosing && css.up}`}>
						<h2>{projects[selectedId - 1].name}</h2>
						<br />
						<p>{projects[selectedId - 1].description}</p>
						<br />
						<p>
							<strong>Used technologies: </strong>{' '}
							{projects[selectedId - 1].technologies.map((i, index) =>
								index == projects[selectedId - 1].technologies.length - 1
									? `${i}`
									: `${i}, `
							)}
							;
						</p>
						{projects[selectedId - 1].link && (
							<p>
								<strong>Link: </strong>{' '}
								<a
									href={projects[selectedId - 1].link}
									target='_blank'
									rel='noreferrer'>
									{projects[selectedId - 1].link}
								</a>
							</p>
						)}
						<p>
							<strong>Project example:</strong>
						</p>
						<div className={css.images}>
							{projects[selectedId - 1].images.map(src => (
								<img src={src} />
							))}
							<div className={css.paper}></div>
							<div className={css.paper}></div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

const DrawerBox = ({ text, fileOnEnter, fileOnLeave, data, onFileClick }) => {
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
					{data.map(project => (
						<File
							fileHover={[fileOnEnter, fileOnLeave]}
							data={project}
							onFileClick={onFileClick}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

const File = ({ fileHover, data, onFileClick }) => {
	const [clicked, setClicked] = useState(null);
	const fileClick = () => {
		if (clicked) {
			setClicked(false);
			fileHover[1]();
		} else {
			setClicked(true);
			fileHover[0]();
		}
		onFileClick(data.id);
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
					<p style={{ fontSize: '0.7em' }} data-file='true'>
						{data.name}
					</p>
					<img data-file='true' src={data.images[0]} />
				</div>
			</div>
		</div>
	);
};

export default Home;
