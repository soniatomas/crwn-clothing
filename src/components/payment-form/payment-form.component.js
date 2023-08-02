import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import { selectCartTotal } from '../../store/cart/cart.selector';
import { selectCurrentUser } from '../../store/user/user.selector';
import { BUTTON_TYPE_CLASSES } from '../button/button.component';
import { PaymentFormContainer, FormContainer, PaymentButton } from './payment-form.styles';

const PaymentForm = () => {
	// stripe hooks to make payment request to stripe. 
	const stripe = useStripe();
	const elements = useElements();
	const amount = useSelector(selectCartTotal);
	const currentUser = useSelector(selectCurrentUser);
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	const paymentHandler = async (e) => {
		e.preventDefault();
		if (!stripe || !elements) {
			return;
		}

		setIsProcessingPayment(true);

		// make fetch request in our backend in order to create a payment intent.
		// payment intent is something Stripe creates so that it knows that 
		// there is a payment coming and stripe uses to confirm that theres
		// a final payment about to happen.
		const response = await fetch('/.netlify/functions/create-payment-intent', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ amount: amount*100 })
		}).then(res => res.json());
		//console.log(response);
		
		// const clientSecret = response.paymentIntent.client_secret;
		// the line below is another way to write the line above but instead using destructuring
		const {paymentIntent: { client_secret }} = response;
		// console.log(client_secret);
		// with the client_secret we create the actual payment. 
		const paymentResult = await stripe.confirmCardPayment(client_secret, {
			payment_method: {
				card: elements.getElement(CardElement),
				billing_details: {
					name: currentUser ? currentUser.displayName : 'Guest',
				}
			}
		});

		setIsProcessingPayment(false);

		if (paymentResult.error) {
			alert(paymentResult.error)
		} else {
			if (paymentResult.paymentIntent.status === 'succeeded') {
				alert('Payment Successful');
			}
		}
	};

	return (
		<PaymentFormContainer>
			<FormContainer onSubmit={paymentHandler}>
				<h2>Credit Card Payment: </h2>
				<CardElement />
				<PaymentButton 
					isLoading={isProcessingPayment} 
					buttonType={BUTTON_TYPE_CLASSES.inverted}>
					Pay Now
				</PaymentButton>
			</FormContainer>
		</PaymentFormContainer>
	)
};
export default PaymentForm;