
(function () {
    let jQueryPreOrder;

    this.preOrderCustomConfig = {
        'enableCartRedirection': true
    };

    // TODO Generate instance specific code URL in FTL. Used with <#noparse> after this code so that `` code is escaped
    // let baseUrl = '<@ofbizUrl secure="true"></@ofbizUrl>';
    let baseUrl = 'https://dev-hc.hotwax.io';
    // let baseUrl = 'https://demo-hc.hotwax.io';

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
          });

        });
    } else {
        jQueryPreOrder = jQuery;
        jQueryPreOrder(document).ready(function() {
            initialisePreOrder();
        });
    }

    // load moment library using cdn link
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js', function() {
        console.log('moment js loaded')
    })

    function checkPreOrder (ids) {
        return new Promise(function(resolve, reject) {
            jQueryPreOrder.ajax({
                type: 'POST',
                // need to update this endpoint to use correct endpoint for checking the product preorder availability
                url: `${baseUrl}/api/checkPreorderItemAvailability`,
                data: JSON.stringify({
                    "filters": {
                        "sku": ["31285153595519", "31285153562751"],
                        "sku_op": "in"
                    }
                }),
                dataType: "json",
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (data) {
                    resolve(data)
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
            //TODO: pass id of all the variant in the preorder API
            const id = cartForm.serializeArray().find(ele => ele.name === "id").value;

            // getting ids for all the variants of the product
            const variantIds = meta.product.variants.map(variant => variant.id);

            const addToCartButton = jQueryPreOrder("form[action^='/cart/add']:first [type=submit]:visible:first");

            // need to send sku when connected to dev instance
            // const sku = meta.product.variants.find(variant => variant.id == id).sku;

            // function will return only the products information that are available for preorder
            const preOrderDetails = await checkPreOrder(variantIds).catch(err => console.error(err));

            let hcpreorderShipsFrom = jQueryPreOrder("#hc_preordershipsfrom");
            let span = jQueryPreOrder("#hc_preordershipsfrom span");

            if (preOrderDetails && preOrderDetails.count > 0) {

                // iterating over the response to check for the current variant selected
                const currentVariant = preOrderDetails.docs[0];
                // const currentVariant = preOrderDetails.docs.find((product) => product.productId === id)

                if (currentVariant) {
                    const deliveryDate = moment(currentVariant.estimatedDeliveryDate).format("YYYY-MM-DD hh:mm:ss A")

                    // will add Pre Order to the button
                    addToCartButton.html("Pre Order");

                    // will find for a tag with id hc_preordershipsfrom and if found then add the date to the tag
                    if(hcpreorderShipsFrom.length > 0) {
                        span.html(`${deliveryDate}`)
                    }

                    hcpreorderShipsFrom.show();

                    // will handle the click event on the pre order button
                    addToCartButton.on("click", addToCart.bind(null));
                }
            }
        }
    }

    function addToCart(event) {

        let addToCartForm = jQueryPreOrder("form[action='/cart/add']");

        event.preventDefault();
        event.stopImmediatePropagation();

        let preOrderProperty = jQueryPreOrder(`<input id="pre-order-item" name="properties[Note]" value="Pre-Order" type="hidden"/>`)
        addToCartForm.append(preOrderProperty)

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

        preOrderProperty.remove();
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