/**
 * Mixins docs:
 * https://es.vuejs.org/v2/guide/mixins.html
 * https://codingpotions.com/vue-mixins
 */

export const mixinAlerts = {
  methods: {
    makeToast(variant = null, title = null, message = null) {
      this.$bvToast.toast([message], {
        title,
        variant,
        solid: true,
      })
    },
  },
}

export const _ = null
