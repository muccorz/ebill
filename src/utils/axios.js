import axios from 'axios'
import Element from 'element-ui'
//请求路径设置
axios.defaults.baseURL = "http://192.168.11.9:8082/";

const instance = axios.create({
        timeout: 5000
    })
    //请求拦截器 用于处理服务器报错
    // through可视化
instance.interceptors.response.use(
    response => {
        if (response.data.code == 200) {
            return response
        } else {
            Element.Message.error(response.data.text)
            return Promise.reject(response)
        }
    },
    error => {
        if (error.code == "ERR_NETWORK") {
            Element.Message.error("ネットワーク接続のタイムアウト")
        } else {
            Element.Message.error(error.response.data.text)
        }
        return Promise.reject(error);
    }

)

export default instance