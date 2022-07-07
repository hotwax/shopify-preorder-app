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
        <h1 class="center-align">{{ $t("Order") }} {{ order.name }}</h1>
        <ion-card>
          <ion-list>
            <ion-item lines="none">
              <ion-label>
                <h2>{{order.customer?.first_name}} {{ order.customer?.last_name }}</h2>
                <p>CSR name</p>
              </ion-label>
              <ion-note slot="end">{{ timeFromNow(order?.created_at) }}</ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
    
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
              <ion-checkbox slot="start" />
              <ion-label>{{ $t("Pickup") }}</ion-label>
              <ion-note slot="end">15 {{ $t("in stock") }}</ion-note>
            </ion-item>
            <ion-radio-group :value="isSelected(item)" @ionChange="addProperty(item, $event)">
              <ion-item class="border-top">
                <ion-radio :disabled="checkPreOrderAvailability(item, 'PREORDER')" slot="start" value="PREORDER" />
                <ion-label>{{ $t("Pre Order") }}</ion-label>
                <ion-note slot="end" :color="getEstimatedDeliveryDate(item.sku, 'PREORDER') ? '' : 'warning'">{{ getEstimatedDeliveryDate(item.sku, "PREORDER") ? getEstimatedDeliveryDate(item.sku, "PREORDER") : $t("No shipping estimates") }}</ion-note>
              </ion-item>
              <ion-item class="border-top">
                <ion-radio :disabled="checkPreOrderAvailability(item, 'BACKORDER')" slot="start" value="BACKORDER" />
                <ion-label >{{ $t("Back Order") }}</ion-label>
                <ion-note slot="end" :color="getEstimatedDeliveryDate(item.sku, 'BACKORDER') ? '' : 'warning'">{{ getEstimatedDeliveryDate(item.sku, "BACKORDER") ? getEstimatedDeliveryDate(item.sku, "BACKORDER") : $t("No shipping estimates") }}</ion-note>
              </ion-item>
            </ion-radio-group>
            
          </ion-card>
        </main>
        <div class="text-center center-align">
          <ion-button @click="updateDraftOrder(order.line_items)">{{ $t("Save changes to order") }}</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import {
  IonButton,
  IonCard,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
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
    IonButton,
    IonCard,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
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
  data(){
    return {
      checkPreorderItemAvailability: [] as any
    }
  },
  async mounted(){
    if(this.$route.query.id){
      this.store.dispatch('order/setCurrentDraftOrderId', this.$route.query.id);
    }
    await this.store.dispatch('order/getDraftOrder', {id: this.orderId, configId: this.configId });
    const productIds = await this.order.line_items.map((item: any) => {
      return item.sku;
    }).filter((id: any) => id);
    this.checkPreorderItemAvailability = await this.store.dispatch('shop/checkPreorderItemAvailability', productIds);
  },
  methods: {
    checkPreOrderAvailability(item: any, label: string){
      const product = this.checkPreorderItemAvailability.find((product: any) => {
        return product.sku == item.sku && product.label == label
      })
      return !product;
    },
    addProperty (item: any, event: any) {
      const product = this.checkPreorderItemAvailability.find((product: any) => {
        return product.sku == item.sku
      })
      if(product){
        item.properties.push({ name: 'Note', value: event.detail.value }, { name: 'EstimatedDeliveryDate', value: product.estimatedDeliveryDate })
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
    getEstimatedDeliveryDate(sku: any, label: string){
      const item = this.checkPreorderItemAvailability.find((item: any) => {
        return item.sku == sku && item.label === label
      });
      if(item){
        return item.estimatedDeliveryDate;
      }
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
  max-width: 400px;
  margin-right: auto;
  margin-left: auto;
}

.center-align {
  display: flex;
  justify-content: center;
}
</style>
