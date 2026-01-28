// Shopping Cart
let cart = [];

// Add to cart function
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification('Servicio agregado al carrito');
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.zIndex = '3000';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Open cart modal
document.getElementById('cart-icon').addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
});

function openCart() {
    const modal = document.getElementById('cart-modal');
    const cartItemsDiv = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">El carrito está vacío</p>';
    } else {
        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <div>Cantidad: ${item.quantity}</div>
                </div>
                <div class="cart-item-price">$${item.price * item.quantity} USD</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
        `).join('');
    }
    
    updateCartTotal();
    modal.style.display = 'block';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    openCart();
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = total.toFixed(2);
    updateMonthlyPayment();
}

// Update monthly payment display
function updateMonthlyPayment() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectedPlan = document.querySelector('input[name="payment-plan"]:checked').value;
    const monthlyPaymentDiv = document.getElementById('monthly-payment');
    
    if (selectedPlan === '1') {
        monthlyPaymentDiv.textContent = '';
    } else {
        const monthlyAmount = (total / parseInt(selectedPlan)).toFixed(2);
        monthlyPaymentDiv.textContent = `Pago mensual: $${monthlyAmount} USD x ${selectedPlan} meses`;
    }
}

// Add event listeners for payment plan changes
document.addEventListener('DOMContentLoaded', () => {
    const paymentPlans = document.querySelectorAll('input[name="payment-plan"]');
    paymentPlans.forEach(plan => {
        plan.addEventListener('change', updateMonthlyPayment);
    });
});

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    closeCart();
    openCheckoutModal();
}

function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectedPlan = document.querySelector('input[name="payment-plan"]:checked').value;
    
    document.getElementById('summary-total').textContent = total.toFixed(2);
    
    if (selectedPlan === '1') {
        document.getElementById('summary-plan').textContent = 'Pago único';
        document.getElementById('summary-monthly').textContent = '';
    } else {
        const monthlyAmount = (total / parseInt(selectedPlan)).toFixed(2);
        document.getElementById('summary-plan').textContent = `${selectedPlan} meses sin intereses`;
        document.getElementById('summary-monthly').textContent = `Pago mensual: $${monthlyAmount} USD`;
    }
    
    modal.style.display = 'block';
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// Handle checkout form submission
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('checkout-name').value,
        email: document.getElementById('checkout-email').value,
        phone: document.getElementById('checkout-phone').value,
        cardNumber: document.getElementById('card-number').value,
        cardExpiry: document.getElementById('card-expiry').value,
        cardCvv: document.getElementById('card-cvv').value,
        cardName: document.getElementById('card-name').value,
        cart: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentPlan: document.querySelector('input[name="payment-plan"]:checked').value
    };
    
    // Store customer data
    storeCustomerData(formData);
    
    // Simulate payment processing
    alert('¡Compra procesada exitosamente! Nos pondremos en contacto contigo pronto.');
    
    // Clear cart and close modal
    cart = [];
    updateCartCount();
    closeCheckout();
    
    // Reset form
    document.getElementById('checkout-form').reset();
});

// Format card number input
document.getElementById('card-number').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Format expiry date input
document.getElementById('card-expiry').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        serviceInterest: document.getElementById('service-interest').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Store customer data
    storeCustomerData(formData);
    
    // Show success message
    showNotification('¡Gracias por tu consulta! Nos pondremos en contacto contigo pronto.');
    
    // Reset form
    document.getElementById('contact-form').reset();
});

// Store customer data (in localStorage for demo purposes)
function storeCustomerData(data) {
    const existingData = JSON.parse(localStorage.getItem('customerData') || '[]');
    existingData.push(data);
    localStorage.setItem('customerData', JSON.stringify(existingData));
    console.log('Customer data stored:', data);
}

// Chatbot functionality
let chatOpen = false;

function toggleChat() {
    const chatBody = document.getElementById('chatbot-body');
    const chatToggle = document.getElementById('chat-toggle');
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatBody.classList.add('active');
        chatToggle.textContent = '▲';
    } else {
        chatBody.classList.remove('active');
        chatToggle.textContent = '▼';
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Get bot response
    setTimeout(() => {
        const response = getBotResponse(message);
        addChatMessage(response, 'bot');
    }, 500);
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addChatMessage(message, type) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'user' ? 'user-message' : 'bot-message';
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Visa-related responses
    if (lowerMessage.includes('visa de turista') || lowerMessage.includes('turista')) {
        return 'La visa de turista (B1/B2) permite visitar Estados Unidos por turismo o negocios. El costo del servicio es $299 USD. ¿Te gustaría agendar una consulta?';
    }
    
    if (lowerMessage.includes('visa de trabajo') || lowerMessage.includes('trabajo') || lowerMessage.includes('h1')) {
        return 'La visa H1-B es para trabajadores especializados. Ofrecemos asesoría completa por $499 USD. ¿Necesitas más información?';
    }
    
    if (lowerMessage.includes('residencia') || lowerMessage.includes('green card')) {
        return 'La residencia permanente (Green Card) te permite vivir y trabajar en EE.UU. indefinidamente. Nuestro servicio cuesta $799 USD. ¿Quieres saber los requisitos?';
    }
    
    if (lowerMessage.includes('estudiante') || lowerMessage.includes('estudiar')) {
        return 'La visa F1 es para estudiantes. Te ayudamos con todo el proceso por $399 USD. ¿En qué universidad quieres estudiar?';
    }
    
    // Price-related responses
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuanto')) {
        return 'Nuestros servicios van desde $299 USD (visa de turista) hasta $899 USD (visa de inversionista). Además, ofrecemos planes de pago a 3, 6 o 12 meses sin intereses. ¿Qué servicio te interesa?';
    }
    
    // Payment-related responses
    if (lowerMessage.includes('pago') || lowerMessage.includes('meses') || lowerMessage.includes('tarjeta')) {
        return 'Aceptamos pagos con tarjeta de crédito y ofrecemos planes de 3, 6 o 12 meses sin intereses. Puedes agregar servicios al carrito y seleccionar tu plan de pago preferido.';
    }
    
    // Contact-related responses
    if (lowerMessage.includes('contacto') || lowerMessage.includes('llamar') || lowerMessage.includes('teléfono')) {
        return 'Puedes dejarnos tus datos en el formulario de contacto al final de la página y nos comunicaremos contigo en menos de 24 horas. ¿Te gustaría agendar una consulta?';
    }
    
    // Requirements-related responses
    if (lowerMessage.includes('requisitos') || lowerMessage.includes('documentos') || lowerMessage.includes('necesito')) {
        return 'Los requisitos varían según el tipo de visa. En una consulta inicial evaluamos tu caso específico y te indicamos exactamente qué documentos necesitas. ¿Qué tipo de visa necesitas?';
    }
    
    // Time-related responses
    if (lowerMessage.includes('tiempo') || lowerMessage.includes('demora') || lowerMessage.includes('cuánto tarda')) {
        return 'El tiempo de procesamiento varía según el tipo de visa y tu caso específico. En promedio, el proceso puede tomar de 2 a 6 meses. Te mantenemos informado en cada paso del proceso.';
    }
    
    // Success rate responses
    if (lowerMessage.includes('tasa') || lowerMessage.includes('éxito') || lowerMessage.includes('aprobación')) {
        return 'Tenemos una alta tasa de éxito gracias a nuestra experiencia y preparación detallada de cada caso. Cada caso es único y evaluamos tus posibilidades en la consulta inicial.';
    }
    
    // Greeting responses
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
        return '¡Hola! Bienvenido a Visas Estratégicas USA. ¿En qué tipo de visa o proceso migratorio puedo ayudarte?';
    }
    
    if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
        return '¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas, no dudes en preguntar o déjanos tus datos para una consulta personalizada.';
    }
    
    // Help/services
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('servicios') || lowerMessage.includes('qué hacen')) {
        return 'Ofrecemos asesoría completa para: Visas de Turista, Trabajo, Estudiante, Prometido, Inversionista y Residencia Permanente. También te ayudamos con renovaciones y cambios de estatus. ¿Qué servicio necesitas?';
    }
    
    // Default response
    return 'Gracias por tu pregunta. Para darte información más precisa, te recomiendo dejar tus datos en el formulario de contacto o llamarnos directamente. ¿Hay algo específico sobre visas o procesos migratorios en lo que pueda ayudarte?';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === checkoutModal) {
        closeCheckout();
    }
}

// Initialize chatbot as open by default
document.addEventListener('DOMContentLoaded', () => {
    toggleChat();
});
