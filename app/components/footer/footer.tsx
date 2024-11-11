import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-2 mb-6 text-center">
      <p>
        &copy; {new Date().getFullYear()}. Japan Festival Calendar. All rights
        reserved.
      </p>
      <div>
        <Link
          href={"https://github.com/boyeoon/japan-festival-calendar"}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-[#cb6872]"
        >
          GitHub
        </Link>
      </div>
    </footer>
  );
}
