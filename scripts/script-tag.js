(function () {
    let jQueryPreOrder;
    let addToCartLabel;
    let localDeliveryDate, buttonLabel;

    this.preOrderCustomConfig = {
        'enableCartRedirection': true
    };

    // TODO Generate instance specific code URL in FTL. Used with <#noparse> after this code so that `` code is escaped
    // let baseUrl = '<@ofbizUrl secure="true"></@ofbizUrl>';
    let shopUrl = window.origin;

    function getAddToCartLabel () {
        if (location.pathname.includes('products')) {
            addToCartLabel = jQueryPreOrder("#hc_preorderButton, .hc_preorderButton").html();
        }
    }

    let loadScript = function(url, callback){

        let script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState){ 
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function(){
                callback();
            };
        }
    
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
        
    };

    if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn['jquery']) < 1.7)) {
        loadScript('//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js', function(){
          jQueryPreOrder = jQuery.noConflict(true);
          jQueryPreOrder(document).ready(function() {
              initialisePreOrder();
              getAddToCartLabel();
          });

        });
    } else {
        jQueryPreOrder = jQuery;
        jQueryPreOrder(document).ready(function() {
            initialisePreOrder();
            getAddToCartLabel();
        });
    }

    function isItemAvailableForOrder (virtualId, variantId) {
        return new Promise(function(resolve, reject) {
            jQueryPreOrder.ajax({
                type: 'GET',
                // need to update this endpoint to use correct endpoint for checking the product preorder availability
                url: `${shopUrl}/admin/products/${virtualId}.json`,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (data) {
                    if (data.product.tags.includes('Pre-Order') || data.product.tags.includes('Back-Order')) {
                        resolve(data.product)
                    }
                },
                error: function (err) {
                    reject(err)
                }
            })
        })
    }

    function getVariantMetafields (virtualId, variantId) {
        return new Promise(function(resolve, reject) {
            jQueryPreOrder.ajax({
                type: 'GET',
                // need to update this endpoint to use correct endpoint for checking the product preorder availability
                url: `${shopUrl}/admin/products/${virtualId}/variants/${variantId}/metafields.json`,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (data) {
                    resolve(data.metafields)
                },
                error: function (err) {
                    reject(err)
                }
            })
        })
    }

    async function initialisePreOrder () {
        if (location.pathname.includes('products')) {

            const cartForm = jQueryPreOrder("form[action='/cart/add']");
            const variantId = cartForm.serializeArray().find(ele => ele.name === "id").value;
            // getting virtual product id
            const virtualId = meta.product.id;
            const preorderButton = jQueryPreOrder("#hc_preorderButton, .hc_preorderButton");
            let productType = '';

            let hcpreorderShipsFrom = jQueryPreOrder("#hc_preordershipsfrom");
            let span = jQueryPreOrder("#hc_preordershipsfrom span");

            hcpreorderShipsFrom.css('visibility', 'hidden');
            preorderButton.html(addToCartLabel);

            // removing the click event with handler addToCart
            preorderButton.off('click', addToCart);
            preorderButton.siblings().css('display', 'block');

            const checkItemAvailablity = await isItemAvailableForOrder(virtualId, variantId).then((product) => {
                // checking what type of tag product contains (Pre-Order / Back-order) and on the basis of that will check for metafield
                productType = product.tags.includes('Pre-Order') ? 'Pre-Order' : product.tags.includes('Back-Order') ? 'Back-Order' : ''

                // checking if continue selling is enabled for the variant or not
                return product.variants.find((variant) => variant.id == variantId).inventory_policy === 'continue'
            }).catch(err => console.log(err));

            // if the product does not contains specific tag and continue selling is not enabled then not executing the script
            if (!checkItemAvailablity) return ;

            const metafields = await getVariantMetafields(virtualId, variantId).catch(err => console.error(err));

            const metafield = metafields.find((metafield) => productType === 'Pre-Order' ? metafield.namespace === 'PRE_ORDER_DATE' : metafield.namespace === 'BACKORDER_DATE')

            if (metafield) {
                preorderButton.siblings().css('display', 'none');
                localDeliveryDate = metafield.value;

                // Using different namespace for preorder and backorder but will update it to use single
                // namespace for the both the things
                buttonLabel = metafield.namespace === 'PRE_ORDER_DATE' ? 'Pre Order' : metafield.namespace === 'BACKORDER_DATE' && 'Back Order'

                // will add Pre Order to the button
                preorderButton.html(buttonLabel);

                // will find for a tag with id hc_preordershipsfrom and if found then add the date to the tag
                if(hcpreorderShipsFrom.length > 0) {
                    span.html(`${localDeliveryDate}`)
                }

                // if the value of the metafield is not _NA_ and NULL then only making the date field visible
                if (localDeliveryDate && localDeliveryDate !== 'NULL' && localDeliveryDate !== '_NA_') {
                    hcpreorderShipsFrom.css('visibility', 'visible');
                }

                // will handle the click event on the pre order button
                preorderButton.on("click", addToCart);
            }
        } else {
            // this part executes on all the page other than product page
            // finding an input field with name tags and then iterating over the same
            jQueryPreOrder("input[name='tags']").map(async function (index, element) {

                const variantTagInput = jQueryPreOrder(element);

                // checking for Pre-Orde or Back-Order tag
                if (variantTagInput.val().includes('Pre-Order') || variantTagInput.val().includes('Back-Order')) {
                    // getting the current display variant id and current virtual product id
                    const variantId = variantTagInput.siblings("input[name='id']").val();
                    const virtualId = variantTagInput.siblings("input[name='productId']").val();

                    await isItemAvailableForOrder(virtualId, variantId).then(async (product) => {
                        // checking what type of tag product contains (Pre-Order / Back-order) and on the basis of that will check for metafield
                        const productType = product.tags.includes('Pre-Order') ? 'Pre-Order' : product.tags.includes('Back-Order') ? 'Back-Order' : ''

                        // checking if continue selling is enabled for the variant or not
                        const isContinueSellingEnabled = product.variants.find((variant) => variant.id == variantId).inventory_policy === 'continue'

                        if (isContinueSellingEnabled) {
                            await getVariantMetafields(virtualId, variantId).then((metafields) => {
                                const metafield = metafields.find((metafield) => productType === 'Pre-Order' ? metafield.namespace === 'PRE_ORDER_DATE' : metafield.namespace === 'BACKORDER_DATE')

                                if (metafield) {
                                    // finding a button with type submit as the button will be on the same level as the input field so using siblings
                                    const preorderButton = variantTagInput.siblings("input[type='submit']");
                                    const cartForm = variantTagInput.parent();
                                    const date = metafield.value;

                                    // Using different namespace for preorder and backorder but will update it to use single
                                    // namespace for the both the things
                                    const label = metafield.namespace === 'PRE_ORDER_DATE' ? 'Pre Order' : metafield.namespace === 'BACKORDER_DATE' && 'Back Order'

                                    // will add Pre Order / Back Order label to the button
                                    preorderButton.val(label);

                                    // will handle the click event on the pre order button
                                    preorderButton.on("click", {cartForm, label, date}, addToCartFromProductCard);
                                }
                            }).catch(err => console.error(err));
                        }
                    }).catch(err => console.log(err));
                }
            })
        }
    }

    // defined this method to handle the add to cart event from the product cards
    function addToCartFromProductCard(event) {

        event.preventDefault();
        event.stopImmediatePropagation();

        let orderProperty = jQueryPreOrder(`<input id="pre-order-item" name="properties[Note]" value="${event.data.label}" type="hidden"/>`)
        let estimatedDeliveryDateProperty = jQueryPreOrder(`<input id="pre-order-item" name="properties[PROMISE_DATE]" value="${event.data.date}" type="hidden"/>`)

        event.data.cartForm.append(orderProperty)
        // adding promise date to cart only if it's present
        if (event.data.date && event.data.date !== 'NULL' && event.data.date !== '_NA_') event.data.cartForm.append(estimatedDeliveryDateProperty)

        // using the cart add endpoint to add the product to cart, as using the theme specific methods is not recommended.
        jQueryPreOrder.ajax({
            type: "POST",
            url: '/cart/add.js',
            data: event.data.cartForm.serialize(),
            dataType: 'JSON',
            success: function () {
                // redirecting the user to the cart page after the product gets added to the cart
                if (preOrderCustomConfig.enableCartRedirection) {
                    location.replace('/cart');
                }
            }
        })

        orderProperty.remove();
        if (event.data.date && event.data.date !== 'NULL' && event.data.date !== '_NA_') estimatedDeliveryDateProperty.remove();
    }

    // defined this method to handle add to cart from the product detail page
    function addToCart(event) {
        let addToCartForm = jQueryPreOrder("form[action='/cart/add']");

        event.preventDefault();
        event.stopImmediatePropagation();

        let orderProperty = jQueryPreOrder(`<input id="pre-order-item" name="properties[Note]" value="${buttonLabel}" type="hidden"/>`)
        let estimatedDeliveryDateProperty = jQueryPreOrder(`<input id="pre-order-item" name="properties[PROMISE_DATE]" value="${localDeliveryDate}" type="hidden"/>`)

        addToCartForm.append(orderProperty)
        // adding promise date to cart only if it's present
        if (localDeliveryDate && localDeliveryDate !== 'NULL' && localDeliveryDate !== '_NA_') addToCartForm.append(estimatedDeliveryDateProperty)

        // using the cart add endpoint to add the product to cart, as using the theme specific methods is not recommended.
        jQueryPreOrder.ajax({
            type: "POST",
            url: '/cart/add.js',
            data: addToCartForm.serialize(),
            dataType: 'JSON',
            success: function () {
                // redirecting the user to the cart page after the product gets added to the cart
                if (preOrderCustomConfig.enableCartRedirection) {
                    location.replace('/cart');
                }
            }
        })

        orderProperty.remove();
        if (localDeliveryDate && localDeliveryDate !== 'NULL' && localDeliveryDate !== '_NA_') estimatedDeliveryDateProperty.remove();
    }

    // TODO move it to intialise block
    // To check whether the url has changed or not, for making sure that the variant is changed.
    let url = location.href; 
    new MutationObserver(() => {
        if (location.href !== url) {
            url = location.href;
            initialisePreOrder();
        }
    }).observe(document, {subtree: true, childList: true});
})();