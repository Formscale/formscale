import Image from "next/image";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  description?: string;
  link?: string;
  linkText?: string;
}

export default function AuthHeader({ title, description, link, linkText }: AuthHeaderProps) {
  return (
    <>
      <Image
        src="/assets/logos/formscale-icon.svg"
        className="mb-5 -ml-1 aspect-square"
        alt="Formscale"
        width={52}
        height={52}
      />
      {/* <Image src="/assets/logos/formscale-icon.svg" className="mb-4" alt="Formscale" width={22} height={22} /> */}
      <h1 className="text-xl font-bold">{title}</h1>
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}{" "}
          {link && (
            <Link href={link} className="text-primary underline">
              {linkText}
            </Link>
          )}
        </p>
      )}
    </>
  );
}
