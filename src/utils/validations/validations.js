import { extend, localize } from 'vee-validate'
import {
  required as rule_required,
  email as rule_email,
  min as rule_min,
  max as rule_max,
  confirmed as rule_confirmed,
  regex as rule_regex,
  between as rule_between,
  alpha as rule_alpha,
  integer as rule_integer,
  digits as rule_digits,
  alpha_dash as rule_alpha_dash,
  alpha_num as rule_alpha_num,
  alpha_spaces as rule_alpha_spaces,
  length as rule_length,
} from 'vee-validate/dist/rules'

import en from 'vee-validate/dist/locale/en.json'
import es from 'vee-validate/dist/locale/es.json'
import { validatorPositive, validatorPasswordLogin } from './validators'

// ////////////////////////////////////////////////////////
// General
// ////////////////////////////////////////////////////////

export const required = extend('required', rule_required)

export const email = extend('email', rule_email)

export const min = extend('min', rule_min)

export const max = extend('max', rule_max)

export const confirmed = extend('confirmed', rule_confirmed)

export const regex = extend('regex', rule_regex)

export const between = extend('between', rule_between)

export const alpha = extend('alpha', rule_alpha)

export const integer = extend('integer', rule_integer)

export const digits = extend('digits', rule_digits)

export const alphaDash = extend('alpha_dash', rule_alpha_dash)

export const alphaNum = extend('alpha_num', rule_alpha_num)

export const alphaSpaces = extend('alpha_spaces', rule_alpha_spaces)

export const length = extend('length', rule_length)

export const positive = extend('positive', {
  validate: validatorPositive,
  message: 'Please enter positive number!',
})

export const password = extend('password', {
  validate: validatorPasswordLogin,
  message: 'La contraseña no cumple con los requisitos mínimos de seguridad.',
})

// Definimos los idiomas para vee-validate
localize({
  en: {
    messages: en.messages,
  },
  es: {
    messages: es.messages,
  },
})

// Inicializamos el idioma default o principal
localize('es', es)
