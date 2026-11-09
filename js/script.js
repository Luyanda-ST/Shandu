(() => {
  const emailRecipient = "info@helpinghandhaven.org.za";
  const navToggle = document.querySelector("#nav-toggle");
  const primaryNavigation = document.querySelector("#primary-navigation");

  // Close the compact menu after navigation or when Escape is pressed.
  if (navToggle && primaryNavigation) {
    primaryNavigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        navToggle.checked = false;
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navToggle.checked) {
        navToggle.checked = false;
        navToggle.focus();
      }
    });
  }

  // Validate form fields, then send valid submissions to the email service.
  document.querySelectorAll("form[data-email-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');
    const nameField = form.querySelector('input[name="full-name"]');
    const emailField = form.querySelector('input[type="email"]');
    const phoneField = form.querySelector('input[type="tel"]');
    const messageField = form.querySelector("textarea[name=message]");
    if (!(status instanceof HTMLElement) || !(submitButton instanceof HTMLButtonElement)) return;

    const validateName = () => {
      if (!nameField) return;
      const value = nameField.value.trim();
      const isValid = value === "" ? nameField.value === "" : (/\p{L}/u.test(value) && /^[\p{L}\p{M} .’'-]+$/u.test(value));
      nameField.setCustomValidity(isValid ? "" : "Please enter your name using letters. Spaces, apostrophes, and hyphens are also allowed.");
    };

    const validateEmail = () => {
      if (!emailField) return;
      const value = emailField.value.trim();
      const isValid = value === "" ? emailField.value === "" : /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value);
      emailField.setCustomValidity(isValid ? "" : "Enter a complete email address, such as name@example.com.");
    };

    const validatePhone = () => {
      if (!phoneField) return;
      const value = phoneField.value.trim();
      const digits = value.match(/\d/g) || [];
      const isValid = value === "" ? phoneField.value === "" : (/^[0-9\s()+-]+$/.test(value) && digits.length === 10);
      phoneField.setCustomValidity(isValid ? "" : "Enter exactly 10 digits. Spaces, hyphens, and parentheses are okay.");
    };

    const validateMessage = () => {
      if (!messageField) return;
      const value = messageField.value.trim();
      const isValid = value === "" ? messageField.value === "" : value.length >= 10;
      messageField.setCustomValidity(isValid ? "" : "Please write a message with at least 10 characters.");
    };

    // Use our clearer field messages in the browser's validation popup.
    form.noValidate = true;
    form.addEventListener("input", (event) => {
      if (event.target === nameField) validateName();
      if (event.target === emailField) validateEmail();
      if (event.target === phoneField) validatePhone();
      if (event.target === messageField) validateMessage();
      status.hidden = true;
      status.replaceChildren();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      validateName();
      validateEmail();
      validatePhone();
      validateMessage();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const honeypot = form.querySelector('input[name="_honey"]');
      if (honeypot && honeypot.value.trim() !== "") return;

      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
      status.textContent = "Sending your message...";
      status.hidden = false;
      const submissionData = new FormData(form);
      if (phoneField) submissionData.set("phone", phoneField.value.replace(/\D/g, ""));

      try {
        const response = await fetch(form.dataset.ajaxAction || form.action, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
                    body: JSON.stringify(Object.fromEntries(submissionData))
        });
        const result = await response.json();

        if (!response.ok || (result.success !== true && result.success !== "true")) {
          throw new Error("The email service did not accept the message.");
        }

        if (result.message && /confirm|activate/i.test(result.message)) {
          status.textContent = "The email service needs its first-time confirmation before messages can be delivered. Check the website inbox for its verification email.";
        } else {
          status.textContent = "Thank you. Your message was submitted successfully.";
        }
        form.reset();
      } catch (error) {
        const formData = new FormData(form);
        const subject = form.querySelector('input[name="_subject"]')?.value || "Website enquiry";
        const body = Array.from(formData.entries())
          .filter(([name]) => !name.startsWith("_"))
          .map(([name, value]) => `${name}: ${value}`)
          .join("\n");
        const emailLink = document.createElement("a");
        emailLink.href = `mailto:${emailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        emailLink.textContent = "email us directly instead";
        status.replaceChildren(document.createTextNode("We could not send the form just now. Please "), emailLink, document.createTextNode("."));
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        status.focus();
      }
    });
  });

  // Filter and sort the service cards without reloading the page.
  const serviceList = document.querySelector("#service-list");
  const serviceSearch = document.querySelector("#service-search");
  const serviceSort = document.querySelector("#service-sort");
  if (serviceList && serviceSearch && serviceSort) {
    const serviceCards = Array.from(serviceList.querySelectorAll("[data-service-card]"));
    const serviceResults = document.querySelector("#service-results");
    const serviceEmpty = document.querySelector("#service-empty");

    const updateServices = () => {
      const query = serviceSearch.value.trim().toLocaleLowerCase();
      const sortedCards = [...serviceCards].sort((first, second) => {
        const firstName = first.querySelector("h2")?.textContent.trim() || "";
        const secondName = second.querySelector("h2")?.textContent.trim() || "";
        const direction = serviceSort.value === "za" ? -1 : 1;
        if (serviceSort.value === "default") return serviceCards.indexOf(first) - serviceCards.indexOf(second);
        return direction * firstName.localeCompare(secondName);
      });

      sortedCards.forEach((card) => serviceList.appendChild(card));
      let visibleCount = 0;
      serviceCards.forEach((card) => {
        card.hidden = !card.textContent.toLocaleLowerCase().includes(query);
        if (!card.hidden) visibleCount += 1;
      });
      if (serviceResults) serviceResults.textContent = `${visibleCount} service${visibleCount === 1 ? "" : "s"} found.`;
      if (serviceEmpty) serviceEmpty.hidden = visibleCount !== 0;
    };

    serviceSearch.addEventListener("input", updateServices);
    serviceSort.addEventListener("change", updateServices);
    updateServices();
  }

  // Search, sort, and open gallery photos in a larger view.
  const gallery = document.querySelector("#photo-gallery");
  const gallerySearch = document.querySelector("#gallery-search");
  const gallerySort = document.querySelector("#gallery-sort");
  const lightbox = document.querySelector("#gallery-lightbox");
  if (gallery && gallerySearch && gallerySort && lightbox && typeof lightbox.showModal === "function") {
    const galleryItems = Array.from(gallery.querySelectorAll("[data-gallery-item]"));
    const galleryResults = document.querySelector("#gallery-results");
    const galleryEmpty = document.querySelector("#gallery-empty");
    const lightboxImage = lightbox.querySelector("#lightbox-image");
    const lightboxCaption = lightbox.querySelector("#lightbox-caption");
    const lightboxCount = lightbox.querySelector("#lightbox-count");
    const previousButton = lightbox.querySelector("#lightbox-previous");
    const nextButton = lightbox.querySelector("#lightbox-next");
    let currentIndex = 0;
    let lastOpenedButton = null;

    const visibleGalleryItems = () => Array.from(gallery.querySelectorAll("[data-gallery-item]")).filter((item) => !item.hidden);
    const updateGallery = () => {
      const query = gallerySearch.value.trim().toLocaleLowerCase();
      const sortedItems = [...galleryItems].sort((first, second) => {
        const firstCaption = first.querySelector("figcaption")?.textContent.trim() || "";
        const secondCaption = second.querySelector("figcaption")?.textContent.trim() || "";
        const direction = gallerySort.value === "za" ? -1 : 1;
        if (gallerySort.value === "default") return galleryItems.indexOf(first) - galleryItems.indexOf(second);
        return direction * firstCaption.localeCompare(secondCaption);
      });

      sortedItems.forEach((item) => gallery.appendChild(item));
      let visibleCount = 0;
      galleryItems.forEach((item) => {
        const searchableText = `${item.textContent} ${item.querySelector("img")?.alt || ""}`.toLocaleLowerCase();
        item.hidden = !searchableText.includes(query);
        if (!item.hidden) visibleCount += 1;
      });
      if (galleryResults) galleryResults.textContent = `Showing ${visibleCount} of ${galleryItems.length} photos.`;
      if (galleryEmpty) galleryEmpty.hidden = visibleCount !== 0;
    };

    const showPhoto = () => {
      const visibleItems = visibleGalleryItems();
      const item = visibleItems[currentIndex];
      if (!item) return;
      const button = item.querySelector(".gallery-open");
      const thumbnail = button?.querySelector("img");
      if (!button || !thumbnail || !lightboxImage || !lightboxCaption || !lightboxCount) return;
      lightboxImage.src = button.dataset.full;
      lightboxImage.alt = thumbnail.alt;
      lightboxCaption.textContent = item.querySelector("figcaption")?.textContent || "";
      lightboxCount.textContent = `Photo ${currentIndex + 1} of ${visibleItems.length}`;
    };

    const openPhoto = (button) => {
      const visibleItems = visibleGalleryItems();
      const item = button.closest("[data-gallery-item]");
      currentIndex = visibleItems.indexOf(item);
      if (currentIndex < 0) return;
      lastOpenedButton = button;
      showPhoto();
      lightbox.showModal();
    };

    const movePhoto = (step) => {
      const visibleItems = visibleGalleryItems();
      if (!visibleItems.length) return;
      currentIndex = (currentIndex + step + visibleItems.length) % visibleItems.length;
      showPhoto();
    };

    gallerySearch.addEventListener("input", updateGallery);
    gallerySort.addEventListener("change", updateGallery);
    gallery.addEventListener("click", (event) => {
      if (event.target instanceof Element) {
        const button = event.target.closest(".gallery-open");
        if (button) openPhoto(button);
      }
    });
    lightbox.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox.close());
    previousButton?.addEventListener("click", () => movePhoto(-1));
    nextButton?.addEventListener("click", () => movePhoto(1));
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") movePhoto(-1);
      if (event.key === "ArrowRight") movePhoto(1);
    });
    lightbox.addEventListener("close", () => lastOpenedButton?.focus());
    updateGallery();
  }

  // Reveal selected sections as they enter the screen; skip this for reduced motion.
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("has-scroll-reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
  }
})();