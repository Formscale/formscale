import { Button } from "@/components/ui/button";
// import { DotPattern } from "@/components/ui/dot-pattern";
// import CodeComparison from "@/components/ui/code-comparison";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* <DotPattern className="absolute inset-0 opacity-50" /> */}
      <div className="relative text-center flex flex-col items-center justify-center gap-6 max-w-3xl">
        <h1 className="text-5xl font-extrabold">
          The Most Powerful Form Builder For <span className="italic">Any</span> Site.
        </h1>
        <p className="text-md text-muted-foreground">
          With FormHook, create beautiful forms that seamlessly integrate with your website in seconds - from static
          sites to full-stack apps.
        </p>
        <div className="flex flex-row items-center justify-center gap-2">
          <Button variant="action" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Browse Templates
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Fully Open Source - Use it for free</p>
        {/* <CodeComparison
          beforeCode={`
            <form action="/api/contact" method="post">
  <input type="text" name="name" placeholder="Name" />
  <input type="email" name="email" placeholder="Email" />
  <button type="submit">Submit</button>
</form>

<script>
const form = document.querySelector('form');
const nameInput = document.querySelector('input[name="name"]');
const emailInput = document.querySelector('input[name="email"]');

const validateName = (name) => {
  if (name.length < 2) throw new Error('Name too short');
  if (name.length > 50) throw new Error('Name too long');
  if (!/^[a-zA-Z\s]*$/.test(name)) throw new Error('Invalid characters');
};

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!regex.test(email)) throw new Error('Invalid email');
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    validateName(nameInput.value);
    validateEmail(emailInput.value);

    const res = await fetch('/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameInput.value,
        email: emailInput.value
      })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
  } catch (err) {
    alert(err.message);
  }
});
</script>`}
          afterCode={`<form action="https://api.formhook.com/123" method="post">
  <input type="text" name="name" placeholder="Name" />
  <input type="email" name="email" placeholder="Email" />
  <button type="submit">Submit</button>
</form>`}
          language="html"
          filename="form.html"
          lightTheme="github-light"
          darkTheme="github-dark"
        /> */}
      </div>
    </div>
  );
}
