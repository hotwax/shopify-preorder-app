(function () {
    let jQueryPreOrder;
    let addToCartLabel;
    let localDeliveryDate, buttonLabel;

    this.preOrderCustomConfig = {
        'enableCartRedirection': true
    };

    function getAddToCartLabel () {
        if (location.pathname.includes('products')) {
            const addToCartButton = jQueryPreOrder("#hc_preorderButton, .hc_preorderButton")
            if (addToCartButton.is(':input')) {
                addToCartLabel = addToCartButton.val();
            } else {
                addToCartLabel = addToCartButton.html();
            }
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
                getAddToCartLabel();
                initialisePreOrder();
            });
        });
    } else {
        jQueryPreOrder = jQuery;
        jQueryPreOrder(document).ready(function() {
            getAddToCartLabel();
            initialisePreOrder();
        });
    }

    function isItemAvailableForOrder () {
        return new Promise(function(resolve, reject) {
            jQueryPreOrder.getJSON(`${window.location.pathname}.js`, function (data){
                if (data.tags.includes('Pre-Order') || data.tags.includes('Back-Order')) {
                    resolve(data)
                }
                reject(false)
            })
        })
    }

    async function initialisePreOrder () {
        if (location.pathname.includes('products')) {

            let hcpreorderShipsFrom = jQueryPreOrder("#hc_preordershipsfrom");
            let span = jQueryPreOrder("#hc_preordershipsfrom span");

            jQueryPreOrder(".hc_productForm").each(async function (i, form) {
            const cartForm = jQueryPreOrder(form)
            const variantId = cartForm.serializeArray().find(ele => ele.name === "id").value;

            const preorderButton = cartForm.find("#hc_preorderButton, .hc_preorderButton");
            let productType = '';

            hcpreorderShipsFrom.css('visibility', 'hidden');
            if (preorderButton.is(':input')) {
                preorderButton.val(addToCartLabel);
            } else {
                preorderButton.html(addToCartLabel);
            }

            // removing the click event with handler addToCart
            preorderButton.off('click', addToCart);

            let checkItemAvailablity = await isItemAvailableForOrder().then((product) => {
                // checking what type of tag product contains (Pre-Order / Back-order) and on the basis of that will check for metafield
                productType = product.tags.includes('Pre-Order') ? 'Pre-Order' : product.tags.includes('Back-Order') ? 'Back-Order' : ''

                // checking if continue selling is enabled for the variant or not
                return product.variants.find((variant) => variant.id == variantId).available
            }).catch(err => err);

            checkItemAvailablity = !(jQueryPreOrder("input[id='hc_inventory']").val() > 0) && !(Object.entries(hc_inventory_policy).find(([key, value]) => key == variantId)[1] != "continue");

            // if the product does not contains specific tag and continue selling is not enabled then not executing the script
            if (!checkItemAvailablity) return ;

            const backOrderDate = Object.entries(hc_metaFieldsData).find(([key, value]) => key == variantId)[1][0]
            const preOrderDate = Object.entries(hc_metaFieldsData).find(([key, value]) => key == variantId)[1][1]

            localDeliveryDate = productType === 'Pre-Order' ? preOrderDate : productType === 'Back-Order' && backOrderDate;

            // if the date is of past then making it empty
            let now = new Date();
            now.setHours(0, 0, 0, 0)
            if (new Date(localDeliveryDate) < now) {
                localDeliveryDate = '';
            }

            // Using different namespace for preorder and backorder but will update it to use single
            // namespace for the both the things
            buttonLabel = productType === 'Pre-Order' ? 'Pre Order' : productType === 'Back-Order' && 'Back Order'

            // will add Pre Order to the button
            if (preorderButton.is(':input')) {
                preorderButton.val(buttonLabel);
            } else {
                preorderButton.html(`<span>${buttonLabel}</span>`);
            }

            // will find for a tag with id hc_preordershipsfrom and if found then add the date to the tag
            if(hcpreorderShipsFrom.length > 0) {
                // if the value of the metafield is not _NA_ and NULL then only making the date field visible
                if (localDeliveryDate && localDeliveryDate !== 'NULL' && localDeliveryDate !== '_NA_') {
                    span.html(`${localDeliveryDate}`)
                    hcpreorderShipsFrom.css('visibility', 'visible');
                } else if (productType === 'Back-Order' && jQueryPreOrder(".hc_backorderString").length){
                    hcpreorderShipsFrom.css('visibility', 'visible');
                    localDeliveryDate = jQueryPreOrder(".hc_backorderString").text();
                    span.html(`${localDeliveryDate}`)
                }
            }
            preorderButton.off('click')
            // will handle the click event on the pre order button
            preorderButton.on("click", { cartForm },  addToCart);
            })
        } else {
            // this part executes on all the page other than product page
            // finding an input field with name tags and then iterating over the same
            jQueryPreOrder("input[id='hc_tags']").map(async function (index, element) {

                const variantTagInput = jQueryPreOrder(element);

                // checking for Pre-Order or Back-Order tag
                if (variantTagInput.val().includes('Pre-Order') || variantTagInput.val().includes('Back-Order')) {

                    const backOrderDate = variantTagInput.siblings("input[id=hc_backOrderDate]").val()
                    const preOrderDate = variantTagInput.siblings("input[id=hc_preOrderDate]").val()
                    const continueSelling = variantTagInput.siblings("input[id=hc_continueSelling]").val()
                    const variantInventory = variantTagInput.siblings("input[id=hc_inventory]").val()

                    const productType = variantTagInput.val().includes('Pre-Order') ? 'Pre-Order' : variantTagInput.val().includes('Back-Order') && 'Back-Order'

                    if (continueSelling && continueSelling == 'true' && variantInventory <= 0) {

                        // finding a button with type submit as the button will be on the same level as the input field so using siblings
                        const preorderButton = variantTagInput.siblings("#hc_preorderButton, .hc_preorderButton");
                        const cartForm = variantTagInput.parent();
                        let date = productType === 'Pre-Order' ? preOrderDate : productType === 'Back-Order' && backOrderDate;

                        // if the date is of past then making it empty
                        let now = new Date();
                        now.setHours(0, 0, 0, 0)
                        if (new Date(date) < now) {
                            date = '';
                        }

                        // Using different namespace for preorder and backorder but will update it to use single
                        // namespace for the both the things
                        const label = productType === 'Pre-Order' ? 'Pre Order' : productType === 'Back-Order' && 'Back Order'

                        // will add Pre Order / Back Order label to the button
                        preorderButton.val(label);

                        if ((!date || date == '_NA_' || date == 'NULL') && productType === 'Back-Order' && jQueryPreOrder(".hc_backorderString").length) {
                            date = jQueryPreOrder(".hc_backorderString").text();
                        }

                        // will handle the click event on the pre order button
                        preorderButton.on("click", {cartForm, label, date}, addToCartFromProductCard);
                    }
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
        let addToCartForm = event.data.cartForm;

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