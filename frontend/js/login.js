
async function renderNavContainer()
{
	let lResultHTML = "";

	let loggedIn;
	try
	{
		loggedIn = await ( await fetch( '/api/login' ) ).json();
	}
	catch ( ignore ) { }

	if ( !loggedIn || loggedIn.error )
	{
		lResultHTML = `
			<div class="logon-info"></div>
			<div class="nav-links"></div>
			<div class="register-and-login-links">
			<a href="/register">Register</a>
			<a href="/login">Login</a>
			</div>
		`;
	}
	else
	{
		lResultHTML += `
			<div class='logon-info'>
			Logged in as ${loggedIn.firstName} ${loggedIn.lastName}
			</div>
		`;

		if ( loggedIn.userRole === "user" )
		{
			lResultHTML += `
				<div class='nav-links'>
					<a href='/my-orders'>My orders</a>
				</div>
			`;
		}

		if ( loggedIn.userRole !== "visitor" )
		{
			lResultHTML += `
				<div class="register-and-login-links">
					<a href="/logout">Logout</a>
				</div>
			`;
		}
	}

	return lResultHTML;
}


function renderLoginForm( retry = false )
{
	return `
		<form name="login">
			<h1>Login</h1>
			${ !retry ? '' : `<p class="error">Something went wrong. Please try again!</p>` }
			<label>
			<span>Email:</span><input required type="email" name="email">
			</label>
			<label>
			<span>Password:</span><input required type="password" name="password">
			</label>
			<input type="submit" value="Log in">
		</form>
	`;
}


document.querySelector( 'body' ).addEventListener(
	'submit',
	async ( event ) =>
	{
		let target = event.target;

		if ( !target.closest( 'form[name="login"]' ) ) { return; }

		event.preventDefault();

		let formElements = document.forms.login.elements;
		let requestBody = {};

		for ( let element of formElements )
		{
			if ( element.type === 'submit' ) { continue; }
			requestBody[ element.name ] = element.value;
		}

		let result;
		try {
			result = await ( 
				await fetch( '/api/login',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify( requestBody )
					}
				)
			).json();
		}
		catch (ignore) { }

		if ( !result || result.error )
		{
			document.querySelector( '.login' ).innerHTML = renderLoginForm( true );
			return;
		}

		// Hide the form and modal
		let lElmsToEmpty = document.querySelectorAll( "div.register, div.login" );
		for ( el of lElmsToEmpty )
		{
			el.innerHTML = "";
		}

		let elementsToHide = document.querySelectorAll( '.register, .login, .modal-hider' );

		for ( element of elementsToHide )
		{
			element.classList.add( 'hidden' );
		}

		getLogInfo();
	}
);


document.querySelector( 'body' ).addEventListener(
	'click',
	( event ) =>
	{
		if ( !event.target.closest( 'a[href="/login"]' ) ) { return; }

		event.preventDefault();

		let loginDiv = document.querySelector( '.login' );
		loginDiv.innerHTML = renderLoginForm();
		loginDiv.classList.remove( 'hidden' );
		document.querySelector( '.modal-hider' ).classList.remove( 'hidden' );
	}
);


document.querySelector( 'body' ).addEventListener(
	'click',
	( event ) =>
	{
		if ( !event.target.closest( '.modal-hider' ) ) { return; }

		let lElmsToEmpty = document.querySelectorAll( "div.register, div.login" );
		for ( el of lElmsToEmpty )
		{
			el.innerHTML = "";
		}

		let elementsToHide = document.querySelectorAll( '.register, .login, .modal-hider' );

		for ( element of elementsToHide )
		{
			element.classList.add( 'hidden' );
		}
	}
);
