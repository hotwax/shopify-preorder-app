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
      store  
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
