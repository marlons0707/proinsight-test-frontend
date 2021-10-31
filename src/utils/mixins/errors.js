/**
 * Mixins docs:
 * https://es.vuejs.org/v2/guide/mixins.html
 * https://codingpotions.com/vue-mixins
 */

export const mixinErrors = {
  methods: {
    showErrors(error) {
      let errorMsg = ''
      let errorList = {}

      if (error.response) {
        errorMsg = error.response.data.msg
        errorList = error.response.data.error

        if (typeof errorList === 'object') {
          Object.keys(errorList).forEach(key => {
            errorMsg += errorList[key]
          })
        } else {
          errorMsg += ` ${errorList}`
        }

        if (error.response.status === 401) {
          this.$router.push({ name: 'login' }).catch(() => {})
        }
      } else if (error.request) {
        errorMsg = error.request
      } else if (error.message) {
        errorMsg = error.message
      } else {
        errorMsg = error
      }

      this.makeToast('danger', 'Error', errorMsg)
    },
  },
}

export const _ = null
