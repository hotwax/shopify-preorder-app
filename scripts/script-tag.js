(function () {
    let jQueryPreOrder;
    let addToCartLabel;
    let localDeliveryDate, buttonLabel;

    this.preOrderCustomConfig = {
        'enableCartRedirection': true
    };

    // TODO Generate instance specific code URL in FTL. Used with <#noparse> after this code so that `` code is escaped
    // let baseUrl = '<@ofbizUrl secure="true"></@ofbizUrl>';
    let shopUrl = ''

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
                    // TODO: check if tags is always a string or an array
                    if (data.product.tags.includes('preorder')) {
                        if (data.product.variants.find((variant) => variant.id == variantId).inventory_policy === 'continue')
                            resolve(true)
                        else
                            resolve(false)
                    }
                    resolve(false)
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
            const id = cartForm.serializeArray().find(ele => ele.name === "id").value;
            // getting virtual product id
            const virtualId = meta.product.id;
            const preorderButton = jQueryPreOrder("#hc_preorderButton, .hc_preorderButton");

            const checkItemAvailablity = await isItemAvailableForOrder(virtualId, id).catch(err => console.log(err));

            if (!checkItemAvailablity) return ;

            const metafields = await getVariantMetafields(virtualId, id).catch(err => console.error(err));

            const metafield = metafields.find((metafield) => metafield.namespace === 'PRE_ORDER_DATE' || metafield.namespace === 'BACKORDER_DATE')

            let hcpreorderShipsFrom = jQueryPreOrder("#hc_preordershipsfrom");
            let span = jQueryPreOrder("#hc_preordershipsfrom span");

            hcpreorderShipsFrom.css('visibility', 'hidden');
            preorderButton.html(addToCartLabel);

            // removing the click event with handler addToCart
            preorderButton.off('click', addToCart);

            if (metafield) {
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

                if (metafield.value !== '_NA_') {
                    hcpreorderShipsFrom.css('visibility', 'visible');
                }

                // will handle the click event on the pre order button
                preorderButton.on("click", addToCart);
            }
        }
    }

    function addToCart(event) {
        let addToCartForm = jQueryPreOrder("form[action='/cart/add']");

        event.preventDefault();
        event.stopImmediatePropagation();

        let orderProperty = jQueryPreOrder(`<input id="pre-order-item" name="properties[Note]" value="${buttonLabel}" type="hidden"/>`)
        let estimatedDeliveryDateProperty = jQueryPreOrder(`<input id="pre-order-item" name="properties[PROMISE_DATE]" value="${localDeliveryDate}" type="hidden"/>`)

        addToCartForm.append(orderProperty)
        // adding promise date to cart only if it's present
        if (localDeliveryDate) addToCartForm.append(estimatedDeliveryDateProperty)

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
        if (localDeliveryDate) estimatedDeliveryDateProperty.remove();
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