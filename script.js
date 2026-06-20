// ==========================================
// Elite Clean - API Implementations
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // Original Mobile Menu Toggle Logic
    // ==========================================
    const mobileMenuBtn = document.querySelector('.md\\:hidden button') || document.querySelector('button.md\\:hidden');
    const desktopNav = document.querySelector('nav');

    if (mobileMenuBtn && desktopNav) {
        mobileMenuBtn.addEventListener('click', () => {
            desktopNav.classList.toggle('hidden');
            desktopNav.classList.toggle('flex');
            desktopNav.classList.toggle('flex-col');
            desktopNav.classList.toggle('absolute');
            desktopNav.classList.toggle('top-20');
            desktopNav.classList.toggle('left-0');
            desktopNav.classList.toggle('w-full');
            desktopNav.classList.toggle('bg-white');
            desktopNav.classList.toggle('p-4');
            desktopNav.classList.toggle('shadow-md');
            desktopNav.classList.toggle('space-x-10');
            desktopNav.classList.toggle('space-y-4');
            desktopNav.classList.toggle('z-40');
        });
    }

    // ==========================================
    // UI Feedback Helper (Dynamic Toast)
    // ==========================================
    // This function provides visible feedback for the presentation without modifying HTML
    function showToast(message, type = "success") {
        const toast = document.createElement('div');
        toast.className = `fixed top-24 right-4 text-white px-6 py-3 rounded-lg shadow-xl z-[100] transform transition-all duration-500 translate-x-10 opacity-0 flex items-center gap-2 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
        toast.innerHTML = `<i class="${type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} text-xl"></i> <span>${message}</span>`;
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-10', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('translate-x-0', 'opacity-100');
            toast.classList.add('translate-x-10', 'opacity-0');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // ==========================================
    // 1. GEOLOCATION API & 2. LOCAL STORAGE API
    // ==========================================
    const locationInput = document.getElementById('location-search');
    const detectBtn = document.getElementById('detect-location-btn');

    // Local Storage API: Restore the location when the page reloads
    if (localStorage.getItem('userLocation') && locationInput) {
        locationInput.value = localStorage.getItem('userLocation');
    }

    if (detectBtn) {
        detectBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                locationInput.placeholder = "Detecting your location...";
                // Visual feedback for button
                detectBtn.classList.add('animate-pulse', 'text-brand');
                
                // Geolocation API: Detect current location
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        
                        // Using nominatim for reverse geocoding to get city name
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                            .then(res => res.json())
                            .then(data => {
                                const city = data.address.city || data.address.town || data.address.suburb || data.address.county || "Your Location";
                                
                                // Geolocation API: Autofill the location search box
                                locationInput.value = city;
                                
                                // Local Storage API: Save the user's location automatically
                                localStorage.setItem('userLocation', city);
                                
                                // Geolocation API: Show a success message when location is detected
                                showToast(`Location detected and saved: ${city}`);
                            })
                            .catch(() => {
                                // Fallback if reverse geocoding fails
                                const coords = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                                locationInput.value = coords;
                                localStorage.setItem('userLocation', coords);
                                showToast("Coordinates saved successfully");
                            })
                            .finally(() => {
                                detectBtn.classList.remove('animate-pulse', 'text-brand');
                            });
                    },
                    (error) => {
                        detectBtn.classList.remove('animate-pulse', 'text-brand');
                        showToast("Unable to retrieve location. Please check browser permissions.", "error");
                        locationInput.placeholder = "Enter your location or area...";
                    }
                );
            } else {
                showToast("Geolocation is not supported by your browser.", "error");
            }
        });
    }

    // ==========================================
    // 3. WEB NOTIFICATIONS API
    // ==========================================
    // Request notification permission
    if ("Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            // Request permission politely after a short delay
            setTimeout(() => {
                Notification.requestPermission();
            }, 2000);
        }
    }

    // Helper function to send notifications
    function sendNotification(title, body) {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, {
                body: body,
                icon: "loundery logo.png" // Use existing logo
            });
        } else {
            // Fallback to toast if notifications are blocked but we still want to show UI feedback
            showToast(body);
        }
    }

    // Interactive Notifications on Tracker Steps for Presentation
    const trackerSteps = document.querySelectorAll('.tracker-step');
    const notificationMessages = [
        { title: "Order Placed", msg: "Your laundry order has been successfully placed." },
        { title: "Partner Assigned", msg: "A nearby elite laundry partner has been assigned." },
        { title: "Pickup Confirmed", msg: "Our executive has picked up your laundry." },
        { title: "Laundry Processing", msg: "Your clothes are currently being washed and cared for." },
        { title: "Ironing", msg: "Your clothes are being pressed to perfection." },
        { title: "Out for Delivery", msg: "Your fresh laundry is out for delivery!" },
        { title: "Delivered", msg: "Your laundry has been delivered. Enjoy the freshness!" }
    ];

    trackerSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            // Send attractive notification message related to laundry order
            if (notificationMessages[index]) {
                sendNotification(`Elite Clean: ${notificationMessages[index].title}`, notificationMessages[index].msg);
            }
        });
    });

    // ==========================================
    // 5. PAYMENT API (RAZORPAY) & 6. QR CODE API
    // ==========================================
    const bookButtons = document.querySelectorAll('button');
    const orderModal = document.getElementById('order-modal');
    const modalContent = document.getElementById('modal-content');
    const qrCodeImg = document.getElementById('qr-code-img');
    let generatedOrderId = "";

    bookButtons.forEach(btn => {
        if (btn.innerText.includes("Book Now") || btn.innerText.includes("Book Pickup") || btn.id === 'book-pickup-btn') {
            btn.addEventListener('click', (e) => {
                // Determine partner based on context
                const partnerContainer = e.target.closest('.group');
                let partnerName = "Elite Clean Platform";
                if (partnerContainer) {
                    const h3 = partnerContainer.querySelector('h3');
                    if (h3) partnerName = h3.innerText;
                }
                
                // Local Storage API: Save selected laundry partner and booking information
                localStorage.setItem('selectedPartner', partnerName);
                
                // Payment API (Razorpay): Open payment gateway with demo config
                const options = {
                    "key": "rzp_test_dummyKey123456", // Demo Test Key
                    "amount": "49900", // 499 INR
                    "currency": "INR",
                    "name": "Elite Clean",
                    "description": `Premium Laundry Service by ${partnerName}`,
                    "image": "loundery logo.png",
                    "handler": function (response) {
                        // Payment Success Handling
                        const paymentId = response.razorpay_payment_id || "PAY_" + Math.floor(Math.random() * 1000000);
                        handleSuccessfulPayment(paymentId, partnerName);
                    },
                    "prefill": {
                        "name": "Demo User",
                        "email": "demo@eliteclean.com",
                        "contact": "9876543210"
                    },
                    "theme": {
                        "color": "#086e96"
                    }
                };

                if (typeof Razorpay !== 'undefined') {
                    const rzp = new Razorpay(options);
                    rzp.on('payment.failed', function (response){
                        // Payment Failure Handling
                        showToast(`Payment Failed: ${response.error.description}`, "error");
                    });
                    
                    try {
                        rzp.open();
                    } catch (err) {
                        // If Razorpay throws an error due to the fake key during presentation, fallback to simulated success
                        console.error(err);
                        simulatePayment(partnerName);
                    }
                } else {
                    // Fallback for demo environments if Razorpay checkout script is not loaded
                    simulatePayment(partnerName);
                }
            });
        }
    });

    function simulatePayment(partnerName) {
        showToast(`Simulating payment for ${partnerName}...`);
        setTimeout(() => {
            handleSuccessfulPayment("SIM_PAY_" + Math.floor(Math.random() * 1000000), partnerName);
        }, 1500);
    }

    function handleSuccessfulPayment(paymentId, partnerName) {
        // Payment API: Generate an order after successful payment
        generatedOrderId = "#ORD-" + Math.floor(10000 + Math.random() * 90000);
        
        // Update DOM if Order ID & Tracking ID elements exist
        const orderIdEl = document.getElementById('order-id');
        if (orderIdEl) orderIdEl.innerText = generatedOrderId;
        
        const trackingIdEl = document.getElementById('tracking-id');
        if (trackingIdEl) trackingIdEl.innerText = "TRK-" + Math.floor(1000 + Math.random() * 9000) + "-X";

        // Local Storage API: Save booking info
        const bookingInfo = {
            orderId: generatedOrderId,
            partner: partnerName,
            paymentId: paymentId,
            date: new Date().toISOString()
        };
        localStorage.setItem('lastBooking', JSON.stringify(bookingInfo));

        // QR Code API: Generate unique QR code using order ID as data
        // QR Code API: Display the QR code inside the existing payment success modal
        const qrData = encodeURIComponent(`OrderID:${generatedOrderId}|Partner:${partnerName}|Status:Paid`);
        if (qrCodeImg) {
            qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
            qrCodeImg.alt = `QR Code for ${generatedOrderId}`;
            
            // QR Code API: Allow QR code download
            qrCodeImg.style.cursor = 'pointer';
            qrCodeImg.title = "Click to download QR Code";
            qrCodeImg.onclick = async () => {
                try {
                    const response = await fetch(qrCodeImg.src);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `EliteClean_${generatedOrderId.replace('#', '')}_QR.png`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    showToast("QR Code downloaded successfully!");
                } catch (e) {
                    // Fallback if CORS prevents fetch
                    window.open(qrCodeImg.src, '_blank');
                }
            };
        }

        // Show Modal
        if (orderModal && modalContent) {
            orderModal.classList.remove('hidden');
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }
        
        // Web Notifications API: Send Notification for Order Placed
        sendNotification("Payment Successful!", `Order ${generatedOrderId} placed with ${partnerName}.`);
        showToast("Payment Successful!");
    }

    // Close Modal Logic
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (orderModal) {
                modalContent.classList.remove('scale-100', 'opacity-100');
                modalContent.classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    orderModal.classList.add('hidden');
                    const trackingSection = document.getElementById('tracking');
                    if (trackingSection) trackingSection.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        });
    }
});

// ==========================================
// 4. CLIPBOARD API (Global Function)
// ==========================================
// Connect the existing Copy Order ID and Tracking ID buttons via inline onclick
window.copyToClipboard = function(elementId) {
    const textElement = document.getElementById(elementId);
    if (!textElement) return;
    
    // Clipboard API: Copy the correct text to the clipboard
    const textToCopy = textElement.innerText;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Clipboard API: Display a success toast notification after copying
            const toast = document.getElementById('copy-toast');
            if (toast) {
                toast.classList.remove('opacity-0');
                setTimeout(() => {
                    toast.classList.add('opacity-0');
                }, 3000);
            }
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert("Fallback copy: " + textToCopy);
        });
    } else {
        // Fallback for older browsers
        alert("Copied to clipboard: " + textToCopy);
    }
};
