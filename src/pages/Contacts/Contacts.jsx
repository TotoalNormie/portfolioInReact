import React from 'react';
import './contacts.module.css';

const Contacts = () => {
	return (
		<main>
			<h1>Contacts:</h1>
			<ul>
				<li>
					<a href='https://github.com/TotoalNormie' target='_blank' rel='noreferrer'>
						Github
					</a>
				</li>
				<li>
					<a
						href='https://www.linkedin.com/in/vitaly-vlad-juhno-8a925a298/'
						target='_blank'
						rel='noreferrer'>
						LinkedIn
					</a>
				</li>
			</ul>
		</main>
	);
};

export default Contacts;
