"use client";

import { DataCardButton } from "@/app/(dashboard)/components/data-card";
import { Tab } from "@/components/tabs";
import { ApiResponse } from "@/hooks/fetch";
import { handleCopy } from "@/lib/utils";
import { useError } from "@/providers";
import { Button } from "@formscale/ui/components";
import { CopyIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BundledLanguage } from "shiki";

export default function CodeSwitcher({ formId = "YOUR_FORM_ID", demo = false }: { formId?: string; demo?: boolean }) {
  const [activeTab, setActiveTab] = useState("html");
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const router = useRouter();
  const { handleError, handleToast } = useError();
  const [isLoading, setIsLoading] = useState(false);

  const tabs = {
    html: {
      title: "HTML",
      language: "html",
      code: `<!-- Modify this HTML with the form fields you want to collect -->
<form
  action="${process.env.NEXT_PUBLIC_API_URL}/s/${formId}"
  method="POST"
  enctype="multipart/form-data"
>
  <label>
    Your Email
    <input type="email" name="email" />
  </label>
  <label>
    Your Message
    <textarea name="message"></textarea>
  </label>
  <!-- Add other fields with a "name" attribute -->
  <button type="submit">Send</button>
</form>`,
    },
    javascript: {
      title: "Fetch",
      language: "html",
      code: `<!-- Modify this HTML with the form fields you want to collect -->
<form
  id="formscale"
  action="${process.env.NEXT_PUBLIC_API_URL}/s/${formId}"
  method="POST"
  enctype="multipart/form-data"
>
  <label>
    Your Email
    <input type="email" name="email" />
  </label>
  <label>
    Your Message
    <textarea name="message"></textarea>
  </label>
  <!-- Other fields go here -->
  <button type="submit">Send</button>
  <div id="formscale-status"></div>
</form>

<!-- Place this script at the end of your body tag -->
<script>
  const form = document.getElementById("formscale");

  function handleSubmit(e) {
    e.preventDefault();
    const status = document.getElementById("formscale-status");
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          status.textContent = "Thanks for your submission!";
          form.reset();

          // Handle success (ex: redirect to success page)
        } else {
          return response.json().then((data) => {
            const error = data.error || data.errors || "Submission failed. Please try again.";
            status.textContent = Array.isArray(error) ? error.map((e) => e.message || e).join(", ") : error;
          });
        }
      })
      .catch((error) => {
        status.textContent = error.message || "Network error. Please try again.";
      })
      .finally(() => {
        button.disabled = false;
      });
  }

  form.onsubmit = handleSubmit;
</script>`,
    },
    tsx: {
      title: "React (TSX)",
      language: "tsx",
      code: `// See more examples at https://docs.formscale.dev/react
// "use client" for Next.js
import { FormEvent, useState } from "react";

export default function Form() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;

    fetch("${process.env.NEXT_PUBLIC_API_URL}/s/${formId}", {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setStatus("Thanks for your submission!");
          form.reset();

          // Handle success (ex: redirect to success page)
        } else {
          return response.json().then((data: any) => {
            const error = data.error || data.errors || "Submission failed. Please try again.";
            setStatus(Array.isArray(error) ? error.map((e) => e.message || e).join(", ") : error);
          });
        }
      })
      .catch((error) => {
        setStatus(error.message || "Network error. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label>Email</label>
        <input type="email" name="email" />
      </div>
      <div>
        <label>Your Message</label>
        <textarea name="message" />
      </div>
      {/* Other fields go here */}
      {status && <div>{status}</div>}
      <button type="submit" disabled={isSubmitting}>
        Send
      </button>
    </form>
  );
}`,
    },
    "react-tsx": {
      title: "React (SDK)",
      language: "tsx",
      code: `// Run npm install @formscale/react
// Learn more at https://docs.formscale.dev/react-sdk
import { useFormscale } from "@formscale/react";

export default function Form() {
  const { form, FormProvider, Submit } = useFormscale({
    formId: "${formId}",
    onSuccess: (data: {}) => {
      console.log("Form submitted successfully", data);
      form.reset();
      // Handle success
    },
    onError: (error: string | Error) => {
      console.error("Form submission failed", error);
      // Handle error
    },
  });

  // Set default values, placeholders, descriptions, etc.
  const fields = [
    {
      name: "email",
      type: "email",
      label: "Your Email",
    },
    {
      name: "message",
      type: "textarea",
      label: "Your Message",
    },
  ];

  // Access form state
  const { setValue, getValue, isValid, isDirty } = form;

  return (
    <FormProvider fields={fields}>
      {/* Formscale automatically handles submissions & validation errors */}
      <Submit>Send</Submit>
    </FormProvider>
  );
}`,
    },
  };

  useEffect(() => {
    async function highlightCode() {
      const tab = tabs[activeTab as keyof typeof tabs];

      try {
        const { codeToHtml } = await import("shiki");
        const lang = tab.language.split("-").length > 1 ? tab.language.split("-")[1] : tab.language;

        const code = demo
          ? tab.code
              .replace(/<!--[\s\S]*?-->/g, "")
              .replace(/(?<!https?:)\/\/[^\n]*/g, "")
              .replace(/\/\*[\s\S]*?\*\//g, "")
              .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
              .replace(/^\s*[\r\n]/gm, "")
              .replace(/\n\s*\n/g, "\n")
              .trim()
          : tab.code;

        const highlighted = await codeToHtml(code, {
          lang: lang as BundledLanguage,
          theme: "github-light",
        });
        setHighlightedCode(highlighted);
      } catch (error) {
        setHighlightedCode(
          `<pre className="text-xs sm:text-sm font-mono">
            <code>${tab?.code}</code>
          </pre>`
        );
      }
    }
    highlightCode();
  }, [activeTab, formId, tabs]);

  async function sendSubmission(formId: string) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", "dris@formscale.dev");
      formData.append("message", "Hello, world!");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/s/${formId}`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        handleToast("success", "Submission sent successfully");
        router.push(`/forms/${formId}`);
      } else {
        try {
          const data = (await response.json()) as ApiResponse<{ message: string }>;

          throw new Error(
            typeof data.error === "string"
              ? data.error
              : Array.isArray(data.error)
                ? data.error.map((error) => error.message).join(", ")
                : "Submission failed"
          );
        } catch (e) {
          throw new Error("Submission failed");
        }
      }
    } catch (error) {
      handleError({
        message: "Failed to submit form",
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DataCardButton
      titleHeader={
        <div className="flex justify-between items-center -m-1 -ml-2 -mr-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {Object.entries(tabs).map(([key, tab]) => (
              <Tab key={tab.title} {...tab} isActive={activeTab === key} onClickAction={() => setActiveTab(key)} />
            ))}
          </div>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => handleCopy(tabs[activeTab as keyof typeof tabs].code, "Code")}
          >
            <span className="sr-only">Copy to clipboard</span>
            <CopyIcon />
          </Button>
          {/* option to share/invite member to form */}
        </div>
      }
      buttonText={isLoading ? "Sending..." : "Send Submission"}
      disabled={isLoading}
      onClickAction={() => (demo ? router.push(`/forms`) : sendSubmission(formId))}
    >
      <div className={`overflow-auto ${demo ? "max-h-[300px]" : ""}`}>
        {Object.entries(tabs).map(
          ([key, tab]) =>
            activeTab === key && (
              <div
                key={tab.title}
                className="h-full overflow-auto bg-background font-mono text-xs sm:text-sm [&>pre]:h-full [&>pre]:!bg-transparent [&_code]:break-all"
                dangerouslySetInnerHTML={{ __html: highlightedCode || "" }}
              />
            )
        )}
      </div>
    </DataCardButton>
  );
}
