<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-back-button default-href="/" slot="start" />
        <ion-title>{{ $t("Order Details") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div>
      <ion-list>
        <ion-item lines="none">
          <ion-label>
            <h2>{{order.customer?.first_name}} {{ order.customer?.last_name }}</h2>
            <p>{{ order.name }}</p>
          </ion-label>
          <ion-badge color="dark" slot="end">{{ order.created_at }}</ion-badge>
        </ion-item>
      </ion-list>
      <ion-item v-if="order.customer?.phone">
        <ion-icon :icon="callOutline" slot="start" />
        <ion-label>{{ order.customer?.phone }}</ion-label>
        <ion-button
          fill="outline"
          slot="end"
          color="medium"
        >
          {{ $t("Copy") }}
        </ion-button>
      </ion-item>
      <ion-item lines="none" v-if="order.customer?.email">
        <ion-icon :icon="mailOutline" slot="start" />
        <ion-label>{{ order.customer?.email }}</ion-label>
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
            <ion-label>
              <h2>{{ item.title }}</h2>
              <p>{{ item.variant_title }}</p>
              <p class="ion-text-wrap">{{ $t("SKU") }}: {{ item.sku }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label v-for="property in item.properties" :key="property">
              <p>{{ property.name }}: {{ property.value }}</p>
            </ion-label>
          </ion-item>
          <ion-item lines="none" class="border-top">
            <ion-label>{{ $t("Pre Order") }}</ion-label>
            <ion-checkbox :checked="item.properties.find(property => property.name === 'Note')?.value == 'Pre Order'" @ionChange="addProperty('Pre Order', item, $event)" />
          </ion-item>
          <ion-item lines="none" class="border-top">
            <ion-label>{{ $t("Back Order") }}</ion-label>
            <ion-checkbox :checked=" item.properties.find(property => property.name === 'Note')?.value == 'Back Order'" @ionChange="addProperty('Back Order', item, $event)" />
          </ion-item>               
        </ion-card>
      </main>
      <ion-button @click="updateOrder(order.line_items)">{{ $t("Update") }}</ion-button> 
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
  IonCheckbox,
  IonBackButton
} from "@ionic/vue";
import {
  sendOutline,
  swapVerticalOutline,
  callOutline,
  mailOutline,
} from "ionicons/icons";
import { defineComponent } from 'vue';
import { mapGetters, useStore } from 'vuex';
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
  IonCheckbox,
  IonBackButton
  },
  computed: {
    ...mapGetters({
      order: 'order/getDraftOrder'
    })
  },
  created(){
    this.store.dispatch('order/fetchDraftOrder');
  },
  methods: {
    addProperty (value: string, item: any, event: any) {
      if (event.detail.checked) {
        item.properties.push({ name: 'Note', value: value})
      } else {
        const index = item.properties.findIndex((property: any) => property.value === value);
        item.properties.splice(index, 1);
      }
    },
    updateOrder (lineItems: any, item: any) {
      this.store.dispatch('order/updateDraftOrder', lineItems);
    }
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
