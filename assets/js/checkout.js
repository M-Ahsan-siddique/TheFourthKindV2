/**
 * THE FOURTH KIND — STANDALONE CHECKOUT CONTROLLER
 * Dynamic Cart Retrieval, IBFT Bank Details, Payment Proof Upload, Order Verification & Free WhatsApp Attachment / Web Share Integration
 */

(function () {
  const STORAGE_KEY = 'tfk_cart_items';
  const STORE_WHATSAPP = '923397088666'; // Official Fourth Kind WhatsApp

  // Cart State
  let cart = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  let selectedShippingPrice = 250;
  let appliedDiscount = 0;
  let rawProofFile = null; // Raw File object
  let proofFileData = null;

  // Active Order state for WhatsApp submission
  let currentOrderData = null;

  // DOM Elements
  const summaryItemsList = document.getElementById('summary-items-list');
  const summaryCount = document.getElementById('summary-items-count');
  const subtotalEl = document.getElementById('calc-subtotal');
  const shippingEl = document.getElementById('calc-shipping');
  const discountRow = document.getElementById('calc-discount-row');
  const discountEl = document.getElementById('calc-discount');
  const totalEl = document.getElementById('calc-total');
  const checkoutForm = document.getElementById('checkout-form');
  const btnCompleteOrder = document.getElementById('btn-complete-order');

  // Proof Upload Elements
  const proofDropzone = document.getElementById('proof-dropzone');
  const proofFileInput = document.getElementById('proof-file-input');
  const proofPreviewCard = document.getElementById('proof-preview-card');
  const proofImgThumb = document.getElementById('proof-img-thumb');
  const proofFileName = document.getElementById('proof-file-name');
  const proofFileSize = document.getElementById('proof-file-size');
  const btnRemoveProof = document.getElementById('btn-remove-proof');

  // Modal Elements
  const orderModalOverlay = document.getElementById('order-modal-overlay');
  const modalOrderId = document.getElementById('modal-order-id');
  const modalTipBanner = document.getElementById('modal-tip-banner');
  const btnWhatsappAction = document.getElementById('btn-whatsapp-action');

  // Format Money
  function formatMoney(amount) {
    const num = Number(amount) || 0;
    return 'Rs ' + (num % 1 === 0 ? num.toLocaleString() : num.toFixed(1));
  }

  // Generate Clean Path for images
  function getCleanFileName(path) {
    if (!path) return 'brazilian-bottle-image-listing 1.png';
    const idx = path.indexOf('assets/images/');
    if (idx !== -1) {
      return path.substring(idx + 'assets/images/'.length);
    }
    const parts = path.split('/');
    return parts[parts.length - 1];
  }

  // Render Summary
  function renderOrderSummary() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const grandTotal = Math.max(0, subtotal + selectedShippingPrice - appliedDiscount);

    if (summaryCount) summaryCount.textContent = `(${totalCount} items)`;
    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (shippingEl) shippingEl.textContent = formatMoney(selectedShippingPrice);

    if (appliedDiscount > 0 && discountRow && discountEl) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-${formatMoney(appliedDiscount)}`;
    } else if (discountRow) {
      discountRow.style.display = 'none';
    }

    if (totalEl) totalEl.textContent = formatMoney(grandTotal);

    if (!summaryItemsList) return;

    if (cart.length === 0) {
      summaryItemsList.innerHTML = `
        <div style="text-align: center; padding: 24px 0; color: #888;">
          <p style="font-weight: 600; font-size: 13.5px; margin-bottom: 8px; color: #111;">Your cart is empty.</p>
          <a href="../shop/index.html" style="font-size: 12.5px; color: #000; text-decoration: underline; font-weight: 600;">Explore Specialty Coffees &rarr;</a>
        </div>
      `;
      if (btnCompleteOrder) btnCompleteOrder.disabled = true;
      return;
    }

    if (btnCompleteOrder) btnCompleteOrder.disabled = false;

    let html = '';
    cart.forEach((item) => {
      const fileName = item.fileName || getCleanFileName(item.img);
      const imgPath = `../assets/images/${fileName}`;

      html += `
        <div class="summary-item-card">
          <div class="summary-thumb-box">
            <img src="${imgPath}" alt="${item.name}" onerror="this.src='../assets/images/FourthKind/ethopian-bottle-image-listing 2.png'" />
            <span class="summary-qty-bubble">${item.qty}</span>
          </div>
          <div class="summary-info">
            <h4 class="summary-item-title">${item.name}</h4>
            <span class="summary-item-price-each">${formatMoney(item.price)} each</span>
          </div>
          <span class="summary-line-total">${formatMoney(item.price * item.qty)}</span>
        </div>
      `;
    });

    summaryItemsList.innerHTML = html;
  }

  // Shipping Method Change
  document.querySelectorAll('input[name="shipping_method"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.shipping-card').forEach((card) => card.classList.remove('selected'));
      const parentCard = e.target.closest('.shipping-card');
      if (parentCard) parentCard.classList.add('selected');

      selectedShippingPrice = Number(e.target.value) || 250;
      renderOrderSummary();
    });
  });

  // Payment Method Box Selection
  document.querySelectorAll('input[name="payment_method"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.payment-method-box, .payment-method-item').forEach((box) => box.classList.remove('active'));
      const parentBox = e.target.closest('.payment-method-box, .payment-method-item');
      if (parentBox) parentBox.classList.add('active');
    });
  });

  // Copy to Clipboard buttons for Bank Details
  document.querySelectorAll('.btn-mini-copy, .btn-copy').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.backgroundColor = '#10b981';
          btn.style.color = '#ffffff';
          btn.style.borderColor = '#10b981';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.borderColor = '';
          }, 2000);
        });
      }
    });
  });

  // Promo Code Validation
  const promoInput = document.getElementById('promo-code-input');
  const promoBtn = document.getElementById('promo-apply-btn');
  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = promoInput.value.trim().toUpperCase();
      if (!code) return;

      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      if (code === 'FOURTH10' || code === 'TFK10') {
        appliedDiscount = subtotal * 0.1;
        alert('Promo code applied: 10% OFF discount!');
        renderOrderSummary();
      } else if (code === 'WELCOME') {
        appliedDiscount = Math.min(100, subtotal);
        alert('Promo code applied: Rs 100 OFF!');
        renderOrderSummary();
      } else {
        alert('Invalid promo code. Try "FOURTH10" for 10% off.');
      }
    });
  }

  // Payment Proof File Upload Handling
  function handleProofFile(file) {
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Please upload a valid image (PNG, JPG, JPEG, WebP) or PDF receipt.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    rawProofFile = file;

    const reader = new FileReader();
    reader.onload = function (e) {
      proofFileData = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        dataUrl: e.target.result
      };

      if (proofImgThumb) {
        if (file.type.startsWith('image/')) {
          proofImgThumb.src = e.target.result;
          proofImgThumb.style.display = 'block';
        } else {
          proofImgThumb.style.display = 'none';
        }
      }

      if (proofFileName) proofFileName.textContent = file.name;
      if (proofFileSize) proofFileSize.textContent = proofFileData.size;
      if (proofPreviewCard) proofPreviewCard.classList.add('show');
    };
    reader.readAsDataURL(file);
  }

  if (proofFileInput) {
    proofFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleProofFile(e.target.files[0]);
      }
    });
  }

  // Drag & drop support
  if (proofDropzone) {
    ['dragenter', 'dragover'].forEach((eventName) => {
      proofDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        proofDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      proofDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        proofDropzone.classList.remove('dragover');
      });
    });

    proofDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleProofFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (btnRemoveProof) {
    btnRemoveProof.addEventListener('click', (e) => {
      e.preventDefault();
      rawProofFile = null;
      proofFileData = null;
      if (proofFileInput) proofFileInput.value = '';
      if (proofPreviewCard) proofPreviewCard.classList.remove('show');
    });
  }

  // Generate Unique Order ID
  function generateOrderId() {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `TFK-${randomNum}`;
  }

  // Submit Order Form
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert('Your cart is empty. Please add products to proceed.');
        return;
      }

      const email = document.getElementById('customer-email')?.value.trim() || '';
      const whatsapp = document.getElementById('customer-whatsapp')?.value.trim() || '';
      const fullName = document.getElementById('customer-name')?.value.trim() || '';
      const address = document.getElementById('customer-address')?.value.trim() || '';
      const city = document.getElementById('customer-city')?.value.trim() || '';
      const province = document.getElementById('customer-province')?.value || 'Punjab';
      const notes = document.getElementById('order-notes')?.value.trim() || '';
      const termsAgreed = document.getElementById('terms-agree')?.checked;

      if (!fullName || !whatsapp || !address || !city) {
        alert('Please fill in all required shipping fields (*)');
        return;
      }

      if (!termsAgreed) {
        alert('Please agree to the Terms & Conditions and Policies.');
        return;
      }

      const paymentMethodRadio = document.querySelector('input[name="payment_method"]:checked');
      const paymentMethod = paymentMethodRadio ? paymentMethodRadio.value : 'ibft';

      const orderId = generateOrderId();
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const grandTotal = Math.max(0, subtotal + selectedShippingPrice - appliedDiscount);

      // Clean ASCII / Standard WhatsApp formatting (Universal compatibility)
      let itemsSummary = '';
      cart.forEach((item) => {
        itemsSummary += `* ${item.qty}x ${item.name} (Rs ${item.price * item.qty})\n`;
      });

      const whatsappMessage = 
`*NEW ORDER — THE FOURTH KIND*
--------------------------------
*Order ID:* #${orderId}
*Customer:* ${fullName}
*WhatsApp:* ${whatsapp}
*Email:* ${email || 'N/A'}
*Delivery Address:* ${address}, ${city}, ${province}

*Ordered Items:*
${itemsSummary}
*Subtotal:* Rs ${subtotal.toLocaleString()}
*Shipping:* Rs ${selectedShippingPrice}
${appliedDiscount > 0 ? `*Discount:* -Rs ${appliedDiscount}\n` : ''}*Total Amount:* Rs ${grandTotal.toLocaleString()}

*Payment Method:* ${paymentMethod.toUpperCase()}
*Payment Proof:* ${rawProofFile ? 'Attached screenshot' : 'Sending receipt below'}
${notes ? `*Notes:* ${notes}\n` : ''}--------------------------------
Please confirm my order and share roasting & shipping updates.`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${STORE_WHATSAPP}?text=${encodedMessage}`;

      // Save active order context
      currentOrderData = {
        orderId: orderId,
        whatsappMessage: whatsappMessage,
        whatsappUrl: whatsappUrl
      };

      // Set Modal Content
      if (modalOrderId) modalOrderId.textContent = `Order #${orderId}`;

      // Setup Tip Banner
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (modalTipBanner) {
        if (rawProofFile) {
          modalTipBanner.style.display = 'flex';
          if (isMobile && navigator.canShare) {
            modalTipBanner.innerHTML = `<span>📱 <strong>1-Tap Share:</strong> Tap the button below to share your order details and payment screenshot together via WhatsApp.</span>`;
          } else {
            modalTipBanner.innerHTML = `<span>📋 <strong>Auto-Copy Enabled:</strong> We've prepared your screenshot! Press <strong>Ctrl + V</strong> (Paste) in WhatsApp chat to attach your receipt.</span>`;
          }
        } else {
          modalTipBanner.style.display = 'none';
        }
      }

      // Show Modal
      if (orderModalOverlay) {
        orderModalOverlay.classList.add('open');
      }

      // Clear local cart
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {}
    });
  }

  // Handle WhatsApp Click with Free File Share / Clipboard Copy
  if (btnWhatsappAction) {
    btnWhatsappAction.addEventListener('click', async (e) => {
      e.preventDefault();

      if (!currentOrderData) return;

      // 1. Mobile Web Share API: Try attaching the actual image file natively
      if (rawProofFile && navigator.canShare) {
        try {
          const shareData = {
            files: [rawProofFile],
            title: `The Fourth Kind - Order #${currentOrderData.orderId}`,
            text: currentOrderData.whatsappMessage
          };

          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            return;
          }
        } catch (shareErr) {
          console.log('Native share canceled or fell through:', shareErr);
        }
      }

      // 2. Desktop / Fallback: Copy image to clipboard so user can press Ctrl+V
      if (rawProofFile && rawProofFile.type.startsWith('image/') && navigator.clipboard && window.ClipboardItem) {
        try {
          const clipboardItem = new ClipboardItem({ [rawProofFile.type]: rawProofFile });
          await navigator.clipboard.write([clipboardItem]);
        } catch (clipErr) {
          console.log('Clipboard write skipped:', clipErr);
        }
      }

      // 3. Open WhatsApp Web / App
      window.open(currentOrderData.whatsappUrl, '_blank');
    });
  }

  // Initial Render
  renderOrderSummary();
})();
