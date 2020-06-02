import Vue from 'vue'
import {
  Button, Col, Row, Form, Field, Notify, List, Cell, CellGroup, Image as VanImage,
  Divider, Popup
} from 'vant'

Vue.use(Button)
Vue.use(Col)
Vue.use(Row)
Vue.use(Form)
Vue.use(Field)
Vue.use(List)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(VanImage)
Vue.use(Divider)
Vue.use(Popup)
Vue.prototype.$notify = Notify
