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
            <ion-badge color="dark" slot="end">{{ timeFromNow(order?.created_at) }}</ion-badge>
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
    
        <main v-for="item in order.line_items" :key="item.id">
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
            <ion-radio-group :value="isSelected(item)" @ionChange="addProperty(item, $event)">
              <ion-item lines="none" class="border-top">
                <ion-label>{{ $t("Pre Order") }}</ion-label>
                <ion-radio value="Pre Order" />
              </ion-item>
              <ion-item lines="none" class="border-top">
                <ion-label>{{ $t("Back Order") }}</ion-label>
                <ion-radio value="Back Order" />
              </ion-item>
              <ion-item lines="none" class="border-top">
                <ion-label>{{ $t("None") }}</ion-label>
                <ion-radio value="None" />
              </ion-item>
            </ion-radio-group>
            
          </ion-card>
        </main>
        <ion-button @click="updateDraftOrder(order.line_items)">{{ $t("Update") }}</ion-button>
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
  IonBackButton,
  IonRadio,
  IonRadioGroup
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
import { DateTime } from 'luxon';

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
    IonBackButton,
    IonRadio,
    IonRadioGroup
  },
  computed: {
    ...mapGetters({
      order: 'order/getDraftOrder',
      orderId: 'order/getCurrentDraftOrderId',
      configId: 'shop/getShopConfigId'
    })
  },
  async mounted(){
    if(this.$route.query.id){
      this.store.dispatch('order/setCurrentDraftOrderId', this.$route.query.id);
    }
    await this.store.dispatch('order/getDraftOrder', {id: this.orderId, configId: this.configId });
  },
  methods: {
    addProperty (item: any, event: any) {
      if(item.properties?.find((property: any) => property.name === 'Note')){
        const index = item.properties?.findIndex((property: any) => property.name === 'Note');
        item.properties.splice(index, 1);
      }
      if(event.detail.value !== "None"){
        item.properties.push({ name: 'Note', value: event.detail.value })
      }
    },
    updateDraftOrder (lineItems: any) {
      const id = this.orderId;
      this.store.dispatch('order/updateDraftOrder', {lineItems, id, configId: this.configId});
    },
    isSelected (item: any) {
      const property = item.properties?.find((property: any) => property.name === 'Note')?.value;
      if (property){
        return property
      } else {
        return "None"
      }
    },
    timeFromNow (time: string) {
      if (time) {
        const timeDiff = DateTime.fromISO(time).diff(DateTime.local());
        return DateTime.local().plus(timeDiff).toRelative();
      }
    },
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
