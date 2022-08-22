# shopify-preorder-app
HotWax Commerce shopify preorder app

The app provides functionality to add an item as a pre-order item. It is used to order a product if it’s a pre-order product and adds custom fields to the cart.

## Requirements
- An endpoint to determine whether the current product is available for pre-order or not.
- Add the following HTML code on the Shopify store's product page where you want to display the shipping start date:
```
<p id="hc_preordershipsfrom" style="visibility: hidden;">ships from <span /></p>
```
- Add the id *hc_preorderButton* to the *addToCart* button.
- The following shopify access scopes are needed for the app: read_products, read_content, read_themes, write_themes, read_script_tags, write_script_tags

## Workflow
- Install the app on the store
- Checking for the presence of jquery on the store, if jquery is not present then installing jquery in the store.
- Added an API call to check whether the current product is available for pre-order or not.
- If the product is available for pre-order then change the content of the “Add to cart” button to “Pre-order”.
- Adding a click event on the button and adding a note to the cart item that the current product is a pre-order item.


## Firebase Hosting

We are using firebase hosting for the Pre-order app deployment
Here are the steps to deploy app on firebase hosting

### Prerequisite
- [Firebase Cli](https://firebase.google.com/docs/cli) should be installed 
- Firebase project should be created
- You should have access to firebase project

### Dev deployment 
- Update the DEV instance url at .env.production file

- Build the application using following command
`ionic build`

- Login into firebase 
`firebase login`

- Run following command to deploy to firebase hosting
`firebase deploy --only hosting:hc-dev`


### UAT deployment 
- Update the UAT instance url at .env.production file

- Build the application using following command
`ionic build`

- Login into firebase 
`firebase login`

- Run following command to deploy to firebase hosting
`firebase deploy --only hosting:hc-uat`

## How to build application in different environment or modes(staging, production, qa, etc)?
As there is a bug in Ionic cli due to which we cannot pass flag variables for commands (See [#4669](https://github.com/ionic-team/ionic-cli/issues/4642)). To build application in different modes we need to use vue-cli-service to build and then use the built app using capacitor copy command further. 

Follow following instructions:
1. Manually build the application using vue-cli-service:
npx vue-cli-service build --mode=sandbox

2. Copy web assets to the native project without building the app:
ionic capacitor copy ios --no-build

3. Open the Android Studio / XCode project:
ionic capacitor open android   
ionic capacitor open ios

# Contribution Guideline

1. Fork the repository and clone it locally from the `main` branch. Before starting your work make sure it's up to date with current `main` branch.
2. Pick an issue from [here](https://github.com/hotwax/shopify-preorder-app/issues). Write in the issue comment that you want to pick it, if you can't assign yourself. **Please stay assigned to one issue at a time to not block others**.
3. Create a branch for your edits. Use the following branch naming conventions: **shopify-preorder-app/issue-number**.
4. Please add issue number to your commit message.
5. Propose a Pull Request to `main` branch containing issue number and issue title.
6. Use [Pull Request template](https://github.com/hotwax/shopify-preorder-app/blob/main/.github/PULL_REQUEST_TEMPLATE.md) (it's automatically added to each PR) and fill as much fields as possible to describe your solution.
7. Reference any relevant issues or other information in your PR.
8. Wait for review and adjust your PR according to it.
9. Congrats! Your PR should now be merged in!

If you can't handle some parts of the issue then please ask for help in the comment. If you have any problems during the implementation of some complex issue, feel free to implement just a part of it.

## Report a bug or request a feature

Always define the type of issue:
* Bug report
* Feature request

While writing issues, please be as specific as possible. All requests regarding support with implementation or application setup should be sent to.

# Join the community on Discord
If you have any questions or ideas feel free to join our <a href="https://discord.gg/SwpJnpdyg3" target="_blank">Discord channel</a>

# The license
Shopify preorder app is completely free and released under the Apache v2.0 License. Check <a href="https://github.com/hotwax/shopify-preorder-app/blob/main/LICENSE" target="_blank">LICENSE</a> for more details.
