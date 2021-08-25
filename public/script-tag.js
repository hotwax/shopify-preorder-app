
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

    function checkPreOrder (id) {
        return new Promise(function(resolve, reject) {
            jQueryPreOrder.ajax({
                type: 'POST',
                // need to update this endpoint to use correct endpoint for checking the product preorder availability
                url: `${baseUrl}/api/searchProducts`,
                data: JSON.stringify({
                    "filters": [ `sku: ${id}` ]
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
            const id = cartForm.serializeArray().find(ele => ele.name === "id").value;
            const addToCartButton = jQueryPreOrder("form[action^='/cart/add']:first [type=submit]:visible:first");
            const sku = meta.product.variants.find(variant => variant.id == id).sku;

            const ifPreOrderActive = checkPreOrder(sku);

            if (ifPreOrderActive.preOrder) {
                // will add Pre Order to the button
                addToCartButton.html("Pre Order");

                // will find for a tag with id hc_preordershipsfrom and if found then add the date to the tag
                if(jQueryPreOrder("#hc_preordershipsfrom").length > 0) {
                    jQueryPreOrder("#hc_preordershipsfrom").html(`${ifPreOrderActive.timestamp}`)
                }

                // will handle the click event on the pre order button
                addToCartButton.on("click", addToCart.bind(null));
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