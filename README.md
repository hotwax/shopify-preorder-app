# shopify-preorder-app
HotWax Commerce shopify preorder app

The app provides functionality to add an item as a pre-order item. It is used to order a product if it’s a pre-order product and adds custom fields to the cart.

# Requirements
- An endpoint to determine whether the current product is available for pre-order or not.

# Workflow
- Install the app on the store
- Checking for the presence of jquery on the store, if jquery is not present then installing jquery in the store.
- Added an API call to check whether the current product is available for pre-order or not.
- If the product is available for pre-order then change the content of the “Add to cart” button to “Pre-order”.
- Adding a click event on the button and adding a note to the cart item that the current product is a pre-order item.
