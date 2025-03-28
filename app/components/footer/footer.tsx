import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-4 sm:mt-6 mb-8 sm:mb-12 text-center text-[0.65rem] sm:text-sm px-4">
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
