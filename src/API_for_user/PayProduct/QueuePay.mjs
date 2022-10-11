
class Queue {
    constructor() {
        this.ele = {}
        this.head = 0
        this.tail = 0
    }

    addValue(value) {
        this.ele[this.tail] = value,
        this.tail++
    }

    dequeue() {
        const item = this.ele[this.head]
        delete this.ele[this.head]
        this.head++
        return item
    }

    peek(){
        return this.ele[this.head]
    }

    length(){
        return this.tail - this.head   
    }
}

export default  Queue