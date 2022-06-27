<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-back-button default-href="/" slot="start" />
        <ion-title>{{ $t("Order details") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div>
      <ion-list>
        <ion-item lines="none">
          <ion-label>
            <h2>{{order.customer.first_name}} {{ order.customer.last_name }}</h2>
            <p>{{ order.name }}</p>
          </ion-label>
          <ion-badge color="dark" slot="end">{{ order.created_at }}</ion-badge>
        </ion-item>
      </ion-list>
      <ion-item>
        <ion-icon :icon="callOutline" slot="start" />
        <ion-label>{{order.customer.phone }}</ion-label>
        <ion-button
          fill="outline"
          slot="end"
          color="medium"
        >
          {{ $t("Copy") }}
        </ion-button>
      </ion-item>
      <ion-item lines="none">
        <ion-icon :icon="mailOutline" slot="start" />
        <ion-label>{{ order.customer.email }}</ion-label>
        <ion-button
          fill="outline"
          slot="end"
          color="medium"
        >
          {{ $t("Copy") }}
        </ion-button>
      </ion-item>
  
      <main v-for="item in order.line_items" :key="item">
        <ion-card>
          <ion-item lines="none">
            <ion-thumbnail slot="start">
              <img src="https://dev-resources.hotwax.io/resources/uploads/images/product/m/h/mh04-white_main.jpg" />
            </ion-thumbnail>
            <ion-label>
              <h5>brandName</h5>
              <h2>{{ item.title }}</h2>
              <p class="ion-text-wrap">{{ item.sku }}</p>
              <p>{{ $t("Color") }}: Blue</p>
              <p>{{ $t("Size") }}: Xs</p>
            </ion-label>
          </ion-item>
          <ion-item lines="none" class="border-top">
            <ion-label>{{ $t("Pre Order") }}</ion-label>
            <ion-checkbox />
          </ion-item>
          <ion-item lines="none" class="border-top">
            <ion-label>{{ $t("Back Order") }}</ion-label>
            <ion-checkbox />
          </ion-item>
        </ion-card>
      </main> 
    </div>   
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import {
  IonBadge,
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import {
  sendOutline,
  swapVerticalOutline,
  callOutline,
  mailOutline,
} from "ionicons/icons";
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Home',
  components: {
  IonBadge,
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  },
  data(){
    return{
      order:{
        "id": 1051037040804,
        "note": null,
        "email": "andrewsmith@example.com",
        "taxes_included": true,
        "currency": "USD",
        "invoice_sent_at": null,
        "created_at": "2021-12-28T03:27:29-05:00",
        "updated_at": "2021-12-28T03:27:54-05:00",
        "tax_exempt": false,
        "completed_at": null,
        "name": "#D12",
        "status": "open",
        "line_items": [
            {
                "id": 57922695430308,
                "variant_id": 40257575747748,
                "product_id": 6795715051684,
                "title": "Desiree Fitness Tee",
                "variant_title": "XS / Black",
                "sku": "WS05-XS-Black-SH",
                "vendor": "HC Sandbox",
                "quantity": 1,
                "requires_shipping": true,
                "taxable": true,
                "gift_card": false,
                "fulfillment_service": "manual",
                "grams": 1000,
                "tax_lines": [],
                "applied_discount": null,
                "name": "Desiree Fitness Tee - XS / Black",
                "properties": [
                    {
                        "name": "orderItemSeqId",
                        "value": "07"
                    }
                ],
                "custom": false,
                "price": "24.00",
                "admin_graphql_api_id": "gid://shopify/DraftOrderLineItem/57922695430308"
            }
        ],
        "shipping_address": {
            "first_name": "Andrew",
            "address1": "Washington Street",
            "phone": "09765456765",
            "city": "Indore",
            "zip": "10004",
            "province": "New York",
            "country": "United States",
            "last_name": "Smith",
            "address2": "",
            "company": null,
            "latitude": null,
            "longitude": null,
            "name": "Andrew Smith",
            "country_code": "US",
            "province_code": "NY"
        },
        "billing_address": {
            "first_name": "Jack",
            "address1": "Washington Street",
            "phone": "09765456765",
            "city": "Indore",
            "zip": "10004",
            "province": "New York",
            "country": "United States",
            "last_name": "Norm",
            "address2": "",
            "company": null,
            "latitude": null,
            "longitude": null,
            "name": "Jack Norm",
            "country_code": "US",
            "province_code": "NY"
        },
        "invoice_url": "https://hc-sandbox.myshopify.com/41965584548/invoices/54e14fd1cc642288c01f7c0e2fdf2020",
        "applied_discount": null,
        "order_id": null,
        "shipping_line": null,
        "tax_lines": [],
        "tags": "",
        "note_attributes": [
            {
                "name": "hotwaxOrderId",
                "value": "100306"
            }
        ],
        "total_price": "24.00",
        "subtotal_price": "24.00",
        "total_tax": "0.00",
        "payment_terms": null,
        "admin_graphql_api_id": "gid://shopify/DraftOrder/1051037040804",
        "customer": {
            "id": 5615473557668,
            "email": "andrewsmith@example.com",
            "accepts_marketing": false,
            "created_at": "2021-08-24T01:19:33-04:00",
            "updated_at": "2021-12-29T04:20:55-05:00",
            "first_name": "Andrew",
            "last_name": "Smith",
            "orders_count": 90,
            "state": "disabled",
            "total_spent": "2654.00",
            "last_order_id": 4399409037476,
            "note": null,
            "verified_email": true,
            "multipass_identifier": null,
            "tax_exempt": false,
            "phone": 1234567342,
            "tags": "",
            "last_order_name": "#1364",
            "currency": "USD",
            "accepts_marketing_updated_at": "2021-08-24T01:19:33-04:00",
            "marketing_opt_in_level": null,
            "tax_exemptions": [],
            "email_marketing_consent": {
                "state": "not_subscribed",
                "opt_in_level": "single_opt_in",
                "consent_updated_at": null
            },
            "sms_marketing_consent": null,
            "admin_graphql_api_id": "gid://shopify/Customer/5615473557668",
            "default_address": {
                "id": 6809279103140,
                "customer_id": 5615473557668,
                "first_name": "Andrew",
                "last_name": "Smith",
                "company": null,
                "address1": "Washington Street",
                "address2": "",
                "city": "Indore",
                "province": "New York",
                "country": "United States",
                "zip": "10004",
                "phone": "09765456765",
                "name": "Andrew Smith",
                "province_code": "NY",
                "country_code": "US",
                "country_name": "United States",
                "default": true
            }
        }
    }
    }
  },
  mounted(){
    this.store.dispatch('order/getOrders');
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    return {
      sendOutline,
      swapVerticalOutline,
      callOutline,
      mailOutline,
      router,
      store,
      
    };
  },
});
</script>

<style scoped>
ion-content > div {
  max-width: 560px;
  margin-right: auto;
  margin-left: auto;
}
</style>
