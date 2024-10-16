
import './App.css'

function App() {
	return (
		<>
			<header>
				<h1> Chappy chat app!</h1>

			</header>
			<main>
				<div className='loggin'>
					<input id="username" type="text" placeholder="Username" />
					<input id="password" type="password" placeholder="Password" />
					<button id="login-button"> Log in </button>
					<button id="logout-button"> Log out </button>
				</div>
				
			</main>
		</>
	)
}

export default App
