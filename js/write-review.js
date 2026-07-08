/**
 * write-review.js
 * Powers the standalone "Write a Review" page (write-review.html).
 * Submits a new testimonial to the backend via POST /api/testimonials.
 */

(() => {
  // ---- Config -------------------------------------------------------
  const API_BASE_URL = "https://sidit.in/api"; // change to your deployed backend URL
  const TESTIMONIALS_CREATE_URL = `${API_BASE_URL}/testimonials`;

  // ---- DOM refs -------------------------------------------------------
  const formState = document.getElementById("reviewFormState");
  const successState = document.getElementById("reviewSuccessState");
  const reviewForm = document.getElementById("reviewForm");
  const starPicker = document.getElementById("reviewStarPicker");
  const ratingInput = document.getElementById("reviewRating");
  const submitBtn = document.getElementById("reviewSubmitBtn");
  const formMsg = document.getElementById("reviewFormMsg");

  if (!reviewForm) return; // not on this page

  let selectedRating = 0;

  function setRating(value) {
    selectedRating = value;
    ratingInput.value = value;
    [...starPicker.children].forEach((btn, i) => {
      const active = i < value;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });
  }

  starPicker.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]");
    if (!btn) return;
    setRating(Number(btn.dataset.value));
  });

  // Keyboard support: left/right arrow to adjust rating
  starPicker.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") setRating(Math.min(5, selectedRating + 1));
    if (e.key === "ArrowLeft") setRating(Math.max(1, selectedRating - 1));
  });

  function showSuccess() {
    formState.classList.add("hide");
    successState.classList.add("show");
  }

  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formMsg.textContent = "";
    formMsg.className = "review-form-msg";

    const name = document.getElementById("reviewName").value.trim();
    const reviewText = document.getElementById("reviewText").value.trim();

    if (!name || !reviewText || selectedRating < 1) {
      formMsg.textContent = "Please fill in your name, a rating, and your review.";
      formMsg.className = "review-form-msg error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const res = await fetch(TESTIMONIALS_CREATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          rating: selectedRating,
          reviewText,
          source: "Website",
          isVisible: true, // shows on the site immediately, no approval needed
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Something went wrong");
      }

      showSuccess();
    } catch (err) {
      console.error("Failed to submit review:", err);
      formMsg.textContent = "Couldn't submit your review right now. Please try again.";
      formMsg.className = "review-form-msg error";
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Review";
    }
  });
})();