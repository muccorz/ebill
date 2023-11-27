<template>
    <div>
        <el-autocomplete
            v-model="selectedCustomer"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入取引先名称"
            @select="handleSelect"
        ></el-autocomplete>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedCustomer: '',
            customers: [
                { value: 'customer1', label: 'Customer 1' },
                { value: 'customer2', label: 'Customer 2' },
                { value: 'customer3', label: 'Customer 3' },
                { value: 'customer4', label: 'Customer 4' },
                { value: 'customer5', label: 'Customer 5' }
            ]
        }
    },
    methods: {
        querySearchAsync(queryString, cb) {
            const customers = this.customers
            const results = queryString ? customers.filter(this.createFilter(queryString)) : customers
            cb(results)
        },
        createFilter(queryString) {
            return (customer) => {
                return (customer.label.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
            }
        },
        handleSelect(item) {
            console.log(item)
        }
    }
}
</script>