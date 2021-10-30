<template>
  <div>
    <b-card title="ABC Logística 📦">
      <b-card-text>Su sistema para el mejor control de logística.</b-card-text>
      <b-card-text>Agilizar sus procesos de logística y asegurar el flujo de sus exportaciones nunca había sido tan fácil.
      </b-card-text>
    </b-card>

    <b-card title="Tencologías 💻">
      <b-card-text>Todo sistema debe contar con una interfaz sencilla y fácil de usar.</b-card-text>
      <b-card-text>Es por eso que para este sistema utilizamos tecnologías modernas como VueJS, Laravel y AWS Lightsail.</b-card-text>
    </b-card>

    <b-card title="Repositorios 🐱">
      <b-card-text>Código fuente en Github</b-card-text>
      <b-link
        href="https://github.com/marlons0707/proinsight-test-frontend"
        target="_blank"
      >
        FRONTEND
      </b-link>
      <b-card-text>
        <b-link
          href="https://github.com/marlons0707/proinsight-test-backend"
          target="_blank"
        >
          BACKEND
        </b-link>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import { BCard, BCardText } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardText,
  },
}
</script>

<style>

</style>
