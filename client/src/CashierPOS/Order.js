import React from 'react';

const Order = () => {
    const onCheckout = async e => {
        e.preventDefault();
        try {
            //submit order to database
            //clear order
        } catch (err) {
            console.error(err.message);
        }
    };

    const onClear = async e => {
        e.preventDefault();
        try {
            //clear order
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div class="Order">
            <h1 className='text-center'>Order</h1>

            <div class="orderText overflow-auto">
                <div className='d-flex mt-5'>
                    <h2 className='text-center'>Item</h2>
                    <h2 className='text-center'>Price</h2>
                    <h2 className='text-center'>Quantity</h2>
                </div>
            </div>

            <div class="totals">
                <h2 className='text-center mt-5'>Subtotal</h2>
                <h2 className='text-center mt-5'>Tax</h2>
                <h2 className='text-center mt-5'>Total</h2>
            </div>

            <div className='position-relative'>
                <form className='top-100 start-50 translate-middle'>
                    <button type="button" class="btn btn-success btn-lg" onSubmit={onCheckout}>Checkout</button>
                </form>
                <form className='top-0 start-50 translate-middle'>
                    <button type="button" class="btn btn-danger" onSubmit={onClear}>Clear</button>
                </form>
            </div>
        </div>
    );
};



export default Order;