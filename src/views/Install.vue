<template>
  <ion-page>
    <ion-content>
      <!-- Commented form tag as when using it the install page reloads again and
      then redirect to shopify -->
      <!-- <form> -->
        <ion-list>
          <img src="../assets/images/hc.png" />
          <ion-item>
            <ion-label position="floating"> {{ $t("Shop") }}</ion-label>
            <ion-input
              v-model="shopOrigin"
              name="shopOrigin"
              type="text"
              required
            ></ion-input>
          </ion-item>
        </ion-list>
        <div class="ion-padding">
          <ion-button type="submit" expand="block" @click="install(shopOrigin)">
            {{ $t("Install")  }}
          </ion-button>
        </div>
      <!-- </form> -->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Redirect } from "@shopify/app-bridge/actions";
import createApp from "@shopify/app-bridge";
import { showToast } from "@/utils";
import { useRouter } from "vue-router";
import emitter from "@/event-bus"
import services from "@/services"

export default defineComponent({
  name: "Install",
  components: {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
  },
  data() {
    return {
      apiKey: process.env.VUE_APP_SHOPIFY_API_KEY,
      apiSecret: process.env.VUE_APP_SHOPIFY_API_SECRET,
      shopOrigin: 'hc-sandbox.myshopify.com',
      session: this.$route.query['session'],
      hmac: this.$route.query['hmac'],
      shop: this.$route.query['shop'],
      host: this.$route.query['host'],
      locale: this.$route.query['locale'] || process.env.VUE_APP_I18N_LOCALE || process.env.VUE_APP_I18N_FALLBACK_LOCALE,
      timestamp: this.$route.query['timestamp'],
      code: this.$route.query['code']
    };
  },
  async mounted () {
    if (this.session) {
      this.$router.push("/");
    } else if (this.code) {
      emitter.emit("presentLoader");
      await services.generateAccessToken({
        "code": this.code,
        "shop": this.shop,
        "client_id": this.apiKey,
        "client_secret": this.apiSecret
      }).then(resp => resp.json()).catch(err => console.warn(err));
      const appURL = `https://${this.shop}/admin/apps/${this.apiKey}`;
      window.location.assign(appURL);
    } else if (this.shop || this.host) {
      this.authorise(this.shop, this.host, this.apiKey);
    }
  },
  methods: {
    install(shopOrigin: any) {
      this.authorise(shopOrigin, undefined, this.apiKey);
    },
    authorise(shop: any, host: any, apiKey: any) {
      emitter.emit("presentLoader");
      const redirectUri = process.env.VUE_APP_SHOPIFY_REDIRECT_URI;
      const permissionUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=read_products,read_content&redirect_uri=${redirectUri}`;

      if (window.top == window.self) {
        window.location.assign(permissionUrl);
      } else {
        const app = createApp({
          apiKey: apiKey,
          host,
        });
        Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl);
      }
      emitter.emit("dismissLoader");
    }
  },
  beforeUnmount () {
    emitter.emit("dismissLoader")
  },
  setup() {
    const router = useRouter();
    return {
      router,
      showToast,
    };
  },
});
</script>

<style scoped></style>
