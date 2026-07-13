/**
 * contact.js
 * Wires the "Send us a Message" form on contact.html to the backend.
 * POSTs to /api/contact, matching the Contact model (name, email, phone, message).
 */

(() => {
  // ---- Config -------------------------------------------------------
  const API_BASE_URL = "https://dbms.srujaninfotech.com"; // change to your real backend URL in production
  const CONTACT_CREATE_URL = `${API_BASE_URL}/api/contact`;

  // ---- DOM refs -------------------------------------------------------
  const form = document.getElementById("contact-form");
  if (!form) return; // not on this page

  const nameInput = document.getElementById("cf-name");
  const emailInput = document.getElementById("cf-email");
  const phoneInput = document.getElementById("cf-phone");
  const messageInput = document.getElementById("cf-message");

  const submitBtn = document.getElementById("cf-submit");
  const submitLabel = document.getElementById("cf-submit-label");
  const submitCheck = document.getElementById("cf-submit-check");
  const statusMsg = document.getElementById("cf-status-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    statusMsg.textContent = "";
    statusMsg.className = "cf-status-msg";

    if (!name || !email || !message) {
      statusMsg.textContent = "Please fill in your name, email, and message.";
      statusMsg.className = "cf-status-msg error";
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = "Sending...";

    try {
      const res = await fetch(CONTACT_CREATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      submitLabel.textContent = "Message Sent";
      submitCheck.classList.add("show");
      statusMsg.textContent = "Thanks! We've received your message and will get back to you within 24 hours.";
      statusMsg.className = "cf-status-msg success";

      form.reset();

      setTimeout(() => {
        submitLabel.textContent = "Send Message";
        submitCheck.classList.remove("show");
        submitBtn.disabled = false;
      }, 2500);
    } catch (err) {
      console.error("Failed to submit contact form:", err);
      submitLabel.textContent = "Send Message";
      submitBtn.disabled = false;

      if (err instanceof TypeError) {
        // fetch() throws a plain TypeError for network-level failures:
        // server not running, wrong API_BASE_URL, or blocked by CORS.
        statusMsg.textContent = "Can't reach the server right now. Please try again shortly.";
      } else {
        statusMsg.textContent = "Couldn't send your message. Please try again.";
      }
      statusMsg.className = "cf-status-msg error";
    }
  });
})();