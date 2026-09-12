document.addEventListener("DOMContentLoaded", () => {
  const connectNavBtn = document.getElementById("connectNavBtn");
  const planNowHeroBtn = document.getElementById("planNowHeroBtn");
  const floatingRegisterBtn = document.getElementById("floatingRegisterBtn");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const registrationModal = document.getElementById("registrationModal");
  const eventTypeSelect = document.getElementById("eventTypeSelect");
  const otherEventGroup = document.getElementById("otherEventGroup");
  const otherEventInput = otherEventGroup
    ? otherEventGroup.querySelector("input")
    : null;
  const eventInquiryForm = document.getElementById("eventInquiryForm");
  const footerFlexbox = document.getElementById("footerFlexbox");

  // --- Modal Open/Close Controls ---
  function openModal() {
    if (registrationModal) {
      registrationModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    if (registrationModal) {
      registrationModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  if (planNowHeroBtn) planNowHeroBtn.addEventListener("click", openModal);
  if (floatingRegisterBtn)
    floatingRegisterBtn.addEventListener("click", openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

  if (registrationModal) {
    registrationModal.addEventListener("click", (e) => {
      if (e.target === registrationModal) closeModal();
    });
  }

  // --- Dynamic 'Other' Event Input ---
  if (eventTypeSelect && otherEventGroup && otherEventInput) {
    eventTypeSelect.addEventListener("change", (e) => {
      if (e.target.value === "Other") {
        otherEventGroup.style.display = "flex";
        otherEventInput.setAttribute("required", "required");
      } else {
        otherEventGroup.style.display = "none";
        otherEventInput.removeAttribute("required");
        otherEventInput.value = "";
      }
    });
  }

  // --- Form Submission & LocalStorage Data Persistence ---
  if (eventInquiryForm) {
    eventInquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(eventInquiryForm);
      const inquiryPayload = {
        id: "INQ_" + Date.now(),
        submittedAt: new Date().toISOString(),
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        address: formData.get("address"),
        eventType:
          formData.get("eventType") === "Other"
            ? formData.get("otherEventDetail")
            : formData.get("eventType"),
        budgetRange: formData.get("budgetRange"),
        eventDate: formData.get("eventDate"),
        guestCount: formData.get("guestCount") || "Not Specified",
        notes: formData.get("notes") || "",
      };

      const existingInquiries = JSON.parse(
        localStorage.getItem("elite_event_inquiries") || "[]",
      );
      existingInquiries.push(inquiryPayload);
      localStorage.setItem(
        "elite_event_inquiries",
        JSON.stringify(existingInquiries),
      );

      alert(
        `Thank you, ${inquiryPayload.fullName}! Your inquiry has been stored successfully. Our team will contact you shortly.`,
      );
      eventInquiryForm.reset();
      if (otherEventGroup) otherEventGroup.style.display = "none";
      closeModal();
    });
  }

  // --- Slow Glide Scroll & Single Calm Blink Animation ---
  if (connectNavBtn && footerFlexbox) {
    connectNavBtn.addEventListener("click", () => {
      const targetPosition =
        footerFlexbox.getBoundingClientRect().top +
        window.pageYOffset -
        window.innerHeight / 2 +
        footerFlexbox.offsetHeight / 2;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1800;
      let startTime = null;

      function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      function scrollAnimation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const nextScrollY = easeInOutQuad(
          timeElapsed,
          startPosition,
          distance,
          duration,
        );
        window.scrollTo(0, nextScrollY);

        if (timeElapsed < duration) {
          requestAnimationFrame(scrollAnimation);
        } else {
          window.scrollTo(0, targetPosition);
          footerFlexbox.classList.remove("calm-blink-active");
          void footerFlexbox.offsetWidth;
          footerFlexbox.classList.add("calm-blink-active");

          setTimeout(() => {
            footerFlexbox.classList.remove("calm-blink-active");
          }, 1600);
        }
      }

      requestAnimationFrame(scrollAnimation);
    });
  }
});
