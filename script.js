document.addEventListener("DOMContentLoaded", () => {
  const details = document.querySelectorAll(".accordion-item");

  details.forEach((targetDetail) => {
    const summary = targetDetail.querySelector("summary");

    summary.addEventListener("click", (e) => {
      e.preventDefault();

      const content = targetDetail.querySelector(".accordion-content");

      // If closing
      if (targetDetail.hasAttribute("open")) {
        // Set start height explicitly
        const startHeight = content.offsetHeight;
        content.style.height = `${startHeight}px`;
        content.style.opacity = "1";

        // Wait for next frame to ensure start state is applied
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            content.style.height = "0px";
            content.style.opacity = "0";
            content.style.paddingTop = "0";
            content.style.paddingBottom = "0";
          });
        });

        content.addEventListener(
          "transitionend",
          function onEnd() {
            targetDetail.removeAttribute("open");
            content.style.height = "";
            content.style.opacity = "";
            content.style.paddingTop = "";
            content.style.paddingBottom = "";
            content.removeEventListener("transitionend", onEnd);
          },
          { once: true }
        );
      }
      // If opening
      else {
        targetDetail.setAttribute("open", "");

        // Get destination height (needs to be calculated with padding)
        content.style.height = "auto"; // ensure we get full height
        const destHeight = content.scrollHeight;

        // Set start state
        content.style.height = "0px";
        content.style.opacity = "0";
        content.style.paddingTop = "0";
        content.style.paddingBottom = "0";

        // Force reflow/wait for next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            content.style.height = `${destHeight}px`;
            content.style.opacity = "1";
            content.style.paddingTop = ""; // Reverts to CSS value
            content.style.paddingBottom = ""; // Reverts to CSS value
          });
        });

        content.addEventListener(
          "transitionend",
          function onEnd() {
            content.style.height = ""; // Clean up to allow auto resizing if window changes
            content.style.opacity = "";
            content.removeEventListener("transitionend", onEnd);
          },
          { once: true }
        );
      }
    });
  });
});

const subscriberEmail = document.getElementById("subscriber-email");
const subscribeForm = document.getElementById("subscription-form");
const subscribeText = document.getElementById("subscribe-text");
const subscribeSpinner = document.getElementById("subscribe-spinner");
const successText = document.querySelector(".subscription-success");
const failedText = document.querySelector(".subscription-failed");
const submitButton = document.getElementById("submit-btn");

subscribeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = subscriberEmail.value;
  const key = "sb_publishable_ucXVh30ZCqU4QVedXgK_Kg_6nFjySek";
  const url =
    "https://whghhtqtgqgxsqoejbsd.supabase.co/functions/v1/subscribe-mailer";

  try {
    submitButton.disabled = true;
    subscribeText.hidden = true;
    subscribeSpinner.hidden = false;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
      },
      body: JSON.stringify({
        name: "Functions",
        action: "subscribe",
        recipient: email,
      }),
    });

    if (res.status == 200) {
      successText.hidden = false;
      setTimeout(() => {
        successText.hidden = true;
      }, 5000);
    }
  } catch (error) {
    failedText.hidden = false;
  } finally {
    submitButton.disabled = false;
    subscriberEmail.value = "";
    subscribeText.hidden = false;
    subscribeSpinner.hidden = true;
  }
});
