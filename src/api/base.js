// 封装axios

import axios from 'axios'
import store from '@/store/index'

import { Message } from 'element-ui'

axios.defaults.timeout = 150000
const service = '/api'

