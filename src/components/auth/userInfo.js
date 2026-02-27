export default function getUserInfo() {
const [paymentMethods, setPaymentMethod] = useState([]);

  const addPaymentMethod = () => {
    setPaymentMethod([...paymentMethods, 
	<div key={paymentMethods.length}>
	<div><label>Credit Card Number:</label><input type="text" placeholder="Last Name" value={creditCardNumber} onChange={(e) => setCreditCardNumber(e.target.value)} /></div>
	</div>]);
  };

	
return(
<div>
	<h2>User Information</h2>
	<div><label>First Name:</label><input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
	<div><label>Last Name:</label><input type="text" placeholder="Last Name" value={firstName} onChange={(e) => setLastName(e.target.value)} /></div>
	<div><label>Date of birth:</label><input type="date" placeholder="Last Name" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} /></div>
	<div style={{ display: 'flex'}}>
	<button onClick={addPaymentMethod}>
	<svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
		<g fill="green" >
			<rect x="10" y="10" width="20" height="4" />
			<rect x="18" y="2" width="4" height="20" />
		</g>
	</svg>
	<span style={{fontFamily="Arial, sans-serif", fontSize="20"}}>Payment method</span>
	</button>
	</div>
	<div style={{ display: 'flex'}}>
	<svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
		<g fill="green" >
			<rect x="10" y="10" width="20" height="4" />
			<rect x="18" y="2" width="4" height="20" />
		</g>
	</svg>
	<span style={{fontFamily="Arial, sans-serif", fontSize="20"}}>Payment method</span>
	</div>
	<div>{paymentMethods}</div>
</div>
);

}