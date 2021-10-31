// We haven't added icon's computed property because it makes this mixin coupled with UI
export const togglePasswordVisibility = {
  data() {
    return {
      passwordFieldType: 'password',
      passwordConfFieldType: 'password',
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    toggleConfPasswordVisibility() {
      this.passwordConfFieldType = this.passwordConfFieldType === 'password' ? 'text' : 'password'
    },
  },
}

export const _ = null
