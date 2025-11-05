const LOADING_LABEL = "Generating...";
const ERROR_HTML =
  '<p class="text-red-800 font-medium">Sorry, a delicious error occurred while fetching flavor. Please check the console and try again.</p>';

function setLoadingState(button, isLoading, idleLabel) {
  button.textContent = isLoading ? LOADING_LABEL : idleLabel;
  button.disabled = isLoading;
}

function renderError(outputBox, error) {
  console.error("Fetch API Error:", error);
  outputBox.innerHTML = ERROR_HTML;
}

async function fetchIpsum(url, formData) {
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

function initIpsumForm() {
  const ipsumForm = document.getElementById("ipsum-form");
  const output = document.getElementById("ipsum-output");
  const submitButton = ipsumForm?.querySelector('button[type="submit"]');

  if (!ipsumForm || !output || !submitButton) {
    console.error(
      "Initialization failed: The form, its submit button or the output element is missing from the DOM."
    );
    return;
  }

  const idleLabel = submitButton.textContent.trim();

  ipsumForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoadingState(submitButton, true, idleLabel);

    try {
      output.innerHTML = await fetchIpsum(ipsumForm.action, new FormData(ipsumForm));
    } catch (error) {
      renderError(output, error);
    } finally {
      setLoadingState(submitButton, false, idleLabel);
    }
  });
}

initIpsumForm();
