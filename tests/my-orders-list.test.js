const { test, expect } = require( "@jest/globals" );
require( "./fakedom.js" );
global.listen = require( "../frontend/js/helpers.js" ).listen;
global.formatSEK = require( "../frontend/js/helpers.js" ).formatSEK;
const MyOrdersList = require( "../frontend/js/my-orders-list.js");
const debugMsg = require( "../backend/debug-funcs.js" ).debugMsg;


describe(
	"Unit tests for the class 'MyOrdersList'",
	() =>
	{
		let lOrdersList = new MyOrdersList();

		test
		(
			"List exists and is empty after constructor",
			() =>
			{
				expect( MyOrdersList.mMyOrders ).toBeDefined();
				expect( MyOrdersList.mMyOrders ).toHaveLength( 0 );
			}
		)


		test
		(
			"List is rendered correctly",
			() =>
			{
				let lMockOrders =
				[
					{ id : 9998, date : "1970-01-01 00:59:58", grandTotal : 1199 },
					{ id : 9999, date : "1970-01-01 00:59:59", grandTotal : 1299 }
				];

				MyOrdersList.mMyOrders = lMockOrders;

				expect( MyOrdersList.mMyOrders ).not.toHaveLength( 0 );

				let lExpectedHTML = `
				<div class="order-caption-group">
					<div class="order-caption">
						<span>My Orders</span>
					</div>
				</div>
				<table name="my-orders">
					<thead>
						<tr>
							<td>Order#</td><td>Date</td><td>Order total</td>
						</tr>
					</thead>
					<tbody>
						<tr class="orderlist-row" id="i9998">
							<td>9998</td>
							<td>${ ( new Date( "1970-01-01 00:59:58".split( " " ).join( "T" ) + ".000Z" ) ).toLocaleString( "sv-SE" ) }</td>
							<td>1 199,00 kr</td>
						</tr>
						<tr class="orderlist-row" id="i9999">
							<td>9999</td>
							<td>${ ( new Date( "1970-01-01 00:59:59".split( " " ).join( "T" ) + ".000Z" ) ).toLocaleString( "sv-SE" ) }</td>
							<td>1 299,00 kr</td>
						</tr>
					</tbody>
				</table>
				`.trim().replace( /^\s*$/, "" ).split( /\n/ ).map( s => s.trim() ).join( "\n" );

				// Get the rendering string
				// Removing any leading and trailing new-lines, removing any indentation
				let lRenderedHTML = lOrdersList.render().trim().replace( /^\s*$/, "" ).split( /\n/ ).map( s => s.trim() ).join( "\n" );

				expect( lRenderedHTML ).toBe( lExpectedHTML );
			}
		)
	}
);
