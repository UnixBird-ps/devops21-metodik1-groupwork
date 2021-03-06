const { Given, When, Then } = require( '@wdio/cucumber-framework' );
const allureReporter = require('@wdio/allure-reporter').default;
const debugMsg = require( '../../backend/debug-funcs.js' ).debugMsg;
const pauseTime = 0;
const timeOut = 3000;


/*
// Empty templates
Given(
	"",
	async () =>
	{
	}
);
When(
	"",
	async () =>
	{
	}
);
Then(
	"",
	async () =>
	{
	}
);
*/


Given(
	"that I'm logged in as customer and can see the main page containing the product list",
	async () =>
	{
		await browser.url( '/' );

		let lFirstAuthLink = await $( "div.register-and-login-links a" );
		await lFirstAuthLink.waitForExist( { timeout: timeOut } );
		let lFirstAuthLinkURL = await lFirstAuthLink.getAttribute( "href" );

		if ( lFirstAuthLinkURL != "/logout"  )
		{
			let lLoginLink;
			// let lLinksContainer = await $( 'div.register-and-login-links' );
			// await lLinksContainer.waitUntil
			// (
			// 	async function ()
			// 	{
			// 		lSecondAuthLink = ( await this.$$( "a" ) )[ 1 ];
			// 		return ( lSecondAuthLink && await lSecondAuthLink.getAttribute( "href" ) == "/login" );
			// 	}
			// );

			lLoginLink = await $( ".register-and-login-links a[href='/login']" );
			await expect( lLoginLink ).toExist();
			await lLoginLink.waitForClickable();
			await lLoginLink.click();

			await ( await $( "form[name='login']" ) ).waitForDisplayed();
			await $( 'form[name="login"] input[name="email"]' ).setValue( 'tester@testare.test' );
			await $( 'form[name="login"] input[name="password"]' ).setValue( '12345678' );
			let lSubmitBtn = await $( 'form[name="login"] input[type="submit"]' );

			await lSubmitBtn.waitForClickable();
			await lSubmitBtn.click();

			let lLogonInfoContainer = await $( 'div.logon-info' );
			await lLogonInfoContainer.waitUntil
			(
				async function ()
				{
					let lHTML = await this.getHTML( false );
					return lHTML.includes( "Logged in as " );
				},
				{
					timeout : timeOut,
					timeoutMsg: `Reached a ${ timeOut } ms timeout waiting for the div element 'div.logon-info' to contain the string 'Logged in as'`
				}
			);
		}

		await expect( await $( "div.register-and-login-links a" ) ).toHaveLink( "/logout" );
		await expect( await $( "div.productInList div.product-info" ) ).toExist();
		await browser.pause( pauseTime );
	}
);


When(
	"I click on the link 'My orders' in the top right corner",
	async () =>
	{
		let lMyOrdersLink = await $( ".nav-links a[href='/my-orders']" );

		// let lLinksContainer = await $( '.nav-links' );
		// await lLinksContainer.waitUntil
		// (
		// 	async function ()
		// 	{
		// 		lMyOrdersLink = ( await this.$$( "a" ) )[ 0 ];
		// 		return ( lMyOrdersLink && await lMyOrdersLink.getAttribute( "href" ) === "/my-orders" );
		// 	}
		// );

		await lMyOrdersLink.waitForClickable();
		await lMyOrdersLink.click();
		await $( "table[name='my-orders']" ).waitForDisplayed();
	}
);


Then(
	"my order history should be displayed",
	async () =>
	{
		await expect( await $( 'table[name="my-orders"]' ) ).toExist();
		await browser.pause( pauseTime );
	}
);


Given(
	"that I can see my order history",
	async () =>
	{
		let lSelector = "table[name='my-orders']";
		let lOrdersTableElm = await $( lSelector );
		await expect( lOrdersTableElm ).toExist();
		await lOrdersTableElm.waitForDisplayed();
		await browser.pause( pauseTime );
	}
);


When(
	"I click on one of the rows in the list containing my old orders",
	async () =>
	{
		let lFirstOrderRow = await $( 'table[name="my-orders"] tbody tr.orderlist-row' );
		await lFirstOrderRow.waitForClickable();
		await lFirstOrderRow.click();
	}
);


Then(
	"the orders list should be replaced by a page showing total cost and products ordered for an order",
	async () =>
	{
		let lSelector = "table[name='order-details']";
		await expect( await $( lSelector ) ).toExist();
		await ( await $( lSelector ) ).waitForDisplayed();
		await browser.pause( pauseTime );
	}
);


Given(
	"that I can see an order's details",
	async () =>
	{
		await expect( await $( 'table[name="order-details"]' ) ).toExist();
		await browser.pause( pauseTime );
	}
);


When(
	"I click on the button 'Back to My orders'",
	async () =>
	{
		let lBackButton = await $( "button.back-button-orders" );
		await expect( lBackButton ).toExist();
		await lBackButton.waitForClickable();
		await lBackButton.click();
	}
);


When(
	"I click on the link 'Home' in the top right corner",
	async () =>
	{
		let lSelector = "div.nav-links a[href='/home']";
		await expect( await $( lSelector ) ).toExist();
		await ( await $( lSelector ) ).click();
		await browser.pause( pauseTime );
	}
);


Then(
	"the product list should be displayed",
	async () =>
	{
		await expect( await $( "div.productInList div.product-info" ) ).toExist();
		await browser.pause( pauseTime );
	}
);
