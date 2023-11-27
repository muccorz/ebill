"use strict";(self["webpackChunkebill"]=self["webpackChunkebill"]||[]).push([[591],{6591:function(t,e,s){s.r(e),s.d(e,{default:function(){return n}});var i=function(){var t=this,e=t._self._c;return e("div",{staticStyle:{"text-align":"left"}},[e("div",{staticClass:"h4",staticStyle:{"font-weight":"700","text-align":"left"}},[t._v("カテゴリー管理")]),e("el-divider"),e("div",{staticClass:"d-flex",staticStyle:{"justify-content":"space-around"}},[e("el-card",{staticClass:"box-card"},[e("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[e("span",[t._v("帳票種類")]),e("el-button",{staticStyle:{float:"right",padding:"3px 0"},attrs:{type:"text"},on:{click:t.addBillType}},[t._v("新規")])],1),t._l(t.billTypes,(function(s){return e("div",{key:s.billTypeno,staticClass:"text item d-flex",staticStyle:{"justify-content":"space-between"}},[e("div",[t._v(t._s(s.billType))]),e("el-button",{attrs:{size:"mini",type:"danger",icon:"el-icon-delete"},on:{click:function(e){return t.deleteBillType(s.billTypeno)}}},[t._v("削除")])],1)}))],2),e("el-card",{staticClass:"box-card"},[e("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[e("span",[t._v("取引先")]),e("el-button",{staticStyle:{float:"right",padding:"3px 0"},attrs:{type:"text"},on:{click:function(e){t.dialogFormVisible=!0}}},[t._v("新規")]),e("el-dialog",{attrs:{title:"取引先新規",visible:t.dialogFormVisible},on:{"update:visible":function(e){t.dialogFormVisible=e},closed:t.customerInit}},[e("el-form",{attrs:{model:t.customer}},[e("el-form-item",{attrs:{label:"取引先"}},[t.flag1?e("span",{staticClass:"text-danger",staticStyle:{"font-size":"12px"}},[t._v("取引先を入力してください")]):t._e(),e("el-input",{attrs:{autocomplete:"off"},on:{blur:t.customerBlur},model:{value:t.customer.customer,callback:function(e){t.$set(t.customer,"customer",e)},expression:"customer.customer"}})],1),e("el-form-item",{attrs:{label:"取引先種類"}},[t.flag2?e("span",{staticClass:"text-danger",staticStyle:{"font-size":"12px"}},[t._v("取引先種類を入力してください")]):t._e(),e("el-select",{staticClass:"w-100",attrs:{filterable:"","allow-create":"","default-first-option":"",placeholder:"取引先種類を選択してください"},model:{value:t.customer.customerType,callback:function(e){t.$set(t.customer,"customerType",e)},expression:"customer.customerType"}},t._l(t.customerTypes,(function(t){return e("el-option",{key:t.customerType,attrs:{label:t.customerType,value:t.customerType}})})),1)],1)],1),e("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:function(e){t.dialogFormVisible=!1}}},[t._v("キャンセル")]),e("el-button",{attrs:{type:"primary",disabled:t.addCustomerBt},on:{click:t.addCustomer}},[t._v("追 加")])],1)],1)],1),t._l(t.customers,(function(s){return e("div",{key:s.customerno,staticClass:"text item d-flex",staticStyle:{"justify-content":"space-between"}},[e("div",{staticStyle:{width:"120px"}},[t._v(t._s(s.customer))]),e("div",[t._v(t._s(s.customerType))]),e("el-button",{attrs:{size:"mini",type:"danger",icon:"el-icon-delete"},on:{click:function(e){return t.deleteCustomer(s.customerno)}}},[t._v("削除")])],1)}))],2)],1)],1)},o=[],a={data(){return{path:"",dialogFormVisible:!1,flag1:!1,flag2:!1,billType:{billType:""},customer:{customer:"",customerType:""},customerTypes:[],billTypes:[],customers:[]}},name:"categoryView",computed:{addCustomerBt(){return""===this.customer.customer||""===this.customer.customerType}},created(){this.billsInit(),this.costumersInit(),this.customerTypesInit()},methods:{costumersInit(){this.$http.get("/category/getCustomers").then((t=>{this.customers=t.data.data}))},customerTypesInit(){this.$http.get("/category/getCustomerTypes").then((t=>{this.customerTypes=t.data.data}))},customerBlur(){""===this.customer.customer?this.flag1=!0:this.flag1=!1},deleteCustomer(t){this.$confirm("これで取引先は完全に削除されます，続きますが？","取引先を消しますが？",{confirmButtonText:"続く",cancelButtonText:"キャンセル",type:"warning"}).then((()=>{this.$http.get("/category/deleteCustomer/"+t).then((t=>{200===t.data.code&&(this.$message({type:"success",message:"削除成功"}),this.customerInit())}))})).catch((()=>{}))},addCustomer(){let t=!1;this.customerTypes.forEach((e=>{this.customer.customerType===e.customerType&&(t=!0)})),t?this.addCustomerSend():this.$confirm("入力した取引先は今のない取引先です。","取引先を新規しますか？",{confirmButtonText:"新規",cancelButtonText:"キャンセル",type:"warning"}).then((()=>{this.addCustomerSend()}))},addCustomerSend(){this.$http.post("/category/addCustomer",this.customer).then((t=>{200===t.data.code&&(this.$message({type:"success",message:"新規成功"}),this.costomersInit(),this.costomerInit())})),this.dialogFormVisible=!1},deleteBillType(t){this.$confirm("これで帳票種類は完全に削除されます，続きますが？","帳票種類を消しますが？",{confirmButtonText:"続く",cancelButtonText:"キャンセル",type:"warning"}).then((()=>{this.$http.get("/category/deleteBillType/"+t).then((t=>{200===t.data.code&&(this.$message({type:"success",message:"削除成功"}),this.billsInit())}))})).catch((()=>{}))},addBillType(){this.$prompt("帳票種類を入力ください","帳票種類新規",{confirmButtonText:"追加",cancelButtonText:"キャンセル"}).then((({value:t})=>{null!=t&&""!==t?this.$http.get("/category/addBillType/"+t).then((t=>{200===t.data.code&&(this.$message({type:"success",message:"新規成功"}),this.billsInit())})):this.$message({type:"warning",message:"帳票種類を入力ください"})})).catch((()=>{}))},handleFolderChange(t){const e=t.target.files[0].path;this.path=e},triggerFileInput(){this.$refs.fileInput.click()},billsInit(){this.$http.get("/category/getBillTypes").then((t=>{this.billTypes=t.data.data}))},costomersInit(){this.$http.get("/category/getCustomers").then((t=>{this.customers=t.data.data}))},customerInit(){this.customer.customer="",this.customer.customerType=""}}},l=a,c=s(1001),r=(0,c.Z)(l,i,o,!1,null,"7694e381",null),n=r.exports}}]);
//# sourceMappingURL=591.0012581d.js.map