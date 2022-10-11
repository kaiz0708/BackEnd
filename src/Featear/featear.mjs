export let customCart = (carts) => {
    return carts.map( (cart) => {
        let product = cart.product
        return {
            infor_product : product.common,
            id_cart : cart._id,
            id_product : product._id,
            quantity : cart.quantity,
            size : cart.size
        }
    })
}

export let customProductRes = (products) => {
    return  products.map(product => {
        return {
            ...product.common,
            ...product.cate,
            id_product : product._id.toString()
        }
    })
}

export let toSlug = (str) => {

	str = str.toLowerCase()     
	str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
	str = str.replace(/[đĐ]/g, 'd')
	str = str.replace(/([^0-9a-z-\s])/g, '')
	str = str.replace(/(-)/g, ' ')
	str = str.replace(/\s/g, ' ')
	str = str.trim()
	return str;
}

let customFeedBack = (feedbacks) => {
    return feedbacks.map(feedback => {
        return {
            'id_user' : feedback.id_user,
            'username' : feedback.username,
            'avatar' : feedback.avatar,
            'content' : feedback.content,
            'date' : feedback.date,
            'time' : feedback.time,
            'like' : feedback.like,
            'id' : feedback._id.toString()
        }
    })
}

export let customProductInfor = (products) => {
    return {
        "infor_product" : {...products.common},
        ...products.about,
        ...products.describe,
        "feedback_user" : {
            'id_feed' : products.feedback._id,
            'list_feedback' : customFeedBack(products.feedback.content_feedback) 
        }
    }
}

export let customInforBill = (bills) => {
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
