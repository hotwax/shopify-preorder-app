<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ $t("Preorder") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $t("Preorder App") }}</ion-title>
        </ion-toolbar>
      </ion-header>
    
      <div id="container">
        <strong>{{ $t("Check preorder items") }}</strong>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent } from 'vue';
import services from "@/services"

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  },
  async mounted () {
    const code = this.$route.query['code']
    const shop = this.$route.query['shop']
    const payload = {
      "code": code,
      "shop": shop,
      "client_id": process.env.VUE_APP_SHOPIFY_API_KEY,
      "client_secret": process.env.VUE_APP_SHOPIFY_API_SECRET
    }
    await services.generateAccessToken(payload).then(resp => resp.json()).catch(err => console.warn(err));
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>