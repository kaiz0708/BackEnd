
export let customInforBillAdmin = (bills) => {
    return bills.map(bill => {
        const { user , product , status_product, _id } = bill
        return {
            "id_bill" : _id, 
            "user" : user,
            "product" : {
                ...product.id_product.common,
                "id_product" : product.id_product._id
            },
            "size" : product.size,
            "quantity" : product.quantity,
            "date" : product.date.toLocaleDateString(),
            "time" : product.date.toLocaleTimeString(),
            "checkstatus" : status_product
        }
    })
}
